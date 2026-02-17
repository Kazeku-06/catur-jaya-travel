import axios from 'axios';

// Base API configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000, // Increase timeout to 30 seconds to match config/api.js
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // List of endpoints that don't require authentication
    const publicEndpoints = [
      '/auth/login',
      '/auth/register',
      '/auth/forgot-password',
      '/auth/reset-password',
      '/trips',
      '/travels'
    ];

    // Check if this is a public endpoint
    const isPublicEndpoint = publicEndpoints.some(endpoint =>
      config.url?.includes(endpoint)
    );

    // Only add token for protected endpoints
    if (!isPublicEndpoint) {
      let token = localStorage.getItem('auth_token');

      // Check if token matches expected format (not JSON stringified "undefined" or null)
      if (token && token !== 'undefined' && token !== 'null') {
        // Remove quotes if the token was stored as a JSON string
        if (token.startsWith('"') && token.endsWith('"')) {
          token = token.slice(1, -1);
        }

        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // console.log('No Auth Token found for protected endpoint:', config.url);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Only redirect to login if we're not already on login/oauth pages
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath.includes('/login') || 
                        currentPath.includes('/register') || 
                        currentPath.includes('/oauth') ||
                        currentPath.includes('/forgot-password') ||
                        currentPath.includes('/reset-password');
      
      if (!isAuthPage) {
        console.log('401 error, clearing auth and redirecting to login');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        // Use setTimeout to prevent immediate redirect during request processing
        setTimeout(() => {
          window.location.href = '/login';
        }, 100);
      } else {
        console.log('401 error on auth page, not redirecting');
      }
    }
    return Promise.reject(error);
  }
);

export default api;