import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import api, { endpoints } from '../config/api';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';

const Debug = () => {
  const [authToken] = useLocalStorage('auth_token', null);
  const [userData] = useLocalStorage('user_data', null);
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const runTest = async (testName, testFunction) => {
    setLoading(true);
    try {
      const result = await testFunction();
      setTestResults(prev => ({
        ...prev,
        [testName]: { success: true, data: result }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [testName]: { success: false, error: error.message, response: error.response?.data }
      }));
    }
    setLoading(false);
  };

  const testAuth = async () => {
    const response = await api.get(endpoints.testAuth);
    return response.data;
  };

  const testCreateTransaction = async () => {
    // Get first trip
    const tripsResponse = await api.get(endpoints.trips);
    const firstTrip = tripsResponse.data.data[0];
    
    if (!firstTrip) {
      throw new Error('No trips available for testing');
    }

    const response = await api.post(endpoints.createTripTransaction(firstTrip.id), {
      participants: 2,
      departure_date: '2026-02-15',
      special_requests: 'Test booking',
      contact_phone: '+6281234567890',
      emergency_contact: 'Test Emergency - +6281234567891'
    });
    return response.data;
  };

  const testGetBookings = async () => {
    const response = await api.get(endpoints.userBookings);
    return response.data;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug Page</h1>
        
        {/* Auth Status */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Authentication Status</h2>
          <div className="space-y-2">
            <p><strong>Token:</strong> {authToken ? 'Present' : 'Missing'}</p>
            <p><strong>User:</strong> {userData ? JSON.stringify(userData, null, 2) : 'No user data'}</p>
            <p><strong>Token Preview:</strong> {authToken ? `${authToken.substring(0, 20)}...` : 'N/A'}</p>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">API Tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => runTest('auth', testAuth)}
              disabled={loading || !authToken}
              variant="primary"
            >
              Test Auth
            </Button>
            <Button
              onClick={() => runTest('transaction', testCreateTransaction)}
              disabled={loading || !authToken}
              variant="secondary"
            >
              Test Create Transaction
            </Button>
            <Button
              onClick={() => runTest('bookings', testGetBookings)}
              disabled={loading || !authToken}
              variant="outline"
            >
              Test Get Bookings
            </Button>
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Results</h2>
          {Object.keys(testResults).length === 0 ? (
            <p className="text-gray-600">No tests run yet</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(testResults).map(([testName, result]) => (
                <div key={testName} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2 flex items-center">
                    {testName}
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {result.success ? 'SUCCESS' : 'FAILED'}
                    </span>
                  </h3>
                  <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                    {JSON.stringify(result.success ? result.data : result, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Debug;