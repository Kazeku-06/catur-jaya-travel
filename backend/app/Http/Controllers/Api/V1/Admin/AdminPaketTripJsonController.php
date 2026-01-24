<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\PaketTrip;
use App\Services\FileUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AdminPaketTripJsonController extends Controller
{
    protected $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    /**
     * Store a newly created trip with required image (JSON format with base64)
     */
    public function store(Request $request)
    {
        // Validation for JSON with base64 image
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'duration' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'quota' => 'required|integer|min:1',
            'image_base64' => 'required|string', // Base64 encoded image
            'image_name' => 'required|string|max:255', // Original filename
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $request->only([
                'title', 'description', 'price', 'duration', 
                'location', 'quota', 'is_active'
            ]);

            // Set default is_active if not provided
            $data['is_active'] = $request->has('is_active') ? $request->is_active : true;

            // Handle base64 image
            $imageBase64 = $request->image_base64;
            $imageName = $request->image_name;

            // Validate base64 format
            if (!preg_match('/^data:image\/(\w+);base64,/', $imageBase64, $matches)) {
                return response()->json([
                    'message' => 'Invalid image format. Must be base64 with data:image prefix',
                    'error' => 'Expected format: data:image/jpeg;base64,{base64_string}'
                ], 400);
            }

            $imageType = $matches[1];
            $allowedTypes = ['jpeg', 'jpg', 'png', 'webp'];
            
            if (!in_array(strtolower($imageType), $allowedTypes)) {
                return response()->json([
                    'message' => 'Invalid image type. Allowed: JPEG, JPG, PNG, WEBP',
                    'error' => "Received type: $imageType"
                ], 400);
            }

            // Remove data:image/xxx;base64, prefix
            $imageData = preg_replace('/^data:image\/\w+;base64,/', '', $imageBase64);
            $imageData = base64_decode($imageData);

            if ($imageData === false) {
                return response()->json([
                    'message' => 'Failed to decode base64 image',
                    'error' => 'Invalid base64 encoding'
                ], 400);
            }

            // Check image size (max 5MB)
            if (strlen($imageData) > 5 * 1024 * 1024) {
                return response()->json([
                    'message' => 'Image too large. Maximum size is 5MB',
                    'error' => 'Current size: ' . round(strlen($imageData) / 1024 / 1024, 2) . 'MB'
                ], 400);
            }

            // Generate unique filename
            $extension = strtolower($imageType) === 'jpeg' ? 'jpg' : strtolower($imageType);
            $filename = Str::uuid() . '.' . $extension;
            $imagePath = 'trips/' . $filename;

            // Save image to storage
            \Storage::disk('public')->put($imagePath, $imageData);

            $data['image'] = $imagePath;

            // Create trip
            $trip = PaketTrip::create($data);
            $trip->image_url = $this->fileUploadService->getImageUrl($trip->image);

            return response()->json([
                'message' => 'Trip created successfully with image',
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
     * Update trip with optional image (JSON format with base64)
     */
    public function update(Request $request, string $id)
    {
        // Validation for JSON with optional base64 image
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric|min:0',
            'duration' => 'sometimes|required|string|max:255',
            'location' => 'sometimes|required|string|max:255',
            'quota' => 'sometimes|required|integer|min:1',
            'image_base64' => 'nullable|string', // Optional base64 encoded image
            'image_name' => 'required_with:image_base64|string|max:255', // Required if image_base64 provided
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $trip = PaketTrip::findOrFail($id);
            
            $data = $request->only([
                'title', 'description', 'price', 'duration', 
                'location', 'quota', 'is_active'
            ]);

            // Handle base64 image if provided
            if ($request->has('image_base64') && $request->image_base64) {
                $imageBase64 = $request->image_base64;

                // Validate base64 format
                if (!preg_match('/^data:image\/(\w+);base64,/', $imageBase64, $matches)) {
                    return response()->json([
                        'message' => 'Invalid image format. Must be base64 with data:image prefix',
                        'error' => 'Expected format: data:image/jpeg;base64,{base64_string}'
                    ], 400);
                }

                $imageType = $matches[1];
                $allowedTypes = ['jpeg', 'jpg', 'png', 'webp'];
                
                if (!in_array(strtolower($imageType), $allowedTypes)) {
                    return response()->json([
                        'message' => 'Invalid image type. Allowed: JPEG, JPG, PNG, WEBP',
                        'error' => "Received type: $imageType"
                    ], 400);
                }

                // Remove data:image/xxx;base64, prefix
                $imageData = preg_replace('/^data:image\/\w+;base64,/', '', $imageBase64);
                $imageData = base64_decode($imageData);

                if ($imageData === false) {
                    return response()->json([
                        'message' => 'Failed to decode base64 image',
                        'error' => 'Invalid base64 encoding'
                    ], 400);
                }

                // Check image size (max 5MB)
                if (strlen($imageData) > 5 * 1024 * 1024) {
                    return response()->json([
                        'message' => 'Image too large. Maximum size is 5MB',
                        'error' => 'Current size: ' . round(strlen($imageData) / 1024 / 1024, 2) . 'MB'
                    ], 400);
                }

                // Delete old image
                if ($trip->image) {
                    $this->fileUploadService->deleteImage($trip->image);
                }

                // Generate unique filename
                $extension = strtolower($imageType) === 'jpeg' ? 'jpg' : strtolower($imageType);
                $filename = Str::uuid() . '.' . $extension;
                $imagePath = 'trips/' . $filename;

                // Save new image to storage
                \Storage::disk('public')->put($imagePath, $imageData);

                $data['image'] = $imagePath;
            }

            // Update trip
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
}