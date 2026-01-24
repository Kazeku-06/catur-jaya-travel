import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
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
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
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
  
  // Note: Carter mobiles not mentioned in API doc, using trips as fallback
  // You may need to add this endpoint to backend or use a different approach
  carterMobiles: '/trips', // Fallback - may need backend implementation
  carterMobileDetail: (id) => `/trips/${id}`, // Fallback - may need backend implementation
  
  // Transaction endpoints (requires authentication)
  createTripTransaction: (tripId) => `/transactions/trip/${tripId}`,
  createTravelTransaction: (travelId) => `/transactions/travel/${travelId}`,
  
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
  }
};