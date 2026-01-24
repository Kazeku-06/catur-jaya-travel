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
    public function index()
    {
        try {
            $trips = PaketTrip::all()->map(function ($trip) {
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
     * Store a newly created trip (Admin only)
     */
    public function store(Request $request)
    {
        // Custom validation for multipart/form-data
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'duration' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'quota' => 'required|integer|min:1',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120', // 5MB max
            'is_active' => 'nullable|in:true,false,1,0',
        ]);

        try {
            $data = $request->only([
                'title', 'description', 'price', 'duration', 
                'location', 'quota', 'is_active'
            ]);

            // Set default is_active if not provided
            $data['is_active'] = $request->has('is_active') ? 
                in_array($request->is_active, ['true', '1', 1, true]) : true;

            // Handle image upload
            if ($request->hasFile('image')) {
                $data['image'] = $this->fileUploadService->uploadImage(
                    $request->file('image'),
                    'trips'
                );
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
     */
    public function update(Request $request, string $id)
    {
        // Custom validation for multipart/form-data
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric|min:0',
            'duration' => 'sometimes|required|string|max:255',
            'location' => 'sometimes|required|string|max:255',
            'quota' => 'sometimes|required|integer|min:1',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120', // 5MB max
            'is_active' => 'nullable|in:true,false,1,0',
        ]);

        try {
            $trip = PaketTrip::findOrFail($id);
            
            $data = $request->only([
                'title', 'description', 'price', 'duration', 
                'location', 'quota', 'is_active'
            ]);

            // Handle image upload
            if ($request->hasFile('image')) {
                $data['image'] = $this->fileUploadService->uploadImage(
                    $request->file('image'),
                    'trips',
                    $trip->image // Delete old image
                );
            }

            $trip->update(array_filter($data)); // Only update provided fields
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

    /**
     * Upload image for trip (Admin only)
     */
    public function uploadImage(Request $request, string $id)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120', // 5MB max
        ]);

        try {
            $trip = PaketTrip::findOrFail($id);

            if ($request->hasFile('image')) {
                $imagePath = $this->fileUploadService->uploadImage(
                    $request->file('image'),
                    'trips',
                    $trip->image // Delete old image
                );

                $trip->update(['image' => $imagePath]);
                $trip->image_url = $this->fileUploadService->getImageUrl($imagePath);

                return response()->json([
                    'message' => 'Image uploaded successfully',
                    'data' => [
                        'image_path' => $imagePath,
                        'image_url' => $trip->image_url
                    ]
                ]);
            }

            return response()->json([
                'message' => 'No image file provided'
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to upload image',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
