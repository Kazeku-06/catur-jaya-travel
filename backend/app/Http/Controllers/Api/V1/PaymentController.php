<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\MidtransService;
use App\Services\TransactionService;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    protected $midtransService;
    protected $transactionService;

    public function __construct(MidtransService $midtransService, TransactionService $transactionService)
    {
        $this->midtransService = $midtransService;
        $this->transactionService = $transactionService;
    }

    /**
     * Handle Midtrans callback notification
     */
    public function midtransCallback(Request $request)
    {
        try {
            // Verify signature for security
            $orderId = $request->order_id;
            $statusCode = $request->status_code;
            $grossAmount = $request->gross_amount;
            $signatureKey = $request->signature_key;

            if (!$this->midtransService->verifySignature($orderId, $statusCode, $grossAmount, $signatureKey)) {
                return response()->json(['message' => 'Invalid signature'], 400);
            }

            // Handle notification
            $notificationData = $this->midtransService->handleNotification();

            // Update transaction status
            $transaction = $this->transactionService->updateTransactionStatus(
                $notificationData['order_id'],
                $notificationData['payment_status'],
                $notificationData['raw_response']
            );

            return response()->json([
                'message' => 'Notification processed successfully',
                'transaction_id' => $transaction->id,
                'payment_status' => $transaction->payment_status
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to process notification',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get Midtrans configuration for frontend
     */
    public function getMidtransConfig()
    {
        return response()->json([
            'client_key' => config('midtrans.client_key'),
            'is_production' => config('midtrans.is_production')
        ]);
    }
}
