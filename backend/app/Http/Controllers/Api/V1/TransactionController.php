<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\TransactionService;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    protected $transactionService;

    public function __construct(TransactionService $transactionService)
    {
        $this->transactionService = $transactionService;
    }

    /**
     * Create transaction for trip (Requires authentication)
     */
    public function createTripTransaction(Request $request, string $tripId)
    {
        try {
            $result = $this->transactionService->createTripTransaction(
                $request->user()->id,
                $tripId
            );

            return response()->json([
                'message' => 'Transaction created successfully',
                'data' => [
                    'transaction_id' => $result['transaction']->id,
                    'order_id' => $result['transaction']->midtrans_order_id,
                    'total_price' => $result['transaction']->total_price,
                    'snap_token' => $result['snap_token'],
                    'item' => $result['item']
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create transaction',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Create transaction for travel (Requires authentication)
     */
    public function createTravelTransaction(Request $request, string $travelId)
    {
        try {
            $result = $this->transactionService->createTravelTransaction(
                $request->user()->id,
                $travelId
            );

            return response()->json([
                'message' => 'Transaction created successfully',
                'data' => [
                    'transaction_id' => $result['transaction']->id,
                    'order_id' => $result['transaction']->midtrans_order_id,
                    'total_price' => $result['transaction']->total_price,
                    'snap_token' => $result['snap_token'],
                    'item' => $result['item']
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create transaction',
                'error' => $e->getMessage()
            ], 400);
        }
    }
}
