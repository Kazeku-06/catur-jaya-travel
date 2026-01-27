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
      <div className="min-h-screen flex bg-gray-50">
        {/* Left Side - Visual & Branding (Hidden on mobile) */}
        <motion.div
          className="hidden lg:block lg:flex-[1.2] relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Decorative Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 via-primary-700/85 to-primary-900/95 z-10"></div>
          
          <img
            src="/images/register-bg.jpg"
            alt="Adventure Indonesia"
            className="absolute inset-0 w-full h-full object-cover scale-105"
          />
          
          {/* Overlay Content */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-16 text-white">
            <div className="max-w-md text-center">
              <motion.h3
                className="text-5xl font-extrabold mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Mulai Petualangan <br /> Anda Sekarang
              </motion.h3>
              
              <motion.p
                className="text-xl text-primary-100 mb-12 opacity-90 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Bergabunglah dengan ribuan traveler yang telah mempercayai kami untuk petualangan mereka
              </motion.p>

              <motion.div
                className="space-y-5 bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {[
                  'Booking mudah dan cepat',
                  'Harga terjangkau dan transparan',
                  'Pelayanan CS 24/7',
                  'Destinasi terpercaya'
                ].map((text, index) => (
                  <div key={index} className="flex items-center text-primary-50">
                    <div className="bg-primary-500/30 rounded-full p-1 mr-4">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-medium">{text}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Register Form */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-12 lg:px-20 bg-white">
          <motion.div
            className="max-w-md w-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
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
                <span className="text-2xl font-extrabold text-gray-900 tracking-tight">Catur Jaya Mandiri</span>
              </Link>
            </div>
            
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
                Buat Akun Baru
              </h2>
              <p className="text-gray-500 text-lg">
                Daftar sekarang dan mulai petualangan Anda
              </p>
            </div>

            {/* Form Container */}
            <div className="bg-white">
              <RegisterForm onSubmit={handleRegister} />
            </div>

            {/* Footer Links */}
            <div className="mt-8 space-y-6">
              <div className="text-center">
                <p className="text-gray-600">
                  Sudah punya akun?{' '}
                  <Link
                    to="/login"
                    state={{ from }}
                    className="font-semibold text-primary-600 hover:text-primary-700 transition-colors underline-offset-4 hover:underline"
                  >
                    Masuk di sini
                  </Link>
                </p>
              </div>

              <div className="text-center">
                <Link
                  to="/"
                  className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors group"
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
      </div>
    </Layout>
  );
};

export default Register;