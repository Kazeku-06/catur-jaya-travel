import React, { useState } from 'react';
import api from '../config/api';
import { logout } from '../utils/auth';

const LoginDebug = () => {
  const [email, setEmail] = useState('atta@example.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Attempting login with:', { email, password });
      
      const response = await api.post('/auth/login', {
        email,
        password
      });
      
      console.log('Login response:', response.data);
      
      if (response.data.access_token && response.data.user) {
        // Store token and user data
        localStorage.setItem('auth_token', response.data.access_token);
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
        
        console.log('Token stored:', response.data.access_token.substring(0, 20) + '...');
        console.log('User data stored:', response.data.user);
        
        setResult({
          success: true,
          message: 'Login successful!',
          token: response.data.access_token,
          user: response.data.user
        });
      } else {
        setResult({
          success: false,
          message: 'Invalid response format',
          data: response.data
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setResult({
        success: false,
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
    } finally {
      setLoading(false);
    }
  };

  const testStoredToken = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setResult({
        success: false,
        message: 'No token found in localStorage'
      });
      return;
    }

    try {
      console.log('Testing stored token:', token.substring(0, 20) + '...');
      
      const response = await api.get('/admin/test-auth');
      console.log('Token test response:', response.data);
      
      setResult({
        success: true,
        message: 'Token is valid!',
        data: response.data
      });
    } catch (error) {
      console.error('Token test error:', error);
      setResult({
        success: false,
        message: 'Token test failed: ' + error.message,
        status: error.response?.status,
        data: error.response?.data
      });
    }
  };

  const clearStorage = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setResult({
      success: true,
      message: 'Storage cleared'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Login Debug</h1>
        
        {/* Current Storage Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Storage</h2>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Token:</strong> {localStorage.getItem('auth_token') ? 
                localStorage.getItem('auth_token').substring(0, 30) + '...' : 'None'}
            </div>
            <div>
              <strong>User Data:</strong> {localStorage.getItem('user_data') || 'None'}
            </div>
          </div>
          
          {/* Token Status Check */}
          <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ Token Issue Detected:</strong> Your current token is invalid or expired. 
              Please logout and login again to get a fresh token.
            </p>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Login Test</h2>
          
          {/* Available Admin Accounts */}
          <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Available Admin Accounts:</strong>
            </p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Email: <code>atta@example.com</code> | Password: <code>password</code></li>
              <li>• Email: <code>admin@travel.com</code> | Password: <code>password123</code></li>
            </ul>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>

        {/* Test Buttons */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Tests</h2>
          <div className="space-x-4">
            <button
              onClick={testStoredToken}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Test Stored Token
            </button>
            <button
              onClick={clearStorage}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Clear Storage
            </button>
            <button
              onClick={() => {
                console.log('Manual logout clicked');
                logout();
              }}
              className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
            >
              Manual Logout
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Result</h2>
            <div className={`p-4 rounded ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
              <div className="mb-2">
                <strong>Status:</strong> {result.success ? 'SUCCESS' : 'FAILED'}
              </div>
              <div className="mb-2">
                <strong>Message:</strong> {result.message}
              </div>
              {result.status && (
                <div className="mb-2">
                  <strong>HTTP Status:</strong> {result.status}
                </div>
              )}
              {result.token && (
                <div className="mb-2">
                  <strong>Token:</strong> {result.token.substring(0, 30)}...
                </div>
              )}
              {result.user && (
                <div className="mb-2">
                  <strong>User:</strong> {result.user.name} ({result.user.role})
                </div>
              )}
              {result.data && (
                <div className="mb-2">
                  <strong>Data:</strong>
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginDebug;