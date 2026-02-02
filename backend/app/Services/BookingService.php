<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\PaketTrip;
use App\Models\Travel;
use App\Models\PaymentProof;
use Illuminate\Support\Str;
use Carbon\Carbon;

class BookingService
{
    protected $notificationService;
    protected $fileUploadService;

    public function __construct(NotificationService $notificationService, FileUploadService $fileUploadService)
    {
        $this->notificationService = $notificationService;
        $this->fileUploadService = $fileUploadService;
    }

    /**
     * Create booking for trip
     */
    public function createTripBooking($userId, $tripId, $bookingData)
    {
        $trip = PaketTrip::where('id', $tripId)->where('is_active', true)->first();

        if (!$trip) {
            throw new \Exception('Trip tidak ditemukan atau tidak aktif');
        }

        // Validate booking data
        $this->validateTripBookingData($bookingData);

        $participants = $bookingData['participants'] ?? 1;
        $totalPrice = $trip->price * $participants;

        // Set expired time (24 hours from now)
        $expiredAt = Carbon::now()->addHours(24);

        $booking = Booking::create([
            'user_id' => $userId,
            'catalog_type' => 'trip',
            'catalog_id' => $tripId,
            'booking_data' => [
                'nama_pemesan' => $bookingData['nama_pemesan'],
                'nomor_hp' => $bookingData['nomor_hp'],
                'tanggal_keberangkatan' => $bookingData['tanggal_keberangkatan'],
                'jumlah_orang' => $participants,
                'catatan_tambahan' => $bookingData['catatan_tambahan'] ?? null,
            ],
            'total_price' => $totalPrice,
            'status' => Booking::STATUS_MENUNGGU_PEMBAYARAN,
            'expired_at' => $expiredAt,
        ]);

        // Create notification for admins about new booking
        $this->notificationService->createBookingNotification(
            $booking->id,
            'Trip: ' . $trip->title,
            $totalPrice
        );

        return [
            'booking' => $booking,
            'catalog' => $trip
        ];
    }

    /**
     * Create booking for travel
     */
    public function createTravelBooking($userId, $travelId, $bookingData)
    {
        $travel = Travel::where('id', $travelId)->where('is_active', true)->first();

        if (!$travel) {
            throw new \Exception('Travel tidak ditemukan atau tidak aktif');
        }

        // Validate booking data
        $this->validateTravelBookingData($bookingData);

        $passengers = $bookingData['passengers'] ?? 1;
        $totalPrice = $travel->price_per_person * $passengers;

        // Set expired time (24 hours from now)
        $expiredAt = Carbon::now()->addHours(24);

        $booking = Booking::create([
            'user_id' => $userId,
            'catalog_type' => 'travel',
            'catalog_id' => $travelId,
            'booking_data' => [
                'nama_pemesan' => $bookingData['nama_pemesan'],
                'nomor_hp' => $bookingData['nomor_hp'],
                'tanggal_keberangkatan' => $bookingData['tanggal_keberangkatan'],
                'jumlah_orang' => $passengers,
                'catatan_tambahan' => $bookingData['catatan_tambahan'] ?? null,
            ],
            'total_price' => $totalPrice,
            'status' => Booking::STATUS_MENUNGGU_PEMBAYARAN,
            'expired_at' => $expiredAt,
        ]);

        // Create notification for admins about new booking
        $this->notificationService->createBookingNotification(
            $booking->id,
            'Travel: ' . $travel->origin . ' - ' . $travel->destination,
            $totalPrice
        );

        return [
            'booking' => $booking,
            'catalog' => $travel
        ];
    }

