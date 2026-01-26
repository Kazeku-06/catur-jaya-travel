import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationItem from './NotificationItem';

const NotificationDropdown = ({ onClose }) => {
  const { 
    notifications, 
    loading, 
    error, 
    fetchNotifications, 
    markAllAsRead 
  } = useNotifications();
  
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchNotifications(1, 10); // Load first 10 notifications
  }, [fetchNotifications]);

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleLoadMore = async () => {
    try {
      const nextPage = currentPage + 1;
      const response = await fetchNotifications(nextPage, 10);
      setCurrentPage(nextPage);
    } catch (error) {
      console.error('Error loading more notifications:', error);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Dropdown */}
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Notifikasi
            </h3>
            {notifications.length > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Tandai Semua Dibaca
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="max-h-80 overflow-y-auto">
          {loading && notifications.length === 0 ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Memuat notifikasi...</p>
            </div>
          ) : error ? (
            <div className="p-4 text-center">
              <p className="text-sm text-red-600">Gagal memuat notifikasi</p>
              <button
                onClick={() => fetchNotifications(1, 10)}
                className="text-xs text-blue-600 hover:text-blue-800 mt-1"
              >
                Coba Lagi
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center">
              <svg
                className="w-12 h-12 text-gray-300 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <p className="text-sm text-gray-500">Tidak ada notifikasi</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="w-full text-xs text-blue-600 hover:text-blue-800 font-medium py-1 disabled:opacity-50"
            >
              {loading ? 'Memuat...' : 'Muat Lebih Banyak'}
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default NotificationDropdown;