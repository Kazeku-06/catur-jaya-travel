import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

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

// API endpoints
export const endpoints = {
  // Auth
  login: '/auth/login',
  register: '/auth/register',
  logout: '/auth/logout',
  profile: '/auth/profile',
  
  // Trips
  trips: '/trips',
  tripDetail: (id) => `/trips/${id}`,
  
  // Travels
  travels: '/travels',
  travelDetail: (id) => `/travels/${id}`,
  
  // Carter Mobiles
  carterMobiles: '/carter-mobiles',
  carterMobileDetail: (id) => `/carter-mobiles/${id}`,
  
  // Transactions
  transactions: '/transactions',
  transactionDetail: (id) => `/transactions/${id}`,
  payment: '/payment',
  paymentCallback: '/payment/callback',
};