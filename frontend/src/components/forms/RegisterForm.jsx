import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from '../../hooks/useForm';
import { authValidation } from '../../utils/validation';
import Alert from '../ui/Alert';
import api, { endpoints } from '../../config/api';

const RegisterForm = ({ onSubmit, loading = false }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('error');
  const [showPassword, setShowPassword] = useState(false);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isValid,
  } = useForm(
    {
      name: '',
      email: '',
      phone: '',
      password: '',
      password_confirmation: '',
    },
    authValidation.register
  );

  const handleFormSubmit = async (formData) => {
    try {
      await onSubmit(formData);
      setAlertType('success');
      setAlertMessage('Registrasi berhasil! Mengalihkan...');
      setShowAlert(true);
    } catch (error) {
      setAlertType('error');
      setAlertMessage(error.message || 'Registrasi gagal. Silakan coba lagi.');
      setShowAlert(true);
    }
  };

  // Handler untuk Google Register
  const handleGoogleRegister = async () => {
    try {
      const response = await api.get(endpoints.googleRedirect);
      if (response.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      setAlertType('error');
      setAlertMessage('Gagal menghubungkan ke Google. Silakan coba lagi.');
      setShowAlert(true);
    }
  };

  // Helper untuk render input dengan gaya Legend (Identik dengan Login)
  const renderFieldset = (id, label, type, placeholder, value, error, isTouched) => (
    <fieldset className={`relative border-2 ${isTouched && error ? 'border-red-500' : 'border-gray-200'} rounded-[25px] px-4 pb-2 pt-0 focus-within:border-[#0091FF] transition-all shadow-sm`}>
      <legend className="text-gray-400 text-sm font-medium px-2 ml-4 mb-0">
        {label}
      </legend>
      <div className="flex items-center">
        <input
          id={id}
          type={type === 'password' && showPassword ? 'text' : type}
          value={value}
          onChange={(e) => handleChange(id, e.target.value)}
          onBlur={() => handleBlur(id)}
          className="w-full bg-transparent px-3 py-2 text-gray-700 focus:outline-none text-lg placeholder-gray-300"
          placeholder={placeholder}
          required
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-400 hover:text-gray-600 px-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        )}
      </div>
      {isTouched && error && (
        <p className="absolute -bottom-5 left-4 text-[10px] text-red-500">{error}</p>
      )}
    </fieldset>
  );

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {showAlert && (
        <div className="mb-6">
          <Alert
            type={alertType}
            message={alertMessage}
            isVisible={showAlert}
            onClose={() => setShowAlert(false)}
            autoClose={alertType === 'success'}
          />
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(handleFormSubmit);
        }}
        className="space-y-6"
      >
        {/* Name Input */}
        {renderFieldset('name', 'Full Name', 'text', 'Your Name', values.name, errors.name, touched.name)}

        {/* Email Input */}
        {renderFieldset('email', 'Email', 'email', 'example@mail.com', values.email, errors.email, touched.email)}

        {/* Phone Input */}
        {renderFieldset('phone', 'Phone Number', 'tel', '0812xxxx', values.phone, errors.phone, touched.phone)}

        {/* Password Input */}
        {renderFieldset('password', 'Password', 'password', '••••••••', values.password, errors.password, touched.password)}

        {/* Confirmation Password Input */}
        {renderFieldset('password_confirmation', 'Confirm Password', 'password', '••••••••', values.password_confirmation, errors.password_confirmation, touched.password_confirmation)}

        {/* Submit Button - Solid Blue (Sesuai Gambar Login) */}
        <div className="pt-4 space-y-4">
          <button
            type="submit"
            disabled={!isValid || loading}
            className="w-full py-4 text-white text-xl font-bold bg-[#0091FF] rounded-full shadow-lg shadow-blue-200 hover:bg-[#007acc] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Sign up'}
          </button>

          {/* Google Button - Outlined (Sesuai Gambar Login) */}
          <button
            type="button"
            onClick={handleGoogleRegister}
            className="w-full py-4 text-gray-700 text-base font-semibold bg-white border-2 border-[#0091FF] rounded-full shadow-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Sign up with Google
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default RegisterForm;