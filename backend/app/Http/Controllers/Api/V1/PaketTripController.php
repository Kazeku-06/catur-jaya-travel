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
     * Display a listing of active trips (Public access)
     *
     * @summary Get all active trips
     * @description Retrieve all active trip packages available for booking. No authentication required.
     */
    public function index()
    {
        try {
            $trips = PaketTrip::active()->get()->map(function ($trip) {
                $trip->image_url = $trip->image ? $this->fileUploadService->getImageUrl($trip->image) : null;
                return $trip;
            });

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
     * Display the specified trip (Public access)
     *
     * @summary Get trip details
     * @description Get detailed information about a specific trip package. No authentication required.
     */
    public function show(string $id)
    {
        try {
            $trip = PaketTrip::where('id', $id)->where('is_active', true)->first();

            if (!$trip) {
                return response()->json([
                    'message' => 'Trip not found'
                ], 404);
            }

            $trip->image_url = $trip->image ? $this->fileUploadService->getImageUrl($trip->image) : null;

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
