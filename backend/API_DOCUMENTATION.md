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
Content-Type: application/json

{
    "participants": 2,
    "departure_date": "2026-02-15",
    "special_requests": "Vegetarian meals please"
}
```

**Response:**
```json
{
    "message": "Transaction created successfully",
    "data": {
        "transaction_id": "uuid-string",
        "order_id": "TRIP-1642834782-ABC123",
        "total_price": "3000000.00",
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
Content-Type: application/json

{
    "passengers": 1,
    "departure_date": "2026-02-20",
    "pickup_location": "Jakarta Pusat",
    "special_requests": "Need wheelchair assistance"
}
```

**Response:**
```json
{
    "message": "Transaction created successfully",
    "data": {
        "transaction_id": "uuid-string",
        "order_id": "TRAVEL-1642834782-XYZ456",
        "total_price": "75000.00",
        "snap_token": "midtrans_snap_token",
        "item": {
            "id": "uuid-string",
            "origin": "Jakarta",
            "destination": "Bandung",
            "price_per_person": "75000.00"
        }
    }
}
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

**Validation Rules for Create Trip:**
```json
{
    "title": "required|string|max:255",
    "description": "required|string",
    "price": "required|numeric|min:0",
    "duration": "required|string|max:255",
    "location": "required|string|max:255",
    "quota": "required|integer|min:1",
    "image_base64": "required_without:image_url|string",
    "image_url": "required_without:image_base64|url",
    "image_name": "required_with:image_base64|string|max:255",
    "is_active": "nullable|boolean"
}
```

**Error Response (Validation Failed):**
```json
{
    "message": "The given data was invalid.",
    "errors": {
        "title": ["The title field is required."],
        "image_base64": ["The image base64 field is required when image url is not present."],
        "price": ["The price must be a number."]
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

**Response for Create Travel:**
```json
{
    "message": "Travel created successfully",
    "data": {
        "id": "uuid-string",
        "origin": "Jakarta",
        "destination": "Bandung",
        "vehicle_type": "Bus Executive",
        "price_per_person": "75000.00",
        "image": "travels/uuid-filename.jpg",
        "image_url": "http://localhost:8000/storage/travels/uuid-filename.jpg",
        "is_active": true,
        "created_at": "2026-01-24T07:49:39.000000Z",
        "updated_at": "2026-01-24T07:49:39.000000Z"
    }
}
```

**Validation Rules for Create Travel:**
```json
{
    "origin": "required|string|max:255",
    "destination": "required|string|max:255",
    "vehicle_type": "required|string|max:255",
    "price_per_person": "required|numeric|min:0",
    "image_base64": "required_without:image_url|string",
    "image_url": "required_without:image_base64|url",
    "image_name": "required_with:image_base64|string|max:255",
    "is_active": "nullable|boolean"
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

## Complete API Request/Response Examples

### Authentication Endpoints

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

**Validation Rules:**
```json
{
    "name": "required|string|max:255",
    "email": "required|string|email|max:255|unique:users",
    "password": "required|string|min:8|confirmed"
}
```

**Success Response (201):**
```json
{
    "message": "User registered successfully",
    "user": {
        "id": "uuid-string",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "created_at": "2026-01-24T07:49:39.000000Z",
        "updated_at": "2026-01-24T07:49:39.000000Z"
    },
    "access_token": "1|abcdef123456...",
    "token_type": "Bearer"
}
```

**Error Response (422):**
```json
{
    "message": "The given data was invalid.",
    "errors": {
        "email": ["The email has already been taken."],
        "password": ["The password confirmation does not match."]
    }
}
```

#### Login User
```http
POST /api/v1/auth/login
Content-Type: application/json

{
    "email": "admin@travel.com",
    "password": "password123"
}
```

**Validation Rules:**
```json
{
    "email": "required|email",
    "password": "required|string"
}
```

**Success Response (200):**
```json
{
    "message": "Login successful",
    "user": {
        "id": "uuid-string",
        "name": "Admin",
        "email": "admin@travel.com",
        "role": "admin"
    },
    "access_token": "2|xyz789...",
    "token_type": "Bearer"
}
```

**Error Response (401):**
```json
{
    "message": "Invalid credentials"
}
```

#### Logout User
```http
POST /api/v1/auth/logout
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
    "message": "Logged out successfully"
}
```

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

## Complete POST Method Structures

### Image Upload Validation & Processing

#### Base64 Image Processing
```json
{
    "image_base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...",
    "image_name": "filename.jpg"
}
```

**Processing Steps:**
1. Validate base64 format with data:image prefix
2. Extract image type (jpeg, png, webp, jpg)
3. Decode base64 data
4. Validate file size (max 5MB)
5. Generate UUID filename
6. Save to storage/app/public/{trips|travels}/
7. Return image URL

#### Image URL Processing
```json
{
    "image_url": "https://example.com/images/photo.jpg"
}
```

**Processing Steps:**
1. Download image from URL
2. Validate downloaded content
3. Check file size and format
4. Generate UUID filename
5. Save to local storage
6. Return local image URL

### Error Response Structures

#### Validation Error (422)
```json
{
    "message": "The given data was invalid.",
    "errors": {
        "title": ["The title field is required."],
        "image_base64": ["The image base64 field is required when image url is not present."],
        "price": ["The price must be a number."],
        "email": ["The email has already been taken."]
    }
}
```

#### Image Processing Errors (400)
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

```json
{
    "message": "Invalid image type. Allowed: JPEG, JPG, PNG, WEBP",
    "error": "Received type: gif"
}
```

```json
{
    "message": "Failed to download image from URL",
    "error": "Could not access the provided image URL"
}
```

#### Authentication Errors
```json
{
    "message": "Unauthenticated."
}
```

```json
{
    "message": "This action is unauthorized."
}
```

### Complete Transaction POST Structure

#### Trip Transaction Request
```http
POST /api/v1/transactions/trip/{trip_id}
Authorization: Bearer {token}
Content-Type: application/json

{
    "participants": 2,
    "departure_date": "2026-02-15",
    "special_requests": "Vegetarian meals please",
    "contact_phone": "+62812345678",
    "emergency_contact": "Jane Doe - +62887654321"
}
```

**Validation Rules:**
```json
{
    "participants": "required|integer|min:1|max:50",
    "departure_date": "required|date|after:today",
    "special_requests": "nullable|string|max:1000",
    "contact_phone": "required|string|max:20",
    "emergency_contact": "nullable|string|max:255"
}
```

#### Travel Transaction Request
```http
POST /api/v1/transactions/travel/{travel_id}
Authorization: Bearer {token}
Content-Type: application/json

{
    "passengers": 1,
    "departure_date": "2026-02-20",
    "pickup_location": "Jakarta Pusat",
    "destination_address": "Bandung Kota",
    "contact_phone": "+62812345678",
    "special_requests": "Need wheelchair assistance"
}
```

**Validation Rules:**
```json
{
    "passengers": "required|integer|min:1|max:10",
    "departure_date": "required|date|after:today",
    "pickup_location": "required|string|max:255",
    "destination_address": "nullable|string|max:255",
    "contact_phone": "required|string|max:20",
    "special_requests": "nullable|string|max:1000"
}
```

### Midtrans Payment Callback Structure

#### Webhook Request
```http
POST /api/v1/payments/midtrans/callback
Content-Type: application/json

{
    "order_id": "TRIP-1642834782-ABC123",
    "status_code": "200",
    "gross_amount": "1500000.00",
    "signature_key": "signature_from_midtrans",
    "transaction_status": "settlement",
    "fraud_status": "accept",
    "payment_type": "credit_card",
    "transaction_time": "2026-01-24 15:30:45",
    "transaction_id": "midtrans-transaction-id"
}
```

**Response:**
```json
{
    "message": "Payment callback processed successfully"
}
```

### Complete Field Descriptions

#### Trip Fields
- **title**: Nama paket trip (required, max 255 chars)
- **description**: Deskripsi lengkap trip (required, text)
- **price**: Harga per orang dalam Rupiah (required, numeric, min 0)
- **duration**: Durasi trip (required, max 255 chars)
- **location**: Lokasi/destinasi (required, max 255 chars)
- **quota**: Jumlah maksimal peserta (required, integer, min 1)
- **is_active**: Status aktif trip (optional, boolean, default true)
- **image_base64**: Gambar dalam format base64 (required_without image_url)
- **image_url**: URL gambar eksternal (required_without image_base64)
- **image_name**: Nama file gambar (required_with image_base64)

#### Travel Fields
- **origin**: Kota asal (required, max 255 chars)
- **destination**: Kota tujuan (required, max 255 chars)
- **vehicle_type**: Jenis kendaraan (required, max 255 chars)
- **price_per_person**: Harga per orang dalam Rupiah (required, numeric, min 0)
- **is_active**: Status aktif travel (optional, boolean, default true)
- **image_base64**: Gambar dalam format base64 (required_without image_url)
- **image_url**: URL gambar eksternal (required_without image_base64)
- **image_name**: Nama file gambar (required_with image_base64)

### HTTP Status Codes

- **200 OK**: Request berhasil
- **201 Created**: Resource berhasil dibuat
- **400 Bad Request**: Request tidak valid (image processing error)
- **401 Unauthorized**: Token tidak valid atau tidak ada
- **403 Forbidden**: Tidak memiliki permission (bukan admin)
- **404 Not Found**: Resource tidak ditemukan
- **422 Unprocessable Entity**: Validation error
- **500 Internal Server Error**: Server error

### Rate Limiting

- **Authentication endpoints**: 5 requests per minute
- **Public endpoints**: 60 requests per minute
- **Admin endpoints**: 100 requests per minute
- **Image upload**: 10 requests per minute

### Security Headers Required

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer {token}
X-Requested-With: XMLHttpRequest
```

### Testing Examples

#### Test Trip Creation with cURL
```bash
curl -X POST http://localhost:8000/api/v1/admin/trips \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "title": "Test Trip",
    "description": "Test description",
    "price": 1000000,
    "duration": "2 hari 1 malam",
    "location": "Bali",
    "quota": 20,
    "image_url": "https://picsum.photos/800/600",
    "is_active": true
  }'
```

#### Test Travel Creation with cURL
```bash
curl -X POST http://localhost:8000/api/v1/admin/travels \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "origin": "Jakarta",
    "destination": "Bandung", 
    "vehicle_type": "Bus Executive",
    "price_per_person": 75000,
    "image_url": "https://picsum.photos/800/600",
    "is_active": true
  }'
```

---

**Last Updated:** January 26, 2026  
**API Version:** v1  
**Backend Framework:** Laravel 11  
**Authentication:** Laravel Sanctum  
**Image Storage:** Local Storage with Public Link