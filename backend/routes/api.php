<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\PaketTripController;
use App\Http\Controllers\Api\V1\TravelController;
use App\Http\Controllers\Api\V1\TransactionController;
use App\Http\Controllers\Api\V1\PaymentController;
use App\Http\Controllers\Api\V1\Admin\AdminPaketTripController;
use App\Http\Controllers\Api\V1\Admin\AdminTravelController;
use App\Http\Controllers\Api\V1\Admin\AdminTransactionController;
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

        // Test notifications table
        Route::get('test-notifications', function (Request $request) {
            try {
                // Check if table exists
                $tableExists = \Schema::hasTable('notifications');
                
                if (!$tableExists) {
                    return response()->json([
                        'error' => 'Notifications table does not exist',
                        'solution' => 'Run: php artisan migrate'
                    ], 500);
                }
                
                // Try to count notifications
                $count = \DB::table('notifications')->count();
                
                // Try to get user notifications
                $user = $request->user();
                $userNotifications = \DB::table('notifications')
                    ->where('user_id', $user->id)
                    ->count();
                
                return response()->json([
                    'table_exists' => $tableExists,
                    'total_notifications' => $count,
                    'user_notifications' => $userNotifications,
                    'user_id' => $user->id,
                    'user_role' => $user->role
                ]);
                
            } catch (\Exception $e) {
                return response()->json([
                    'error' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ], 500);
            }
        });

        // Admin Trip Management
        Route::apiResource('trips', AdminPaketTripController::class);

        // Admin Travel Management
        Route::apiResource('travels', AdminTravelController::class);

        // Admin Transaction Management
        Route::get('transactions', [AdminTransactionController::class, 'index']);
        Route::get('transactions/{id}', [AdminTransactionController::class, 'show']);
        Route::get('transactions/statistics', [AdminTransactionController::class, 'statistics']);

        // Admin Notification Management
        Route::prefix('notifications')->group(function () {
            // Simple test endpoint
            Route::get('/test-simple', function (Request $request) {
                return response()->json([
                    'message' => 'Simple test working',
                    'user_id' => $request->user()->id,
                    'timestamp' => now()
                ]);
            });
            
            // Test without database
            Route::get('/test-no-db', function (Request $request) {
                return response()->json([
                    'message' => 'Test without database working',
                    'user' => $request->user()->only(['id', 'name', 'email', 'role']),
                    'timestamp' => now()->toISOString()
                ]);
            });
            
            // Test with fake data
            Route::get('/test-fake', function (Request $request) {
                return response()->json([
                    'message' => 'Notifications retrieved successfully',
                    'data' => [
                        [
                            'id' => 'fake-1',
                            'type' => 'order_created',
                            'title' => 'Order Baru Masuk',
                            'message' => 'Order dengan ID TRIP-123 menunggu pembayaran',
                            'is_read' => false,
                            'created_at' => now()->subHours(2)->toISOString(),
                        ],
                        [
                            'id' => 'fake-2',
                            'type' => 'payment_paid',
                            'title' => 'Pembayaran Berhasil',
                            'message' => 'Pembayaran untuk order TRIP-456 telah berhasil',
                            'is_read' => true,
                            'created_at' => now()->subHours(5)->toISOString(),
                        ]
                    ],
                    'pagination' => [
                        'current_page' => 1,
                        'per_page' => 20,
                        'total' => 2,
                        'last_page' => 1,
                        'from' => 1,
                        'to' => 2,
                    ]
                ]);
            });
            
            Route::get('/unread-count-fake', function (Request $request) {
                return response()->json([
                    'message' => 'Unread count retrieved successfully',
                    'data' => [
                        'unread_count' => 1
                    ]
                ]);
            });
            
            // Debug endpoint
            Route::get('/debug', function () {
                try {
                    $user = auth()->user();
                    $notificationCount = \App\Models\Notification::count();
                    $userNotificationCount = \App\Models\Notification::where('user_id', $user->id)->count();
                    
                    return response()->json([
                        'user' => $user,
                        'total_notifications' => $notificationCount,
                        'user_notifications' => $userNotificationCount,
                        'table_exists' => \Schema::hasTable('notifications')
                    ]);
                } catch (\Exception $e) {
                    return response()->json([
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString()
                    ], 500);
                }
            });
            
            Route::get('/', [AdminNotificationController::class, 'index']);
            Route::get('/unread-count', [AdminNotificationController::class, 'unreadCount']);
            Route::get('/statistics', [AdminNotificationController::class, 'statistics']);
            Route::post('/{id}/read', [AdminNotificationController::class, 'markAsRead']);
            Route::post('/mark-all-read', [AdminNotificationController::class, 'markAllAsRead']);
        });
    });
});
