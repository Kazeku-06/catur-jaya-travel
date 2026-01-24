# Postman/Insomnia Examples - Catur Jaya Travel API

## Authentication

### 1. Login Admin
```http
POST http://localhost:8000/api/v1/auth/login
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
        "id": "uuid",
        "name": "Admin",
        "email": "admin@travel.com",
        "role": "admin"
    },
    "access_token": "your_token_here",
    "token_type": "Bearer"
}
```

## Trip Management

### 2. Create Trip (JSON - No Image)
```http
POST http://localhost:8000/api/v1/admin/trips
Authorization: Bearer your_token_here
Content-Type: application/json

{
    "title": "Wisata Raja Ampat",
    "description": "Paket wisata diving di Raja Ampat dengan pemandangan bawah laut yang menakjubkan",
    "price": 3500000,
    "duration": "5 hari 4 malam",
    "location": "Raja Ampat, Papua Barat",
    "quota": 8,
    "is_active": true
}
```

### 3. Create Trip (Form Data - With Image)
```http
POST http://localhost:8000/api/v1/admin/trips
Authorization: Bearer your_token_here
Content-Type: multipart/form-data

title: Wisata Komodo Island
description: Paket wisata ke Pulau Komodo untuk melihat komodo dan snorkeling
price: 2800000
duration: 4 hari 3 malam
location: Labuan Bajo, NTT
quota: 12
is_active: true
image: [SELECT FILE - JPEG/PNG/JPG/WEBP, Max 5MB]
```

### 4. Update Trip (Form Data - With Image)
```http
PUT http://localhost:8000/api/v1/admin/trips/{trip_id}
Authorization: Bearer your_token_here
Content-Type: multipart/form-data

title: Wisata Komodo Island Updated
price: 3000000
image: [SELECT NEW FILE - JPEG/PNG/JPG/WEBP, Max 5MB]
# Only include fields you want to update
```

### 5. Get All Trips (Public)
```http
GET http://localhost:8000/api/v1/trips
# No authentication required
```

### 6. Get Trip Detail (Public)
```http
GET http://localhost:8000/api/v1/trips/{trip_id}
# No authentication required
```

## Travel Management

### 7. Create Travel (JSON - No Image)
```http
POST http://localhost:8000/api/v1/admin/travels
Authorization: Bearer your_token_here
Content-Type: application/json

{
    "origin": "Denpasar",
    "destination": "Ubud",
    "vehicle_type": "Minibus AC",
    "price_per_person": 45000,
    "is_active": true
}
```

### 8. Create Travel (Form Data - With Image)
```http
POST http://localhost:8000/api/v1/admin/travels
Authorization: Bearer your_token_here
Content-Type: multipart/form-data

origin: Yogyakarta
destination: Solo
vehicle_type: Bus Pariwisata
price_per_person: 35000
is_active: true
image: [SELECT FILE - JPEG/PNG/JPG/WEBP, Max 5MB]
```

### 9. Update Travel (Form Data - With Image)
```http
PUT http://localhost:8000/api/v1/admin/travels/{travel_id}
Authorization: Bearer your_token_here
Content-Type: multipart/form-data

price_per_person: 40000
image: [SELECT NEW FILE - JPEG/PNG/JPG/WEBP, Max 5MB]
# Only include fields you want to update
```

### 10. Get All Travels (Public)
```http
GET http://localhost:8000/api/v1/travels
# No authentication required
```

### 11. Get Travel Detail (Public)
```http
GET http://localhost:8000/api/v1/travels/{travel_id}
# No authentication required
```

## Image Upload (Separate Endpoints)

### 12. Upload Trip Image (Alternative Method)
```http
POST http://localhost:8000/api/v1/admin/trips/{trip_id}/upload-image
Authorization: Bearer your_token_here
Content-Type: multipart/form-data

image: [SELECT FILE - JPEG/PNG/JPG/WEBP, Max 5MB]
```

### 13. Upload Travel Image (Alternative Method)
```http
POST http://localhost:8000/api/v1/admin/travels/{travel_id}/upload-image
Authorization: Bearer your_token_here
Content-Type: multipart/form-data

image: [SELECT FILE - JPEG/PNG/JPG/WEBP, Max 5MB]
```

## Response Examples

### Success Response (With Image)
```json
{
    "message": "Trip created successfully",
    "data": {
        "id": "d13f08fd-e920-41c5-a9f6-28fdc234bb1f",
        "title": "Wisata Komodo Island",
        "description": "Paket wisata ke Pulau Komodo untuk melihat komodo dan snorkeling",
        "price": "2800000.00",
        "duration": "4 hari 3 malam",
        "location": "Labuan Bajo, NTT",
        "quota": 12,
        "image": "trips/c8c1727d-0ab0-4e04-af4e-77da03fdcae2.jpg",
        "image_url": "http://localhost:8000/storage/trips/c8c1727d-0ab0-4e04-af4e-77da03fdcae2.jpg",
        "is_active": true,
        "created_at": "2026-01-24T08:43:02.000000Z",
        "updated_at": "2026-01-24T08:43:02.000000Z"
    }
}
```

### Error Response (Validation)
```json
{
    "message": "The given data was invalid.",
    "errors": {
        "title": ["The title field is required."],
        "image": ["The image must be an image.", "The image must not be greater than 5120 kilobytes."]
    }
}
```

## Notes

1. **Content-Type**: 
   - Use `application/json` for requests without images
   - Use `multipart/form-data` for requests with images

2. **Image Requirements**:
   - Formats: JPEG, PNG, JPG, WEBP
   - Maximum size: 5MB
   - Images are automatically resized and optimized

3. **Boolean Fields**:
   - For form-data: use `"true"` or `"false"` as strings
   - For JSON: use `true` or `false` as booleans

4. **Image URLs**:
   - All responses include both `image` (path) and `image_url` (full URL)
   - Images are accessible at `http://localhost:8000/storage/trips/` or `http://localhost:8000/storage/travels/`

5. **Authentication**:
   - Admin endpoints require `Authorization: Bearer {token}` header
   - Public endpoints (GET trips/travels) don't require authentication