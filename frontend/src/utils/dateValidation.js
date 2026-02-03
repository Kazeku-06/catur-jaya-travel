/**
 * Utility functions for date validation
 */

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string} Today's date string
 */
export const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Get maximum allowed date (1 year from today) in YYYY-MM-DD format
 * @returns {string} Maximum date string
 */
export const getMaxDateString = () => {
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  return maxDate.toISOString().split('T')[0];
};

/**
 * Validate if a date is within allowed range (today to 1 year from now)
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {object} Validation result with isValid and error message
 */
export const validateTravelDate = (dateString) => {
  if (!dateString) {
    return {
      isValid: false,
      error: 'Tanggal perjalanan harus diisi'
    };
  }

  const selectedDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time for accurate comparison

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  if (isNaN(selectedDate.getTime())) {
    return {
      isValid: false,
      error: 'Format tanggal tidak valid'
    };
  }

  if (selectedDate < today) {
    return {
      isValid: false,
      error: 'Tanggal perjalanan tidak boleh sebelum hari ini'
    };
  }

  if (selectedDate > maxDate) {
    return {
      isValid: false,
      error: 'Tanggal perjalanan maksimal 1 tahun dari sekarang'
    };
  }

  return {
    isValid: true,
    error: null
  };
};

/**
 * Format date to Indonesian locale
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDateToIndonesian = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Check if a date is weekend (Saturday or Sunday)
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if weekend
 */
export const isWeekend = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const day = dateObj.getDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
};

/**
 * Get the next available weekday from a given date
 * @param {string|Date} date - Starting date
 * @returns {Date} Next weekday
 */
export const getNextWeekday = (date) => {
  const dateObj = new Date(typeof date === 'string' ? date : date);
  
  while (isWeekend(dateObj)) {
    dateObj.setDate(dateObj.getDate() + 1);
  }
  
  return dateObj;
};

/**
 * Calculate days between two dates
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @returns {number} Number of days
 */
export const daysBetween = (startDate, endDate) => {
  const start = new Date(typeof startDate === 'string' ? startDate : startDate);
  const end = new Date(typeof endDate === 'string' ? endDate : endDate);
  
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Check if date is a holiday (basic implementation - can be extended)
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if holiday
 */
export const isHoliday = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const month = dateObj.getMonth() + 1; // getMonth() returns 0-11
  const day = dateObj.getDate();
  
  // Indonesian national holidays (basic list)
  const holidays = [
    { month: 1, day: 1 },   // New Year
    { month: 8, day: 17 },  // Independence Day
    { month: 12, day: 25 }, // Christmas
  ];
  
  return holidays.some(holiday => holiday.month === month && holiday.day === day);
};