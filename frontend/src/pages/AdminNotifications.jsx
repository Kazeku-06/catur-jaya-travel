import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNotifications } from '../hooks/useNotifications';
import NotificationItem from '../components/notifications/NotificationItem';

const AdminNotifications = () => {
  const { 
    notifications, 
    unreadCount,
    loading, 
    error, 
    fetchNotifications, 
    markAllAsRead 
  } = useNotifications();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [typeFilter, setTypeFilter] = useState('all'); // all, order_created, payment_paid, payment_failed

  useEffect(() => {
    fetchNotifications(1, 20);
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
      await fetchNotifications(nextPage, 20);
      setCurrentPage(nextPage);
    } catch (error) {
      console.error('Error loading more notifications:', error);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    // Filter by read status
    if (filter === 'unread' && notification.is_read) return false;
    if (filter === 'read' && !notification.is_read) return false;
    
    // Filter by type
    if (typeFilter !== 'all' && notification.type !== typeFilter) return false;
    
    return true;
  });

  const getTypeLabel = (type) => {
    switch (type) {
      case 'order_created': return 'Order Baru';
      case 'payment_paid': return 'Pembayaran Berhasil';
      case 'payment_failed': return 'Pembayaran Gagal';
      default: return 'Semua';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifikasi Admin</h1>
              <p className="text-gray-600 mt-2">
                Kelola notifikasi order dan pembayaran
              </p>
            </div>
            
            {unreadCount > 0 && (
              <motion.button
                onClick={handleMarkAllAsRead}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Tandai Semua Dibaca ({unreadCount})
              </motion.button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Semua Notifikasi</option>
                <option value="unread">Belum Dibaca</option>
                <option value="read">Sudah Dibaca</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Notifikasi
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Semua Jenis</option>
                <option value="order_created">Order Baru</option>
                <option value="payment_paid">Pembayaran Berhasil</option>
                <option value="payment_failed">Pembayaran Gagal</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{notifications.length}</div>
            <div className="text-sm text-gray-600">Total Notifikasi</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
            <div className="text-sm text-gray-600">Belum Dibaca</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {notifications.filter(n => n.type === 'payment_paid').length}
            </div>
            <div className="text-sm text-gray-600">Pembayaran Berhasil</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-red-600">
              {notifications.filter(n => n.type === 'payment_failed').length}
            </div>
            <div className="text-sm text-gray-600">Pembayaran Gagal</div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {loading && notifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Memuat notifikasi...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="text-red-600 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-600 font-medium">Gagal memuat notifikasi</p>
              <p className="text-gray-500 text-sm mt-1">{error}</p>
              <button
                onClick={() => fetchNotifications(1, 20)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
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
              <p className="text-gray-500 font-medium">Tidak ada notifikasi</p>
              <p className="text-gray-400 text-sm mt-1">
                {filter !== 'all' || typeFilter !== 'all' 
                  ? 'Coba ubah filter untuk melihat notifikasi lain'
                  : 'Notifikasi akan muncul ketika ada order baru atau perubahan status pembayaran'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <NotificationItem notification={notification} />
                </motion.div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {filteredNotifications.length > 0 && (
            <div className="p-4 border-t border-gray-200 text-center">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {loading ? 'Memuat...' : 'Muat Lebih Banyak'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;