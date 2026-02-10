import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from '../../hooks/useForm';
import { authValidation } from '../../utils/validation';
import Alert from '../ui/Alert';

const LoginForm = ({ onSubmit, loading = false }) => {
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
    { email: '', password: '' },
    authValidation.login
  );

  const handleFormSubmit = async (formData) => {
    try {
      await onSubmit(formData);
      setAlertType('success');
      setAlertMessage('Login berhasil! Mengalihkan...');
      setShowAlert(true);
    } catch (error) {
      setAlertType('error');
      setAlertMessage(error.message || 'Login gagal. Silakan coba lagi.');
      setShowAlert(true);
    }
  };

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
        {/* EMAIL FIELDSET */}
        <fieldset className="relative border-2 border-gray-200 rounded-[30px] px-4 pb-2 pt-0 focus-within:border-[#0091FF] transition-all shadow-sm">
          <legend className="text-gray-400 text-sm font-medium px-2 ml-4 mb-0">
            Email
          </legend>
          <input
            type="email"
            value={values.email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            className="w-full bg-transparent px-3 py-2 text-gray-700 focus:outline-none text-lg"
            required
          />
          {touched.email && errors.email && (
            <p className="absolute -bottom-6 left-4 text-[10px] text-red-500">{errors.email}</p>
          )}
        </fieldset>

        {/* PASSWORD FIELDSET */}
        <fieldset className="relative border-2 border-gray-200 rounded-[25px] px-4 pb-2 pt-0 focus-within:border-[#0091FF] transition-all shadow-sm">
          <legend className="text-gray-400 text-sm font-medium px-2 ml-4 mb-0">
            Password
          </legend>
          <div className="flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              value={values.password}
              onChange={(e) => handleChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              className="w-full bg-transparent px-3 py-2 text-gray-700 focus:outline-none text-lg"
              required
            />
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
          </div>
          {touched.password && errors.password && (
            <p className="absolute -bottom-6 left-4 text-[10px] text-red-500">{errors.password}</p>
          )}
        </fieldset>

        {/* Forgot Password Link */}
        <div className="flex justify-end pr-2 -mt-2">
          <Link to="/forgot-password" size="sm" className="text-sm text-gray-400 hover:text-gray-600">
            forgot password?
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 text-white text-xl font-bold bg-[#0091FF] rounded-full shadow-lg hover:bg-[#007acc] active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <button
            type="button"
            className="w-full py-4 text-gray-700 text-base font-semibold bg-white border-2 border-[#0091FF] rounded-full shadow-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Sign in with Google
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default LoginForm;