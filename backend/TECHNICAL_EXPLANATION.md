# Penjelasan Logika Backend Secara Teknis

## 1. Arsitektur Sistem

### MVC + Service Layer Pattern
```
Request → Route → Controller → Service → Model → Database
                     ↓
Response ← View ← Controller ← Service ← Model ← Database
```

**Keuntungan:**
- **Separation of Concerns**: Setiap layer memiliki tanggung jawab yang jelas
- **Testability**: Service layer mudah di-unit test
- **Reusability**: Logic bisnis di service bisa digunakan di berbagai controller
- **Maintainability**: Perubahan logic tidak mempengaruhi controller

### UUID sebagai Primary Key
```php
// Trait HasUuid
protected static function bootHasUuid()
{
    static::creating(function ($model) {
        if (empty($model->{$model->getKeyName()})) {
            $model->{$model->getKeyName()} = Str::uuid()->toString();
        }
    });
}
```

**Keuntungan UUID:**
- **Security**: Mencegah enumeration attack
- **Scalability**: Tidak ada collision di distributed system
- **Privacy**: ID tidak sequential, sulit ditebak

## 2. Authentication & Authorization Flow

### Laravel Sanctum Implementation
```php
// Login Process
1. User submit credentials
2. Validate credentials dengan Auth::attempt()
3. Generate token dengan $user->createToken()
4. Return token ke client
5. Client store token dan kirim di header Authorization: Bearer {token}
```

### Role-Based Access Control (RBAC)
```php
// RoleMiddleware
public function handle(Request $request, Closure $next, ...$roles): Response
{
    if (!$request->user()) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $userRole = $request->user()->role;
    
    if (!in_array($userRole, $roles)) {
        return response()->json(['message' => 'Forbidden'], 403);
    }

    return $next($request);
}
```

**Flow Authorization:**
1. Request masuk ke middleware
2. Check apakah user authenticated
3. Check apakah user role sesuai dengan yang diizinkan
4. Allow/Deny request

## 3. Transaction Logic Flow

### Trip/Travel Transaction Process
```php
// TransactionService::createTripTransaction()
1. Validate trip exists dan active
2. Generate unique order_id dengan format: TRIP-{timestamp}-{random}
3. Create transaction record dengan status 'pending'
4. Call MidtransService untuk create Snap token
5. Return transaction data + snap_token
6. Jika gagal, rollback transaction
```

### Payment Status Management
```php
// Status Flow: pending → paid/failed/expired
1. Transaction dibuat dengan status 'pending'
2. User melakukan pembayaran via Midtrans
3. Midtrans kirim callback ke webhook
4. Verify signature untuk security
5. Update transaction status berdasarkan callback
6. Create payment record untuk audit trail
```

## 4. Security Implementation

### Input Validation
```php
// Form Request Validation
public function rules(): array
{
    return [
        'title' => 'required|string|max:255',
        'price' => 'required|numeric|min:0',
        // Server-side validation mencegah manipulation
    ];
}
```

### Price Protection
```php
// Harga TIDAK dikirim dari frontend
// Server yang menghitung harga dari database
$trip = PaketTrip::findOrFail($tripId);
$totalPrice = $trip->price; // Dari database, bukan dari request
```

### Midtrans Signature Verification
```php
public function verifySignature($orderId, $statusCode, $grossAmount, $signatureKey)
{
    $serverKey = config('midtrans.server_key');
    $hash = hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);
    
    return $hash === $signatureKey; // Verify authenticity
}
```

## 5. Database Design Patterns

### Polymorphic Relationship Simulation
```php
// Transaction bisa reference ke Trip atau Travel
// Menggunakan transaction_type + reference_id
public function referencedItem()
{
    if ($this->transaction_type === 'trip') {
        return $this->belongsTo(PaketTrip::class, 'reference_id');
    } elseif ($this->transaction_type === 'travel') {
        return $this->belongsTo(Travel::class, 'reference_id');
    }
}
```

### Audit Trail Pattern
```php
// Payment table sebagai audit trail
// Setiap perubahan status payment dicatat
Payment::create([
    'transaction_id' => $transaction->id,
    'payment_type' => 'midtrans',
    'transaction_status' => $paymentStatus,
    'raw_response' => $rawResponse, // Full response dari Midtrans
]);
```

## 6. Service Layer Logic

### MidtransService Responsibilities
```php
class MidtransService
{
    // 1. Configuration management
    // 2. Snap token creation
    // 3. Notification handling
    // 4. Signature verification
    // 5. Status mapping
}
```

