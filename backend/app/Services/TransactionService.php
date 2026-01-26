<?php

namespace App\Services;

use App\Models\Transaction;
use App\Models\PaketTrip;
use App\Models\Travel;
use App\Models\Payment;
use Illuminate\Support\Str;

class TransactionService
{
    protected $midtransService;
    protected $notificationService;

    public function __construct(MidtransService $midtransService, NotificationService $notificationService)
    {
        $this->midtransService = $midtransService;
        $this->notificationService = $notificationService;
    }

    /**
     * Create transaction for trip
     */
    public function createTripTransaction($userId, $tripId, $bookingData = [])
    {
        $trip = PaketTrip::where('id', $tripId)->where('is_active', true)->first();

        if (!$trip) {
            throw new \Exception('Trip not found or inactive');
        }

        $participants = $bookingData['participants'] ?? 1;
        $totalPrice = $trip->price * $participants;
        $orderId = 'TRIP-' . time() . '-' . Str::random(6);

        $transaction = Transaction::create([
            'user_id' => $userId,
            'transaction_type' => 'trip',
            'reference_id' => $tripId,
            'total_price' => $totalPrice,
            'payment_status' => 'pending',
            'midtrans_order_id' => $orderId,
            // Booking details
            'participants' => $participants,
            'departure_date' => $bookingData['departure_date'] ?? null,
            'special_requests' => $bookingData['special_requests'] ?? null,
            'contact_phone' => $bookingData['contact_phone'] ?? null,
            'emergency_contact' => $bookingData['emergency_contact'] ?? null,
        ]);

        // Create notification for admins about new order
        $this->notificationService->createOrderNotification(
            $orderId,
            'Trip: ' . $trip->title,
            $totalPrice
        );

        return $this->createPayment($transaction, $trip);
    }

    /**
     * Create transaction for travel
     */
    public function createTravelTransaction($userId, $travelId, $bookingData = [])
    {
        $travel = Travel::where('id', $travelId)->where('is_active', true)->first();

        if (!$travel) {
            throw new \Exception('Travel not found or inactive');
        }

        $passengers = $bookingData['passengers'] ?? 1;
        $totalPrice = $travel->price_per_person * $passengers;
        $orderId = 'TRAVEL-' . time() . '-' . Str::random(6);

        $transaction = Transaction::create([
            'user_id' => $userId,
            'transaction_type' => 'travel',
            'reference_id' => $travelId,
            'total_price' => $totalPrice,
            'payment_status' => 'pending',
            'midtrans_order_id' => $orderId,
            // Booking details
            'passengers' => $passengers,
            'departure_date' => $bookingData['departure_date'] ?? null,
            'special_requests' => $bookingData['special_requests'] ?? null,
            'contact_phone' => $bookingData['contact_phone'] ?? null,
            'pickup_location' => $bookingData['pickup_location'] ?? null,
            'destination_address' => $bookingData['destination_address'] ?? null,
        ]);

        // Create notification for admins about new order
        $this->notificationService->createOrderNotification(
            $orderId,
            'Travel: ' . $travel->origin . ' - ' . $travel->destination,
            $totalPrice
        );

        return $this->createPayment($transaction, $travel);
    }

    /**
     * Create payment with Midtrans
     */
    private function createPayment($transaction, $item)
    {
        $user = $transaction->user;

        $customerDetails = [
            'first_name' => $user->name,
            'email' => $user->email,
        ];

        $itemName = $transaction->transaction_type === 'trip' ? $item->title : $item->origin . ' - ' . $item->destination;

        $itemDetails = [
            [
                'id' => $transaction->reference_id,
                'price' => $transaction->total_price,
                'quantity' => 1,
                'name' => $itemName,
            ]
        ];

        try {
            // Check if Midtrans is properly configured
            $serverKey = config('midtrans.server_key');
            if (!$serverKey || $serverKey === 'SB-Mid-server-YOUR_SERVER_KEY_HERE') {
                // Return without Midtrans token for testing
                return [
                    'transaction' => $transaction,
                    'snap_token' => null,
                    'item' => $item
                ];
            }

            $snapToken = $this->midtransService->createSnapToken(
                $transaction->midtrans_order_id,
                $transaction->total_price,
                $customerDetails,
                $itemDetails
            );

            return [
                'transaction' => $transaction,
                'snap_token' => $snapToken,
                'item' => $item
            ];
        } catch (\Exception $e) {
            // Log error but don't delete transaction for debugging
            \Log::error('Midtrans error: ' . $e->getMessage());
            
            return [
                'transaction' => $transaction,
                'snap_token' => null,
                'item' => $item
            ];
        }
    }

