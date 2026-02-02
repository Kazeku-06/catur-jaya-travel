<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\BookingService;
use Illuminate\Http\Request;

/**
 * @tags User Bookings
 */
class BookingController extends Controller
{
    protected $bookingService;

    public function __construct(BookingService $bookingService)
    {
        $this->bookingService = $bookingService;
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
}