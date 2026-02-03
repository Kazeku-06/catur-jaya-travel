import api from './api';

export const authService = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.access_token) {
      localStorage.setItem('auth_token', response.data.access_token);
      localStorage.setItem('user_data', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Google OAuth Login - Redirect to backend
  loginWithGoogle: () => {
    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
    window.location.href = `${backendUrl}/auth/google/redirect`;
  },

  // Handle Google OAuth callback
  handleGoogleCallback: async (token) => {
    if (!token) {
      throw new Error('No token received from Google OAuth');
    }

    // Clean the token (remove any quotes or whitespace)
    const cleanToken = token.trim().replace(/^["']|["']$/g, '');
    
    // Set token first
    localStorage.setItem('auth_token', cleanToken);
    
    // Check if user data is already available in localStorage (from URL)
    const existingUserData = localStorage.getItem('user_data');
    if (existingUserData) {
      try {
        const userData = JSON.parse(existingUserData);
        console.log('Using existing user data from localStorage:', userData);
        return { user: userData };
      } catch (parseError) {
        console.error('Failed to parse existing user data:', parseError);
        // Continue to API call if parsing fails
      }
    }
    
    try {
      // Test the token by making a profile request with a shorter timeout
      const response = await api.get('/auth/me', { timeout: 10000 });
      
      if (response.data && response.data.user) {
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
        return response.data;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      // If profile fetch fails, remove the token to prevent infinite loops
      console.error('Profile fetch failed:', error);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('Server tidak merespons. Silakan coba lagi.');
      } else if (error.response?.status === 401) {
        throw new Error('Token tidak valid. Silakan login ulang.');
      } else {
        throw new Error('Gagal memverifikasi login. Silakan coba lagi.');
      }
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  },

  // Get current user profile
  getProfile: async () => {
    console.log('authService.getProfile called from:', new Error().stack);
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Forgot password - send reset email
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password using token
  resetPassword: async (resetData) => {
    const response = await api.post('/auth/reset-password', resetData);
    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  },

  // Get current user data from localStorage
  getCurrentUser: () => {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },

  // Check if user is admin
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user?.role === 'admin';
  },

  // Check if user is Google user
  isGoogleUser: () => {
    const user = authService.getCurrentUser();
    return user?.auth_provider === 'google';
  }
};