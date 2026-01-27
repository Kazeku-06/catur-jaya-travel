import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

console.log('🔧 API Configuration:', {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  API_BASE_URL: API_BASE_URL,
  NODE_ENV: import.meta.env.NODE_ENV
});

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increase timeout to 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('auth_token');
    console.log('Request interceptor - Token from localStorage:', token ? `${token.substring(0, 20)}...` : 'None');

    if (token) {
      try {
        const parsed = JSON.parse(token);
        if (parsed) token = parsed;
      } catch (e) {
        // Token likely not a JSON string, usage as-is
      }

      config.headers.Authorization = `Bearer ${token}`;
      console.log('Request interceptor - Authorization header set:', config.headers.Authorization.substring(0, 30) + '...');
    } else {
      console.warn('Request interceptor - No token found in localStorage');
    }

    console.log('Request interceptor - Final config:', {
      url: config.url,
      method: config.method,
      headers: config.headers
    });

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Temporarily disabled for debugging
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log error but don't auto-logout
    console.error('API Error:', error.response?.status, error.config?.url);

    // Uncomment this when debugging is done:
    // if (error.response?.status === 401) {
    //   localStorage.removeItem('auth_token');
    //   localStorage.removeItem('user_data');
    //   window.location.href = '/login';
    // }

    return Promise.reject(error);
  }
);

export default api;

// API endpoints based on backend documentation
export const endpoints = {
  // Auth endpoints
  login: '/auth/login',
  register: '/auth/register',
  logout: '/auth/logout',
  profile: '/auth/me',

  // Public catalog endpoints (guest access)
  trips: '/trips',
  tripDetail: (id) => `/trips/${id}`,

  travels: '/travels',
  travelDetail: (id) => `/travels/${id}`,

  // Transaction endpoints (requires authentication)
  createTripTransaction: (tripId) => `/transactions/trip/${tripId}`,
  createTravelTransaction: (travelId) => `/transactions/travel/${travelId}`,
  userBookings: '/transactions/my-bookings',
  transactionDetail: (id) => `/transactions/${id}`,
  testAuth: '/test-auth',

  // Payment endpoints
  midtransConfig: '/payments/midtrans',
  midtransCallback: '/payments/midtrans/callback',

  // Admin endpoints (requires admin role)
  admin: {
    trips: '/admin/trips',
    tripDetail: (id) => `/admin/trips/${id}`,
    travels: '/admin/travels',
    travelDetail: (id) => `/admin/travels/${id}`,
    transactions: '/admin/transactions',
    transactionDetail: (id) => `/admin/transactions/${id}`,
    transactionStats: '/admin/transactions/statistics',

    // Notification endpoints
    notifications: '/admin/notifications',
    notificationUnreadCount: '/admin/notifications/unread-count',
    notificationStats: '/admin/notifications/statistics',
    markNotificationRead: (id) => `/admin/notifications/${id}/read`,
    markAllNotificationsRead: '/admin/notifications/mark-all-read',
  }
};