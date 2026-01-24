<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\TravelRequest;
use App\Models\Travel;
use App\Services\FileUploadService;
use Illuminate\Http\Request;

class AdminTravelController extends Controller
{
    protected $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    /**
     * Display a listing of all travels (Admin only)
     */
    public function index()
    {
        try {
            $travels = Travel::all()->map(function ($travel) {
                $travel->image_url = $travel->image ? $this->fileUploadService->getImageUrl($travel->image) : null;
                return $travel;
            });

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
     * Supports both Form Data and JSON with base64 image
     * IMAGE IS REQUIRED for both formats
     */
    public function store(Request $request)
    {
        // Detect content type
        $contentType = $request->header('Content-Type', '');
        $isJson = str_contains($contentType, 'application/json');

        if ($isJson) {
            // JSON with base64 image validation
            $request->validate([
                'origin' => 'required|string|max:255',
                'destination' => 'required|string|max:255',
                'vehicle_type' => 'required|string|max:255',
                'price_per_person' => 'required|numeric|min:0',
                'image_base64' => 'required|string', // REQUIRED for JSON
                'image_name' => 'required|string|max:255',
                'is_active' => 'nullable|boolean',
            ]);
        } else {
            // Form data validation
            $request->validate([
                'origin' => 'required|string|max:255',
                'destination' => 'required|string|max:255',
                'vehicle_type' => 'required|string|max:255',
                'price_per_person' => 'required|numeric|min:0',
                'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120', // REQUIRED for Form Data
                'is_active' => 'nullable|in:true,false,1,0',
            ]);
        }

        try {
            $data = $request->only([
                'origin', 'destination', 'vehicle_type', 
                'price_per_person', 'is_active'
            ]);

            // Handle is_active
            if ($isJson) {
                $data['is_active'] = $request->has('is_active') ? $request->is_active : true;
            } else {
                $data['is_active'] = $request->has('is_active') ? 
                    in_array($request->is_active, ['true', '1', 1, true]) : true;
            }

            // Handle image upload
            if ($isJson) {
                // Handle base64 image
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

                // Generate unique filename
                $extension = strtolower($imageType) === 'jpeg' ? 'jpg' : strtolower($imageType);
                $filename = \Illuminate\Support\Str::uuid() . '.' . $extension;
                $imagePath = 'travels/' . $filename;

                // Save image to storage
                \Storage::disk('public')->put($imagePath, $imageData);
                $data['image'] = $imagePath;

            } else {
                // Handle form data image
                $data['image'] = $this->fileUploadService->uploadImage(
                    $request->file('image'),
                    'travels'
                );
            }

            $travel = Travel::create($data);
            $travel->image_url = $travel->image ? $this->fileUploadService->getImageUrl($travel->image) : null;

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
            $travel->image_url = $travel->image ? $this->fileUploadService->getImageUrl($travel->image) : null;

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
     * Supports both Form Data and JSON with base64 image
     */
    public function update(Request $request, string $id)
    {
        // Detect content type
        $contentType = $request->header('Content-Type', '');
        $isJson = str_contains($contentType, 'application/json');

        if ($isJson) {
            // JSON with base64 image validation
            $request->validate([
                'origin' => 'sometimes|required|string|max:255',
                'destination' => 'sometimes|required|string|max:255',
                'vehicle_type' => 'sometimes|required|string|max:255',
                'price_per_person' => 'sometimes|required|numeric|min:0',
                'image_base64' => 'nullable|string',
                'image_name' => 'required_with:image_base64|string|max:255',
                'is_active' => 'nullable|boolean',
            ]);
        } else {
            // Form data validation
            $request->validate([
                'origin' => 'sometimes|required|string|max:255',
                'destination' => 'sometimes|required|string|max:255',
                'vehicle_type' => 'sometimes|required|string|max:255',
                'price_per_person' => 'sometimes|required|numeric|min:0',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
                'is_active' => 'nullable|in:true,false,1,0',
            ]);
        }

        try {
            $travel = Travel::findOrFail($id);
            
            $data = $request->only([
                'origin', 'destination', 'vehicle_type', 
                'price_per_person', 'is_active'
            ]);

            // Handle image upload
            if ($isJson && $request->has('image_base64') && $request->image_base64) {
                // Handle base64 image
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
                $filename = \Illuminate\Support\Str::uuid() . '.' . $extension;
                $imagePath = 'travels/' . $filename;

                // Save new image to storage
                \Storage::disk('public')->put($imagePath, $imageData);
                $data['image'] = $imagePath;

            } elseif (!$isJson && $request->hasFile('image')) {
                // Handle form data image
                $data['image'] = $this->fileUploadService->uploadImage(
                    $request->file('image'),
                    'travels',
                    $travel->image // Delete old image
                );
            }

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

    /**
     * Remove the specified travel (Admin only)
     */
    public function destroy(string $id)
    {
        try {
            $travel = Travel::findOrFail($id);
            
            // Delete associated image
            if ($travel->image) {
                $this->fileUploadService->deleteImage($travel->image);
            }
            
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

    /**
     * Upload image for travel (Admin only)
     */
    public function uploadImage(Request $request, string $id)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120', // 5MB max
        ]);

        try {
            $travel = Travel::findOrFail($id);

            if ($request->hasFile('image')) {
                $imagePath = $this->fileUploadService->uploadImage(
                    $request->file('image'),
                    'travels',
                    $travel->image // Delete old image
                );

                $travel->update(['image' => $imagePath]);
                $travel->image_url = $this->fileUploadService->getImageUrl($imagePath);

                return response()->json([
                    'message' => 'Image uploaded successfully',
                    'data' => [
                        'image_path' => $imagePath,
                        'image_url' => $travel->image_url
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
