# Frontend JSON-Only API Integration

## ✅ Completed Updates

### 1. **Service Layer Updates**
- **catalogService.js**: Removed carter mobile references
- **adminService.js**: New service for JSON-only admin endpoints
- **imageHelpers**: Utility functions for image handling in JSON format

### 2. **Admin Components Created**
- **TripForm.jsx**: Form component for creating/editing trips (JSON-only)
- **TravelForm.jsx**: Form component for creating/editing travels (JSON-only)
- **AdminDashboard.jsx**: Complete admin interface demonstrating JSON-only API usage

### 3. **Image Upload Methods**
Frontend now supports both JSON-only image upload methods:

#### Method 1: File Upload → Base64
```javascript
// Convert file to base64
const base64 = await imageHelpers.fileToBase64(file);

// Send as JSON
const tripData = {
  title: "Trip Name",
  // ... other fields
  image_base64: base64,
  image_name: file.name
};
```

#### Method 2: Image URL
```javascript
// Send image URL
const tripData = {
  title: "Trip Name",
  // ... other fields
  image_url: "https://example.com/image.jpg"
};
```

### 4. **API Configuration**
- **api.js**: Already properly configured for JSON-only requests
- **Content-Type**: `application/json` by default
- **Authorization**: Bearer token handling
- **Error handling**: 401 redirects to login

## 🔧 Key Features

### **Admin Service Functions**
```javascript
import { adminService, imageHelpers } from '../services/adminService';

// Create trip with file upload
const tripData = await imageHelpers.prepareTripData(formData, imageFile);
const response = await adminService.trips.create(tripData);

// Create travel with image URL
const travelData = await imageHelpers.prepareTravelData(formData, null, imageUrl);
const response = await adminService.travels.create(travelData);

// Update (image optional)
const response = await adminService.trips.update(id, updateData);
```

### **Image Validation**
```javascript
// Validate image file before upload
const errors = imageHelpers.validateImage(file);
if (errors.length > 0) {
  // Handle validation errors
  console.error(errors);
}
```

### **Form Components**
Both `TripForm` and `TravelForm` components include:
- ✅ JSON-only API integration
- ✅ File upload → Base64 conversion
- ✅ Image URL input option
- ✅ Image validation (type, size)
- ✅ Loading states
- ✅ Error handling
- ✅ Success feedback

## 📋 Validation Rules

### **Image Validation**
- **Formats**: JPEG, PNG, JPG, WEBP
- **Max Size**: 5MB
- **Required**: For CREATE operations
- **Optional**: For UPDATE operations

### **Trip Fields**
```javascript
{
  title: "required|string",
  description: "required|string", 
  price: "required|number",
  duration: "required|string",
  location: "required|string",
  quota: "required|number",
  is_active: "boolean",
  // Image (one required for CREATE)
  image_base64: "string", // OR
  image_url: "url"
}
```

### **Travel Fields**
```javascript
{
  origin: "required|string",
  destination: "required|string",
  vehicle_type: "required|string", 
  price_per_person: "required|number",
  is_active: "boolean",
  // Image (one required for CREATE)
  image_base64: "string", // OR
  image_url: "url"
}
```

## 🎯 Usage Examples

### **Create Trip with File Upload**
```jsx
import { adminService, imageHelpers } from '../services/adminService';

const handleCreateTrip = async (formData, imageFile) => {
  try {
    const tripData = await imageHelpers.prepareTripData(formData, imageFile);
    const response = await adminService.trips.create(tripData);
    console.log('Trip created:', response.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

### **Create Travel with Image URL**
```jsx
const handleCreateTravel = async (formData, imageUrl) => {
  try {
    const travelData = await imageHelpers.prepareTravelData(formData, null, imageUrl);
    const response = await adminService.travels.create(travelData);
    console.log('Travel created:', response.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

### **Update with Optional Image**
```jsx
const handleUpdate = async (id, formData, newImageFile = null) => {
  try {
    const updateData = await imageHelpers.prepareTripData(formData, newImageFile);
    const response = await adminService.trips.update(id, updateData);
    console.log('Trip updated:', response.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

## 🧪 Testing

### **Frontend API Test**
```bash
# Run frontend API integration test
node test_frontend_api.js
```

### **Manual Testing**
1. Start backend: `php artisan serve --host=localhost --port=8000`
2. Start frontend: `npm run dev`
3. Navigate to `/admin` (create this route)
4. Test creating/editing trips and travels

## 🔄 Migration from Form-Data

### **Before (Form-Data)**
```javascript
// OLD - Form-data approach (no longer supported)
const formData = new FormData();
formData.append('title', 'Trip Name');
formData.append('image', file);

await api.post('/admin/trips', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
```

### **After (JSON-Only)**
```javascript
// NEW - JSON-only approach
const base64 = await imageHelpers.fileToBase64(file);
const tripData = {
  title: 'Trip Name',
  image_base64: base64,
  image_name: file.name
};

await api.post('/admin/trips', tripData); // JSON by default
```

## 📁 File Structure

```
frontend/src/
├── services/
│   ├── adminService.js          # JSON-only admin API functions
│   ├── catalogService.js        # Updated (removed carter mobile)
│   └── ...
├── components/
│   └── admin/
│       ├── TripForm.jsx         # JSON-only trip form
│       └── TravelForm.jsx       # JSON-only travel form
├── pages/
│   └── AdminDashboard.jsx       # Complete admin interface
└── test_frontend_api.js         # API integration test
```

## 🎉 Benefits

1. **Consistent API**: All endpoints use JSON format
2. **Better Error Handling**: Structured JSON error responses
3. **Image Flexibility**: Support both file upload and URL methods
4. **Type Safety**: Better TypeScript support (if needed)
5. **Easier Testing**: JSON requests are easier to test
6. **Modern Approach**: Follows REST API best practices

## 🚀 Next Steps

1. Add the admin route to your router
2. Implement authentication guards for admin pages
3. Add more admin features (transactions, statistics)
4. Consider adding TypeScript for better type safety
5. Add unit tests for the service functions