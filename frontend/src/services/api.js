import axios from 'axios';

// Base API configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
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

      // Parse token if it's a JSON string (stored by useLocalStorage)
      if (token) {
        try {
          // Try to parse in case it's a JSON string
          const parsed = JSON.parse(token);
          if (parsed) token = parsed;
        } catch (e) {
          // If parsing fails, it's likely a raw string, use as is
        }

        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.log('No Auth Token found for protected endpoint:', config.url);
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
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;