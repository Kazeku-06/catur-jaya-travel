/**
 * Logo loading test utility
 * Use this to verify logo loading works correctly across all pages
 */

export const testLogoLoading = () => {
  console.log('=== Logo Loading Test ===');
  
  const logoFiles = [
    '/logo_1.jpg-removebg-preview.png',
    '/logo 1.jpg.jpeg'
  ];
  
  const testResults = [];
  
  logoFiles.forEach((logoPath, index) => {
    const img = new Image();
    
    img.onload = () => {
      console.log(`✅ Logo ${index + 1} loaded successfully: ${logoPath}`);
      testResults.push({ path: logoPath, status: 'success' });
      
      if (testResults.length === logoFiles.length) {
        console.log('\n=== Test Summary ===');
        testResults.forEach((result, i) => {
          console.log(`Logo ${i + 1}: ${result.status} - ${result.path}`);
        });
      }
    };
    
    img.onerror = () => {
      console.log(`❌ Logo ${index + 1} failed to load: ${logoPath}`);
      testResults.push({ path: logoPath, status: 'failed' });
      
      if (testResults.length === logoFiles.length) {
        console.log('\n=== Test Summary ===');
        testResults.forEach((result, i) => {
          console.log(`Logo ${i + 1}: ${result.status} - ${result.path}`);
        });
      }
    };
    
    img.src = logoPath;
  });
  
  return testResults;
};

// Test logo component fallback system
export const testLogoFallback = () => {
  console.log('=== Logo Fallback Test ===');
  
  // Test with non-existent image
  const img = new Image();
  
  img.onerror = () => {
    console.log('✅ Error handling works - fallback system will activate');
    
    // Test fallback image
    const fallbackImg = new Image();
    fallbackImg.onload = () => {
      console.log('✅ Fallback image loaded successfully');
    };
    fallbackImg.onerror = () => {
      console.log('⚠️ Fallback image also failed - text logo will be used');
    };
    fallbackImg.src = '/logo 1.jpg.jpeg';
  };
  
  img.src = '/non-existent-logo.png';
};

// Export for browser console use
if (typeof window !== 'undefined') {
  window.testLogoLoading = testLogoLoading;
  window.testLogoFallback = testLogoFallback;
}