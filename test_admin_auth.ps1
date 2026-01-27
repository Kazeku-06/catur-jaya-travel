# Test Admin Authentication Script
# This script tests admin authentication and API endpoints

Write-Host "=== Testing Admin Authentication ===" -ForegroundColor Green

# Read environment variables
$envFile = "backend/.env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "^([^#][^=]+)=(.*)$") {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2])
        }
    }
}

$baseUrl = "http://localhost:8000/api/v1"

Write-Host "Base URL: $baseUrl" -ForegroundColor Yellow

# Test 1: Login as admin
Write-Host "`n1. Testing admin login..." -ForegroundColor Cyan

$loginData = @{
    email = "admin@example.com"
    password = "password"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    Write-Host "✓ Login successful" -ForegroundColor Green
    Write-Host "User: $($loginResponse.user.name)" -ForegroundColor White
    Write-Host "Role: $($loginResponse.user.role)" -ForegroundColor White
    Write-Host "Token: $($loginResponse.token.Substring(0, 20))..." -ForegroundColor White
    
    $token = $loginResponse.token
    $headers = @{
        "Authorization" = "Bearer $token"
        "Accept" = "application/json"
        "Content-Type" = "application/json"
    }
    
} catch {
    Write-Host "✗ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Red
    exit 1
}

# Test 2: Test auth endpoint
Write-Host "`n2. Testing auth endpoint..." -ForegroundColor Cyan

try {
    $authResponse = Invoke-RestMethod -Uri "$baseUrl/test-auth" -Method GET -Headers $headers
    Write-Host "✓ Auth test successful" -ForegroundColor Green
    Write-Host "Message: $($authResponse.message)" -ForegroundColor White
    Write-Host "User: $($authResponse.user.name)" -ForegroundColor White
} catch {
    Write-Host "✗ Auth test failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
}

# Test 3: Test admin auth endpoint
Write-Host "`n3. Testing admin auth endpoint..." -ForegroundColor Cyan

try {
    $adminAuthResponse = Invoke-RestMethod -Uri "$baseUrl/admin/test-auth" -Method GET -Headers $headers
    Write-Host "✓ Admin auth test successful" -ForegroundColor Green
    Write-Host "Message: $($adminAuthResponse.message)" -ForegroundColor White
    Write-Host "User: $($adminAuthResponse.user.name)" -ForegroundColor White
    Write-Host "Role: $($adminAuthResponse.role)" -ForegroundColor White
} catch {
    Write-Host "✗ Admin auth test failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "This indicates token authentication failed" -ForegroundColor Yellow
    } elseif ($_.Exception.Response.StatusCode -eq 403) {
        Write-Host "This indicates role authorization failed" -ForegroundColor Yellow
    }
}

# Test 4: Test admin trips endpoint
Write-Host "`n4. Testing admin trips endpoint..." -ForegroundColor Cyan

try {
    $tripsResponse = Invoke-RestMethod -Uri "$baseUrl/admin/trips" -Method GET -Headers $headers
    Write-Host "✓ Admin trips test successful" -ForegroundColor Green
    Write-Host "Trips count: $($tripsResponse.data.Count)" -ForegroundColor White
} catch {
    Write-Host "✗ Admin trips test failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "This is likely the cause of the logout issue!" -ForegroundColor Red
    }
}

# Test 5: Test admin travels endpoint
Write-Host "`n5. Testing admin travels endpoint..." -ForegroundColor Cyan

try {
    $travelsResponse = Invoke-RestMethod -Uri "$baseUrl/admin/travels" -Method GET -Headers $headers
    Write-Host "✓ Admin travels test successful" -ForegroundColor Green
    Write-Host "Travels count: $($travelsResponse.data.Count)" -ForegroundColor White
} catch {
    Write-Host "✗ Admin travels test failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "This is likely the cause of the logout issue!" -ForegroundColor Red
    }
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Green
Write-Host "If any admin endpoints returned 401, that's causing the automatic logout." -ForegroundColor Yellow