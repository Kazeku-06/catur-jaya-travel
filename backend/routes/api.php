<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\PaketTripController;
use App\Http\Controllers\Api\V1\TravelController;
use App\Http\Controllers\Api\V1\TransactionController;
use App\Http\Controllers\Api\V1\PaymentController;
use App\Http\Controllers\Api\V1\Admin\AdminPaketTripController;
use App\Http\Controllers\Api\V1\Admin\AdminTravelController;
use App\Http\Controllers\Api\V1\Admin\AdminTransactionController;

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

    // User Transaction Routes (Requires authentication)
    Route::middleware('auth:sanctum')->group(function () {
        // Test endpoint untuk debugging
        Route::get('test-auth', function (Request $request) {
            return response()->json([
                'message' => 'Authentication working',
                'user' => $request->user(),
                'token' => $request->bearerToken()
            ]);
        });
        
        Route::post('transactions/trip/{id}', [TransactionController::class, 'createTripTransaction']);
        Route::post('transactions/travel/{id}', [TransactionController::class, 'createTravelTransaction']);
        Route::get('transactions/my-bookings', [TransactionController::class, 'getUserBookings']);
        Route::get('transactions/{id}', [TransactionController::class, 'getTransactionDetail']);
    });

    // Payment Routes
    Route::prefix('payments')->group(function () {
        Route::get('midtrans', [PaymentController::class, 'getMidtransConfig']);
        Route::post('midtrans/callback', [PaymentController::class, 'midtransCallback']);
    });

    // Admin Routes (Requires admin role)
    Route::prefix('admin')->middleware(['auth:sanctum', 'role:admin'])->group(function () {

        // Admin Trip Management
        Route::apiResource('trips', AdminPaketTripController::class);

        // Admin Travel Management
        Route::apiResource('travels', AdminTravelController::class);

        // Admin Transaction Management
        Route::get('transactions', [AdminTransactionController::class, 'index']);
        Route::get('transactions/{id}', [AdminTransactionController::class, 'show']);
        Route::get('transactions/statistics', [AdminTransactionController::class, 'statistics']);
    });
});
