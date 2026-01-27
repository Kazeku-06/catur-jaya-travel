import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import Image from '../components/ui/Image';
import { getImageUrl } from '../utils/helpers';
import { imageDebug } from '../utils/imageDebug';

const ImageTest = () => {
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  const addResult = (test, success, message, data = null) => {
    setTestResults(prev => [...prev, {
      test,
      success,
      message,
      data,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  // Test different image path formats
  const testImagePaths = async () => {
    setLoading(true);
    clearResults();

    const testPaths = [
      'trips/test-image.jpg',
      'storage/trips/test-image.jpg',
      '/storage/trips/test-image.jpg',
      'http://localhost:8000/storage/trips/test-image.jpg',
      'https://via.placeholder.com/150x150.jpg?text=Test',
      'invalid-path.jpg',
      null,
      ''
    ];

    addResult('Image Path Tests', false, 'Testing different image path formats...');

    for (const path of testPaths) {
      const processedUrl = getImageUrl(path);
      addResult(
        `Path: ${path || 'null/empty'}`,
        true,
        `Processed to: ${processedUrl}`,
        { originalPath: path, processedUrl }
      );

      // Test accessibility
      try {
        const accessTest = await imageDebug.testImageUrl(processedUrl);
        addResult(
          `Access Test: ${path || 'null/empty'}`,
          accessTest.accessible,
          accessTest.accessible ? 'Image accessible' : `Failed: ${accessTest.status || accessTest.error}`,
          accessTest
        );
      } catch (error) {
        addResult(
          `Access Test: ${path || 'null/empty'}`,
          false,
          `Error: ${error.message}`
        );
      }
    }

    setLoading(false);
    showAlert('info', 'Image path tests completed');
  };

  // Test storage link
  const testStorageLink = async () => {
    addResult('Storage Link Test', false, 'Testing storage symbolic link...');

    const storageTestUrl = 'http://localhost:8000/storage/test.txt';
    
    try {
      const response = await fetch(storageTestUrl, { method: 'HEAD' });
      addResult(
        'Storage Link Test',
        response.status !== 404,
        response.status === 404 ? 'Storage link not working (404)' : `Storage accessible (${response.status})`,
        { status: response.status, statusText: response.statusText }
      );
    } catch (error) {
      addResult(
        'Storage Link Test',
        false,
        `Storage link error: ${error.message}`
      );
    }
  };

  // Test placeholder images
  const testPlaceholders = async () => {
    addResult('Placeholder Test', false, 'Testing placeholder images...');

    const placeholders = [
      '/images/placeholder.jpg',
      '/images/trip-placeholder.jpg',
      '/images/travel-placeholder.jpg'
    ];

    for (const placeholder of placeholders) {
      try {
        const result = await imageDebug.createTestImage(placeholder);
        addResult(
          `Placeholder: ${placeholder}`,
          result.loaded,
          result.loaded ? `Loaded (${result.width}x${result.height})` : 'Failed to load',
          result
        );
      } catch (error) {
        addResult(
          `Placeholder: ${placeholder}`,
          false,
          `Error: ${error.message}`
        );
      }
    }
  };

  // Run all tests
  const runAllTests = async () => {
    setLoading(true);
    clearResults();
    
    await testImagePaths();
    await testStorageLink();
    await testPlaceholders();
    
    setLoading(false);
    showAlert('success', 'All tests completed');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="bg-white rounded-lg shadow-lg p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Image Loading Test</h1>
            
            {alert.show && (
              <Alert
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert({ show: false, type: '', message: '' })}
              />
            )}

            {/* Environment Info */}
            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Environment Info</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>VITE_API_BASE_URL:</strong> {import.meta.env.VITE_API_BASE_URL || 'Not set'}
                </div>
                <div>
                  <strong>Base URL:</strong> {import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:8000'}
                </div>
                <div>
                  <strong>Storage URL:</strong> {(import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:8000') + '/storage'}
                </div>
                <div>
                  <strong>NODE_ENV:</strong> {import.meta.env.NODE_ENV}
                </div>
              </div>
            </div>

            {/* Test Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Button
                onClick={runAllTests}
                loading={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Run All Tests
              </Button>
              
              <Button
                onClick={testImagePaths}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                Test Image Paths
              </Button>
              
              <Button
                onClick={testStorageLink}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Test Storage Link
              </Button>
              
              <Button
                onClick={testPlaceholders}
                disabled={loading}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Test Placeholders
              </Button>
              
              <Button
                onClick={clearResults}
                variant="outline"
              >
                Clear Results
              </Button>
            </div>

            {/* Visual Image Tests */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Visual Image Tests</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm mb-2">Placeholder</p>
                  <Image
                    src="/images/placeholder.jpg"
                    alt="Placeholder"
                    className="w-24 h-24 mx-auto"
                    debug={true}
                  />
                </div>
                
                <div className="text-center">
                  <p className="text-sm mb-2">Trip Placeholder</p>
                  <Image
                    src="/images/trip-placeholder.jpg"
                    alt="Trip Placeholder"
                    className="w-24 h-24 mx-auto"
                    debug={true}
                  />
                </div>
                
                <div className="text-center">
                  <p className="text-sm mb-2">Travel Placeholder</p>
                  <Image
                    src="/images/travel-placeholder.jpg"
                    alt="Travel Placeholder"
                    className="w-24 h-24 mx-auto"
                    debug={true}
                  />
                </div>
                
                <div className="text-center">
                  <p className="text-sm mb-2">External Image</p>
                  <Image
                    src="https://via.placeholder.com/150x150.jpg?text=External"
                    alt="External"
                    className="w-24 h-24 mx-auto"
                    debug={true}
                  />
                </div>
                
                <div className="text-center">
                  <p className="text-sm mb-2">Storage Path</p>
                  <Image
                    src="trips/test-image.jpg"
                    alt="Storage Test"
                    className="w-24 h-24 mx-auto"
                    debug={true}
                  />
                </div>
                
                <div className="text-center">
                  <p className="text-sm mb-2">Invalid Path</p>
                  <Image
                    src="invalid/path.jpg"
                    alt="Invalid"
                    className="w-24 h-24 mx-auto"
                    debug={true}
                  />
                </div>
                
                <div className="text-center">
                  <p className="text-sm mb-2">Null Path</p>
                  <Image
                    src={null}
                    alt="Null"
                    className="w-24 h-24 mx-auto"
                    debug={true}
                  />
                </div>
                
                <div className="text-center">
                  <p className="text-sm mb-2">Empty Path</p>
                  <Image
                    src=""
                    alt="Empty"
                    className="w-24 h-24 mx-auto"
                    debug={true}
                  />
                </div>
              </div>
            </div>

            {/* Test Results */}
            {testResults.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Test Results</h2>
                <div className="max-h-96 overflow-y-auto">
                  {testResults.map((result, index) => (
                    <motion.div
                      key={index}
                      className={`p-3 rounded border text-sm ${
                        result.success 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-red-50 border-red-200'
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-medium ${
                          result.success ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {result.success ? '✅' : '❌'} {result.test}
                        </h3>
                        <span className="text-xs text-gray-500">{result.timestamp}</span>
                      </div>
                      <p className={`${
                        result.success ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {result.message}
                      </p>
                      {result.data && (
                        <details className="mt-1">
                          <summary className="cursor-pointer text-xs text-gray-600">
                            Show Details
                          </summary>
                          <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-auto">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-medium text-yellow-800 mb-2">Instructions</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Make sure backend server is running on http://localhost:8000</li>
                <li>• Check if storage symbolic link exists: <code>php artisan storage:link</code></li>
                <li>• Verify placeholder images exist in frontend/public/images/</li>
                <li>• Check browser console for detailed image loading logs</li>
                <li>• Red debug badges indicate failed image loads</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default ImageTest;