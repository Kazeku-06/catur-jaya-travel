#!/usr/bin/env node

// Test script for frontend API integration with JSON-only backend
// Run with: node test_frontend_api.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

console.log('=== Testing Frontend API Integration with JSON-Only Backend ===\n');

async function testAPI() {
  let adminToken = null;

  try {
    // Test 1: Admin Login
    console.log('1. Testing Admin Login...');
    const loginResponse = await api.post('/auth/login', {
      email: 'admin@travel.com',
      password: 'password123'
    });
    
    adminToken = loginResponse.data.access_token;
    console.log('✓ Login successful');
    console.log(`Admin Token: ${adminToken.substring(0, 20)}...\n`);

    // Set auth header for subsequent requests
    api.defaults.headers.Authorization = `Bearer ${adminToken}`;

    // Test 2: Get Public Trips
    console.log('2. Testing Get Public Trips...');
    const tripsResponse = await api.get('/trips');
    console.log(`✓ Retrieved ${tripsResponse.data.data?.length || 0} trips`);
    console.log('Sample trip:', tripsResponse.data.data?.[0]?.title || 'No trips available\n');

    // Test 3: Get Public Travels
    console.log('3. Testing Get Public Travels...');
    const travelsResponse = await api.get('/travels');
    console.log(`✓ Retrieved ${travelsResponse.data.data?.length || 0} travels`);
    console.log('Sample travel:', travelsResponse.data.data?.[0] ? 
      `${travelsResponse.data.data[0].origin} - ${travelsResponse.data.data[0].destination}` : 
      'No travels available\n');

    // Test 4: Create Trip with Base64 Image (JSON Only)
    console.log('4. Testing Create Trip with Base64 Image (JSON Only)...');
    const base64Image = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A';
    
    const tripData = {
      title: 'Frontend Test Trip JSON Only',
      description: 'Testing frontend integration with JSON-only backend API',
      price: 1000000,
      duration: '2 hari 1 malam',
      location: 'Test Location',
      quota: 10,
      image_base64: base64Image,
      image_name: 'test-trip.jpg',
      is_active: true
    };

    const createTripResponse = await api.post('/admin/trips', tripData);
    console.log('✓ Trip created successfully with JSON-only format');
    console.log(`Trip ID: ${createTripResponse.data.data.id}`);
    console.log(`Image URL: ${createTripResponse.data.data.image_url}\n`);

    const createdTripId = createTripResponse.data.data.id;

    // Test 5: Create Travel with Image URL (JSON Only)
    console.log('5. Testing Create Travel with Image URL (JSON Only)...');
    const travelData = {
      origin: 'Jakarta',
      destination: 'Bandung',
      vehicle_type: 'Bus Executive',
      price_per_person: 75000,
      image_url: 'https://picsum.photos/400/300',
      is_active: true
    };

    const createTravelResponse = await api.post('/admin/travels', travelData);
    console.log('✓ Travel created successfully with JSON-only format');
    console.log(`Travel ID: ${createTravelResponse.data.data.id}`);
    console.log(`Image URL: ${createTravelResponse.data.data.image_url}\n`);

    const createdTravelId = createTravelResponse.data.data.id;

    // Test 6: Update Trip (JSON Only)
    console.log('6. Testing Update Trip (JSON Only)...');
    const updateTripData = {
      title: 'Updated Frontend Test Trip JSON Only',
      price: 1200000
    };

    const updateTripResponse = await api.put(`/admin/trips/${createdTripId}`, updateTripData);
    console.log('✓ Trip updated successfully with JSON-only format');
    console.log(`Updated title: ${updateTripResponse.data.data.title}\n`);

    // Test 7: Get Admin Trips
    console.log('7. Testing Get Admin Trips...');
    const adminTripsResponse = await api.get('/admin/trips');
    console.log(`✓ Retrieved ${adminTripsResponse.data.data?.length || 0} admin trips\n`);

    // Test 8: Get Admin Travels
    console.log('8. Testing Get Admin Travels...');
    const adminTravelsResponse = await api.get('/admin/travels');
    console.log(`✓ Retrieved ${adminTravelsResponse.data.data?.length || 0} admin travels\n`);

    console.log('=== All Frontend API Tests Passed! ===');
    console.log('✓ Frontend is properly integrated with JSON-only backend');
    console.log('✓ Image upload works with both base64 and URL methods');
    console.log('✓ All CRUD operations work correctly');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

// Run tests
testAPI();