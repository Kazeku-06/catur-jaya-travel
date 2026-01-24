import { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

// App reducer for global state
const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_SUCCESS_MESSAGE':
      return { ...state, successMessage: action.payload };
    case 'CLEAR_SUCCESS_MESSAGE':
      return { ...state, successMessage: null };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  loading: false,
  error: null,
  successMessage: null
};

// App Provider
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setLoading = (loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const setSuccessMessage = (message) => {
    dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: message });
  };

  const clearSuccessMessage = () => {
    dispatch({ type: 'CLEAR_SUCCESS_MESSAGE' });
  };

  const value = {
    ...state,
    setLoading,
    setError,
    clearError,
    setSuccessMessage,
    clearSuccessMessage
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use app context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};