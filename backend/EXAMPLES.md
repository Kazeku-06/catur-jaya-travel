# Contoh Request dan Response JSON

## 1. Authentication Examples

### Register User
**Request:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

**Response (201):**
```json
{
    "message": "User registered successfully",
    "user": {
        "id": "9d4e8f2a-1234-4567-8901-123456789abc",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user"
    },
    "access_token": "1|abcdefghijklmnopqrstuvwxyz1234567890",
    "token_type": "Bearer"
}
```

### Login Admin
**Request:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@travel.com",
    "password": "password123"
  }'
```

**Response (200):**
```json
{
    "message": "Login successful",
    "user": {
        "id": "9d4e8f2a-5678-4567-8901-123456789def",
        "name": "Admin",
        "email": "admin@travel.com",
        "role": "admin"
    },
    "access_token": "2|zyxwvutsrqponmlkjihgfedcba0987654321",
    "token_type": "Bearer"
}
```

## 2. Public Catalog Examples

### Get All Trips
**Request:**
```bash
curl http://localhost:8000/api/v1/trips
```

**Response (200):**
```json
{
    "message": "Trips retrieved successfully",
    "data": [
        {
            "id": "9d4e8f2a-1111-4567-8901-123456789abc",
            "title": "Wisata Bromo Tengger Semeru",
            "description": "Paket wisata 3 hari 2 malam ke Bromo Tengger Semeru dengan pemandangan sunrise yang menakjubkan",
            "price": "1500000.00",
            "duration": "3 hari 2 malam",
            "location": "Bromo, Jawa Timur",
            "quota": 20,
            "is_active": true,
            "created_at": "2026-01-22T03:39:42.000000Z",
            "updated_at": "2026-01-22T03:39:42.000000Z"
        },
        {
            "id": "9d4e8f2a-2222-4567-8901-123456789def",
            "title": "Wisata Pantai Malang Selatan",
            "description": "Paket wisata 2 hari 1 malam mengunjungi pantai-pantai eksotis di Malang Selatan",
            "price": "800000.00",
            "duration": "2 hari 1 malam",
            "location": "Malang Selatan, Jawa Timur",
            "quota": 15,
            "is_active": true,
            "created_at": "2026-01-22T03:39:42.000000Z",
            "updated_at": "2026-01-22T03:39:42.000000Z"
        }
    ]
}
```

### Get Carter Mobile Detail
**Request:**
```bash
curl http://localhost:8000/api/v1/carter-mobiles/9d4e8f2a-3333-4567-8901-123456789abc
```

**Response (200):**
```json
{
    "message": "Carter mobile retrieved successfully",
    "data": {
        "id": "9d4e8f2a-3333-4567-8901-123456789abc",
        "vehicle_name": "Toyota Avanza",
        "description": "Mobil keluarga dengan kapasitas 7 orang, cocok untuk perjalanan dalam kota atau luar kota",
        "whatsapp_number": "6281234567890",
        "is_active": true,
        "created_at": "2026-01-22T03:39:42.000000Z",
        "updated_at": "2026-01-22T03:39:42.000000Z"
    },
    "whatsapp_contact": {
        "number": "6281234567890",
        "message": "Halo, saya tertarik dengan layanan carter mobil Toyota Avanza"
    }
}
```

## 3. User Transaction Examples

### Create Trip Transaction (Requires Login)
**Request:**
```bash
curl -X POST http://localhost:8000/api/v1/transactions/trip/9d4e8f2a-1111-4567-8901-123456789abc \
  -H "Authorization: Bearer 1|abcdefghijklmnopqrstuvwxyz1234567890" \
  -H "Content-Type: application/json"
