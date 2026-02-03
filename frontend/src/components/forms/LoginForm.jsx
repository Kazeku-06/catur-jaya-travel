import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from '../../hooks/useForm';
import { authValidation } from '../../utils/validation';
import Input from '../ui/Input';
import Button from '../ui/Button';
import GoogleButton from '../ui/GoogleButton';
import Alert from '../ui/Alert';

const LoginForm = ({ onSubmit, loading = false }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('error');

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
      email: '',
      password: '',
    },
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
      className="w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Alert */}
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

      <form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(handleFormSubmit);
      }} className="space-y-6">
        {/* Email */}
        <Input
          label="Email"
          type="email"
          placeholder="Masukkan email Anda"
          value={values.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          error={touched.email ? errors.email : ''}
          required
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          }
        />

        {/* Password */}
        <Input
          label="Password"
          type="password"
          placeholder="Masukkan password Anda"
          value={values.password}
          onChange={(e) => handleChange('password', e.target.value)}
          onBlur={() => handleBlur('password')}
          error={touched.password ? errors.password : ''}
          required
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          }
        />

        {/* Remember Me */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Ingat saya
            </label>
          </div>

          <div className="text-sm">
            <Link 
              to="/forgot-password" 
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Lupa password?
            </Link>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          disabled={!isValid || loading}
        >
          {loading ? 'Masuk...' : 'Masuk'}
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Atau</span>
          </div>
        </div>

        {/* Social Login */}
        <div className="space-y-3">
          <GoogleButton
            variant="outline"
            size="md"
            fullWidth
          >
            Masuk dengan Google
          </GoogleButton>

          <Button
            type="button"
            variant="outline"
            size="md"
            fullWidth
            leftIcon={
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            }
          >
            Masuk dengan Facebook
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default LoginForm;