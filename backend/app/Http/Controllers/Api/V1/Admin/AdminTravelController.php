<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\TravelRequest;
use App\Models\Travel;
use Illuminate\Http\Request;

class AdminTravelController extends Controller
{
    /**
     * Display a listing of all travels (Admin only)
     */
    public function index()
    {
        try {
            $travels = Travel::all();

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
     * Store a newly created travel (Admin only)
     */
    public function store(TravelRequest $request)
    {
        try {
            $travel = Travel::create($request->validated());

            return response()->json([
                'message' => 'Travel created successfully',
                'data' => $travel
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create travel',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified travel (Admin only)
     */
    public function show(string $id)
    {
        try {
            $travel = Travel::findOrFail($id);

            return response()->json([
                'message' => 'Travel retrieved successfully',
                'data' => $travel
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Travel not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified travel (Admin only)
     */
    public function update(TravelRequest $request, string $id)
    {
        try {
            $travel = Travel::findOrFail($id);
            $travel->update($request->validated());

            return response()->json([
                'message' => 'Travel updated successfully',
                'data' => $travel
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update travel',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified travel (Admin only)
     */
    public function destroy(string $id)
    {
        try {
            $travel = Travel::findOrFail($id);
            $travel->delete();

            return response()->json([
                'message' => 'Travel deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete travel',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