```

**Response (201):**
```json
{
    "message": "Transaction created successfully",
    "data": {
        "transaction_id": "9d4e8f2a-4444-4567-8901-123456789abc",
        "order_id": "TRIP-1642834782-ABC123",
        "total_price": "1500000.00",
        "snap_token": "66e4fa55-fdac-4ef9-91b5-1c2d3e4f5g6h",
        "item": {
            "id": "9d4e8f2a-1111-4567-8901-123456789abc",
            "title": "Wisata Bromo Tengger Semeru",
            "description": "Paket wisata 3 hari 2 malam ke Bromo Tengger Semeru dengan pemandangan sunrise yang menakjubkan",
            "price": "1500000.00",
            "duration": "3 hari 2 malam",
            "location": "Bromo, Jawa Timur",
            "quota": 20,
            "is_active": true
        }
    }
}
```

### Unauthorized Transaction (Guest)
**Request:**
```bash
curl -X POST http://localhost:8000/api/v1/transactions/trip/9d4e8f2a-1111-4567-8901-123456789abc \
  -H "Content-Type: application/json"
```

**Response (401):**
```json
{
    "message": "Unauthenticated."
}
```

## 4. Payment Examples

### Get Midtrans Config
**Request:**
```bash
curl http://localhost:8000/api/v1/payments/midtrans
```

**Response (200):**
```json
{
    "client_key": "SB-Mid-client-your_client_key_here",
    "is_production": false
}
```

### Midtrans Callback (Webhook)
**Request:**
```bash
curl -X POST http://localhost:8000/api/v1/payments/midtrans/callback \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "TRIP-1642834782-ABC123",
    "status_code": "200",
    "gross_amount": "1500000.00",
    "signature_key": "calculated_signature_from_midtrans",
    "transaction_status": "settlement",
    "fraud_status": "accept",
    "payment_type": "credit_card",
    "transaction_time": "2026-01-22 10:30:00"
  }'
```

**Response (200):**
```json
{
    "message": "Notification processed successfully",
    "transaction_id": "9d4e8f2a-4444-4567-8901-123456789abc",
    "payment_status": "paid"
}
```

## 5. Admin Examples

### Create Trip (Admin Only)
**Request:**
```bash
curl -X POST http://localhost:8000/api/v1/admin/trips \
  -H "Authorization: Bearer 2|zyxwvutsrqponmlkjihgfedcba0987654321" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Wisata Bali 4D3N",
    "description": "Paket wisata Bali lengkap dengan hotel dan transportasi",
    "price": 2500000,
    "duration": "4 hari 3 malam",
    "location": "Bali",
    "quota": 25,
    "is_active": true
  }'
```

**Response (201):**
```json
{
    "message": "Trip created successfully",
    "data": {
        "id": "9d4e8f2a-5555-4567-8901-123456789abc",
        "title": "Wisata Bali 4D3N",
        "description": "Paket wisata Bali lengkap dengan hotel dan transportasi",
        "price": "2500000.00",
        "duration": "4 hari 3 malam",
        "location": "Bali",
        "quota": 25,
        "is_active": true,
        "created_at": "2026-01-22T10:30:00.000000Z",
        "updated_at": "2026-01-22T10:30:00.000000Z"
    }
}
```

### Get All Transactions (Admin Only)
**Request:**
```bash
curl "http://localhost:8000/api/v1/admin/transactions?payment_status=paid&page=1" \
  -H "Authorization: Bearer 2|zyxwvutsrqponmlkjihgfedcba0987654321"
