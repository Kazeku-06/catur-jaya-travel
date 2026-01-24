# 📡 API Integration Notes - Frontend

## 🔗 Backend API Integration

Frontend telah disesuaikan dengan dokumentasi API backend yang tersedia di `backend/API_DOCUMENTATION.md`.

### 🌐 Base URL
```
http://localhost:8000/api/v1
```

## ✅ Implemented Endpoints

### 🔐 Authentication
- ✅ `POST /auth/login` - Login user
- ✅ `POST /auth/register` - Register user  
- ✅ `GET /auth/me` - Get user profile
- ✅ `POST /auth/logout` - Logout user

### 📋 Public Catalog
- ✅ `GET /trips` - Get all trips
- ✅ `GET /trips/{id}` - Get trip detail
- ✅ `GET /travels` - Get all travels
- ✅ `GET /travels/{id}` - Get travel detail

### 💳 Transactions (Protected)
- ✅ `POST /transactions/trip/{trip_id}` - Create trip transaction
- ✅ `POST /transactions/travel/{travel_id}` - Create travel transaction

### 💰 Payment
- ✅ `GET /payments/midtrans` - Get Midtrans config
- ✅ `POST /payments/midtrans/callback` - Midtrans webhook

## 🔄 Data Mapping

### Backend → Frontend Field Mapping

#### Trips Data
```javascript
// Backend Response
{
  "id": "uuid",
  "title": "Trip Name",        // → name (frontend)
  "description": "...",
  "price": "1500000.00",
  "duration": "3 hari 2 malam",
  "location": "Bromo, Jawa Timur",
  "quota": 20,
  "is_active": true,           // → is_available (frontend)
  "created_at": "...",
  "updated_at": "..."
}

// Frontend Mapping
const mappedTrip = {
  ...tripData,
  name: tripData.title,
  is_available: tripData.is_active,
  // Add default values for missing fields
  images: tripData.images || [tripData.image],
  rating: tripData.rating || 4.5,
  total_reviews: tripData.total_reviews || 0,
  category: tripData.category || 'Wisata',
}
```

#### Travels Data
```javascript
// Backend Response
{
  "id": "uuid",
  "origin": "Jakarta",         // → departure_location (frontend)
  "destination": "Bandung",    // → destination_location (frontend)
  "vehicle_type": "Bus Executive",
  "price_per_person": "75000", // → price (frontend)
  "is_active": true,           // → is_available (frontend)
}

// Frontend Mapping
const mappedTravel = {
  ...travelData,
  name: `${travelData.origin} - ${travelData.destination}`,
  departure_location: travelData.origin,
  destination_location: travelData.destination,
  price: travelData.price_per_person,
  is_available: travelData.is_active,
}
```

#### Auth Response
```javascript
// Backend Response
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "name": "User Name",
    "email": "user@example.com",
    "role": "user"
  },
  "access_token": "token_string",
  "token_type": "Bearer"
}

// Frontend Usage
const { user, access_token } = response.data;
setAuthToken(access_token);
setUserData(user);
```

## ⚠️ Missing Endpoints & Workarounds

### 🚗 Carter Mobiles
**Status**: ❌ Not available in backend API

**Workaround**: 
- Frontend uses trips endpoint as fallback
- CarterMobiles pages will show empty state
- WhatsApp integration still works for contact

**Implementation**:
```javascript
// Fallback in api.js
carterMobiles: '/trips', // Fallback - needs backend implementation
carterMobileDetail: (id) => `/trips/${id}`, // Fallback
```

### 🔍 Advanced Filtering & Pagination
**Status**: ❌ Backend doesn't support query parameters for filtering

**Workaround**:
- Frontend implements client-side filtering
- Client-side pagination
- Client-side sorting

**Implementation**:
```javascript
// Client-side filtering example
let filteredTrips = tripsData;

if (searchQuery) {
  filteredTrips = filteredTrips.filter(trip => 
    trip.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );
}

if (filters.location) {
  filteredTrips = filteredTrips.filter(trip => 
    trip.location?.toLowerCase().includes(filters.location.toLowerCase())
  );
}
```

### 📊 Transaction Management
**Status**: ⚠️ Limited transaction endpoints

