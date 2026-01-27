import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import RegisterForm from '../components/forms/RegisterForm';
import { useLocalStorage } from '../hooks/useLocalStorage';
import api, { endpoints } from '../config/api';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [authToken] = useLocalStorage('auth_token', null);

  const from = location.state?.from || '/';

  useEffect(() => {
    // Redirect if already logged in
    if (authToken) {
      navigate(from, { replace: true });
    }
  }, [authToken, navigate, from]);

  const handleRegister = async (formData) => {
    try {
      const response = await api.post(endpoints.register, formData);
      
      // Backend response structure: { message: "User registered successfully", user: {...}, access_token: "..." }
      // Redirect to login page with success message
      navigate('/login', { 
        state: { 
          from,
          message: response.data.message || 'Registrasi berhasil! Silakan login dengan akun Anda.' 
        } 
      });
      
    } catch (error) {
      // Backend validation errors: { message: "The given data was invalid.", errors: {...} }
      let message = 'Registrasi gagal. Silakan coba lagi.';
      
      if (error.response?.data?.errors) {
        // Extract first validation error
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0];
        if (Array.isArray(firstError) && firstError.length > 0) {
          message = firstError[0];
        }
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      
      throw new Error(message);
    }
  };

  return (
    <Layout showHeader={false} showFooter={false}>
      <div className="min-h-screen flex">
        {/* Left Side - Image */}
        <motion.div
          className="hidden lg:block lg:flex-1 relative"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 to-primary-800/90 z-10"></div>
          <img
            src="/images/register-bg.jpg"
            alt="Adventure Indonesia"
            className="w-full h-full object-cover"
          />
          
          {/* Overlay Content */}
          <div className="absolute inset-0 z-20 flex items-center justify-center p-12">
            <div className="text-center text-white">
              <motion.h3
                className="text-4xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Mulai Petualangan Anda
              </motion.h3>
              
              <motion.p
                className="text-xl text-primary-100 mb-8 max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Bergabunglah dengan ribuan traveler yang telah mempercayai kami untuk petualangan mereka
              </motion.p>

              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="flex items-center text-primary-100">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Booking mudah dan cepat</span>
                </div>
                <div className="flex items-center text-primary-100">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Harga terjangkau dan transparan</span>
                </div>
                <div className="flex items-center text-primary-100">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Pelayanan 24/7</span>
                </div>
                <div className="flex items-center text-primary-100">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Destinasi terpercaya</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Register Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-md w-full space-y-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Header */}
            <div className="text-center">
              <Link to="/" className="inline-flex items-center space-x-2 mb-8">
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-gray-900">Catur Jaya Mandiri Travel</span>
              </Link>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Buat Akun Baru
              </h2>
              <p className="text-gray-600">
                Daftar sekarang dan mulai petualangan Anda
              </p>
            </div>

            {/* Register Form */}
            <RegisterForm onSubmit={handleRegister} />

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Sudah punya akun?{' '}
                <Link
                  to="/login"
                  state={{ from }}
                  className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
                >
                  Masuk di sini
                </Link>
              </p>
            </div>

            {/* Back to Home */}
            <div className="text-center">
              <Link
                to="/"
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali ke Beranda
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;