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
  },
  BOOKINGS: {
    TRIP: '/bookings/trip',
    TRAVEL: '/bookings/travel',
    MY_BOOKINGS: '/bookings/my',
    DETAIL: '/bookings',
    UPLOAD_PROOF: '/bookings/{id}/payment-proof',
  },
  ADMIN: {
    BOOKINGS: '/admin/bookings',
    APPROVE: '/admin/bookings/{id}/approve',
    REJECT: '/admin/bookings/{id}/reject',
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

// Booking status (new manual payment system)
export const BOOKING_STATUS = {
  MENUNGGU_PEMBAYARAN: 'menunggu_pembayaran',
  MENUNGGU_VALIDASI: 'menunggu_validasi',
  LUNAS: 'lunas',
  DITOLAK: 'ditolak',
  EXPIRED: 'expired',
};

// Bank accounts for manual transfer
export const BANK_ACCOUNTS = {
  BCA: {
    bank: 'BCA',
    accountNumber: '1234567890',
    accountName: 'PT Travel Indonesia',
  },
  MANDIRI: {
    bank: 'Mandiri',
    accountNumber: '0987654321',
    accountName: 'PT Travel Indonesia',
  }
};