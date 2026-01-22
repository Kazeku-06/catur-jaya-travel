# API Documentation - Web Travel Backend

## Base URL
```
http://localhost:8000/api/v1
```

## Authentication
API menggunakan Laravel Sanctum untuk authentication. Setelah login, gunakan Bearer token di header:
```
Authorization: Bearer {your_token}
```

## API Endpoints

### 1. Authentication

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123"
}
```

**Response:**
```json
{
    "message": "User registered successfully",
    "user": {
        "id": "uuid-string",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user"
    },
    "access_token": "token_string",
    "token_type": "Bearer"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
    "email": "admin@travel.com",
    "password": "password123"
}
```

**Response:**
```json
{
    "message": "Login successful",
    "user": {
        "id": "uuid-string",
        "name": "Admin",
        "email": "admin@travel.com",
        "role": "admin"
    },
    "access_token": "token_string",
    "token_type": "Bearer"
}
```

#### Get User Profile
```http
GET /api/v1/auth/me
Authorization: Bearer {token}
```

#### Logout
```http
POST /api/v1/auth/logout
Authorization: Bearer {token}
```

### 2. Public Catalog (Guest Access)

#### Get All Trips
```http
GET /api/v1/trips
```

**Response:**
```json
{
    "message": "Trips retrieved successfully",
    "data": [
        {
            "id": "uuid-string",
            "title": "Wisata Bromo Tengger Semeru",
            "description": "Paket wisata 3 hari 2 malam...",
            "price": "1500000.00",
            "duration": "3 hari 2 malam",
            "location": "Bromo, Jawa Timur",
            "quota": 20,
            "is_active": true,
            "created_at": "2026-01-22T03:39:42.000000Z",
            "updated_at": "2026-01-22T03:39:42.000000Z"
        }
    ]
}
```

#### Get Trip Detail
```http
GET /api/v1/trips/{id}
```

#### Get All Travels
```http
GET /api/v1/travels
```

#### Get Travel Detail
```http
GET /api/v1/travels/{id}
```

#### Get All Carter Mobiles
```http
GET /api/v1/carter-mobiles
```

#### Get Carter Mobile Detail
```http
GET /api/v1/carter-mobiles/{id}
```

**Response:**
```json
{
    "message": "Carter mobile retrieved successfully",
    "data": {
        "id": "uuid-string",
        "vehicle_name": "Toyota Avanza",
        "description": "Mobil keluarga dengan kapasitas 7 orang...",
        "whatsapp_number": "6281234567890",
        "is_active": true
    },
    "whatsapp_contact": {
        "number": "6281234567890",
        "message": "Halo, saya tertarik dengan layanan carter mobil Toyota Avanza"
    }
}
```

### 3. User Transactions (Requires Authentication)

#### Create Trip Transaction
```http
POST /api/v1/transactions/trip/{trip_id}
Authorization: Bearer {token}
```

**Response:**
```json
{
    "message": "Transaction created successfully",
    "data": {
        "transaction_id": "uuid-string",
        "order_id": "TRIP-1642834782-ABC123",
        "total_price": "1500000.00",
        "snap_token": "midtrans_snap_token",
        "item": {
            "id": "uuid-string",
            "title": "Wisata Bromo Tengger Semeru",
            "price": "1500000.00"
        }
    }
}
```

#### Create Travel Transaction
```http
POST /api/v1/transactions/travel/{travel_id}
Authorization: Bearer {token}
```

### 4. Payment

#### Get Midtrans Config
```http
GET /api/v1/payments/midtrans
```

**Response:**
```json
{
    "client_key": "your_midtrans_client_key",
    "is_production": false
}
```

#### Midtrans Callback (Webhook)
```http
POST /api/v1/payments/midtrans/callback
Content-Type: application/json

{
    "order_id": "TRIP-1642834782-ABC123",
    "status_code": "200",
    "gross_amount": "1500000.00",
    "signature_key": "signature_from_midtrans",
    "transaction_status": "settlement",
    "fraud_status": "accept"
}
```

### 5. Admin Routes (Requires Admin Role)

#### Admin Trip Management
```http
GET /api/v1/admin/trips                    # Get all trips
POST /api/v1/admin/trips                   # Create trip
GET /api/v1/admin/trips/{id}               # Get trip detail
PUT /api/v1/admin/trips/{id}               # Update trip
DELETE /api/v1/admin/trips/{id}            # Delete trip
```

**Create Trip Request:**
```json
{
    "title": "Wisata Bali 4D3N",
    "description": "Paket wisata Bali lengkap dengan hotel dan transportasi",
    "price": 2500000,
    "duration": "4 hari 3 malam",
    "location": "Bali",
    "quota": 25,
    "is_active": true
}
```

#### Admin Travel Management
```http
GET /api/v1/admin/travels                  # Get all travels
POST /api/v1/admin/travels                 # Create travel
GET /api/v1/admin/travels/{id}             # Get travel detail
PUT /api/v1/admin/travels/{id}             # Update travel
DELETE /api/v1/admin/travels/{id}          # Delete travel
```

**Create Travel Request:**
```json
{
    "origin": "Jakarta",
    "destination": "Bandung",
    "vehicle_type": "Bus Executive",
    "price_per_person": 75000,
    "is_active": true
}
```

#### Admin Carter Mobile Management
```http
GET /api/v1/admin/carter-mobiles           # Get all carter mobiles
POST /api/v1/admin/carter-mobiles          # Create carter mobile
GET /api/v1/admin/carter-mobiles/{id}      # Get carter mobile detail
PUT /api/v1/admin/carter-mobiles/{id}      # Update carter mobile
DELETE /api/v1/admin/carter-mobiles/{id}   # Delete carter mobile
```

**Create Carter Mobile Request:**
```json
{
    "vehicle_name": "Toyota Innova",
    "description": "Mobil keluarga premium dengan kapasitas 8 orang",
    "whatsapp_number": "6281234567893",
    "is_active": true
}
```

#### Admin Transaction Management
```http
GET /api/v1/admin/transactions             # Get all transactions (with filters)
GET /api/v1/admin/transactions/{id}        # Get transaction detail
GET /api/v1/admin/transactions/statistics  # Get transaction statistics
```

**Transaction Filters:**
```http
GET /api/v1/admin/transactions?payment_status=paid
GET /api/v1/admin/transactions?transaction_type=trip
GET /api/v1/admin/transactions?start_date=2026-01-01&end_date=2026-01-31
```

## Error Responses

### 401 Unauthorized
```json
{
    "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
    "message": "Forbidden"
}
```

### 404 Not Found
```json
{
    "message": "Trip not found"
}
```

### 422 Validation Error
```json
{
    "message": "The given data was invalid.",
    "errors": {
        "email": ["The email field is required."],
        "password": ["The password field is required."]
    }
}
```

### 500 Server Error
```json
{
    "message": "Failed to create transaction",
    "error": "Error details"
}
```

## Payment Status Flow

1. **pending** - Transaction created, waiting for payment
2. **paid** - Payment successful
3. **failed** - Payment failed or cancelled
4. **expired** - Payment expired

## Security Features

1. **Password Hashing** - Using bcrypt
2. **API Authentication** - Laravel Sanctum tokens
3. **Role-based Access Control** - Admin/User roles
4. **Request Validation** - Form Request validation
5. **Midtrans Signature Verification** - Webhook security
6. **Price Validation** - Server-side price calculation

## Default Admin Account

```
Email: admin@travel.com
Password: password123
Role: admin
```
