<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\TransactionService;
use Illuminate\Http\Request;

/**
 * @tags User Transactions
 */
class TransactionController extends Controller
{
    protected $transactionService;

    public function __construct(TransactionService $transactionService)
    {
        $this->transactionService = $transactionService;
    }

    /**
     * Create transaction for trip (Requires authentication)
     *
     * @summary Create trip transaction
     * @description Create a new transaction for a trip package. Requires user authentication. Returns transaction details and Midtrans Snap token for payment.
     */
    public function createTripTransaction(Request $request, string $tripId)
    {
        $request->validate([
            'participants' => 'required|integer|min:1|max:50',
            'departure_date' => 'required|date|after:today',
            'special_requests' => 'nullable|string|max:1000',
            'contact_phone' => 'required|string|max:20',
            'emergency_contact' => 'nullable|string|max:255'
        ]);

        try {
            $result = $this->transactionService->createTripTransaction(
                $request->user()->id,
                $tripId,
                $request->only([
                    'participants',
                    'departure_date', 
                    'special_requests',
                    'contact_phone',
                    'emergency_contact'
                ])
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
     *
     * @summary Create travel transaction
     * @description Create a new transaction for a travel service. Requires user authentication. Returns transaction details and Midtrans Snap token for payment.
     */
    public function createTravelTransaction(Request $request, string $travelId)
    {
        $request->validate([
            'passengers' => 'required|integer|min:1|max:10',
            'departure_date' => 'required|date|after:today',
            'pickup_location' => 'required|string|max:255',
            'destination_address' => 'nullable|string|max:255',
            'contact_phone' => 'required|string|max:20',
            'special_requests' => 'nullable|string|max:1000'
        ]);

        try {
            $result = $this->transactionService->createTravelTransaction(
                $request->user()->id,
                $travelId,
                $request->only([
                    'passengers',
                    'departure_date',
                    'pickup_location',
                    'destination_address', 
                    'contact_phone',
                    'special_requests'
                ])
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
     * Get user's bookings/transactions (Requires authentication)
     *
     * @summary Get user bookings
     * @description Get all transactions/bookings for the authenticated user
     */
    public function getUserBookings(Request $request)
    {
        try {
            $bookings = $this->transactionService->getUserBookings($request->user()->id);

            return response()->json([
                'message' => 'User bookings retrieved successfully',
                'data' => $bookings
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve bookings',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Get specific transaction detail (Requires authentication)
     *
     * @summary Get transaction detail
     * @description Get detailed information about a specific transaction. User can only access their own transactions.
     */
    public function getTransactionDetail(Request $request, string $transactionId)
    {
        try {
            $transaction = $this->transactionService->getTransactionDetail(
                $request->user()->id,
                $transactionId
            );

            return response()->json([
                'message' => 'Transaction detail retrieved successfully',
                'data' => $transaction
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve transaction detail',
                'error' => $e->getMessage()
            ], 400);
        }
    }
}
