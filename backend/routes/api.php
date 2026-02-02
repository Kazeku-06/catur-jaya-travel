<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\PaketTripController;
use App\Http\Controllers\Api\V1\TravelController;
use App\Http\Controllers\Api\V1\BookingController;
use App\Http\Controllers\Api\V1\Admin\AdminPaketTripController;
use App\Http\Controllers\Api\V1\Admin\AdminTravelController;
use App\Http\Controllers\Api\V1\Admin\AdminBookingController;
use App\Http\Controllers\Api\V1\Admin\AdminNotificationController;

// API Version 1 Routes
Route::prefix('v1')->group(function () {

    // Authentication Routes
    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login', [AuthController::class, 'login']);

        Route::middleware('auth:sanctum')->group(function () {
            Route::get('me', [AuthController::class, 'me']);
            Route::post('logout', [AuthController::class, 'logout']);
        });
    });

    // Public Catalog Routes (Guest access)
    Route::get('trips', [PaketTripController::class, 'index']);
    Route::get('trips/{id}', [PaketTripController::class, 'show']);

    Route::get('travels', [TravelController::class, 'index']);
    Route::get('travels/{id}', [TravelController::class, 'show']);

    // User Booking Routes (Requires authentication)
    Route::middleware('auth:sanctum')->group(function () {
        // Test endpoint untuk debugging
        Route::get('test-auth', function (Request $request) {
            return response()->json([
                'message' => 'Authentication working',
                'user' => $request->user(),
                'token' => $request->bearerToken()
            ]);
        });
        
        // Booking endpoints
        Route::post('bookings/trip/{id}', [BookingController::class, 'createTripBooking']);
        Route::post('bookings/travel/{id}', [BookingController::class, 'createTravelBooking']);
        Route::get('bookings/my', [BookingController::class, 'getUserBookings']);
        Route::get('bookings/{id}', [BookingController::class, 'getBookingDetail']);
        Route::post('bookings/{id}/payment-proof', [BookingController::class, 'uploadPaymentProof']);
    });

    // Admin Routes (Requires admin role)
    Route::prefix('admin')->middleware(['auth:sanctum', 'log_sanctum', 'role:admin'])->group(function () {
        
        // Test endpoint for debugging
        Route::get('test-auth', function (Request $request) {
            return response()->json([
                'message' => 'Admin authentication working',
                'user' => $request->user(),
                'role' => $request->user()->role,
                'token_name' => $request->user()->currentAccessToken()->name ?? 'unknown'
            ]);
        });

        // Admin Trip Management
        Route::apiResource('trips', AdminPaketTripController::class);

        // Admin Travel Management
        Route::apiResource('travels', AdminTravelController::class);

        // Admin Booking Management
        Route::get('bookings', [AdminBookingController::class, 'index']);
        Route::get('bookings/{id}', [AdminBookingController::class, 'show']);
        Route::get('bookings/statistics', [AdminBookingController::class, 'statistics']);
        Route::put('bookings/{id}/approve', [AdminBookingController::class, 'approve']);
        Route::put('bookings/{id}/reject', [AdminBookingController::class, 'reject']);

        // Admin Notification Management
        Route::prefix('notifications')->group(function () {
            Route::get('/', [AdminNotificationController::class, 'index']);
            Route::get('/unread-count', [AdminNotificationController::class, 'unreadCount']);
            Route::get('/statistics', [AdminNotificationController::class, 'statistics']);
            Route::post('/{id}/read', [AdminNotificationController::class, 'markAsRead']);
            Route::post('/mark-all-read', [AdminNotificationController::class, 'markAllAsRead']);
        });
    });
});
