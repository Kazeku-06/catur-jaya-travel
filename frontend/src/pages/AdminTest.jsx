import React, { useState, useEffect } from 'react';
import api from '../config/api';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AdminTest = () => {
  const [authToken] = useLocalStorage('auth_token', null);
  const [userData] = useLocalStorage('user_data', null);
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testAuth = async () => {
    setLoading(true);
    try {
      console.log('Testing with token:', authToken);
      const response = await api.get('/admin/test-auth');
      console.log('Test response:', response.data);
      setTestResult({ success: true, data: response.data });
    } catch (error) {
      console.error('Test error:', error);
      console.error('Error response:', error.response);
      setTestResult({ 
        success: false, 
        error: error.message,
        status: error.response?.status,
        data: error.response?.data 
      });
    } finally {
      setLoading(false);
    }
  };

  const testTrips = async () => {
    setLoading(true);
    try {
      console.log('Testing trips endpoint with token:', authToken);
      const response = await api.get('/admin/trips');
      console.log('Trips response:', response.data);
      setTestResult({ success: true, data: response.data, endpoint: 'trips' });
    } catch (error) {
      console.error('Trips error:', error);
      console.error('Error response:', error.response);
      setTestResult({ 
        success: false, 
        error: error.message,
        status: error.response?.status,
        data: error.response?.data,
        endpoint: 'trips'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Admin API Test</h1>
        
        {/* Auth Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Info</h2>
          <div className="space-y-2">
            <div><strong>Token:</strong> {authToken ? `${authToken.substring(0, 30)}...` : 'None'}</div>
            <div><strong>User:</strong> {userData?.name || 'None'}</div>
            <div><strong>Role:</strong> {userData?.role || 'None'}</div>
            <div><strong>Email:</strong> {userData?.email || 'None'}</div>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">API Tests</h2>
          <div className="space-x-4">
            <button
              onClick={testAuth}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Admin Auth'}
            </button>
            <button
              onClick={testTrips}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Admin Trips'}
            </button>
          </div>
        </div>

        {/* Test Results */}
        {testResult && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <div className={`p-4 rounded ${testResult.success ? 'bg-green-100' : 'bg-red-100'}`}>
              <div className="mb-2">
                <strong>Status:</strong> {testResult.success ? 'SUCCESS' : 'FAILED'}
              </div>
              {testResult.endpoint && (
                <div className="mb-2">
                  <strong>Endpoint:</strong> {testResult.endpoint}
                </div>
              )}
              {testResult.status && (
                <div className="mb-2">
                  <strong>HTTP Status:</strong> {testResult.status}
                </div>
              )}
              {testResult.error && (
                <div className="mb-2">
                  <strong>Error:</strong> {testResult.error}
                </div>
              )}
              <div className="mb-2">
                <strong>Response:</strong>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto">
                  {JSON.stringify(testResult.data, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTest;