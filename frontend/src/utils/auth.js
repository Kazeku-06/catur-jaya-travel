// Auth utility functions

export const logout = () => {
  console.log('Global logout function called');
  
  try {
    // Clear localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    
    // Dispatch custom event to notify all components
    window.dispatchEvent(new CustomEvent('localStorageChange', {
      detail: { key: 'auth_token', newValue: null }
    }));
    
    window.dispatchEvent(new CustomEvent('localStorageChange', {
      detail: { key: 'user_data', newValue: null }
    }));
    
    console.log('Storage cleared and events dispatched');
    
    // Force page refresh to ensure clean state
    setTimeout(() => {
      window.location.href = '/';
    }, 100);
    
  } catch (error) {
    console.error('Error during logout:', error);
    // Fallback: force refresh anyway
    window.location.href = '/';
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('auth_token');
  return !!token;
};

export const isAdmin = () => {
  try {
    const userData = localStorage.getItem('user_data');
    if (!userData) return false;
    
    const user = JSON.parse(userData);
    return user.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

export const getUserData = () => {
  try {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};