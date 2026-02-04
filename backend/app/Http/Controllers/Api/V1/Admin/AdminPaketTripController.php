<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PaketTripRequest;
use App\Models\PaketTrip;
use App\Services\FileUploadService;
use Illuminate\Http\Request;

class AdminPaketTripController extends Controller
{
    protected $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    /**
     * Display a listing of all trips (Admin only)
     */
    public function index(Request $request)
    {
        try {
            $perPage = $request->get('per_page', 5); // Default 5 items per page
            $page = $request->get('page', 1);

            // Validate per_page parameter
            if ($perPage > 50) {
                $perPage = 50; // Max 50 items per page
            }

            $trips = PaketTrip::orderBy('created_at', 'desc')
                ->paginate($perPage);

            // Add image URLs to each trip
            $trips->getCollection()->transform(function ($trip) {
                $trip->image_url = $trip->image ? $this->fileUploadService->getImageUrl($trip->image) : null;
                return $trip;
            });

            return response()->json([
                'message' => 'Trips retrieved successfully',
                'data' => $trips->items(),
                'pagination' => [
                    'current_page' => $trips->currentPage(),
                    'per_page' => $trips->perPage(),
                    'total' => $trips->total(),
                    'last_page' => $trips->lastPage(),
                    'from' => $trips->firstItem(),
                    'to' => $trips->lastItem(),
                    'has_more_pages' => $trips->hasMorePages(),
                ]
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
     * JSON ONLY - Supports base64 image OR image URL
     * IMAGE IS REQUIRED
     */
    public function store(Request $request)
    {
        // JSON validation only - supports base64 OR image URL
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'rundown' => 'nullable|array',
            'rundown.*.time' => 'nullable|string|max:255',
            'rundown.*.activity' => 'required_with:rundown.*|string|max:500',
            'facilities' => 'nullable|array',
            'facilities.*' => 'string|max:255',
            'price' => 'required|numeric|min:0',
            'duration' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'quota' => 'required|integer|min:1',
            'capacity' => 'required|integer|min:1',
            'image_base64' => 'required_without:image_url|string', // Base64 image
            'image_url' => 'required_without:image_base64|url', // Direct image URL
            'image_name' => 'required_with:image_base64|string|max:255',
            'is_active' => 'nullable|boolean',
        ]);

        try {
            $data = $request->only([
                'title', 'description', 'rundown', 'facilities', 'price', 'duration',
                'location', 'quota', 'capacity', 'is_active'
            ]);

            // Set default is_active if not provided
            $data['is_active'] = $request->has('is_active') ? $request->is_active : true;

            // Handle image processing
            // Handle image processing using Service (GEMINI.MD #1 & #2)
            $imagePath = $this->fileUploadService->processImageSource(
                $request->only(['image_base64', 'image_url', 'image_name']),
                'trips'
            );

            if ($imagePath) {
                $data['image'] = $imagePath;
            }


            $trip = PaketTrip::create($data);
            $trip->image_url = $trip->image ? $this->fileUploadService->getImageUrl($trip->image) : null;

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
            $trip->image_url = $trip->image ? $this->fileUploadService->getImageUrl($trip->image) : null;

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
     * JSON ONLY - Supports base64 image OR image URL
     */
    public function update(Request $request, string $id)
    {
        // JSON validation only - supports base64 OR image URL
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'rundown' => 'nullable|array',
            'rundown.*.time' => 'nullable|string|max:255',
            'rundown.*.activity' => 'required_with:rundown.*|string|max:500',
            'facilities' => 'nullable|array',
            'facilities.*' => 'string|max:255',
            'price' => 'sometimes|required|numeric|min:0',
            'duration' => 'sometimes|required|string|max:255',
            'location' => 'sometimes|required|string|max:255',
            'quota' => 'sometimes|required|integer|min:1',
            'capacity' => 'sometimes|required|integer|min:1',
            'image_base64' => 'nullable|string', // Base64 image
            'image_url' => 'nullable|url', // Direct image URL
            'image_name' => 'required_with:image_base64|string|max:255',
            'is_active' => 'nullable|boolean',
        ]);

        try {
            $trip = PaketTrip::findOrFail($id);

            $data = $request->only([
                'title', 'description', 'rundown', 'facilities', 'price', 'duration',
                'location', 'quota', 'capacity', 'is_active'
            ]);

            // Handle image processing
            // Handle image processing using Service (GEMINI.MD #1 & #2)
            $imagePath = $this->fileUploadService->processImageSource(
                $request->only(['image_base64', 'image_url', 'image_name']),
                'trips',
                $trip->image
            );

            if ($imagePath) {
                $data['image'] = $imagePath;
            }


            // Perform update with only the fields provided in request
            $trip->update(collect($data)->reject(fn($v) => is_null($v))->toArray());
            $trip->image_url = $trip->image ? $this->fileUploadService->getImageUrl($trip->image) : null;

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

            // Delete associated image
            if ($trip->image) {
                $this->fileUploadService->deleteImage($trip->image);
            }

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
