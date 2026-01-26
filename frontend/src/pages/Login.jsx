import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import LoginForm from '../components/forms/LoginForm';
import { useLocalStorage } from '../hooks/useLocalStorage';
import api, { endpoints } from '../config/api';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [authToken, setAuthToken] = useLocalStorage('auth_token', null);
  const [, setUserData] = useLocalStorage('user_data', null);

  const from = location.state?.from || '/';

  useEffect(() => {
    // Redirect if already logged in
    if (authToken) {
      navigate(from, { replace: true });
    }
  }, [authToken, navigate, from]);

  const handleLogin = async (formData) => {
    try {
      const response = await api.post(endpoints.login, formData);
      
      // Backend response structure: { message: "Login successful", user: {...}, access_token: "...", token_type: "Bearer" }
      const { user, access_token } = response.data;
      
      setAuthToken(access_token);
      setUserData(user);
      
      // Redirect to intended page or home
      navigate(from, { replace: true });
      
    } catch (error) {
      // Backend error structure: { message: "...", errors: {...} }
      const message = error.response?.data?.message || 'Login gagal. Silakan coba lagi.';
      throw new Error(message);
    }
  };

  return (
    <Layout showHeader={false} showFooter={false}>
      <div className="min-h-screen flex">
        {/* Left Side - Login Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-md w-full space-y-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
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
                <span className="text-2xl font-bold text-gray-900">Catur Jaya Travel</span>
              </Link>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Selamat Datang Kembali
              </h2>
              <p className="text-gray-600">
                Masuk ke akun Anda untuk melanjutkan petualangan
              </p>
            </div>

            {/* Login Form */}
            <LoginForm onSubmit={handleLogin} />

            {/* Register Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Belum punya akun?{' '}
                <Link
                  to="/register"
                  state={{ from }}
                  className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
                >
                  Daftar sekarang
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

        {/* Right Side - Image */}
        <motion.div
          className="hidden lg:block lg:flex-1 relative"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 to-primary-800/90 z-10"></div>
          <img
            src="/images/login-bg.jpg"
            alt="Beautiful Indonesia"
            className="w-full h-full object-cover"
          />
          
          {/* Overlay Content */}
          <div className="absolute inset-0 z-20 flex items-center justify-center p-12">
            <div className="text-center text-white">
              <motion.h3
                className="text-4xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Jelajahi Keindahan Indonesia
              </motion.h3>
              
              <motion.p
                className="text-xl text-primary-100 mb-8 max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Temukan destinasi wisata menakjubkan dan buat kenangan tak terlupakan bersama kami
              </motion.p>

              <motion.div
                className="grid grid-cols-2 gap-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div>
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-primary-200">Destinasi</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">10K+</div>
                  <div className="text-primary-200">Pelanggan</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">50+</div>
                  <div className="text-primary-200">Kota</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">5</div>
                  <div className="text-primary-200">Tahun</div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Login;