### TransactionService Responsibilities
```php
class TransactionService
{
    // 1. Business logic validation
    // 2. Transaction creation
    // 3. Price calculation
    // 4. Integration dengan MidtransService
    // 5. Status update management
}
```

## 7. Error Handling Strategy

### Graceful Error Handling
```php
try {
    $result = $this->transactionService->createTripTransaction($userId, $tripId);
    return response()->json(['data' => $result], 201);
} catch (\Exception $e) {
    // Log error untuk debugging
    Log::error('Transaction creation failed', [
        'user_id' => $userId,
        'trip_id' => $tripId,
        'error' => $e->getMessage()
    ]);
    
    // Return user-friendly error
    return response()->json([
        'message' => 'Failed to create transaction',
        'error' => $e->getMessage()
    ], 400);
}
```

### Rollback Strategy
```php
// Jika Midtrans gagal, hapus transaction yang sudah dibuat
try {
    $snapToken = $this->midtransService->createSnapToken(...);
    return ['transaction' => $transaction, 'snap_token' => $snapToken];
} catch (\Exception $e) {
    $transaction->delete(); // Rollback
    throw $e;
}
```

## 8. API Design Principles

### RESTful API Design
```
GET    /api/v1/trips           # List trips
GET    /api/v1/trips/{id}      # Get trip detail
POST   /api/v1/admin/trips     # Create trip (admin)
PUT    /api/v1/admin/trips/{id} # Update trip (admin)
DELETE /api/v1/admin/trips/{id} # Delete trip (admin)
```

### Consistent Response Format
```php
// Success Response
{
    "message": "Operation successful",
    "data": { ... }
}

// Error Response
{
    "message": "Operation failed",
    "error": "Error details"
}
```

### HTTP Status Code Usage
- **200**: Success (GET, PUT)
- **201**: Created (POST)
- **400**: Bad Request (Business logic error)
- **401**: Unauthorized (Not authenticated)
- **403**: Forbidden (Not authorized)
- **404**: Not Found
- **422**: Validation Error
- **500**: Server Error

## 9. Performance Optimization

### Eager Loading
```php
// Prevent N+1 Query Problem
$transactions = Transaction::with(['user', 'payments'])->get();
```

### Database Indexing
```php
// Migration dengan index
$table->index(['payment_status', 'created_at']);
$table->index('transaction_type');
$table->unique('midtrans_order_id');
```

### Pagination
```php
// Admin transaction list dengan pagination
$transactions = $query->orderBy('created_at', 'desc')->paginate(20);
```

## 10. Business Logic Validation

### Guest vs User Access
```php
// Guest: Bisa lihat katalog, tidak bisa transaksi
// User: Bisa lihat katalog + buat transaksi
// Admin: Full access ke semua fitur

// Middleware enforcement
Route::middleware('auth:sanctum')->group(function () {
    Route::post('transactions/trip/{id}', [TransactionController::class, 'createTripTransaction']);
});
```

### Carter Mobil Logic
```php
// Carter Mobil tidak menggunakan payment gateway
// Langsung redirect ke WhatsApp admin
public function show(string $id)
{
    $carterMobile = CarterMobile::where('id', $id)->where('is_active', true)->first();
    
    return response()->json([
        'data' => $carterMobile,
        'whatsapp_contact' => [
            'number' => $carterMobile->whatsapp_number,
            'message' => 'Halo, saya tertarik dengan layanan carter mobil ' . $carterMobile->vehicle_name
        ]
    ]);
}
```

## 11. Integration Patterns

### Webhook Handling
```php
// Midtrans Callback Pattern
1. Receive POST request dari Midtrans
2. Verify signature untuk security
3. Parse notification data
4. Update transaction status
5. Create payment audit record
6. Return success response
```

### External Service Integration
```php
// MidtransService sebagai abstraction layer
// Jika ganti payment gateway, cukup ganti service implementation
interface PaymentGatewayInterface
{
    public function createPayment($params);
    public function handleCallback();
}
```

## 12. Monitoring & Logging

### Transaction Monitoring
```php
// Log setiap transaction creation
Log::info('Transaction created', [
    'transaction_id' => $transaction->id,
    'user_id' => $userId,
    'type' => $transaction->transaction_type,
    'amount' => $transaction->total_price
]);
```

### Payment Callback Logging
```php
// Log semua callback dari Midtrans
Log::info('Midtrans callback received', [
    'order_id' => $orderId,
    'status' => $paymentStatus,
    'raw_response' => $rawResponse
]);
```

Sistem ini dirancang untuk production-ready dengan mempertimbangkan security, scalability, maintainability, dan user experience yang optimal.
