// Image Debug Utilities
export const imageDebug = {
  // Test if image URL is accessible
  testImageUrl: async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return {
        url,
        accessible: response.ok,
        status: response.status,
        statusText: response.statusText,
        contentType: response.headers.get('content-type'),
        contentLength: response.headers.get('content-length')
      };
    } catch (error) {
      return {
        url,
        accessible: false,
        error: error.message
      };
    }
  },

  // Test multiple image URLs
  testMultipleImages: async (urls) => {
    const results = await Promise.all(
      urls.map(url => imageDebug.testImageUrl(url))
    );
    return results;
  },

  // Log image loading info
  logImageInfo: (imagePath, processedUrl, context = '') => {
    console.log(`🖼️ Image Debug ${context}:`, {
      originalPath: imagePath,
      processedUrl: processedUrl,
      isFullUrl: imagePath?.startsWith('http'),
      hasStoragePrefix: imagePath?.includes('storage/'),
      baseUrl: import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:8000'
    });
  },
   
  // Create image element to test loading
  createTestImage: (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ url, loaded: true, width: img.width, height: img.height });
      img.onerror = () => resolve({ url, loaded: false, error: 'Failed to load' });
      img.src = url;
    });
  },

  // Test image loading with different URL formats
  testImageFormats: async (imagePath) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:8000';
    
    const testUrls = [
      imagePath, // Original
      `${baseUrl}/storage/${imagePath}`, // With storage prefix
      `${baseUrl}/${imagePath}`, // Direct
      `${baseUrl}/storage/${imagePath.replace('storage/', '')}`, // Clean storage prefix
    ];

    console.log('🧪 Testing image formats for:', imagePath);
    
    const results = await Promise.all(
      testUrls.map(async (url, index) => {
        const result = await imageDebug.createTestImage(url);
        console.log(`Test ${index + 1}: ${result.loaded ? '✅' : '❌'} ${url}`);
        return result;
      })
    );

    return results;
  }
};

// Auto-log environment info
if (typeof window !== 'undefined') {
  console.log('🖼️ Image Environment:', {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    baseUrl: import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:8000',
    storageUrl: (import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:8000') + '/storage'
  });
}