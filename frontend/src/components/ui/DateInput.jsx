import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getTodayString, getMaxDateString, validateTravelDate, formatDateToIndonesian } from '../../utils/dateValidation';

const DateInput = ({
  value,
  onChange,
  label = "Travel Date",
  placeholder = "Select travel date",
  required = false,
  showHelper = true,
  className = "",
  disabled = false,
  minDate = null,
  maxDate = null,
  onValidation = null
}) => {
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  // Use custom min/max dates or default to travel date validation
  const minDateString = minDate || getTodayString();
  const maxDateString = maxDate || getMaxDateString();
  const maxDateObj = new Date(maxDateString);

  // Validate date whenever value changes
  useEffect(() => {
    if (touched && value) {
      const validation = validateTravelDate(value);
      const newError = validation.isValid ? '' : validation.error;
      if (error !== newError) {
        setError(newError);
      }
      
      // Call parent validation callback if provided
      if (onValidation) {
        onValidation(validation);
      }
    }
  }, [value, touched, onValidation, error]);

  const handleChange = (e) => {
    const selectedDate = e.target.value;
    setTouched(true);
    
    if (onChange) {
      onChange(e);
    }
  };

  const handleBlur = () => {
    setTouched(true);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Date Input */}
      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          min={minDateString}
          max={maxDateString}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          className={`
            w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent
            transition-colors duration-200 bg-white
            ${error && touched ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          `}
          style={{ colorScheme: 'light' }}
        />
        
        {/* Calendar Icon */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      {/* Error Message */}
      {error && touched && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center text-sm text-red-600"
        >
          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </motion.div>
      )}

      {/* Helper Text */}
      {showHelper && !error && (
        <div className="text-xs text-gray-500 flex items-center">
          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Pilih tanggal mulai dari hari ini hingga {formatDateToIndonesian(maxDateObj)}
        </div>
      )}
    </div>
  );
};

export default DateInput;