// Validation rules for forms
export const validationRules = {
  required: (message = 'Field ini wajib diisi') => (value) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return message;
    }
    return '';
  },

  email: (message = 'Format email tidak valid') => (value) => {
    if (!value) return '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return message;
    }
    return '';
  },

  minLength: (min, message) => (value) => {
    if (!value) return '';
    if (value.length < min) {
      return message || `Minimal ${min} karakter`;
    }
    return '';
  },

  maxLength: (max, message) => (value) => {
    if (!value) return '';
    if (value.length > max) {
      return message || `Maksimal ${max} karakter`;
    }
    return '';
  },

  phone: (message = 'Format nomor telepon tidak valid') => (value) => {
    if (!value) return '';
    const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
    if (!phoneRegex.test(value.replace(/\s/g, ''))) {
      return message;
    }
    return '';
  },

  confirmPassword: (passwordField, message = 'Password tidak cocok') => (value, allValues) => {
    if (!value) return '';
    if (value !== allValues[passwordField]) {
      return message;
    }
    return '';
  },

  numeric: (message = 'Hanya boleh berisi angka') => (value) => {
    if (!value) return '';
    if (!/^\d+$/.test(value)) {
      return message;
    }
    return '';
  },

  alphanumeric: (message = 'Hanya boleh berisi huruf dan angka') => (value) => {
    if (!value) return '';
    if (!/^[a-zA-Z0-9]+$/.test(value)) {
      return message;
    }
    return '';
  },
};

// Common validation schemas
export const authValidation = {
  login: {
    email: [
      validationRules.required('Email wajib diisi'),
      validationRules.email(),
    ],
    password: [
      validationRules.required('Password wajib diisi'),
      validationRules.minLength(6, 'Password minimal 6 karakter'),
    ],
  },
  
  register: {
    name: [
      validationRules.required('Nama wajib diisi'),
      validationRules.minLength(2, 'Nama minimal 2 karakter'),
    ],
    email: [
      validationRules.required('Email wajib diisi'),
      validationRules.email(),
    ],
    phone: [
      validationRules.required('Nomor telepon wajib diisi'),
      validationRules.phone(),
    ],
    password: [
      validationRules.required('Password wajib diisi'),
      validationRules.minLength(6, 'Password minimal 6 karakter'),
    ],
    password_confirmation: [
      validationRules.required('Konfirmasi password wajib diisi'),
      validationRules.confirmPassword('password'),
    ],
  },
};