<?php

nap\Services;

use App\Models\Transaction;
use App\Models\PaketTrip;
use App\Models\Travel;
use App\Models\Payment;
use Illuminate\Support\Str;

class TransactionService
{
    protected $midtransService;

    public function __construct(MidtransService $midtransService)
    {
        $this->midtransService = $midtransService;
    }

    /**
     * Create transaction for trip
     */
    public function createTripTransaction($userId, $tripId)
    {
        $trip = PaketTrip::where('id', $tripId)->where('is_active', true)->first();

        if (!$trip) {
            throw new \Exception('Trip not found or inactive');
        }

        $orderId = 'TRIP-' . time() . '-' . Str::random(6);

        $transaction = Transaction::create([
            'user_id' => $userId,
            'transaction_type' => 'trip',
            'reference_id' => $tripId,
            'total_price' => $trip->price,
            'payment_status' => 'pending',
            'midtrans_order_id' => $orderId,
        ]);

        return $this->createPayment($transaction, $trip);
    }

    /**
     * Create transaction for travel
     */
    public function createTravelTransaction($userId, $travelId)
    {
        $travel = Travel::where('id', $travelId)->where('is_active', true)->first();

        if (!$travel) {
            throw new \Exception('Travel not found or inactive');
        }

        $orderId = 'TRAVEL-' . time() . '-' . Str::random(6);

        $transaction = Transaction::create([
            'user_id' => $userId,
            'transaction_type' => 'travel',
            'reference_id' => $travelId,
            'total_price' => $travel->price_per_person,
            'payment_status' => 'pending',
            'midtrans_order_id' => $orderId,
        ]);

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

        $itemName = $transaction->transaction_type=== 'trip' ? $item->title : $item->origin . ' - ' . $item->destination;

        $itemDetails = [
            [
                'id' => $transaction->reference_id,
                'price' => $transaction->total_price,
                'quantity' => 1,
                'name' => $itemName,
            ]
        ];

        try {
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
            // Delete transaction if payment creation fails
            $transaction->delete();
            throw $e;
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

        $transaction->update(['payment_status' => $paymentStatus]);

        // Create payment record
        Payment::create([
            'transaction_id' => $transaction->id,
            'payment_type' => 'midtrans',
            'transaction_status' => $paymentStatus,
            'raw_response' => $rawResponse,
        ]);

        return $transaction;
    }
}
