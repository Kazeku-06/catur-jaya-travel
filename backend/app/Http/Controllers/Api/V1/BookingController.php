<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\BookingService;
use App\Services\TicketService;
use App\Models\Booking;
use Illuminate\Http\Request;

/**
 * @tags User Bookings
 */
class BookingController extends Controller
{
    protected $bookingService;
    protected $ticketService;

    public function __construct(BookingService $bookingService, TicketService $ticketService)
    {
        $this->bookingService = $bookingService;
        $this->ticketService = $ticketService;
    }

    /**
     * Create booking for trip (Requires authentication)
     *
     * @summary Create trip booking
     * @description Create a new booking for a trip package. Requires user authentication. Returns booking details with 24-hour payment deadline.
     */
    public function createTripBooking(Request $request, string $tripId)
    {
        $request->validate([
            'nama_pemesan' => 'required|string|max:255',
            'nomor_hp' => 'required|string|max:20',
            'tanggal_keberangkatan' => 'required|date|after:today',
            'participants' => 'required|integer|min:1|max:50',
            'catatan_tambahan' => 'nullable|string|max:1000'
        ]);

        try {
            $result = $this->bookingService->createTripBooking(
                $request->user()->id,
                $tripId,
                $request->only([
                    'nama_pemesan',
                    'nomor_hp',
                    'tanggal_keberangkatan',
                    'participants',
                    'catatan_tambahan'
                ])
            );

            return response()->json([
                'message' => 'Booking berhasil dibuat',
                'data' => [
                    'booking_id' => $result['booking']->id,
                    'total_price' => $result['booking']->total_price,
                    'status' => $result['booking']->status,
                    'expired_at' => $result['booking']->expired_at,
                    'catalog' => $result['catalog']
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal membuat booking',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Create booking for travel (Requires authentication)
     *
     * @summary Create travel booking
     * @description Create a new booking for a travel service. Requires user authentication. Returns booking details with 24-hour payment deadline.
     */
    public function createTravelBooking(Request $request, string $travelId)
    {
        $request->validate([
            'nama_pemesan' => 'required|string|max:255',
            'nomor_hp' => 'required|string|max:20',
            'tanggal_keberangkatan' => 'required|date|after:today',
            'passengers' => 'required|integer|min:1|max:10',
            'catatan_tambahan' => 'nullable|string|max:1000'
        ]);

        try {
            $result = $this->bookingService->createTravelBooking(
                $request->user()->id,
                $travelId,
                $request->only([
                    'nama_pemesan',
                    'nomor_hp',
                    'tanggal_keberangkatan',
                    'passengers',
                    'catatan_tambahan'
                ])
            );

            return response()->json([
                'message' => 'Booking berhasil dibuat',
                'data' => [
                    'booking_id' => $result['booking']->id,
                    'total_price' => $result['booking']->total_price,
                    'status' => $result['booking']->status,
                    'expired_at' => $result['booking']->expired_at,
                    'catalog' => $result['catalog']
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal membuat booking',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Get user's bookings (Requires authentication)
     *
     * @summary Get user bookings
     * @description Get all bookings for the authenticated user
     */
    public function getUserBookings(Request $request)
    {
        try {
            $bookings = $this->bookingService->getUserBookings($request->user()->id);

            return response()->json([
                'message' => 'Booking berhasil diambil',
                'data' => $bookings
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mengambil booking',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Get specific booking detail (Requires authentication)
     *
     * @summary Get booking detail
     * @description Get detailed information about a specific booking. User can only access their own bookings.
     */
    public function getBookingDetail(Request $request, string $bookingId)
    {
        try {
            $booking = $this->bookingService->getBookingDetail(
                $request->user()->id,
                $bookingId
            );

            return response()->json([
                'message' => 'Detail booking berhasil diambil',
                'data' => $booking
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mengambil detail booking',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Upload payment proof (Requires authentication)
     *
     * @summary Upload payment proof
     * @description Upload payment proof image for a booking. Only works for bookings with 'menunggu_pembayaran' status.
     */
    public function uploadPaymentProof(Request $request, string $bookingId)
    {
        $request->validate([
            'payment_proof' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB max
            'bank_name' => 'nullable|string|in:BCA,Mandiri'
        ]);

        try {
            $result = $this->bookingService->uploadPaymentProof(
                $request->user()->id,
                $bookingId,
                $request->file('payment_proof'),
                $request->bank_name
            );

            return response()->json([
                'message' => 'Bukti pembayaran berhasil diupload',
                'data' => [
                    'booking' => $result['booking'],
                    'payment_proof' => $result['payment_proof']
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mengupload bukti pembayaran',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Download official ticket (Requires authentication)
     *
     * @summary Download official ticket
     * @description Download official ticket PDF for a booking. Only works for bookings with 'lunas' status. User can only download their own tickets or admin can download any ticket.
     */
    public function downloadTicket(Request $request, string $bookingId)
    {
        try {
            // Find booking
            $booking = Booking::where('id', $bookingId)->first();

            if (!$booking) {
                return response()->json([
                    'message' => 'Booking tidak ditemukan'
                ], 404);
            }

            // Check authorization - user can only download their own tickets or admin can download any
            $user = $request->user();
            if ($booking->user_id !== $user->id && $user->role !== 'admin') {
                return response()->json([
                    'message' => 'Akses ditolak. Anda hanya dapat mengunduh tiket milik sendiri.'
                ], 403);
            }

            // Check if booking status allows ticket download
            if (!$booking->canDownloadTicket()) {
                return response()->json([
                    'message' => 'Tiket hanya dapat diunduh untuk booking dengan status LUNAS'
                ], 400);
            }

            // Generate PDF ticket
            $pdf = $this->ticketService->generateTicketPdf($booking);

            // Return PDF as download
            $filename = 'tiket-' . $booking->booking_code . '.pdf';
            
            return $pdf->download($filename);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mengunduh tiket',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}