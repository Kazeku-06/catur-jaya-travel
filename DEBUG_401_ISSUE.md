# Debug 401 Issue - Manual vs Web Difference

## Problem Summary
- Manual API test with PowerShell/curl works ✅
- Web application gets 401 Unauthorized ❌
- Same credentials, same endpoints, different results

## Debugging Steps

### 1. Check Token Differences
Visit `/token-test` page to:
- ✅ Test fresh login
- ✅ Compare stored token vs fresh token
- ✅ Test direct fetch vs axios
- ✅ See detailed token information

### 2. Monitor Backend Logs
Run in separate terminal:
```bash
# Monitor Laravel logs for Sanctum auth debugging
powershell -ExecutionPolicy Bypass -File monitor_logs.ps1
```

### 3. Check Browser Console
Look for:
- API configuration logs
- Token information
- Request/response details
- Error messages

### 4. Verify Environment
- ✅ Frontend .env: `VITE_API_BASE_URL=http://localhost:8000/api/v1`
- ✅ Backend running on: `http://localhost:8000`
- ✅ Database seeded with admin user

## Possible Causes

### 1. Token Format Issues
- Token might be corrupted during storage
- Different token format between manual and web
- Token encoding issues

### 2. Request Header Issues
- Missing or incorrect headers
- CORS issues
- Content-Type problems

### 3. Middleware Issues
- Sanctum middleware not recognizing token
- Role middleware failing
- Request processing order

### 4. Session/Storage Issues
- localStorage corruption
- Token expiration
- Browser cache issues

## Debug Tools Available

### Frontend Pages:
- `/token-test` - Comprehensive token testing
- `/admin-debug` - Admin-specific debugging
- Browser DevTools Console - Detailed logging

### Backend Logging:
- Laravel logs with Sanctum auth debugging
- Middleware logging enabled
- Request/response tracking

## Quick Test Commands

### Manual Test (Working):
```bash
# Login
$body = '{"email":"admin@travel.com","password":"password123"}'
$response = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/auth/login" -Method POST -Body $body -ContentType "application/json"
$token = $response.access_token

# Test admin endpoint
$headers = @{"Authorization" = "Bearer $token"; "Accept" = "application/json"}
Invoke-RestMethod -Uri "http://localhost:8000/api/v1/admin/trips" -Method GET -Headers $headers
```

### Web Test (Failing):
1. Login at `/login` with `admin@travel.com` / `password123`
2. Go to `/admin` - should get 401 errors
3. Check console for detailed logs

## Next Steps

1. **Run Token Test**: Visit `/token-test` and run all tests
2. **Monitor Logs**: Run log monitoring script
3. **Compare Results**: Look for differences between manual and web requests
4. **Check Headers**: Verify all request headers are identical
5. **Test Direct Fetch**: See if direct fetch works vs axios

The issue is likely in the token handling, request formatting, or middleware processing between manual and web requests.