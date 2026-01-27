import api, { endpoints } from '../config/api';

class NotificationService {
  /**
   * Get all notifications for admin
   */
  async getNotifications(page = 1, perPage = 20) {
    try {
      // Temporary: use fake endpoint for testing
      const response = await api.get('/admin/notifications/test-fake', {
        params: { page, per_page: perPage }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Fallback to original endpoint
      try {
        const response = await api.get(endpoints.admin.notifications, {
          params: { page, per_page: perPage }
        });
        return response.data;
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        throw error;
      }
    }
  }

  /**
   * Get unread notifications count
   */
  async getUnreadCount() {
    try {
      // Temporary: use fake endpoint for testing
      const response = await api.get('/admin/notifications/unread-count-fake');
      return response.data.data.unread_count;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      // Fallback to original endpoint
      try {
        const response = await api.get(endpoints.admin.notificationUnreadCount);
        return response.data.data.unread_count;
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        throw error;
      }
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId) {
    try {
      const response = await api.post(endpoints.admin.markNotificationRead(notificationId));
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    try {
      const response = await api.post(endpoints.admin.markAllNotificationsRead);
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Get notification statistics
   */
  async getStatistics() {
    try {
      const response = await api.get(endpoints.admin.notificationStats);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching notification statistics:', error);
      throw error;
    }
  }
}

export default new NotificationService();