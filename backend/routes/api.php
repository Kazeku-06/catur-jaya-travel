<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Auth\GoogleAuthController;
use App\Http\Controllers\Api\V1\PaketTripController;
use App\Http\Controllers\Api\V1\TravelController;
use App\Http\Controllers\Api\V1\BookingController;
use App\Http\Controllers\Api\V1\Admin\AdminPaketTripController;
use App\Http\Controllers\Api\V1\Admin\AdminTravelController;
use App\Http\Controllers\Api\V1\Admin\AdminBookingController;
use App\Http\Controllers\Api\V1\Admin\AdminNotificationController;

// API Version 1 Routes
Route::prefix('v1')->middleware('throttle:api')->group(function () {

    // Authentication Routes
    Route::prefix('auth')->middleware('throttle:auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login', [AuthController::class, 'login']);
        Route::post('forgot-password', [AuthController::class, 'forgotPassword'])->middleware('throttle:5,10');
        Route::post('reset-password', [AuthController::class, 'resetPassword']);

        // Google OAuth Routes (No auth middleware required)
        Route::get('google/redirect', [GoogleAuthController::class, 'redirect']);
        Route::get('google/callback', [GoogleAuthController::class, 'callback']);

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

        // Test ticket generation
        Route::get('test-ticket/{id}', function (Request $request, $id) {
            try {
                $booking = \App\Models\Booking::find($id);
                if (!$booking) {
                    return response()->json(['error' => 'Booking not found'], 404);
                }

                return response()->json([
                    'booking_id' => $booking->id,
                    'booking_code' => $booking->booking_code,
                    'status' => $booking->status,
                    'can_download' => $booking->canDownloadTicket(),
                    'user_id' => $booking->user_id,
                    'catalog_type' => $booking->catalog_type,
                ]);
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
        });

        // Test user bookings
        Route::get('test-my-bookings', function (Request $request) {
            try {
                $user = $request->user();
                $bookings = \App\Models\Booking::where('user_id', $user->id)->get();
                
                return response()->json([
                    'user_id' => $user->id,
                    'user_email' => $user->email,
                    'bookings_count' => $bookings->count(),
                    'bookings' => $bookings->map(function($booking) {
                        return [
                            'id' => $booking->id,
                            'booking_code' => $booking->booking_code,
                            'status' => $booking->status,
                            'catalog_type' => $booking->catalog_type,
                            'created_at' => $booking->created_at,
                        ];
                    })
                ]);
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
        });

        // Test email sending
        Route::get('test-email', function () {
            try {
                \Log::info('Testing email configuration...');
                
                // Test basic mail configuration
                $config = config('mail');
                \Log::info('Mail config', $config);
                
                \Illuminate\Support\Facades\Mail::raw('Test email from Laravel - Catur Jaya Travel', function ($message) {
                    $message->to('tssytari@gmail.com')
                            ->subject('Test Email - Catur Jaya Travel');
                });
                
                \Log::info('Test email sent successfully');
                return response()->json(['message' => 'Test email sent successfully!']);
            } catch (\Exception $e) {
                \Log::error('Test email failed', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                return response()->json(['error' => $e->getMessage()], 500);
            }
        });

        // Test forgot password directly
        Route::get('test-forgot/{email}', function ($email) {
            try {
                \Log::info('Testing forgot password for: ' . $email);
                
                $service = new \App\Services\PasswordResetService();
                $result = $service->sendResetEmail($email);
                
                return response()->json([
                    'message' => 'Forgot password test completed',
                    'result' => $result
                ]);
            } catch (\Exception $e) {
                \Log::error('Test forgot password failed', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                return response()->json(['error' => $e->getMessage()], 500);
            }
        });

        // Booking endpoints
        Route::post('bookings/trip/{id}', [BookingController::class, 'createTripBooking']);
        Route::post('bookings/travel/{id}', [BookingController::class, 'createTravelBooking']);
        Route::get('bookings/my', [BookingController::class, 'getUserBookings']);
        Route::get('bookings/{id}', [BookingController::class, 'getBookingDetail']);
        Route::post('bookings/{id}/payment-proof', [BookingController::class, 'uploadPaymentProof']);
        Route::get('bookings/{id}/download-ticket', [BookingController::class, 'downloadTicket']);
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
        Route::get('bookings/statistics', [AdminBookingController::class, 'statistics']);
        Route::get('bookings/{id}', [AdminBookingController::class, 'show']);
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
