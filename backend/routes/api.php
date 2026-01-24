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
use App\Http\Controllers\Api\V1\Admin\AdminPaketTripJsonController;
use App\Http\Controllers\Api\V1\Admin\AdminTravelJsonController;

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
        Route::post('transactions/trip/{id}', [TransactionController::class, 'createTripTransaction']);
        Route::post('transactions/travel/{id}', [TransactionController::class, 'createTravelTransaction']);
    });

    // Payment Routes
    Route::prefix('payments')->group(function () {
        Route::get('midtrans', [PaymentController::class, 'getMidtransConfig']);
        Route::post('midtrans/callback', [PaymentController::class, 'midtransCallback']);
    });

    // Admin Routes (Requires admin role)
    Route::prefix('admin')->middleware(['auth:sanctum', 'role:admin'])->group(function () {

        // Admin Trip Management (Form Data - Optional Image)
        Route::apiResource('trips', AdminPaketTripController::class);
        Route::post('trips/{id}/upload-image', [AdminPaketTripController::class, 'uploadImage']);

        // Admin Trip Management (JSON - Required Image)
        Route::post('trips-json', [AdminPaketTripJsonController::class, 'store']);
        Route::put('trips-json/{id}', [AdminPaketTripJsonController::class, 'update']);

        // Admin Travel Management (Form Data - Optional Image)
        Route::apiResource('travels', AdminTravelController::class);
        Route::post('travels/{id}/upload-image', [AdminTravelController::class, 'uploadImage']);

        // Admin Travel Management (JSON - Required Image)
        Route::post('travels-json', [AdminTravelJsonController::class, 'store']);
        Route::put('travels-json/{id}', [AdminTravelJsonController::class, 'update']);

        // Admin Transaction Management
        Route::get('transactions', [AdminTransactionController::class, 'index']);
        Route::get('transactions/{id}', [AdminTransactionController::class, 'show']);
        Route::get('transactions/statistics', [AdminTransactionController::class, 'statistics']);
    });
});
