<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Travel;
use App\Services\FileUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AdminTravelJsonController extends Controller
{
    protected $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    /**
     * Store a newly created travel with required image (JSON format with base64)
     */
    public function store(Request $request)
    {
        // Validation for JSON with base64 image
        $validator = Validator::make($request->all(), [
            'origin' => 'required|string|max:255',
            'destination' => 'required|string|max:255',
            'vehicle_type' => 'required|string|max:255',
            'price_per_person' => 'required|numeric|min:0',
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
                'origin', 'destination', 'vehicle_type', 
                'price_per_person', 'is_active'
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
            $imagePath = 'travels/' . $filename;

            // Save image to storage
            \Storage::disk('public')->put($imagePath, $imageData);

            $data['image'] = $imagePath;

            // Create travel
            $travel = Travel::create($data);
            $travel->image_url = $this->fileUploadService->getImageUrl($travel->image);

            return response()->json([
                'message' => 'Travel created successfully with image',
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
     * Update travel with optional image (JSON format with base64)
     */
    public function update(Request $request, string $id)
    {
        // Validation for JSON with optional base64 image
        $validator = Validator::make($request->all(), [
            'origin' => 'sometimes|required|string|max:255',
            'destination' => 'sometimes|required|string|max:255',
            'vehicle_type' => 'sometimes|required|string|max:255',
            'price_per_person' => 'sometimes|required|numeric|min:0',
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
            $travel = Travel::findOrFail($id);
            
            $data = $request->only([
                'origin', 'destination', 'vehicle_type', 
                'price_per_person', 'is_active'
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
                if ($travel->image) {
                    $this->fileUploadService->deleteImage($travel->image);
                }

                // Generate unique filename
                $extension = strtolower($imageType) === 'jpeg' ? 'jpg' : strtolower($imageType);
                $filename = Str::uuid() . '.' . $extension;
                $imagePath = 'travels/' . $filename;

                // Save new image to storage
                \Storage::disk('public')->put($imagePath, $imageData);

                $data['image'] = $imagePath;
            }

            // Update travel
            $travel->update(array_filter($data)); // Only update provided fields
            $travel->image_url = $travel->image ? $this->fileUploadService->getImageUrl($travel->image) : null;

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
}