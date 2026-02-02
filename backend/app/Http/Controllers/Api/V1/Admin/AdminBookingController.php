<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\PaymentProof;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class AdminBookingController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Display a listing of all bookings (Admin only)
     */
    public function index(Request $request)
    {
        try {
            $perPage = $request->get('per_page', 10);
            $page = $request->get('page', 1);

            if ($perPage > 50) {
                $perPage = 50;
            }

            $query = Booking::with(['user', 'latestPaymentProof']);

            // Filter by status if provided
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // Filter by catalog type if provided
            if ($request->has('catalog_type')) {
                $query->where('catalog_type', $request->catalog_type);
            }

            // Filter by date range if provided
            if ($request->has('start_date')) {
                $query->whereDate('created_at', '>=', $request->start_date);
            }

            if ($request->has('end_date')) {
                $query->whereDate('created_at', '<=', $request->end_date);
            }

            // Search functionality
            if ($request->has('search') && !empty($request->search)) {
                $searchTerm = $request->search;
                $query->where(function($q) use ($searchTerm) {
                    $q->whereHas('user', function($userQuery) use ($searchTerm) {
                        $userQuery->where('name', 'like', '%' . $searchTerm . '%')
                                 ->orWhere('email', 'like', '%' . $searchTerm . '%');
                    })
                    ->orWhereJsonContains('booking_data->nama_pemesan', $searchTerm)
                    ->orWhereJsonContains('booking_data->nomor_hp', $searchTerm);
                });
            }

            $bookings = $query->orderBy('created_at', 'desc')->paginate($perPage);

            // Add catalog information to each booking
            $bookingsWithCatalog = $bookings->getCollection()->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'user' => $booking->user,
                    'catalog_type' => $booking->catalog_type,
                    'catalog' => $booking->catalog,
                    'booking_data' => $booking->booking_data,
                    'total_price' => $booking->total_price,
                    'status' => $booking->status,
                    'expired_at' => $booking->expired_at,
                    'created_at' => $booking->created_at,
                    'updated_at' => $booking->updated_at,
                    'payment_proof' => $booking->latestPaymentProof,
                    'is_expired' => $booking->isExpired(),
                ];
            });

            return response()->json([
                'message' => 'Bookings retrieved successfully',
                'data' => $bookingsWithCatalog,
                'pagination' => [
                    'current_page' => $bookings->currentPage(),
                    'per_page' => $bookings->perPage(),
                    'total' => $bookings->total(),
                    'last_page' => $bookings->lastPage(),
                    'from' => $bookings->firstItem(),
                    'to' => $bookings->lastItem(),
                    'has_more_pages' => $bookings->hasMorePages(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve bookings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified booking (Admin only)
     */
    public function show(string $id)
    {
        try {
            $booking = Booking::with(['user', 'paymentProofs'])->findOrFail($id);

            $bookingData = [
                'id' => $booking->id,
                'user' => $booking->user,
                'catalog_type' => $booking->catalog_type,
                'catalog' => $booking->catalog,
                'booking_data' => $booking->booking_data,
                'total_price' => $booking->total_price,
                'status' => $booking->status,
                'expired_at' => $booking->expired_at,
                'created_at' => $booking->created_at,
                'updated_at' => $booking->updated_at,
                'payment_proofs' => $booking->paymentProofs,
                'is_expired' => $booking->isExpired(),
            ];

            return response()->json([
                'message' => 'Booking retrieved successfully',
                'data' => $bookingData
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Booking not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Approve booking payment (Admin only)
     */
    public function approve(Request $request, string $id)
    {
        try {
            $booking = Booking::findOrFail($id);

            if ($booking->status !== Booking::STATUS_MENUNGGU_VALIDASI) {
                return response()->json([
                    'message' => 'Booking tidak dalam status menunggu validasi'
                ], 400);
            }

            // Update booking status to lunas
            $booking->update(['status' => Booking::STATUS_LUNAS]);

            // Create notification for user
            $catalog = $booking->catalog;
            $catalogName = $booking->catalog_type === 'trip'
                ? $catalog->title
                : $catalog->origin . ' - ' . $catalog->destination;

            $this->notificationService->createPaymentApprovedNotification(
                $booking->user_id,
                $catalogName,
                (float) $booking->total_price
            );

            return response()->json([
                'message' => 'Pembayaran berhasil disetujui',
                'data' => [
                    'booking_id' => $booking->id,
                    'status' => $booking->status
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menyetujui pembayaran',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reject booking payment (Admin only)
     */
    public function reject(Request $request, string $id)
    {
        $request->validate([
            'reason' => 'nullable|string|max:500'
        ]);

        try {
            $booking = Booking::findOrFail($id);

            if ($booking->status !== Booking::STATUS_MENUNGGU_VALIDASI) {
                return response()->json([
                    'message' => 'Booking tidak dalam status menunggu validasi'
                ], 400);
            }

            // Update booking status to ditolak
            $booking->update(['status' => Booking::STATUS_DITOLAK]);

            // Create notification for user
            $catalog = $booking->catalog;
            $catalogName = $booking->catalog_type === 'trip'
                ? $catalog->title
                : $catalog->origin . ' - ' . $catalog->destination;

            $this->notificationService->createPaymentRejectedNotification(
                $booking->user_id,
                $catalogName,
                (float) $booking->total_price,
                $request->reason ?? ''
            );

            return response()->json([
                'message' => 'Pembayaran berhasil ditolak',
                'data' => [
                    'booking_id' => $booking->id,
                    'status' => $booking->status,
                    'reason' => $request->reason
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menolak pembayaran',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get booking statistics (Admin only)
     */
    public function statistics()
    {
        try {
            $stats = [
                'total_bookings' => Booking::count(),
                'menunggu_pembayaran' => Booking::menungguPembayaran()->count(),
                'menunggu_validasi' => Booking::menungguValidasi()->count(),
                'lunas' => Booking::lunas()->count(),
                'ditolak' => Booking::ditolak()->count(),
                'expired' => Booking::expired()->count(),
                'total_revenue' => Booking::lunas()->sum('total_price'),
                'trip_bookings' => Booking::where('catalog_type', 'trip')->count(),
                'travel_bookings' => Booking::where('catalog_type', 'travel')->count(),
            ];

            return response()->json([
                'message' => 'Statistics retrieved successfully',
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
