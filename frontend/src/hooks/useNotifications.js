import { useState, useEffect, useCallback } from 'react';
import notificationService from '../services/notificationService';

export const useNotifications = (pollingInterval = 30000) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
      setError(null);
    } catch (err) {
      console.error('Error fetching unread count:', err);
      setError(err.message);
    }
  }, []);

  // Fetch all notifications
  const fetchNotifications = useCallback(async (page = 1, perPage = 20) => {
    setLoading(true);
    try {
      const response = await notificationService.getNotifications(page, perPage);
      setNotifications(response.data);
      setError(null);
      return response;
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true }
            : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
      setError(null);
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError(err.message);
      throw err;
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      );
      
      setUnreadCount(0);
      setError(null);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      setError(err.message);
      throw err;
    }
  }, []);

  // Setup polling for unread count
  useEffect(() => {
    // Initial fetch
    fetchUnreadCount();

    // Setup polling
    const interval = setInterval(fetchUnreadCount, pollingInterval);

    return () => clearInterval(interval);
  }, [fetchUnreadCount, pollingInterval]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications
  };
};