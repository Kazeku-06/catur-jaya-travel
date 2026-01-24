# Test JSON API with Base64 Image
# PowerShell script untuk test JSON API dengan base64 image

$baseUrl = "http://localhost:8000/api/v1"

Write-Host "=== Testing JSON API with Base64 Image ===" -ForegroundColor Green

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
    "Content-Type" = "application/json"
    "Accept" = "application/json"
}

# 2. Create sample base64 image (1x1 pixel JPEG)
Write-Host "`n2. Creating base64 image..." -ForegroundColor Yellow
$base64Image = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A"
Write-Host "Base64 image created (1x1 pixel JPEG)" -ForegroundColor Green

# 3. Test Create Trip dengan JSON + Base64 Image (WAJIB)
Write-Host "`n3. Create trip with JSON + Base64 Image (REQUIRED)..." -ForegroundColor Yellow
try {
    $tripData = @{
        title = "Test Trip JSON Base64"
        description = "Trip created via JSON with required base64 image"
        price = 850000
        duration = "3 hari 2 malam"
        location = "Test Location JSON"
        quota = 12
        image_base64 = $base64Image
        image_name = "test-trip.jpg"
        is_active = $true
    }
    
    $createTripResponse = Invoke-RestMethod -Uri "$baseUrl/admin/trips-json" -Method POST -Headers $headers -Body ($tripData | ConvertTo-Json)
    Write-Host "Trip created successfully: $($createTripResponse.data.title)" -ForegroundColor Green
    Write-Host "Image URL: $($createTripResponse.data.image_url)" -ForegroundColor Cyan
    $tripId = $createTripResponse.data.id
} catch {
    Write-Host "Error creating trip: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorResponse = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorResponse)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error details: $errorBody" -ForegroundColor Red
    }
}

# 4. Test Create Travel dengan JSON + Base64 Image (WAJIB)
Write-Host "`n4. Create travel with JSON + Base64 Image (REQUIRED)..." -ForegroundColor Yellow
try {
    $travelData = @{
        origin = "Jakarta"
        destination = "Yogyakarta"
        vehicle_type = "Bus Executive JSON"
        price_per_person = 95000
        image_base64 = $base64Image
        image_name = "test-travel.jpg"
        is_active = $true
    }
    
    $createTravelResponse = Invoke-RestMethod -Uri "$baseUrl/admin/travels-json" -Method POST -Headers $headers -Body ($travelData | ConvertTo-Json)
    Write-Host "Travel created successfully: $($createTravelResponse.data.origin) → $($createTravelResponse.data.destination)" -ForegroundColor Green
    Write-Host "Image URL: $($createTravelResponse.data.image_url)" -ForegroundColor Cyan
    $travelId = $createTravelResponse.data.id
} catch {
    Write-Host "Error creating travel: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorResponse = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorResponse)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error details: $errorBody" -ForegroundColor Red
    }
}

# 5. Test Create Trip tanpa Image (harus ERROR)
Write-Host "`n5. Test create trip without image (should FAIL)..." -ForegroundColor Yellow
try {
    $tripDataNoImage = @{
        title = "Test Trip No Image"
        description = "This should fail because image is required"
        price = 500000
        duration = "2 hari 1 malam"
        location = "Test Location"
        quota = 10
        is_active = $true
    }
    
    $failResponse = Invoke-RestMethod -Uri "$baseUrl/admin/trips-json" -Method POST -Headers $headers -Body ($tripDataNoImage | ConvertTo-Json)
    Write-Host "ERROR: This should have failed!" -ForegroundColor Red
} catch {
    Write-Host "✓ Correctly failed: Image is required" -ForegroundColor Green
    if ($_.Exception.Response.StatusCode -eq 422) {
        Write-Host "✓ Validation error as expected (422)" -ForegroundColor Green
    }
}

