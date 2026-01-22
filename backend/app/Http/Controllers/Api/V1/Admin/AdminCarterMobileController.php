<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CarterMobileRequest;
use App\Models\CarterMobile;
use Illuminate\Http\Request;

class AdminCarterMobileController extends Controller
{
    /**
     * Display a listing of all carter mobiles (Admin only)
     */
    public function index()
    {
        try {
            $carterMobiles = CarterMobile::all();

            return response()->json([
                'message' => 'Carter mobiles retrieved successfully',
                'data' => $carterMobiles
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve carter mobiles',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created carter mobile (Admin only)
     */
    public function store(CarterMobileRequest $request)
    {
        try {
            $carterMobile = CarterMobile::create($request->validated());

            return response()->json([
                'message' => 'Carter mobile created successfully',
                'data' => $carterMobile
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create carter mobile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified carter mobile (Admin only)
     */
    public function show(string $id)
    {
        try {
            $carterMobile = CarterMobile::findOrFail($id);

            return response()->json([
                'message' => 'Carter mobile retrieved successfully',
                'data' => $carterMobile
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Carter mobile not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified carter mobile (Admin only)
     */
    public function update(CarterMobileRequest $request, string $id)
    {
        try {
            $carterMobile = CarterMobile::findOrFail($id);
            $carterMobile->update($request->validated());

            return response()->json([
                'message' => 'Carter mobile updated successfully',
                'data' => $carterMobile
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update carter mobile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified carter mobile (Admin only)
     */
    public function destroy(string $id)
    {
        try {
            $carterMobile = CarterMobile::findOrFail($id);
            $carterMobile->delete();

            return response()->json([
                'message' => 'Carter mobile deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete carter mobile',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
