import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import LoginForm from '../components/forms/LoginForm';
import AdminLoginHelper from '../components/AdminLoginHelper';
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
      <div className="min-h-screen flex bg-gray-50">
        {/* Left Side - Login Form */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-12 lg:px-20 bg-white">
          <motion.div
            className="max-w-md w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Logo & Brand */}
            <div className="mb-10 text-center lg:text-left">
              <Link to="/" className="inline-flex items-center space-x-3 group">
                <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-200 group-hover:bg-primary-700 transition-colors">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-2xl font-extrabold text-gray-900 tracking-tight">Catur Jaya Travel</span>
              </Link>
            </div>

            {/* Welcome Text */}
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">
                Selamat Datang Kembali
              </h2>
              <p className="text-gray-500 text-lg">
                Masuk ke akun Anda untuk melanjutkan petualangan
              </p>
            </div>

            {/* Form Container */}
            <div className="bg-white rounded-2xl">
              <LoginForm onSubmit={handleLogin} />
              
              <div className="mt-8 pt-6 border-t border-gray-100">
                <AdminLoginHelper onAdminLogin={handleLogin} />
              </div>
            </div>

            {/* Footer Links */}
            <div className="mt-10 space-y-4">
              <div className="text-center">
                <p className="text-gray-600">
                  Belum punya akun?{' '}
                  <Link
                    to="/register"
                    state={{ from }}
                    className="font-semibold text-primary-600 hover:text-primary-700 transition-colors underline-offset-4 hover:underline"
                  >
                    Daftar sekarang
                  </Link>
                </p>
              </div>

              <div className="text-center">
                <Link
                  to="/"
                  className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors duration-200 group"
                >
                  <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Kembali ke Beranda
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Visual Section */}
        <motion.div
          className="hidden lg:block lg:flex-[1.2] relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Decorative Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 via-primary-700/85 to-primary-900/95 z-10"></div>
          
          <img
            src="/images/login-bg.jpg"
            alt="Beautiful Indonesia"
            className="absolute inset-0 w-full h-full object-cover scale-105"
          />
          
          {/* Floating Content */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-16 text-white">
            <motion.div 
              className="text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h3 className="text-5xl font-extrabold mb-6 leading-tight">
                Jelajahi Keindahan <br /> Indonesia
              </h3>
              <p className="text-xl text-primary-100 mb-12 max-w-lg mx-auto leading-relaxed opacity-90">
                Temukan destinasi wisata menakjubkan dan buat kenangan tak terlupakan bersama kami.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-10 max-w-md mx-auto bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <div className="space-y-1">
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-primary-200 text-sm uppercase tracking-wider font-medium">Destinasi</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold">10K+</div>
                  <div className="text-primary-200 text-sm uppercase tracking-wider font-medium">Pelanggan</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold">50+</div>
                  <div className="text-primary-200 text-sm uppercase tracking-wider font-medium">Kota</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold">5</div>
                  <div className="text-primary-200 text-sm uppercase tracking-wider font-medium">Tahun</div>
                </div>
              </div>
            </motion.div>

            {/* Bottom Credit */}
            <div className="absolute bottom-10 text-primary-200/60 text-sm">
              © 2024 Catur Jaya Travel. All rights reserved.
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Login;