# 6. Test Update Trip dengan Image (Optional)
if ($tripId) {
    Write-Host "`n6. Update trip with new image..." -ForegroundColor Yellow
    try {
        # Create different base64 image for update
        $updateBase64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
        
        $updateData = @{
            title = "Updated Trip JSON"
            price = 950000
            image_base64 = $updateBase64Image
            image_name = "updated-trip.png"
        }
        
        $updateResponse = Invoke-RestMethod -Uri "$baseUrl/admin/trips-json/$tripId" -Method PUT -Headers $headers -Body ($updateData | ConvertTo-Json)
        Write-Host "Trip updated successfully: $($updateResponse.data.title)" -ForegroundColor Green
        Write-Host "New Image URL: $($updateResponse.data.image_url)" -ForegroundColor Cyan
    } catch {
        Write-Host "Error updating trip: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# 7. Test Update Travel tanpa Image (Optional)
if ($travelId) {
    Write-Host "`n7. Update travel without image..." -ForegroundColor Yellow
    try {
        $updateTravelData = @{
            price_per_person = 105000
            vehicle_type = "Bus Super Executive JSON"
        }
        
        $updateTravelResponse = Invoke-RestMethod -Uri "$baseUrl/admin/travels-json/$travelId" -Method PUT -Headers $headers -Body ($updateTravelData | ConvertTo-Json)
        Write-Host "Travel updated successfully: $($updateTravelResponse.data.vehicle_type)" -ForegroundColor Green
        Write-Host "Price: $($updateTravelResponse.data.price_per_person)" -ForegroundColor Cyan
    } catch {
        Write-Host "Error updating travel: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# 8. Test dengan Invalid Base64 Format
Write-Host "`n8. Test with invalid base64 format (should FAIL)..." -ForegroundColor Yellow
try {
    $invalidData = @{
        title = "Test Invalid Image"
        description = "This should fail because of invalid base64"
        price = 500000
        duration = "2 hari 1 malam"
        location = "Test Location"
        quota = 10
        image_base64 = "invalid-base64-string"
        image_name = "test.jpg"
        is_active = $true
    }
    
    $invalidResponse = Invoke-RestMethod -Uri "$baseUrl/admin/trips-json" -Method POST -Headers $headers -Body ($invalidData | ConvertTo-Json)
    Write-Host "ERROR: This should have failed!" -ForegroundColor Red
} catch {
    Write-Host "✓ Correctly failed: Invalid base64 format" -ForegroundColor Green
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "✓ Bad request error as expected (400)" -ForegroundColor Green
    }
}

# 9. Get all trips untuk melihat hasil
Write-Host "`n9. Get all trips to see results..." -ForegroundColor Yellow
try {
    $allTrips = Invoke-RestMethod -Uri "$baseUrl/trips" -Method GET
    Write-Host "Total trips: $($allTrips.data.Count)" -ForegroundColor Green
    
    foreach ($trip in $allTrips.data) {
        if ($trip.title -like "*JSON*") {
            Write-Host "- $($trip.title) | Price: $($trip.price)" -ForegroundColor Cyan
            if ($trip.image_url) {
                Write-Host "  Image: $($trip.image_url)" -ForegroundColor Gray
            }
        }
    }
} catch {
    Write-Host "Error getting trips: $($_.Exception.Message)" -ForegroundColor Red
}

# 10. Get all travels untuk melihat hasil
Write-Host "`n10. Get all travels to see results..." -ForegroundColor Yellow
try {
    $allTravels = Invoke-RestMethod -Uri "$baseUrl/travels" -Method GET
    Write-Host "Total travels: $($allTravels.data.Count)" -ForegroundColor Green
    
    foreach ($travel in $allTravels.data) {
        if ($travel.vehicle_type -like "*JSON*") {
            Write-Host "- $($travel.origin) → $($travel.destination) | $($travel.vehicle_type)" -ForegroundColor Cyan
            if ($travel.image_url) {
                Write-Host "  Image: $($travel.image_url)" -ForegroundColor Gray
            }
        }
    }
} catch {
    Write-Host "Error getting travels: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== JSON API Test Completed! ===" -ForegroundColor Green
Write-Host "`nNew Endpoints:" -ForegroundColor Cyan
Write-Host "- POST /api/v1/admin/trips-json (JSON + Required Base64 Image)" -ForegroundColor Gray
Write-Host "- PUT /api/v1/admin/trips-json/{id} (JSON + Optional Base64 Image)" -ForegroundColor Gray
Write-Host "- POST /api/v1/admin/travels-json (JSON + Required Base64 Image)" -ForegroundColor Gray
Write-Host "- PUT /api/v1/admin/travels-json/{id} (JSON + Optional Base64 Image)" -ForegroundColor Gray