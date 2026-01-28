<?php

namespace App\Services;

use Midtrans\Config;
use Midtrans\Snap;
use Midtrans\Notification;

class MidtransService
{
    public function __construct()
    {
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = config('midtrans.is_sanitized');
        Config::$is3ds = config('midtrans.is_3ds');
    }

    /**
     * Create Snap Token for payment
     */
    public function createSnapToken($orderId, $grossAmount, $customerDetails, $itemDetails)
    {
        $params = [
            'transaction_details' => [
                'order_id' => $orderId,
                'gross_amount' => $grossAmount,
            ],
            'customer_details' => $customerDetails,
            'item_details' => $itemDetails,
            'enabled_payments' => [
                'bri_va',      // Bank BRI Virtual Account
                'bca_va',      // Bank BCA Virtual Account
                'qris'         // QRIS
            ],
            'custom_expiry' => [
                'order_time' => date('Y-m-d H:i:s O'),
                'expiry_duration' => 60,
                'unit' => 'minute'
            ],
            'callbacks' => [
                'finish' => config('app.url') . '/payment/success'
            ]
        ];

        try {
            $snapToken = Snap::getSnapToken($params);
            return $snapToken;
        } catch (\Exception $e) {
            throw new \Exception('Failed to create Snap token: ' . $e->getMessage());
        }
    }

    /**
     * Handle Midtrans notification callback
     */
    public function handleNotification()
    {
        try {
            $notification = new Notification();

            $transactionStatus = $notification->transaction_status;
            $fraudStatus = $notification->fraud_status;
            $orderId = $notification->order_id;

            // Determine payment status
            $paymentStatus = 'pending';

            if ($transactionStatus == 'capture') {
                if ($fraudStatus == 'challenge') {
                    $paymentStatus = 'pending';
                } else if ($fraudStatus == 'accept') {
                    $paymentStatus = 'paid';
                }
            } else if ($transactionStatus == 'settlement') {
                $paymentStatus = 'paid';
            } else if ($transactionStatus == 'cancel' ||
                      $transactionStatus == 'deny' ||
                      $transactionStatus == 'expire') {
                $paymentStatus = 'failed';
 }else if ($transactionStatus == 'pending') {
                $paymentStatus = 'pending';
            }

            return [
                'order_id' => $orderId,
                'payment_status' => $paymentStatus,
                'transaction_status' => $transactionStatus,
                'fraud_status' => $fraudStatus,
                'raw_response' => $notification->getResponse()
            ];
        } catch (\Exception $e) {
            throw new \Exception('Failed to handle notification: ' . $e->getMessage());
        }
    }

    /**
     * Verify signature key for security
     */
    public function verifySignature($orderId, $statusCode, $grossAmount, $signatureKey)
    {
        $serverKey = config('midtrans.server_key');
        $hash = hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);

        return $hash === $signatureKey;
    }
}
