<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\PaketTrip;
use App\Services\FileUploadService;
use Illuminate\Http\Request;

/**
 * @tags Public Catalog - Paket Trip
 */
class PaketTripController extends Controller
{
    protected $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    /**
     * Display a listing of all trips (Public access)
     *
     * @summary Get all trips (including inactive ones)
     * @description Retrieve all trip packages. Inactive trips will be shown but marked as unavailable for booking.
     */
    public function index()
    {
        try {
            // Add logging for debugging
            \Log::info('Fetching trips started');
            
            $trips = PaketTrip::select(['id', 'title', 'description', 'price', 'duration', 'location', 'quota', 'capacity', 'image', 'is_active', 'created_at', 'updated_at'])
                ->withCount(['confirmedBookings'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($trip) {
                    $trip->image_url = $trip->image ? $this->fileUploadService->getImageUrl($trip->image) : null;
                    $trip->remaining_quota = $trip->remaining_quota;
                    $trip->is_available_for_booking = $trip->isAvailableForBooking();
                    $trip->is_quota_full = $trip->isQuotaFull();
                    return $trip;
                });

            \Log::info('Trips fetched successfully', ['count' => $trips->count()]);

            return response()->json([
                'message' => 'Trips retrieved successfully',
                'data' => $trips
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching trips', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Failed to retrieve trips',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified trip (Public access)
     *
     * @summary Get trip details
     * @description Get detailed information about a specific trip package. Shows both active and inactive trips.
     */
    public function show(string $id)
    {
        try {
            $trip = PaketTrip::where('id', $id)->first();

            if (!$trip) {
                return response()->json([
                    'message' => 'Trip not found'
                ], 404);
            }

            $trip->image_url = $trip->image ? $this->fileUploadService->getImageUrl($trip->image) : null;
            $trip->remaining_quota = $trip->remaining_quota;
            $trip->is_available_for_booking = $trip->isAvailableForBooking();
            $trip->is_quota_full = $trip->isQuotaFull();

            return response()->json([
                'message' => 'Trip retrieved successfully',
                'data' => $trip
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve trip',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
