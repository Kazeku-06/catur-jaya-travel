// Format currency to Indonesian Rupiah
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Format date to Indonesian format
export const formatDate = (date, options = {}) => {
  // Handle null, undefined, or invalid dates
  if (!date) return '-';
  
  const dateObj = new Date(date);
  
  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return '-';
  }
  
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };
  
  try {
    return new Intl.DateTimeFormat('id-ID', defaultOptions).format(dateObj);
  } catch (error) {
    console.warn('Invalid date format:', date);
    return '-';
  }
};

// Format relative time (e.g., "2 hari yang lalu")
export const formatRelativeTime = (date) => {
  // Handle null, undefined, or invalid dates
  if (!date) return '-';
  
  const now = new Date();
  const targetDate = new Date(date);
  
  // Check if the date is valid
  if (isNaN(targetDate.getTime())) {
    return '-';
  }
  
  const diffInSeconds = Math.floor((now - targetDate) / 1000);
  
  const intervals = {
    tahun: 31536000,
    bulan: 2592000,
    minggu: 604800,
    hari: 86400,
    jam: 3600,
    menit: 60,
  };
  
  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return `${interval} ${unit} yang lalu`;
    }
  }
  
  return 'Baru saja';
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// Generate WhatsApp URL
export const generateWhatsAppUrl = (phone, message = '') => {
  const cleanPhone = phone.replace(/\D/g, '');
  const formattedPhone = cleanPhone.startsWith('0') 
    ? '62' + cleanPhone.substring(1) 
    : cleanPhone;
  
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${formattedPhone}${message ? `?text=${encodedMessage}` : ''}`;
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Check if device is mobile
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// Generate slug from text
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Validate Indonesian phone number
export const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Get image URL with fallback
export const getImageUrl = (imagePath, fallback = '/images/placeholder.jpg') => {
  if (!imagePath) return fallback;
  
  // If it's already a full URL (from backend's image_url field), return as is
  if (imagePath.startsWith('http')) return imagePath;
  
  // If it's a relative path, construct the full URL
  // Backend serves images at: http://localhost:8000/storage/{path}
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:8000';
  
  // Handle different path formats
  if (imagePath.startsWith('storage/')) {
    // Already has storage/ prefix
    return `${baseUrl}/${imagePath}`;
  } else if (imagePath.startsWith('/storage/')) {
    // Has /storage/ prefix
    return `${baseUrl}${imagePath}`;
  } else {
    // No storage prefix, add it
    return `${baseUrl}/storage/${imagePath}`;
  }
};

// Copy text to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      return true;
    } catch (err) {
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  }
};

// Scroll to element smoothly
export const scrollToElement = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};