# Test Modified API - Required Image for POST
# PowerShell script untuk test API yang sudah dimodifikasi

$baseUrl = "http://localhost:8000/api/v1"

Write-Host "=== Testing Modified API - Required Image for POST ===" -ForegroundColor Green

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

# 2. Create base64 image
Write-Host "`n2. Creating base64 image..." -ForegroundColor Yellow
$base64Image = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A"
Write-Host "Base64 image created" -ForegroundColor Green

# 3. Test Create Trip dengan JSON + Base64 Image (WAJIB)
Write-Host "`n3. Create trip with JSON + Base64 Image (REQUIRED)..." -ForegroundColor Yellow
try {
    $tripData = @{
        title = "Test Trip Modified API"
        description = "Trip created via modified API with required base64 image"
        price = 950000
        duration = "3 hari 2 malam"
        location = "Test Location Modified"
        quota = 15
        image_base64 = $base64Image
        image_name = "test-modified.jpg"
        is_active = $true
    }
    
    $createTripResponse = Invoke-RestMethod -Uri "$baseUrl/admin/trips" -Method POST -Headers $headers -Body ($tripData | ConvertTo-Json)
    Write-Host "✓ Trip created successfully: $($createTripResponse.data.title)" -ForegroundColor Green
    Write-Host "  Image URL: $($createTripResponse.data.image_url)" -ForegroundColor Cyan
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
        origin = "Surabaya"
        destination = "Malang"
        vehicle_type = "Bus Modified API"
        price_per_person = 65000
        image_base64 = $base64Image
        image_name = "test-modified-travel.jpg"
        is_active = $true
    }
    
    $createTravelResponse = Invoke-RestMethod -Uri "$baseUrl/admin/travels" -Method POST -Headers $headers -Body ($travelData | ConvertTo-Json)
    Write-Host "✓ Travel created successfully: $($createTravelResponse.data.origin) → $($createTravelResponse.data.destination)" -ForegroundColor Green
    Write-Host "  Image URL: $($createTravelResponse.data.image_url)" -ForegroundColor Cyan
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
    
    $failResponse = Invoke-RestMethod -Uri "$baseUrl/admin/trips" -Method POST -Headers $headers -Body ($tripDataNoImage | ConvertTo-Json)
    Write-Host "❌ ERROR: This should have failed!" -ForegroundColor Red
} catch {
    Write-Host "✓ Correctly failed: Image is required for JSON" -ForegroundColor Green
    if ($_.Exception.Response.StatusCode -eq 422) {
        Write-Host "✓ Validation error as expected (422)" -ForegroundColor Green
    }
}

# 6. Test Create Travel tanpa Image (harus ERROR)
Write-Host "`n6. Test create travel without image (should FAIL)..." -ForegroundColor Yellow
try {
    $travelDataNoImage = @{
        origin = "Jakarta"
        destination = "Bandung"
        vehicle_type = "Bus No Image"
        price_per_person = 50000
        is_active = $true
    }
    
    $failTravelResponse = Invoke-RestMethod -Uri "$baseUrl/admin/travels" -Method POST -Headers $headers -Body ($travelDataNoImage | ConvertTo-Json)
    Write-Host "❌ ERROR: This should have failed!" -ForegroundColor Red
} catch {
    Write-Host "✓ Correctly failed: Image is required for JSON" -ForegroundColor Green
    if ($_.Exception.Response.StatusCode -eq 422) {
        Write-Host "✓ Validation error as expected (422)" -ForegroundColor Green
    }
}

# 7. Test Update Trip tanpa Image (Optional - should SUCCESS)
if ($tripId) {
    Write-Host "`n7. Update trip without image (should SUCCESS)..." -ForegroundColor Yellow
    try {
        $updateData = @{
            title = "Updated Trip Modified API"
            price = 1050000
        }
        
        $updateResponse = Invoke-RestMethod -Uri "$baseUrl/admin/trips/$tripId" -Method PUT -Headers $headers -Body ($updateData | ConvertTo-Json)
        Write-Host "✓ Trip updated successfully: $($updateResponse.data.title)" -ForegroundColor Green
        Write-Host "  New Price: $($updateResponse.data.price)" -ForegroundColor Cyan
    } catch {
        Write-Host "Error updating trip: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# 8. Test Update Travel dengan Image (Optional - should SUCCESS)
if ($travelId) {
    Write-Host "`n8. Update travel with new image..." -ForegroundColor Yellow
    try {
        # Different base64 image for update
        $updateBase64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
        
        $updateTravelData = @{
            price_per_person = 75000
            vehicle_type = "Bus Super Modified API"
            image_base64 = $updateBase64Image
            image_name = "updated-travel.png"
        }
        
        $updateTravelResponse = Invoke-RestMethod -Uri "$baseUrl/admin/travels/$travelId" -Method PUT -Headers $headers -Body ($updateTravelData | ConvertTo-Json)
        Write-Host "✓ Travel updated successfully: $($updateTravelResponse.data.vehicle_type)" -ForegroundColor Green
        Write-Host "  New Image URL: $($updateTravelResponse.data.image_url)" -ForegroundColor Cyan
    } catch {
        Write-Host "Error updating travel: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# 9. Get all trips untuk melihat hasil
Write-Host "`n9. Get all trips to see results..." -ForegroundColor Yellow
try {
    $allTrips = Invoke-RestMethod -Uri "$baseUrl/trips" -Method GET
    Write-Host "Total trips: $($allTrips.data.Count)" -ForegroundColor Green
    
    foreach ($trip in $allTrips.data) {
        if ($trip.title -like "*Modified*") {
            Write-Host "- $($trip.title) | Price: $($trip.price)" -ForegroundColor Cyan
            if ($trip.image_url) {
                Write-Host "  Image: $($trip.image_url)" -ForegroundColor Gray
            }
        }
    }
} catch {
    Write-Host "Error getting trips: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Modified API Test Completed! ===" -ForegroundColor Green
Write-Host "`nKey Changes:" -ForegroundColor Cyan
Write-Host "- POST /api/v1/admin/trips now REQUIRES image (Form Data OR JSON)" -ForegroundColor Gray
Write-Host "- POST /api/v1/admin/travels now REQUIRES image (Form Data OR JSON)" -ForegroundColor Gray
Write-Host "- PUT endpoints still have optional image" -ForegroundColor Gray
Write-Host "- Same endpoints, different validation rules" -ForegroundColor Gray