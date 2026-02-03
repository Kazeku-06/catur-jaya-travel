import { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: !!action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, error: null };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

// Global flag to prevent double processing in StrictMode
let isProcessingCallback = false;

// Auth Provider
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        if (authService.isAuthenticated()) {
          const userData = authService.getCurrentUser();
          dispatch({ type: 'SET_USER', payload: userData });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = useCallback(async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const response = await authService.login(credentials);
      dispatch({ type: 'SET_USER', payload: response.user });
      
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Register function
  const register = useCallback(async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const response = await authService.register(userData);
      dispatch({ type: 'SET_USER', payload: response.user });
      
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Google OAuth Callback Handler
  const handleGoogleCallback = useCallback(async (token, providedResponse = null) => {
    // Prevent double processing in StrictMode
    if (isProcessingCallback) {
      console.log('AuthContext: Callback already processing, skipping...');
      return;
    }
    
    isProcessingCallback = true;
    
    try {
      console.log('AuthContext: Starting Google callback processing...');
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      let response;
      if (providedResponse) {
        // Use provided response (from URL data)
        console.log('AuthContext: Using provided user data');
        response = providedResponse;
      } else {
        // Make API call to get user data
        console.log('AuthContext: Making API call to get user data');
        response = await authService.handleGoogleCallback(token);
      }
      
      console.log('AuthContext: Google callback successful, user:', response.user);
      dispatch({ type: 'SET_USER', payload: response.user });
      
      return response;
    } catch (error) {
      console.error('AuthContext: Google callback error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Google login failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
      isProcessingCallback = false;
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  const value = useMemo(() => ({
    ...state,
    login,
    register,
    logout,
    handleGoogleCallback,
    isAdmin: () => authService.isAdmin()
  }), [state, login, register, logout, handleGoogleCallback]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};