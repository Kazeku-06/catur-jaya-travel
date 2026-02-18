// Utility to clear corrupted localStorage data
export const clearCorruptedStorage = () => {
  try {
    console.log('Clearing potentially corrupted localStorage data...');
    
    // List of keys that might be corrupted
    const keysToCheck = ['auth_token', 'user_data'];
    
    keysToCheck.forEach(key => {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          // For auth_token, just check if it's a reasonable string
          if (key === 'auth_token') {
            if (item.length < 10 || item.includes('undefined') || item.includes('null')) {
              console.log(`Removing corrupted ${key}:`, item);
              localStorage.removeItem(key);
            }
          } else {
            // For other keys, try to parse as JSON
            try {
              JSON.parse(item);
            } catch {
              console.warn('Failed to parse and clear corrupted state for: ' + key + '. Attempting full clear.');
              localStorage.clear();
            }
          }
        }
      } catch (error) {
        console.error(`Error checking ${key}:`, error);
        localStorage.removeItem(key);
      }
    });
    
    console.log('localStorage cleanup completed');
  } catch (error) {
    console.error('Error during localStorage cleanup:', error);
  }
};

// Auto-run cleanup on import
clearCorruptedStorage();