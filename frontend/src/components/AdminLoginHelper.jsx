import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from './ui/Button';

const AdminLoginHelper = ({ onAdminLogin }) => {
  const [showHelper, setShowHelper] = useState(false);

  const handleAdminLogin = () => {
    if (onAdminLogin) {
      onAdminLogin({
        email: 'admin@travel.com',
        password: 'password123'
      });
    }
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="mt-6">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setShowHelper(!showHelper)}
        className="w-full text-xs"
      >
        {showHelper ? 'Hide' : 'Show'} Admin Login Helper
      </Button>
      
      {showHelper && (
        <motion.div
          className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <h4 className="font-medium text-blue-800 mb-2">Admin Credentials (Development)</h4>
          <div className="text-sm text-blue-700 space-y-1 mb-3">
            <div><strong>Email:</strong> admin@travel.com</div>
            <div><strong>Password:</strong> password123</div>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={handleAdminLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Auto-fill Admin Credentials
          </Button>
          <div className="mt-2 text-xs text-blue-600">
            <a 
              href="/admin-debug" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              Open Admin Debug Panel
            </a>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminLoginHelper;