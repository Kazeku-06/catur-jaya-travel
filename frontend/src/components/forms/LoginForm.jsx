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

        <div className="flex items-center justify-between">
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
        </div>
      </form>
    </motion.div>
  );
};

export default LoginForm;