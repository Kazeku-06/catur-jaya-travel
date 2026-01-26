# Test API with Image Upload
# PowerShell script untuk test API upload gambar

$baseUrl = "http://localhost:8000/api/v1"

Write-Host "=== Testing Catur Jaya Travel API with Image Upload ===" -ForegroundColor Green

# 1. Login sebagai admin
Write-Host "`n1. Login as admin..." -ForegroundColor Yellow
$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body (@{
    email = "admin@travel.com"
    password = "password123"
} | ConvertTo-Json)

$token = $loginResponse.access_token
Write-Host "Login successful! Token: $($token.Substring(0,20))..." -ForegroundColor Green

# Headers dengan token
$headers = @{
    "Authorization" = "Bearer $token"
    "Accept" = "application/json"
}

# 2. Test GET trips (public)
Write-Host "`n2. Get all trips (public)..." -ForegroundColor Yellow
try {
    $trips = Invoke-RestMethod -Uri "$baseUrl/trips" -Method GET
    Write-Host "Found $($trips.data.Count) trips" -ForegroundColor Green
    
    if ($trips.data.Count -gt 0) {
        $firstTrip = $trips.data[0]
        Write-Host "First trip: $($firstTrip.title)" -ForegroundColor Cyan
        if ($firstTrip.image_url) {
            Write-Host "Image URL: $($firstTrip.image_url)" -ForegroundColor Cyan
        }
    }
} catch {
    Write-Host "Error getting trips: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Create trip dengan JSON (tanpa gambar)
Write-Host "`n3. Create trip with JSON (no image)..." -ForegroundColor Yellow
try {
    $newTrip = @{
        title = "Test Trip JSON"
        description = "Trip created via JSON without image"
        price = 500000
        duration = "2 hari 1 malam"
        location = "Test Location"
        quota = 10
        is_active = $true
    }
    
    $createResponse = Invoke-RestMethod -Uri "$baseUrl/admin/trips" -Method POST -Headers $headers -ContentType "application/json" -Body ($newTrip | ConvertTo-Json)
    Write-Host "Trip created successfully: $($createResponse.data.title)" -ForegroundColor Green
    $tripId = $createResponse.data.id
} catch {
    Write-Host "Error creating trip: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Create sample image file untuk test
Write-Host "`n4. Creating sample image for test..." -ForegroundColor Yellow
$imagePath = "test-image.jpg"

# Create a simple test image (1x1 pixel JPEG)
$imageBytes = [System.Convert]::FromBase64String("/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A")
[System.IO.File]::WriteAllBytes($imagePath, $imageBytes)
Write-Host "Sample image created: $imagePath" -ForegroundColor Green

# 5. Create trip dengan Form Data (dengan gambar) menggunakan curl
Write-Host "`n5. Create trip with Form Data (with image) using curl..." -ForegroundColor Yellow
try {
    $curlCommand = @"
curl -X POST "$baseUrl/admin/trips" \
  -H "Authorization: Bearer $token" \
  -H "Accept: application/json" \
  -F "title=Test Trip with Image" \
  -F "description=Trip created via Form Data with image" \
  -F "price=750000" \
  -F "duration=3 hari 2 malam" \
  -F "location=Test Location with Image" \
  -F "quota=15" \
  -F "is_active=true" \
  -F "image=@$imagePath"
"@
    
    Write-Host "Curl command:" -ForegroundColor Cyan
    Write-Host $curlCommand -ForegroundColor Gray
    
    # Execute curl command
    $curlResult = cmd /c "curl -X POST `"$baseUrl/admin/trips`" -H `"Authorization: Bearer $token`" -H `"Accept: application/json`" -F `"title=Test Trip with Image`" -F `"description=Trip created via Form Data with image`" -F `"price=750000`" -F `"duration=3 hari 2 malam`" -F `"location=Test Location with Image`" -F `"quota=15`" -F `"is_active=true`" -F `"image=@$imagePath`""
    
    Write-Host "Response: $curlResult" -ForegroundColor Green
} catch {
    Write-Host "Error with curl: $($_.Exception.Message)" -ForegroundColor Red
}

# 6. Test GET trips lagi untuk melihat hasil
Write-Host "`n6. Get all trips again to see results..." -ForegroundColor Yellow
try {
    $tripsAfter = Invoke-RestMethod -Uri "$baseUrl/trips" -Method GET
    Write-Host "Now found $($tripsAfter.data.Count) trips" -ForegroundColor Green
    
    foreach ($trip in $tripsAfter.data) {
        Write-Host "- $($trip.title)" -ForegroundColor Cyan
        if ($trip.image_url) {
            Write-Host "  Image: $($trip.image_url)" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "Error getting trips: $($_.Exception.Message)" -ForegroundColor Red
}

# 7. Test travels
Write-Host "`n7. Create travel with image using curl..." -ForegroundColor Yellow
try {
    $curlTravelResult = cmd /c "curl -X POST `"$baseUrl/admin/travels`" -H `"Authorization: Bearer $token`" -H `"Accept: application/json`" -F `"origin=Jakarta`" -F `"destination=Surabaya`" -F `"vehicle_type=Bus Executive Test`" -F `"price_per_person=85000`" -F `"is_active=true`" -F `"image=@$imagePath`""
    
    Write-Host "Travel Response: $curlTravelResult" -ForegroundColor Green
} catch {
    Write-Host "Error creating travel: $($_.Exception.Message)" -ForegroundColor Red
}

# 8. Get travels
Write-Host "`n8. Get all travels..." -ForegroundColor Yellow
try {
    $travels = Invoke-RestMethod -Uri "$baseUrl/travels" -Method GET
    Write-Host "Found $($travels.data.Count) travels" -ForegroundColor Green
    
    foreach ($travel in $travels.data) {
        Write-Host "- $($travel.origin) → $($travel.destination)" -ForegroundColor Cyan
        if ($travel.image_url) {
            Write-Host "  Image: $($travel.image_url)" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "Error getting travels: $($_.Exception.Message)" -ForegroundColor Red
}

# Cleanup
Write-Host "`n9. Cleanup..." -ForegroundColor Yellow
if (Test-Path $imagePath) {
    Remove-Item $imagePath
    Write-Host "Test image removed" -ForegroundColor Green
}

Write-Host "`n=== Test completed! ===" -ForegroundColor Green
Write-Host "Check your browser at: http://localhost:8000/storage/trips/ and http://localhost:8000/storage/travels/" -ForegroundColor Cyan