**Available**:
- Create trip transaction
- Create travel transaction

**Missing**:
- Get user transactions/bookings
- Transaction status updates
- Transaction history

**Workaround**:
- Payment status pages use URL parameters
- Mock transaction data for demo

## 🛠️ Configuration Updates

### Environment Variables
```env
# Updated to match backend
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_NAME=Catur Jaya Travel
VITE_WHATSAPP_NUMBER=6281234567890
```

### API Configuration
```javascript
// src/config/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// Updated endpoints to match backend
export const endpoints = {
  login: '/auth/login',
  register: '/auth/register',
  trips: '/trips',
  travels: '/travels',
  createTripTransaction: (tripId) => `/transactions/trip/${tripId}`,
  createTravelTransaction: (travelId) => `/transactions/travel/${travelId}`,
  // ... other endpoints
};
```

## 🔧 Error Handling

### Backend Error Formats
```javascript
// 401 Unauthorized
{
  "message": "Unauthorized"
}

// 422 Validation Error
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password field is required."]
  }
}

// 404 Not Found
{
  "message": "Trip not found"
}
```

### Frontend Error Handling
```javascript
// Login error handling
catch (error) {
  const message = error.response?.data?.message || 'Login gagal. Silakan coba lagi.';
  throw new Error(message);
}

// Registration validation errors
if (error.response?.data?.errors) {
  const errors = error.response.data.errors;
  const firstError = Object.values(errors)[0];
  if (Array.isArray(firstError) && firstError.length > 0) {
    message = firstError[0];
  }
}
```

## 🚀 Testing API Integration

### 1. Start Backend Server
```bash
cd backend
php artisan serve
```

### 2. Start Frontend Development Server
```bash
cd frontend
npm run dev
```

### 3. Test Authentication
- Register new user: `/register`
- Login with credentials: `/login`
- Default admin: `admin@travel.com` / `password123`

### 4. Test Public Endpoints
- View trips: `/trips`
- View travels: `/travels`
- View trip details: `/trips/{id}`
- View travel details: `/travels/{id}`

### 5. Test Protected Features
- Create trip booking (requires login)
- Create travel booking (requires login)

## 📝 Development Notes

### 🔄 Future Backend Enhancements Needed

1. **Carter Mobiles Endpoints**
   ```
   GET /carter-mobiles
   GET /carter-mobiles/{id}
   ```

2. **Advanced Query Parameters**
   ```
   GET /trips?search=bromo&category=adventure&min_price=1000000
   GET /travels?origin=jakarta&destination=bandung
   ```

3. **Pagination Support**
   ```
   GET /trips?page=1&limit=12
   Response: { data: [...], total: 100, per_page: 12, current_page: 1 }
   ```

4. **User Transaction Management**
   ```
   GET /user/transactions
   GET /user/transactions/{id}
   PUT /user/transactions/{id}/cancel
   ```

5. **File Upload for Images**
   ```
   POST /admin/trips/{id}/images
   DELETE /admin/trips/{id}/images/{image_id}
   ```

### 🎯 Current Limitations

1. **No Image Upload**: Frontend uses placeholder images
2. **Limited Filtering**: Client-side filtering only
3. **No Real-time Updates**: No WebSocket/SSE integration
4. **Mock Data**: Some features use mock data for demo

### ✅ Working Features

1. **Authentication**: Login/Register/Logout
2. **Trip Browsing**: List and detail views
3. **Travel Browsing**: List and detail views  
4. **Responsive Design**: Mobile-first approach
5. **Error Handling**: Graceful error management
6. **Loading States**: Proper UX feedback
7. **Form Validation**: Client-side validation
8. **WhatsApp Integration**: Contact functionality

## 🎉 Conclusion

Frontend telah berhasil diintegrasikan dengan backend API yang tersedia. Meskipun ada beberapa endpoint yang belum tersedia di backend (seperti carter mobiles), frontend telah diimplementasikan dengan workaround yang memungkinkan aplikasi tetap berfungsi dengan baik.

Semua fitur utama seperti authentication, trip browsing, travel browsing, dan booking system telah terintegrasi dengan backend API sesuai dokumentasi yang tersedia.