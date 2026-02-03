import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;
      
      // Special handling for auth_token - it's stored as plain string
      if (key === 'auth_token') {
        return item;
      }
      
      // For other keys, try to parse as JSON
      try {
        return JSON.parse(item);
      } catch (parseError) {
        // If JSON parsing fails, return as string
        console.warn(`Failed to parse localStorage key "${key}" as JSON, using as string:`, parseError);
        return item;
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      // Clear corrupted data
      try {
        window.localStorage.removeItem(key);
      } catch (clearError) {
        console.error(`Failed to clear corrupted localStorage key "${key}":`, clearError);
      }
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      // Special handling for auth_token - store as plain string
      if (key === 'auth_token') {
        window.localStorage.setItem(key, valueToStore);
      } else {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
      
      // Dispatch custom event for same-tab detection
      const storageValue = key === 'auth_token' ? valueToStore : JSON.stringify(valueToStore);
      window.dispatchEvent(new CustomEvent('localStorageChange', {
        detail: { key, newValue: storageValue }
      }));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Listen for changes to this key from other tabs/windows and same tab
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          // Special handling for auth_token
          if (key === 'auth_token') {
            setStoredValue(e.newValue);
          } else {
            setStoredValue(JSON.parse(e.newValue));
          }
        } catch (error) {
          console.error(`Error parsing localStorage key "${key}":`, error);
        }
      }
    };

    const handleCustomStorageChange = (e) => {
      if (e.detail.key === key) {
        try {
          const newValue = e.detail.newValue;
          if (newValue === null) {
            setStoredValue(initialValue);
          } else {
            // Special handling for auth_token
            if (key === 'auth_token') {
              setStoredValue(newValue);
            } else {
              setStoredValue(JSON.parse(newValue));
            }
          }
        } catch (error) {
          console.error(`Error parsing localStorage key "${key}":`, error);
        }
      }
    };

    // Listen for storage events from other tabs
    window.addEventListener('storage', handleStorageChange);
    // Listen for custom events from same tab
    window.addEventListener('localStorageChange', handleCustomStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleCustomStorageChange);
    };
  }, [key, initialValue]);

  // Method to remove item from localStorage
  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
      
      // Dispatch custom event for same-tab detection
      window.dispatchEvent(new CustomEvent('localStorageChange', {
        detail: { key, newValue: null }
      }));
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
};