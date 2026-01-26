import React from 'react';
import AdminLayout from '../components/Layout/AdminLayout';
import AuthDebug from '../components/debug/AuthDebug';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AdminDashboardSimple = () => {
  const [authToken] = useLocalStorage('auth_token', null);
  const [userData] = useLocalStorage('user_data', null);

  return (
    <AdminLayout>
      <AuthDebug />
      <div className="space-y-6">
        {/* Simple Info Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Dashboard (Simple)</h2>
          <div className="space-y-2">
            <p><strong>User:</strong> {userData?.name || 'Unknown'}</p>
            <p><strong>Email:</strong> {userData?.email || 'Unknown'}</p>
            <p><strong>Role:</strong> {userData?.role || 'Unknown'}</p>
            <p><strong>Token:</strong> {authToken ? 'Present' : 'Missing'}</p>
          </div>
        </div>

        {/* Test Message */}
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p>If you can see this message without being logged out, the basic admin authentication is working.</p>
        </div>

        {/* Navigation Links */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Test Links</h3>
          <div className="space-y-2">
            <a href="/admin-test" className="block text-blue-600 hover:text-blue-800">
              → Go to Admin API Test Page
            </a>
            <a href="/admin" className="block text-blue-600 hover:text-blue-800">
              → Go to Full Admin Dashboard
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardSimple;