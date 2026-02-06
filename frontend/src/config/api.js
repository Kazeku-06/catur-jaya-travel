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

// Global flag to prevent multiple simultaneous /auth/me requests
let isAuthMeInProgress = false;
let lastAuthMeRequest = 0;
const AUTH_ME_DEBOUNCE_TIME = 5000; // 5 seconds

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Prevent multiple simultaneous /auth/me requests with debouncing
    if (config.url?.includes('/auth/me')) {
      const now = Date.now();
      
      if (isAuthMeInProgress) {
        console.log('Blocking duplicate /auth/me request (in progress)');
        return Promise.reject(new Error('Duplicate /auth/me request blocked'));
      }
      
      if (now - lastAuthMeRequest < AUTH_ME_DEBOUNCE_TIME) {
        console.log('Blocking /auth/me request (debounce)');
        return Promise.reject(new Error('Duplicate /auth/me request blocked'));
      }
      
      isAuthMeInProgress = true;
      lastAuthMeRequest = now;
    }

    let token = localStorage.getItem('auth_token');
    
    // Check if token matches expected format (not JSON stringified "undefined" or null)
    if (token && token !== 'undefined' && token !== 'null') {
      // Clean token if it has extra quotes
      if (token.startsWith('"') && token.endsWith('"')) {
        token = token.slice(1, -1);
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Reset flag when /auth/me request completes successfully
    if (response.config?.url?.includes('/auth/me')) {
      isAuthMeInProgress = false;
    }
    return response;
  },
  (error) => {
    // Reset flag when /auth/me request fails
    if (error.config?.url?.includes('/auth/me')) {
      isAuthMeInProgress = false;
    }

    if (error.response?.status === 401) {
      // Check if we are already on an auth page to prevent redirect loops
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath.includes('/login') || 
                        currentPath.includes('/register') || 
                        currentPath.includes('/oauth') ||
                        currentPath.includes('/forgot-password') ||
                        currentPath.includes('/reset-password');
      
      if (!isAuthPage) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        window.location.href = '/login';
      }
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
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
  
  // Google OAuth endpoints
  googleRedirect: '/auth/google/redirect',
  googleCallback: '/auth/google/callback',

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