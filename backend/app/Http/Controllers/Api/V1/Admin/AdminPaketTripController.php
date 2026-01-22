<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PaketTripRequest;
use App\Models\PaketTrip;
use Illuminate\Http\Request;

class AdminPaketTripController extends Controller
{
    /**
     * Display a listing of all trips (Admin only)
     */
    public function index()
    {
        try {
            $trips = PaketTrip::all();

            return response()->json([
                'message' => 'Trips retrieved successfully',
                'data' => $trips
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve trips',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created trip (Admin only)
     */
    public function store(PaketTripRequest $request)
    {
        try {
            $trip = PaketTrip::create($request->validated());

            return response()->json([
                'message' => 'Trip created successfully',
                'data' => $trip
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create trip',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified trip (Admin only)
     */
    public function show(string $id)
    {
        try {
            $trip = PaketTrip::findOrFail($id);

            return response()->json([
                'message' => 'Trip retrieved successfully',
                'data' => $trip
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Trip not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified trip (Admin only)
     */
    public function update(PaketTripRequest $request, string $id)
    {
        try {
            $trip = PaketTrip::findOrFail($id);
            $trip->update($request->validated());

            return response()->json([
                'message' => 'Trip updated successfully',
                'data' => $trip
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update trip',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified trip (Admin only)
     */
    public function destroy(string $id)
    {
        try {
            $trip = PaketTrip::findOrFail($id);
            $trip->delete();

            return response()->json([
                'message' => 'Trip deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete trip',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
