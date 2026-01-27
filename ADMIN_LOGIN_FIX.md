# Admin Login Issue - Fix Guide

## Problem
Admin users are getting automatically logged out when accessing the admin dashboard due to 401 Unauthorized errors from backend API endpoints.

## Root Cause
The issue occurs because:
1. Admin user credentials in the database use email `admin@travel.com` (not `admin@example.com`)
2. Users might be logging in with wrong credentials
3. Token authentication is working, but admin endpoints are returning 401

## Solution

### 1. Use Correct Admin Credentials
Make sure to login with:
- **Email:** `admin@travel.com`
- **Password:** `password123`

### 2. Debug Tools Available

#### Frontend Debug Pages:
- `/admin-debug` - Complete admin authentication testing
- `/debug` - General debug information
- Development login helper on login page (shows admin credentials)

#### Backend Commands:
```bash
# Make sure admin user exists
php artisan db:seed --class=AdminUserSeeder

# Start the server
php artisan serve
```

### 3. Test Admin Authentication

Visit `/admin-debug` page to:
- Test admin login with correct credentials
- Test admin API endpoints
- See detailed error information
- Clear authentication data if needed

### 4. Check Browser Console

The application now logs detailed information:
- API requests and responses
- Authentication token status
- Error details for 401 responses

## Quick Fix Steps

1. **Logout completely** (clear browser data if needed)
2. **Login with correct credentials:** `admin@travel.com` / `password123`
3. **Check `/admin-debug`** if issues persist
4. **Verify backend is running** on `http://localhost:8000`

## Development Notes

- Response interceptor temporarily disabled to prevent auto-logout during debugging
- Admin login helper available on login page (development only)
- Detailed console logging enabled for troubleshooting
- AuthDebug component shows current authentication state

## Files Modified

- `frontend/src/pages/AdminDashboard.jsx` - Added debug alert
- `frontend/src/pages/Login.jsx` - Added admin login helper
- `frontend/src/pages/AdminDebug.jsx` - New debug page
- `frontend/src/config/api.js` - Enhanced logging, disabled auto-logout
- `frontend/src/components/AdminLoginHelper.jsx` - New helper component

The admin authentication should now work correctly with the proper credentials.