```

**Response (200):**
```json
{
    "message": "Transactions retrieved successfully",
    "data": {
        "current_page": 1,
        "data": [
            {
                "id": "9d4e8f2a-4444-4567-8901-123456789abc",
                "user_id": "9d4e8f2a-1234-4567-8901-123456789abc",
                "transaction_type": "trip",
                "reference_id": "9d4e8f2a-1111-4567-8901-123456789abc",
                "total_price": "1500000.00",
                "payment_status": "paid",
                "midtrans_order_id": "TRIP-1642834782-ABC123",
                "created_at": "2026-01-22T10:00:00.000000Z",
                "updated_at": "2026-01-22T10:30:00.000000Z",
                "user": {
                    "id": "9d4e8f2a-1234-4567-8901-123456789abc",
                    "name": "John Doe",
                    "email": "john@example.com",
                    "role": "user"
                },
                "payments": [
                    {
                        "id": "9d4e8f2a-6666-4567-8901-123456789abc",
                        "transaction_id": "9d4e8f2a-4444-4567-8901-123456789abc",
                        "payment_type": "midtrans",
                        "transaction_status": "paid",
                        "raw_response": {
                            "order_id": "TRIP-1642834782-ABC123",
                            "transaction_status": "settlement",
                            "fraud_status": "accept"
                        },
                        "created_at": "2026-01-22T10:30:00.000000Z"
                    }
                ]
            }
        ],
        "first_page_url": "http://localhost:8000/api/v1/admin/transactions?page=1",
        "from": 1,
        "last_page": 1,
        "last_page_url": "http://localhost:8000/api/v1/admin/transactions?page=1",
        "links": [
            {
                "url": null,
                "label": "&laquo; Previous",
                "active": false
            },
            {
                "url": "http://localhost:8000/api/v1/admin/transactions?page=1",
                "label": "1",
                "active": true
            },
            {
                "url": null,
                "label": "Next &raquo;",
                "active": false
            }
        ],
        "next_page_url": null,
        "path": "http://localhost:8000/api/v1/admin/transactions",
        "per_page": 20,
        "prev_page_url": null,
        "to": 1,
        "total": 1
    }
}
```

### Get Transaction Statistics (Admin Only)
**Request:**
```bash
curl http://localhost:8000/api/v1/admin/transactions/statistics \
  -H "Authorization: Bearer 2|zyxwvutsrqponmlkjihgfedcba0987654321"
```

**Response (200):**
```json
{
    "message": "Statistics retrieved successfully",
    "data": {
        "total_transactions": 5,
        "pending_transactions": 1,
        "paid_transactions": 3,
        "failed_transactions": 1,
        "expired_transactions": 0,
        "total_revenue": "4500000.00",
        "trip_transactions": 3,
        "travel_transactions": 2
    }
}
```

## 6. Error Examples

### Validation Error
**Request:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "",
    "email": "invalid-email",
    "password": "123"
  }'
```

**Response (422):**
```json
{
    "message": "The given data was invalid.",
    "errors": {
        "name": ["The name field is required."],
        "email": ["The email must be a valid email address."],
        "password": ["The password must be at least 8 characters.", "The password confirmation does not match."]
    }
}
```

### Forbidden Access (User trying to access admin endpoint)
**Request:**
```bash
curl http://localhost:8000/api/v1/admin/trips \
  -H "Authorization: Bearer 1|abcdefghijklmnopqrstuvwxyz1234567890"
```

**Response (403):**
```json
{
    "message": "Forbidden"
}
```

### Not Found
**Request:**
```bash
curl http://localhost:8000/api/v1/trips/invalid-uuid
```

**Response (404):**
```json
{
    "message": "Trip not found"
}
```

## 7. Business Logic Examples

### Trip Not Available
**Request:**
```bash
curl -X POST http://localhost:8000/api/v1/transactions/trip/inactive-trip-id \
  -H "Authorization: Bearer 1|abcdefghijklmnopqrstuvwxyz1234567890"
```

**Response (400):**
```json
{
    "message": "Failed to create transaction",
    "error": "Trip not found or inactive"
}
```

### Invalid Midtrans Signature
**Request:**
```bash
curl -X POST http://localhost:8000/api/v1/payments/midtrans/callback \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "TRIP-1642834782-ABC123",
    "status_code": "200",
    "gross_amount": "1500000.00",
    "signature_key": "invalid_signature"
  }'
```

**Response (400):**
```json
{
    "message": "Invalid signature"
}
```
