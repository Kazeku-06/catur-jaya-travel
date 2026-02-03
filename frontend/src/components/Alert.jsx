import React from 'react';
import { motion } from 'framer-motion';

const Alert = ({ children, variant = 'error' }) => {
  // Pengaturan warna berdasarkan tipe (error atau success)
  const isError = variant === 'error';
  
  const bgColor = isError ? 'bg-red-50' : 'bg-green-50';
  const textColor = isError ? 'text-red-800' : 'text-green-800';
  const borderColor = isError ? 'border-red-200' : 'border-green-200';
  const iconColor = isError ? 'text-red-500' : 'text-green-500';

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-start p-4 rounded-lg border ${bgColor} ${borderColor} mb-4`}
    >
      {/* Icon Section */}
      <div className={`flex-shrink-0 ${iconColor}`}>
        {isError ? (
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )}
      </div>

      {/* Text Section */}
      <div className={`ml-3 text-sm font-medium ${textColor}`}>
        {children}
      </div>
    </motion.div>
  );
};

export default Alert;