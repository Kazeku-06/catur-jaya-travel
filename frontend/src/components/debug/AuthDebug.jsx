import React from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const AuthDebug = () => {
  const [authToken] = useLocalStorage('auth_token', null);
  const [userData] = useLocalStorage('user_data', null);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-xs max-w-sm">
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
      </div>
    </div>
  );
};

export default AuthDebug;