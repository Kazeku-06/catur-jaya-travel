<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\CarterMobile;
use Illuminate\Http\Request;

class CarterMobileController extends Controller
{
    /**
     * Display a listing of active carter mobiles (Public access)
     */
    public function index()
    {
        try {
            $carterMobiles = CarterMobile::active()->get();

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
     * Display the specified carter mobile (Public access)
     * Returns WhatsApp number for contact
     */
    public function show(string $id)
    {
        try {
            $carterMobile = CarterMobile::where('id', $id)->where('is_active', true)->first();

            if (!$carterMobile) {
                return response()->json([
                    'message' => 'Carter mobile not found'
                ], 404);
            }

            return response()->json([
                'message' => 'Carter mobile retrieved successfully',
                'data' => $carterMobile,
                'whatsapp_contact' => [
                    'number' => $carterMobile->whatsapp_number,
                    'message' => 'Halo, saya tertarik dengan layanan carter mobil ' . $carterMobile->vehicle_name
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve carter mobile',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
