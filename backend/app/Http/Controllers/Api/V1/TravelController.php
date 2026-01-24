<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Travel;
use App\Services\FileUploadService;
use Illuminate\Http\Request;

class TravelController extends Controller
{
    protected $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    /**
     * Display a listing of active travels (Public access)
     */
    public function index()
    {
        try {
            $travels = Travel::active()->get()->map(function ($travel) {
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
     * Display the specified travel (Public access)
     */
    public function show(string $id)
    {
        try {
            $travel = Travel::where('id', $id)->where('is_active', true)->first();

            if (!$travel) {
                return response()->json([
                    'message' => 'Travel not found'
                ], 404);
            }

            $travel->image_url = $travel->image ? $this->fileUploadService->getImageUrl($travel->image) : null;

            return response()->json([
                'message' => 'Travel retrieved successfully',
                'data' => $travel
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve travel',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
