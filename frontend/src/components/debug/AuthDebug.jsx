import React, { useEffect } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const AuthDebug = () => {
  const [authToken] = useLocalStorage('auth_token', null);
  const [userData] = useLocalStorage('user_data', null);

  useEffect(() => {
    console.log('🔍 AuthDebug Component Mounted');
    console.log('Auth Token:', authToken ? `${authToken.substring(0, 20)}...` : 'None');
    console.log('User Data:', userData);
    console.log('User Role:', userData?.role);
    console.log('User Email:', userData?.email);
    
    // Check if token is expired (basic check)
    if (authToken) {
      try {
        const tokenParts = authToken.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          const now = Math.floor(Date.now() / 1000);
          console.log('Token payload:', payload);
          console.log('Token expires at:', new Date(payload.exp * 1000));
          console.log('Current time:', new Date());
          console.log('Token expired:', payload.exp < now);
        }
      } catch (e) {
        console.log('Token is not JWT format or cannot be decoded');
      }
    }
  }, [authToken, userData]);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h4 className="font-bold mb-2">Auth Debug</h4>
      <div className="space-y-1">
        <div>
          <strong>Token:</strong> {authToken ? `${authToken.substring(0, 20)}...` : 'None'}
        </div>
        <div>
          <strong>User:</strong> {userData?.name || 'None'}
        </div>
        <div>
          <strong>Role:</strong> {userData?.role || 'None'}
        </div>
        <div>
          <strong>Email:</strong> {userData?.email || 'None'}
        </div>
        <div className="mt-2 pt-2 border-t border-gray-600">
          <div className="text-xs text-gray-300">
            Check browser console for detailed logs
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthDebug;