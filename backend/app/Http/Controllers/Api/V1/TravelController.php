<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Travel;
use Illuminate\Http\Request;

class TravelController extends Controller
{
    /**
     * Display a listing of active travels (Public access)
     */
    public function index()
    {
        try {
            $travels = Travel::active()->get();

            return response()->json([
                'message' => 'Travels retrieved successfully',
                'data' => $travels
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve travels',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified travel (Public access)
     */
    public function show(string $id)
    {
        try {
            $travel = Travel::where('id', $id)->where('is_active', true)->first();

            if (!$travel) {
                return response()->json([
                    'message' => 'Travel not found'
                ], 404);
            }

            return response()->json([
                'message' => 'Travel retrieved successfully',
                'data' => $travel
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve travel',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
