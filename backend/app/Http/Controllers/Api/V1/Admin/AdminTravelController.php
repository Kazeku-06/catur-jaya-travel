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
     */
    public function store(Request $request)
    {
        // Custom validation for multipart/form-data
        $request->validate([
            'origin' => 'required|string|max:255',
            'destination' => 'required|string|max:255',
            'vehicle_type' => 'required|string|max:255',
            'price_per_person' => 'required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120', // 5MB max
            'is_active' => 'nullable|in:true,false,1,0',
        ]);

        try {
            $data = $request->only([
                'origin', 'destination', 'vehicle_type', 
                'price_per_person', 'is_active'
            ]);

            // Set default is_active if not provided
            $data['is_active'] = $request->has('is_active') ? 
                in_array($request->is_active, ['true', '1', 1, true]) : true;

            // Handle image upload
            if ($request->hasFile('image')) {
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
     */
    public function update(Request $request, string $id)
    {
        // Custom validation for multipart/form-data
        $request->validate([
            'origin' => 'sometimes|required|string|max:255',
            'destination' => 'sometimes|required|string|max:255',
            'vehicle_type' => 'sometimes|required|string|max:255',
            'price_per_person' => 'sometimes|required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120', // 5MB max
            'is_active' => 'nullable|in:true,false,1,0',
        ]);

        try {
            $travel = Travel::findOrFail($id);
            
            $data = $request->only([
                'origin', 'destination', 'vehicle_type', 
                'price_per_person', 'is_active'
            ]);

            // Handle image upload
            if ($request->hasFile('image')) {
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
