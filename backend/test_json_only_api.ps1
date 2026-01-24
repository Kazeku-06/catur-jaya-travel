#!/usr/bin/env pwsh

# Test script for JSON-only API endpoints
# Make sure Laravel server is running: php artisan serve

$baseUrl = "http://localhost:8000/api/v1"

Write-Host "=== Testing JSON-Only API Endpoints ===" -ForegroundColor Green

# Test 1: Login to get admin token
Write-Host "`n1. Testing Admin Login..." -ForegroundColor Yellow
$loginData = @{
    email = "admin@travel.com"
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    $adminToken = $loginResponse.access_token
    Write-Host "✓ Login successful" -ForegroundColor Green
    Write-Host "Admin Token: $($adminToken.Substring(0,20))..." -ForegroundColor Cyan
} catch {
    Write-Host "✗ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: Create Trip with Base64 Image (JSON Only)
Write-Host "`n2. Testing Create Trip with Base64 Image (JSON Only)..." -ForegroundColor Yellow
$base64Image = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A"

$tripData = @{
    title = "Test Trip JSON Only"
    description = "Testing JSON-only endpoint for trip creation"
    price = 1000000
    duration = "2 hari 1 malam"
    location = "Test Location"
    quota = 10
    image_base64 = $base64Image
    image_name = "test-trip.jpg"
    is_active = $true
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $adminToken"
    "Content-Type" = "application/json"
}

try {
    $tripResponse = Invoke-RestMethod -Uri "$baseUrl/admin/trips" -Method POST -Body $tripData -Headers $headers
    Write-Host "✓ Trip created successfully with JSON-only format" -ForegroundColor Green
    Write-Host "Trip ID: $($tripResponse.data.id)" -ForegroundColor Cyan
    Write-Host "Image URL: $($tripResponse.data.image_url)" -ForegroundColor Cyan
    $createdTripId = $tripResponse.data.id
} catch {
    Write-Host "✗ Trip creation failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Red
}

# Test 3: Create Travel with Image URL (JSON Only)
Write-Host "`n3. Testing Create Travel with Image URL (JSON Only)..." -ForegroundColor Yellow
$travelData = @{
    origin = "Jakarta"
    destination = "Bandung"
    vehicle_type = "Bus Executive"
    price_per_person = 75000
    image_url = "https://picsum.photos/400/300"
    is_active = $true
} | ConvertTo-Json

try {
    $travelResponse = Invoke-RestMethod -Uri "$baseUrl/admin/travels" -Method POST -Body $travelData -Headers $headers
    Write-Host "✓ Travel created successfully with JSON-only format" -ForegroundColor Green
    Write-Host "Travel ID: $($travelResponse.data.id)" -ForegroundColor Cyan
    Write-Host "Image URL: $($travelResponse.data.image_url)" -ForegroundColor Cyan
    $createdTravelId = $travelResponse.data.id
} catch {
    Write-Host "✗ Travel creation failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Update Trip (JSON Only)
if ($createdTripId) {
    Write-Host "`n4. Testing Update Trip (JSON Only)..." -ForegroundColor Yellow
    $updateTripData = @{
        title = "Updated Test Trip JSON Only"
        price = 1200000
    } | ConvertTo-Json

    try {
        $updateResponse = Invoke-RestMethod -Uri "$baseUrl/admin/trips/$createdTripId" -Method PUT -Body $updateTripData -Headers $headers
        Write-Host "✓ Trip updated successfully with JSON-only format" -ForegroundColor Green
    } catch {
        Write-Host "✗ Trip update failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 5: Get All Trips (Public endpoint)
Write-Host "`n5. Testing Get All Trips (Public)..." -ForegroundColor Yellow
try {
    $tripsResponse = Invoke-RestMethod -Uri "$baseUrl/trips" -Method GET
    Write-Host "✓ Retrieved $($tripsResponse.data.Count) trips" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to get trips: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Get All Travels (Public endpoint)
Write-Host "`n6. Testing Get All Travels (Public)..." -ForegroundColor Yellow
try {
    $travelsResponse = Invoke-RestMethod -Uri "$baseUrl/travels" -Method GET
    Write-Host "✓ Retrieved $($travelsResponse.data.Count) travels" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to get travels: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== JSON-Only API Test Complete ===" -ForegroundColor Green
Write-Host "All endpoints are now JSON-only format!" -ForegroundColor Cyan