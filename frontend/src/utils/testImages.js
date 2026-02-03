/**
 * Image loading test utility
 * Use this to verify image loading works correctly across the application
 */

import { getImageUrl } from './helpers.js';

export const testImageLoading = () => {
  console.log('=== Image Loading Test ===');
  
  const testImages = [
    // Placeholder images
    '/images/placeholder.jpg',
    '/images/trip-placeholder.jpg',
    '/images/travel-placeholder.jpg',
    
    // Logo images
    '/logo_1.jpg-removebg-preview.png',
    '/logo 1.jpg.jpeg',
    
    // Test backend image paths
    'storage/trips/sample-trip.jpg',
    '/storage/travels/sample-travel.jpg',
    'trips/sample-image.jpg'
  ];
  
  const testResults = [];
  let completedTests = 0;
  
  testImages.forEach((imagePath, index) => {
    const img = new Image();
    const processedUrl = getImageUrl(imagePath);
    
    console.log(`Testing image ${index + 1}: ${imagePath}`);
    console.log(`Processed URL: ${processedUrl}`);
    
    img.onload = () => {
      console.log(`✅ Image ${index + 1} loaded successfully`);
      testResults.push({ 
        original: imagePath, 
        processed: processedUrl, 
        status: 'success' 
      });
      
      completedTests++;
      if (completedTests === testImages.length) {
        printTestSummary(testResults);
      }
    };
    
    img.onerror = () => {
      console.log(`❌ Image ${index + 1} failed to load`);
      testResults.push({ 
        original: imagePath, 
        processed: processedUrl, 
        status: 'failed' 
      });
      
      completedTests++;
      if (completedTests === testImages.length) {
        printTestSummary(testResults);
      }
    };
    
    img.src = processedUrl;
  });
  
  return testResults;
};

const printTestSummary = (results) => {
  console.log('\n=== Test Summary ===');
  
  const successful = results.filter(r => r.status === 'success');
  const failed = results.filter(r => r.status === 'failed');
  
  console.log(`✅ Successful: ${successful.length}`);
  console.log(`❌ Failed: ${failed.length}`);
  
  if (failed.length > 0) {
    console.log('\nFailed images:');
    failed.forEach((result, i) => {
      console.log(`${i + 1}. ${result.original} → ${result.processed}`);
    });
  }
  
  if (successful.length > 0) {
    console.log('\nSuccessful images:');
    successful.forEach((result, i) => {
      console.log(`${i + 1}. ${result.original} → ${result.processed}`);
    });
  }
};

// Test getImageUrl function with various inputs
export const testGetImageUrl = () => {
  console.log('=== getImageUrl Function Test ===');
  
  const testCases = [
    { input: null, expected: '/images/placeholder.jpg' },
    { input: '', expected: '/images/placeholder.jpg' },
    { input: 'https://example.com/image.jpg', expected: 'https://example.com/image.jpg' },
    { input: 'storage/trips/image.jpg', expected: 'http://localhost:8000/storage/trips/image.jpg' },
    { input: '/storage/trips/image.jpg', expected: 'http://localhost:8000/storage/trips/image.jpg' },
    { input: '/trips/image.jpg', expected: 'http://localhost:8000/storage/trips/image.jpg' },
    { input: 'trips/image.jpg', expected: 'http://localhost:8000/storage/trips/image.jpg' }
  ];
  
  testCases.forEach((testCase, index) => {
    const result = getImageUrl(testCase.input);
    const passed = result.includes(testCase.expected.split('://')[1] || testCase.expected);
    
    console.log(`Test ${index + 1}: ${passed ? '✅' : '❌'}`);
    console.log(`  Input: ${testCase.input}`);
    console.log(`  Expected: ${testCase.expected}`);
    console.log(`  Got: ${result}`);
    console.log('');
  });
};

// Test card image loading specifically
export const testCardImages = () => {
  console.log('=== Card Image Loading Test ===');
  
  // Simulate trip and travel data
  const sampleTrip = {
    id: 1,
    title: 'Sample Trip',
    image_url: 'storage/trips/sample-trip.jpg'
  };
  
  const sampleTravel = {
    id: 1,
    origin: 'Jakarta',
    destination: 'Bandung',
    image_url: 'storage/travels/sample-travel.jpg'
  };
  
  console.log('Trip image URL:', getImageUrl(sampleTrip.image_url));
  console.log('Travel image URL:', getImageUrl(sampleTravel.image_url));
  
  // Test fallback scenarios
  console.log('Trip fallback URL:', getImageUrl(null, '/images/trip-placeholder.jpg'));
  console.log('Travel fallback URL:', getImageUrl(null, '/images/travel-placeholder.jpg'));
};

// Export for browser console use
if (typeof window !== 'undefined') {
  window.testImageLoading = testImageLoading;
  window.testGetImageUrl = testGetImageUrl;
  window.testCardImages = testCardImages;
}