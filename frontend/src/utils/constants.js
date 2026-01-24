// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/me',
  },
  CATALOG: {
    TRIPS: '/trips',
    TRAVELS: '/travels',
    CARTER_MOBILES: '/carter-mobiles',
  },
  TRANSACTIONS: {
    TRIP: '/transactions/trip',
    TRAVEL: '/transactions/travel',
  },
  PAYMENTS: {
    MIDTRANS_CONFIG: '/payments/midtrans',
    MIDTRANS_CALLBACK: '/payments/midtrans/callback',
  },
};

// Breakpoints for responsive design
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px',
};

// Animation durations
export const ANIMATION_DURATION = {
  FAST: 0.2,
  NORMAL: 0.3,
  SLOW: 0.5,
};

// Loading states
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

// Payment status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  EXPIRED: 'expired',
};