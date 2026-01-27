import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

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
    const token = localStorage.getItem('auth_token');
    console.log('🔄 API Request:', {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      tokenPreview: token ? token.substring(0, 20) + '...' : 'None',
      headers: config.headers
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response Success:', {
      url: response.config.url,
      method: response.config.method,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      console.warn('🚨 401 Unauthorized - Clearing auth data and redirecting to login');
      console.log('Current auth token:', localStorage.getItem('auth_token')?.substring(0, 20) + '...');
      console.log('Current user data:', JSON.parse(localStorage.getItem('user_data') || 'null'));
      
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }
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