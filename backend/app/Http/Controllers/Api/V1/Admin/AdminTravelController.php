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
    public function index(Request $request)
    {
        try {
            $perPage = $request->get('per_page', 5); // Default 5 items per page
            $page = $request->get('page', 1);
            
            // Validate per_page parameter
            if ($perPage > 50) {
                $perPage = 50; // Max 50 items per page
            }

            $travels = Travel::orderBy('created_at', 'desc')
                ->paginate($perPage);

            // Add image URLs to each travel
            $travels->getCollection()->transform(function ($travel) {
                $travel->image_url = $travel->image ? $this->fileUploadService->getImageUrl($travel->image) : null;
                return $travel;
            });

            return response()->json([
                'message' => 'Travels retrieved successfully',
                'data' => $travels->items(),
                'pagination' => [
                    'current_page' => $travels->currentPage(),
                    'per_page' => $travels->perPage(),
                    'total' => $travels->total(),
                    'last_page' => $travels->lastPage(),
                    'from' => $travels->firstItem(),
                    'to' => $travels->lastItem(),
                    'has_more_pages' => $travels->hasMorePages(),
                ]
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
     * JSON ONLY - Supports base64 image OR image URL
     * IMAGE IS REQUIRED
     */
    public function store(Request $request)
    {
        // JSON validation only - supports base64 OR image URL
        $request->validate([
            'origin' => 'required|string|max:255',
            'destination' => 'required|string|max:255',
            'vehicle_type' => 'required|string|max:255',
            'price_per_person' => 'required|numeric|min:0',
            'image_base64' => 'required_without:image_url|string', // Base64 image
            'image_url' => 'required_without:image_base64|url', // Direct image URL
            'image_name' => 'required_with:image_base64|string|max:255',
            'is_active' => 'nullable|boolean',
        ]);

        try {
            $data = $request->only([
                'origin', 'destination', 'vehicle_type', 
                'price_per_person', 'is_active'
            ]);

            // Set default is_active if not provided
            $data['is_active'] = $request->has('is_active') ? $request->is_active : true;

            // Handle image processing
            if ($request->has('image_base64') && $request->image_base64) {
                // Handle base64 image
                $imageBase64 = $request->image_base64;

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

                $imageData = preg_replace('/^data:image\/\w+;base64,/', '', $imageBase64);
                $imageData = base64_decode($imageData);

                if ($imageData === false) {
                    return response()->json([
                        'message' => 'Failed to decode base64 image',
                        'error' => 'Invalid base64 encoding'
                    ], 400);
                }

                if (strlen($imageData) > 5 * 1024 * 1024) {
                    return response()->json([
                        'message' => 'Image too large. Maximum size is 5MB',
                        'error' => 'Current size: ' . round(strlen($imageData) / 1024 / 1024, 2) . 'MB'
                    ], 400);
                }

                $extension = strtolower($imageType) === 'jpeg' ? 'jpg' : strtolower($imageType);
                $filename = \Illuminate\Support\Str::uuid() . '.' . $extension;
                $imagePath = 'travels/' . $filename;

                \Storage::disk('public')->put($imagePath, $imageData);
                $data['image'] = $imagePath;

            } elseif ($request->has('image_url') && $request->image_url) {
                // Handle image URL - download and save locally
                try {
                    $imageUrl = $request->image_url;
                    $imageContent = file_get_contents($imageUrl);
                    
                    if ($imageContent === false) {
                        return response()->json([
                            'message' => 'Failed to download image from URL',
                            'error' => 'Could not access the provided image URL'
                        ], 400);
                    }

                    if (strlen($imageContent) > 5 * 1024 * 1024) {
                        return response()->json([
                            'message' => 'Image too large. Maximum size is 5MB',
                            'error' => 'Current size: ' . round(strlen($imageContent) / 1024 / 1024, 2) . 'MB'
                        ], 400);
                    }

                    $imageInfo = getimagesizefromstring($imageContent);
                    if ($imageInfo === false) {
                        return response()->json([
                            'message' => 'Invalid image file',
                            'error' => 'The URL does not point to a valid image'
                        ], 400);
                    }

                    $mimeToExt = [
                        'image/jpeg' => 'jpg',
                        'image/png' => 'png',
                        'image/webp' => 'webp',
                        'image/jpg' => 'jpg'
                    ];

                    $extension = $mimeToExt[$imageInfo['mime']] ?? null;
                    if (!$extension) {
                        return response()->json([
                            'message' => 'Unsupported image type',
                            'error' => 'Allowed types: JPEG, PNG, WEBP'
                        ], 400);
                    }

                    $filename = \Illuminate\Support\Str::uuid() . '.' . $extension;
                    $imagePath = 'travels/' . $filename;

                    \Storage::disk('public')->put($imagePath, $imageContent);
                    $data['image'] = $imagePath;

                } catch (\Exception $e) {
                    return response()->json([
                        'message' => 'Failed to process image URL',
                        'error' => $e->getMessage()
                    ], 400);
                }
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
     * JSON ONLY - Supports base64 image OR image URL
     */
    public function update(Request $request, string $id)
    {
        // JSON validation only - supports base64 OR image URL
        $request->validate([
            'origin' => 'sometimes|required|string|max:255',
            'destination' => 'sometimes|required|string|max:255',
            'vehicle_type' => 'sometimes|required|string|max:255',
            'price_per_person' => 'sometimes|required|numeric|min:0',
            'image_base64' => 'nullable|string', // Base64 image
            'image_url' => 'nullable|url', // Direct image URL
            'image_name' => 'required_with:image_base64|string|max:255',
            'is_active' => 'nullable|boolean',
        ]);

        try {
            $travel = Travel::findOrFail($id);
            
            $data = $request->only([
                'origin', 'destination', 'vehicle_type', 
                'price_per_person', 'is_active'
            ]);

            // Handle image processing
            if ($request->has('image_base64') && $request->image_base64) {
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

            } elseif ($request->has('image_url') && $request->image_url) {
                // Handle image URL - download and save locally
                try {
                    $imageUrl = $request->image_url;
                    $imageContent = file_get_contents($imageUrl);
                    
                    if ($imageContent === false) {
                        return response()->json([
                            'message' => 'Failed to download image from URL',
                            'error' => 'Could not access the provided image URL'
                        ], 400);
                    }

                    // Check image size (max 5MB)
                    if (strlen($imageContent) > 5 * 1024 * 1024) {
                        return response()->json([
                            'message' => 'Image too large. Maximum size is 5MB',
                            'error' => 'Current size: ' . round(strlen($imageContent) / 1024 / 1024, 2) . 'MB'
                        ], 400);
                    }

                    // Get image info
                    $imageInfo = getimagesizefromstring($imageContent);
                    if ($imageInfo === false) {
                        return response()->json([
                            'message' => 'Invalid image file',
                            'error' => 'The URL does not point to a valid image'
                        ], 400);
                    }

                    // Get extension from mime type
                    $mimeToExt = [
                        'image/jpeg' => 'jpg',
                        'image/png' => 'png',
                        'image/webp' => 'webp',
                        'image/jpg' => 'jpg'
                    ];

                    $extension = $mimeToExt[$imageInfo['mime']] ?? null;
                    if (!$extension) {
                        return response()->json([
                            'message' => 'Unsupported image type',
                            'error' => 'Allowed types: JPEG, PNG, WEBP'
                        ], 400);
                    }

                    // Delete old image
                    if ($travel->image) {
                        $this->fileUploadService->deleteImage($travel->image);
                    }

                    // Generate unique filename
                    $filename = \Illuminate\Support\Str::uuid() . '.' . $extension;
                    $imagePath = 'travels/' . $filename;

                    // Save image to storage
                    \Storage::disk('public')->put($imagePath, $imageContent);
                    $data['image'] = $imagePath;

                } catch (\Exception $e) {
                    return response()->json([
                        'message' => 'Failed to process image URL',
                        'error' => $e->getMessage()
                    ], 400);
                }
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

}
