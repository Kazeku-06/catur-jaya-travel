<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;

class AdminTransactionController extends Controller
{
    /**
     * Display a listing of all transactions (Admin only)
     */
    public function index(Request $request)
    {
        try {
            $query = Transaction::with(['user', 'payments']);

            // Filter by payment status if provided
            if ($request->has('payment_status')) {
                $query->where('payment_status', $request->payment_status);
            }

            // Filter by transaction type if provided
            if ($request->has('transaction_type')) {
                $query->where('transaction_type', $request->transaction_type);
            }

            // Filter by date range if provided
            if ($request->has('start_date')) {
                $query->whereDate('created_at', '>=', $request->start_date);
            }

            if ($request->has('end_date')) {
                $query->whereDate('created_at', '<=', $request->end_date);
            }

            $transactions = $query->orderBy('created_at', 'desc')->paginate(20);

            return response()->json([
                'message' => 'Transactions retrieved successfully',
                'data' => $transactions
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve transactions',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified transaction (Admin only)
     */
    public function show(string $id)
    {
        try {
            $transaction = Transaction::with(['user', 'payments'])->findOrFail($id);

            // Get referenced item details
            $referencedItem = null;
            if ($transaction->transaction_type === 'trip') {
                $referencedItem = \App\Models\PaketTrip::find($transaction->reference_id);
            } elseif ($transaction->transaction_type === 'travel') {
                $referencedItem = \App\Models\Travel::find($transaction->reference_id);
            }

            return response()->json([
                'message' => 'Transaction retrieved successfully',
                'data' => [
                    'transaction' => $transaction,
                    'referenced_item' => $referencedItem
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Transaction not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Get transaction statistics (Admin only)
     */
    public function statistics()
    {
        try {
            $stats = [
                'total_transactions' => Transaction::count(),
                'pending_transactions' => Transaction::where('payment_status', 'pending')->count(),
                'paid_transactions' => Transaction::where('payment_status', 'paid')->count(),
                'failed_transactions' => Transaction::where('payment_status', 'failed')->count(),
                'expired_transactions' => Transaction::where('payment_status', 'expired')->count(),
                'total_revenue' => Transaction::where('payment_status', 'paid')->sum('total_price'),
                'trip_transactions' => Transaction::where('transaction_type', 'trip')->count(),
                'travel_transactions' => Transaction::where('transaction_type', 'travel')->count(),
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