    /**
     * Upload payment proof
     */
    public function uploadPaymentProof($userId, $bookingId, $imageFile)
    {
        $booking = Booking::where('id', $bookingId)
            ->where('user_id', $userId)
            ->first();

        if (!$booking) {
            throw new \Exception('Booking tidak ditemukan atau akses ditolak');
        }

        // Check if booking is still valid for payment
        if ($booking->status !== Booking::STATUS_MENUNGGU_PEMBAYARAN) {
            throw new \Exception('Booking tidak dalam status menunggu pembayaran');
        }

        if ($booking->isExpired()) {
            $booking->markAsExpired();
            throw new \Exception('Booking sudah expired. Silakan booking ulang.');
        }

        // Upload image to cloud storage
        $imageUrl = $this->fileUploadService->uploadPaymentProof($imageFile);

        // Create payment proof record
        $paymentProof = PaymentProof::create([
            'booking_id' => $bookingId,
            'image_url' => $imageUrl,
            'uploaded_at' => now(),
        ]);

        // Update booking status
        $booking->update(['status' => Booking::STATUS_MENUNGGU_VALIDASI]);

        // Create notification for admins about payment proof upload
        $catalog = $booking->catalog;
        $catalogName = $booking->catalog_type === 'trip' 
            ? $catalog->title 
            : $catalog->origin . ' - ' . $catalog->destination;

        $this->notificationService->createPaymentProofNotification(
            $booking->id,
            $catalogName,
            $booking->total_price
        );

        return [
            'booking' => $booking->fresh(),
            'payment_proof' => $paymentProof
        ];
    }

    /**
     * Get user's bookings
     */
    public function getUserBookings($userId)
    {
        $bookings = Booking::where('user_id', $userId)
            ->with(['latestPaymentProof'])
            ->orderBy('created_at', 'desc')
            ->get();

        return $bookings->map(function ($booking) {
            $catalog = $booking->catalog;

            return [
                'id' => $booking->id,
                'catalog_type' => $booking->catalog_type,
                'catalog' => $catalog,
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
    }

    /**
     * Get specific booking detail for user
     */
    public function getBookingDetail($userId, $bookingId)
    {
        $booking = Booking::where('id', $bookingId)
            ->where('user_id', $userId)
            ->with(['latestPaymentProof', 'user'])
            ->first();

        if (!$booking) {
            throw new \Exception('Booking tidak ditemukan atau akses ditolak');
        }

        $catalog = $booking->catalog;

        return [
            'id' => $booking->id,
            'catalog_type' => $booking->catalog_type,
            'catalog' => $catalog,
            'booking_data' => $booking->booking_data,
            'total_price' => $booking->total_price,
            'status' => $booking->status,
            'expired_at' => $booking->expired_at,
            'created_at' => $booking->created_at,
            'updated_at' => $booking->updated_at,
            'user' => $booking->user,
            'payment_proof' => $booking->latestPaymentProof,
            'is_expired' => $booking->isExpired(),
        ];
    }

    /**
     * Mark expired bookings
     */
    public function markExpiredBookings()
    {
        $expiredBookings = Booking::where('status', Booking::STATUS_MENUNGGU_PEMBAYARAN)
            ->where('expired_at', '<', now())
            ->get();

        foreach ($expiredBookings as $booking) {
            $booking->markAsExpired();
        }

        return $expiredBookings->count();
    }

    /**
     * Validate trip booking data
     */
    private function validateTripBookingData($data)
    {
        $required = ['nama_pemesan', 'nomor_hp', 'tanggal_keberangkatan', 'participants'];
        
        foreach ($required as $field) {
            if (empty($data[$field])) {
                throw new \InvalidArgumentException("Field {$field} wajib diisi");
            }
        }

        if ($data['participants'] < 1 || $data['participants'] > 50) {
            throw new \InvalidArgumentException('Jumlah peserta harus antara 1-50 orang');
        }

        $departureDate = Carbon::parse($data['tanggal_keberangkatan']);
        if ($departureDate->isPast()) {
            throw new \InvalidArgumentException('Tanggal keberangkatan harus di masa depan');
        }
    }

    /**
     * Validate travel booking data
     */
    private function validateTravelBookingData($data)
    {
        $required = ['nama_pemesan', 'nomor_hp', 'tanggal_keberangkatan', 'passengers'];
        
        foreach ($required as $field) {
            if (empty($data[$field])) {
                throw new \InvalidArgumentException("Field {$field} wajib diisi");
            }
        }

        if ($data['passengers'] < 1 || $data['passengers'] > 10) {
            throw new \InvalidArgumentException('Jumlah penumpang harus antara 1-10 orang');
        }

        $departureDate = Carbon::parse($data['tanggal_keberangkatan']);
        if ($departureDate->isPast()) {
            throw new \InvalidArgumentException('Tanggal keberangkatan harus di masa depan');
        }
    }
}