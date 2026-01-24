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
            "image": "trips/bromo.jpg",
            "image_url": "http://localhost:8000/storage/trips/bromo.jpg",
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
POST /api/v1/admin/trips                   # Create trip (JSON ONLY - REQUIRED image)
GET /api/v1/admin/trips/{id}               # Get trip detail
PUT /api/v1/admin/trips/{id}               # Update trip (JSON ONLY - optional image)
DELETE /api/v1/admin/trips/{id}            # Delete trip
```

**Create Trip (JSON ONLY - Base64 Image REQUIRED):**
```http
POST /api/v1/admin/trips
Content-Type: application/json
Authorization: Bearer {admin_token}

{
    "title": "Wisata Bali 4D3N",
    "description": "Paket wisata Bali lengkap dengan hotel dan transportasi",
    "price": 2500000,
    "duration": "4 hari 3 malam",
    "location": "Bali",
    "quota": 25,
    "image_base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...",
    "image_name": "bali-trip.jpg",
    "is_active": true
}
```

**Create Trip (JSON ONLY - Image URL REQUIRED):**
```http
POST /api/v1/admin/trips
Content-Type: application/json
Authorization: Bearer {admin_token}

{
    "title": "Wisata Bali 4D3N",
    "description": "Paket wisata Bali lengkap dengan hotel dan transportasi",
    "price": 2500000,
    "duration": "4 hari 3 malam",
    "location": "Bali",
    "quota": 25,
    "image_url": "https://example.com/images/bali-trip.jpg",
    "is_active": true
}
```

**Update Trip (JSON ONLY - Optional Image):**
```http
PUT /api/v1/admin/trips/{id}
Content-Type: application/json
Authorization: Bearer {admin_token}

{
    "title": "Wisata Bali Updated",
    "price": 2800000,
    "image_url": "https://example.com/images/bali-updated.jpg"
}
```

**Response with Image:**
```json
{
    "message": "Trip created successfully",
    "data": {
        "id": "uuid-string",
        "title": "Wisata Bali 4D3N",
        "description": "Paket wisata Bali lengkap dengan hotel dan transportasi",
        "price": "2500000.00",
        "duration": "4 hari 3 malam",
        "location": "Bali",
        "quota": 25,
        "image": "trips/uuid-filename.jpg",
        "image_url": "http://localhost:8000/storage/trips/uuid-filename.jpg",
        "is_active": true,
        "created_at": "2026-01-24T07:49:39.000000Z",
        "updated_at": "2026-01-24T07:49:39.000000Z"
    }
}
```

#### Admin Travel Management
```http
GET /api/v1/admin/travels                  # Get all travels
POST /api/v1/admin/travels                 # Create travel (JSON ONLY - REQUIRED image)
GET /api/v1/admin/travels/{id}             # Get travel detail
PUT /api/v1/admin/travels/{id}             # Update travel (JSON ONLY - optional image)
DELETE /api/v1/admin/travels/{id}          # Delete travel
```

**Create Travel (JSON ONLY - Base64 Image REQUIRED):**
```http
POST /api/v1/admin/travels
Content-Type: application/json
Authorization: Bearer {admin_token}

{
    "origin": "Jakarta",
    "destination": "Bandung",
    "vehicle_type": "Bus Executive",
    "price_per_person": 75000,
    "image_base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...",
    "image_name": "jakarta-bandung.jpg",
    "is_active": true
}
```

**Create Travel (JSON ONLY - Image URL REQUIRED):**
```http
POST /api/v1/admin/travels
Content-Type: application/json
Authorization: Bearer {admin_token}

{
    "origin": "Jakarta",
    "destination": "Bandung",
    "vehicle_type": "Bus Executive",
    "price_per_person": 75000,
    "image_url": "https://example.com/images/jakarta-bandung.jpg",
    "is_active": true
}
```

**Update Travel (JSON ONLY - Optional Image):**
```http
PUT /api/v1/admin/travels/{id}
Content-Type: application/json
Authorization: Bearer {admin_token}

{
    "price_per_person": 85000,
    "vehicle_type": "Bus Super Executive",
    "image_url": "https://example.com/images/updated-travel.jpg"
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

## Image Upload Methods (JSON ONLY)

Backend hanya mendukung format JSON dengan 2 metode upload gambar:

### 1. JSON - Base64 Encoding
Upload gambar yang sudah di-encode ke base64.
```json
{
    "image_base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...",
    "image_name": "filename.jpg"
}
```

### 2. JSON - Image URL
Berikan URL gambar, backend akan download dan simpan otomatis.
```json
{
    "image_url": "https://example.com/images/photo.jpg"
}
```

**Catatan:**
- **HANYA FORMAT JSON** yang didukung (tidak ada multipart/form-data)
- Untuk CREATE: Salah satu method gambar WAJIB disediakan
- Untuk UPDATE: Gambar bersifat opsional
- Semua gambar akan disimpan di server dan mendapat URL lokal
- Format yang didukung: JPEG, PNG, JPG, WEBP
- Ukuran maksimal: 5MB

## JSON API with Base64 Images

### Base64 Image Format
All JSON endpoints that require images use base64 encoding with the following format:
```
data:image/{type};base64,{base64_string}
```

**Supported image types:**
- `jpeg` or `jpg`
- `png` 
- `webp`

**Example:**
```
data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A
```

### Validation Rules
- **Maximum file size:** 5MB
- **Required fields for CREATE:** `image_base64` and `image_name`
- **Optional fields for UPDATE:** `image_base64` and `image_name` (both required if updating image)
- **Image validation:** Automatic validation of base64 format and image type

### Error Responses
```json
{
    "message": "Invalid image format. Must be base64 with data:image prefix",
    "error": "Expected format: data:image/jpeg;base64,{base64_string}"
}
```

```json
{
    "message": "Image too large. Maximum size is 5MB",
    "error": "Current size: 7.2MB"
}
```

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