    /**
     * Update transaction status from Midtrans callback
     */
    public function updateTransactionStatus($orderId, $paymentStatus, $rawResponse)
    {
        $transaction = Transaction::where('midtrans_order_id', $orderId)->first();

        if (!$transaction) {
            throw new \Exception('Transaction not found');
        }

        $oldStatus = $transaction->payment_status;
        $transaction->update(['payment_status' => $paymentStatus]);

        // Create payment record
        Payment::create([
            'transaction_id' => $transaction->id,
            'payment_type' => 'midtrans',
            'transaction_status' => $paymentStatus,
            'raw_response' => $rawResponse,
        ]);

        // Create notifications based on payment status change
        if ($oldStatus !== $paymentStatus) {
            $transactionType = $transaction->transaction_type === 'trip' ? 'Trip' : 'Travel';
            
            if ($paymentStatus === 'paid' || $paymentStatus === 'settlement' || $paymentStatus === 'capture') {
                $this->notificationService->createPaymentSuccessNotification(
                    $orderId,
                    $transactionType,
                    $transaction->total_price
                );
            } elseif (in_array($paymentStatus, ['failed', 'expire', 'cancel', 'deny'])) {
                $this->notificationService->createPaymentFailedNotification(
                    $orderId,
                    $transactionType,
                    $transaction->total_price,
                    $paymentStatus
                );
            }
        }

        return $transaction;
    }

    /**
     * Get user's bookings/transactions
     */
    public function getUserBookings($userId)
    {
        $transactions = Transaction::where('user_id', $userId)
            ->with(['user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return $transactions->map(function ($transaction) {
            $item = null;
            
            if ($transaction->transaction_type === 'trip') {
                $item = PaketTrip::find($transaction->reference_id);
            } else if ($transaction->transaction_type === 'travel') {
                $item = Travel::find($transaction->reference_id);
            }

            return [
                'id' => $transaction->id,
                'order_id' => $transaction->midtrans_order_id,
                'transaction_type' => $transaction->transaction_type,
                'total_price' => $transaction->total_price,
                'payment_status' => $transaction->payment_status,
                'created_at' => $transaction->created_at,
                'updated_at' => $transaction->updated_at,
                'item' => $item,
                // Add booking details if they exist in transaction
                'participants' => $transaction->participants ?? null,
                'passengers' => $transaction->passengers ?? null,
                'departure_date' => $transaction->departure_date ?? null,
                'special_requests' => $transaction->special_requests ?? null,
                'pickup_location' => $transaction->pickup_location ?? null,
                'destination_address' => $transaction->destination_address ?? null,
            ];
        });
    }

    /**
     * Get specific transaction detail for user
     */
    public function getTransactionDetail($userId, $transactionId)
    {
        $transaction = Transaction::where('id', $transactionId)
            ->where('user_id', $userId)
            ->with(['user'])
            ->first();

        if (!$transaction) {
            throw new \Exception('Transaction not found or access denied');
        }

        $item = null;
        
        if ($transaction->transaction_type === 'trip') {
            $item = PaketTrip::find($transaction->reference_id);
        } else if ($transaction->transaction_type === 'travel') {
            $item = Travel::find($transaction->reference_id);
        }

        return [
            'id' => $transaction->id,
            'order_id' => $transaction->midtrans_order_id,
            'transaction_type' => $transaction->transaction_type,
            'total_price' => $transaction->total_price,
            'payment_status' => $transaction->payment_status,
            'created_at' => $transaction->created_at,
            'updated_at' => $transaction->updated_at,
            'item' => $item,
            'user' => $transaction->user,
            // Add booking details if they exist in transaction
            'participants' => $transaction->participants ?? null,
            'passengers' => $transaction->passengers ?? null,
            'departure_date' => $transaction->departure_date ?? null,
            'special_requests' => $transaction->special_requests ?? null,
            'pickup_location' => $transaction->pickup_location ?? null,
            'destination_address' => $transaction->destination_address ?? null,
        ];
    }
}
