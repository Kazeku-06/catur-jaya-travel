import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { useLocalStorage } from '../hooks/useLocalStorage';
import api, { endpoints } from '../config/api';

const AdminDebug = () => {
  const [authToken, setAuthToken] = useLocalStorage('auth_token', null);
  const [userData, setUserData] = useLocalStorage('user_data', null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [testResults, setTestResults] = useState([]);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  const addTestResult = (test, success, message, data = null) => {
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

  const testAdminLogin = async () => {
    setLoading(true);
    clearResults();
    
    try {
      // Test login with correct admin email
      const loginData = {
        email: 'admin@travel.com',
        password: 'password123'
      };
      
      addTestResult('Admin Login', false, 'Attempting login with admin@travel.com...');
      
      const response = await api.post(endpoints.login, loginData);
      const { user, access_token } = response.data;
      
      addTestResult('Admin Login', true, 'Login successful!', {
        user: user,
        tokenPreview: access_token.substring(0, 20) + '...'
      });
      
      // Store credentials
      setAuthToken(access_token);
      setUserData(user);
      
      // Test admin endpoint
      addTestResult('Admin Auth Test', false, 'Testing admin authentication...');
      
      const headers = {
        'Authorization': `Bearer ${access_token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      
      try {
        const adminResponse = await fetch('http://localhost:8000/api/v1/admin/test-auth', {
          method: 'GET',
          headers: headers
        });
        
        if (adminResponse.ok) {
          const adminData = await adminResponse.json();
          addTestResult('Admin Auth Test', true, 'Admin authentication successful!', adminData);
        } else {
          const errorData = await adminResponse.text();
          addTestResult('Admin Auth Test', false, `Admin auth failed: ${adminResponse.status}`, errorData);
        }
      } catch (adminError) {
        addTestResult('Admin Auth Test', false, `Admin auth error: ${adminError.message}`);
      }
      
      // Test admin trips endpoint
      addTestResult('Admin Trips Test', false, 'Testing admin trips endpoint...');
      
      try {
        const tripsResponse = await fetch('http://localhost:8000/api/v1/admin/trips', {
          method: 'GET',
          headers: headers
        });
        
        if (tripsResponse.ok) {
          const tripsData = await tripsResponse.json();
          addTestResult('Admin Trips Test', true, 'Admin trips endpoint successful!', {
            count: tripsData.data?.length || 0
          });
        } else {
          const errorData = await tripsResponse.text();
          addTestResult('Admin Trips Test', false, `Admin trips failed: ${tripsResponse.status}`, errorData);
        }
      } catch (tripsError) {
        addTestResult('Admin Trips Test', false, `Admin trips error: ${tripsError.message}`);
      }
      
      showAlert('success', 'Admin login test completed! Check results below.');
      
    } catch (error) {
      addTestResult('Admin Login', false, `Login failed: ${error.message}`, error.response?.data);
      showAlert('error', 'Admin login test failed!');
    } finally {
      setLoading(false);
    }
  };

  const clearAuth = () => {
    setAuthToken(null);
    setUserData(null);
    showAlert('info', 'Authentication data cleared');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="bg-white rounded-lg shadow-lg p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Debug Panel</h1>
            
            {alert.show && (
              <Alert
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert({ show: false, type: '', message: '' })}
              />
            )}

            {/* Current Auth Status */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Current Authentication Status</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Token:</strong> {authToken ? `${authToken.substring(0, 20)}...` : 'None'}
                </div>
                <div>
                  <strong>User:</strong> {userData?.name || 'None'}
                </div>
                <div>
                  <strong>Email:</strong> {userData?.email || 'None'}
                </div>
                <div>
                  <strong>Role:</strong> {userData?.role || 'None'}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 mb-8">
              <Button
                onClick={testAdminLogin}
                loading={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Test Admin Login
              </Button>
              
              <Button
                onClick={clearAuth}
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                Clear Auth Data
              </Button>
              
              <Button
                onClick={clearResults}
                variant="outline"
              >
                Clear Results
              </Button>
            </div>

            {/* Test Results */}
            {testResults.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Test Results</h2>
                {testResults.map((result, index) => (
                  <motion.div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      result.success 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-medium ${
                        result.success ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {result.success ? '✅' : '❌'} {result.test}
                      </h3>
                      <span className="text-xs text-gray-500">{result.timestamp}</span>
                    </div>
                    <p className={`text-sm ${
                      result.success ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {result.message}
                    </p>
                    {result.data && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-xs text-gray-600">
                          Show Details
                        </summary>
                        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Instructions */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Instructions</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Click "Test Admin Login" to test login with admin@travel.com</li>
                <li>• This will test login, admin auth, and admin endpoints</li>
                <li>• Check the results to see where the authentication is failing</li>
                <li>• Use "Clear Auth Data" to reset authentication state</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDebug;