# Test Admin Login Script
Write-Host "=== Testing Admin Login ===" -ForegroundColor Green

$baseUrl = "http://localhost:8000/api/v1"

# Test login with correct admin email
Write-Host "`nTesting login with admin@travel.com..." -ForegroundColor Cyan

$loginData = @{
    email = "admin@travel.com"
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    Write-Host "✓ Login successful" -ForegroundColor Green
    Write-Host "User: $($loginResponse.user.name)" -ForegroundColor White
    Write-Host "Email: $($loginResponse.user.email)" -ForegroundColor White
    Write-Host "Role: $($loginResponse.user.role)" -ForegroundColor White
    Write-Host "Token: $($loginResponse.access_token.Substring(0, 20))..." -ForegroundColor White
    
    $token = $loginResponse.access_token
    $headers = @{
        "Authorization" = "Bearer $token"
        "Accept" = "application/json"
        "Content-Type" = "application/json"
    }
    
    # Test admin endpoint
    Write-Host "`nTesting admin endpoint..." -ForegroundColor Cyan
    try {
        $adminResponse = Invoke-RestMethod -Uri "$baseUrl/admin/test-auth" -Method GET -Headers $headers
        Write-Host "✓ Admin endpoint successful" -ForegroundColor Green
        Write-Host "Message: $($adminResponse.message)" -ForegroundColor White
    } catch {
        Write-Host "✗ Admin endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "✗ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response.StatusCode -eq 422) {
        Write-Host "This might be validation error - check email/password" -ForegroundColor Yellow
    }
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Green