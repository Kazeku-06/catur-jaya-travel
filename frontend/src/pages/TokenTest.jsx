import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { tokenDebug } from '../utils/tokenDebug';
import api, { endpoints } from '../config/api';

const TokenTest = () => {
  const [authToken, setAuthToken] = useLocalStorage('auth_token', null);
  const [userData, setUserData] = useLocalStorage('user_data', null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [testResults, setTestResults] = useState([]);

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

  // Test 1: Login and get fresh token
  const testLogin = async () => {
    setLoading(true);
    clearResults();
    
    try {
      addResult('Login Test', false, 'Attempting login...');
      
      const loginData = {
        email: 'admin@travel.com',
        password: 'password123'
      };
      
      const response = await api.post(endpoints.login, loginData);
      const { user, access_token } = response.data;
      
      addResult('Login Test', true, 'Login successful!', {
        user: user,
        tokenPreview: access_token.substring(0, 30) + '...',
        tokenLength: access_token.length
      });
      
      // Store token
      setAuthToken(access_token);
      setUserData(user);
      
      // Test token immediately
      await testTokenDirectly(access_token);
      
    } catch (error) {
      addResult('Login Test', false, `Login failed: ${error.message}`, error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  // Test 2: Test token directly with fetch
  const testTokenDirectly = async (token = null) => {
    const testToken = token || authToken;
    
    if (!testToken) {
      addResult('Direct Token Test', false, 'No token available');
      return;
    }
    
    addResult('Direct Token Test', false, 'Testing token with direct fetch...');
    
    try {
      const response = await fetch('http://localhost:8000/api/v1/admin/test-auth', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${testToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        addResult('Direct Token Test', true, 'Direct fetch successful!', data);
      } else {
        const errorText = await response.text();
        addResult('Direct Token Test', false, `Direct fetch failed: ${response.status}`, {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
      }
    } catch (error) {
      addResult('Direct Token Test', false, `Direct fetch error: ${error.message}`);
    }
  };

  // Test 3: Test with axios (same as admin dashboard)
  const testTokenWithAxios = async () => {
    if (!authToken) {
      addResult('Axios Token Test', false, 'No token available');
      return;
    }
    
    addResult('Axios Token Test', false, 'Testing token with axios...');
    
    try {
      const response = await api.get('/admin/trips');
      addResult('Axios Token Test', true, 'Axios request successful!', {
        tripsCount: response.data.data?.length || 0
      });
    } catch (error) {
      addResult('Axios Token Test', false, `Axios request failed: ${error.message}`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
    }
  };

  // Test 4: Compare stored token with fresh token
  const compareTokens = async () => {
    addResult('Token Comparison', false, 'Getting fresh token for comparison...');
    
    try {
      const loginData = {
        email: 'admin@travel.com',
        password: 'password123'
      };
      
      const response = await api.post(endpoints.login, loginData);
      const freshToken = response.data.access_token;
      const storedToken = authToken;
      
      const areEqual = freshToken === storedToken;
      
      addResult('Token Comparison', areEqual, areEqual ? 'Tokens match!' : 'Tokens are different!', {
        storedTokenPreview: storedToken ? storedToken.substring(0, 30) + '...' : 'None',
        freshTokenPreview: freshToken.substring(0, 30) + '...',
        storedTokenLength: storedToken ? storedToken.length : 0,
        freshTokenLength: freshToken.length,
        areEqual
      });
      
    } catch (error) {
      addResult('Token Comparison', false, `Comparison failed: ${error.message}`);
    }
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
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Token Debug Test</h1>
            
            {alert.show && (
              <Alert
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert({ show: false, type: '', message: '' })}
              />
            )}

            {/* Current Status */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Current Status</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Token:</strong> {authToken ? `${authToken.substring(0, 30)}...` : 'None'}
                </div>
                <div>
                  <strong>Token Length:</strong> {authToken ? authToken.length : 0}
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

            {/* Test Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Button
                onClick={testLogin}
                loading={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                1. Fresh Login Test
              </Button>
              
              <Button
                onClick={() => testTokenDirectly()}
                disabled={!authToken}
                className="bg-green-600 hover:bg-green-700"
              >
                2. Direct Token Test
              </Button>
              
              <Button
                onClick={testTokenWithAxios}
                disabled={!authToken}
                className="bg-purple-600 hover:bg-purple-700"
              >
                3. Axios Token Test
              </Button>
              
              <Button
                onClick={compareTokens}
                disabled={!authToken}
                className="bg-orange-600 hover:bg-orange-700"
              >
                4. Compare Tokens
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
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default TokenTest;