# Simple Backend Test
Write-Host "=== Testing Backend Server ===" -ForegroundColor Green

$baseUrl = "http://localhost:8000"

# Test if server is running
Write-Host "`nTesting server connection..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$baseUrl" -Method GET -TimeoutSec 5
    Write-Host "✓ Server is running" -ForegroundColor Green
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor White
} catch {
    Write-Host "✗ Server is not running or not accessible" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Make sure to run: php artisan serve" -ForegroundColor Yellow
    exit 1
}

# Test API endpoint
Write-Host "`nTesting API endpoint..." -ForegroundColor Cyan
try {
    $apiResponse = Invoke-WebRequest -Uri "$baseUrl/api/v1/trips" -Method GET -TimeoutSec 5
    Write-Host "✓ API endpoint accessible" -ForegroundColor Green
    Write-Host "Status: $($apiResponse.StatusCode)" -ForegroundColor White
} catch {
    Write-Host "✗ API endpoint failed" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Backend Test Complete ===" -ForegroundColor Green