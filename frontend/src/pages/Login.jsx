import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
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
    if (authToken) {
      navigate(from, { replace: true });
    }
  }, [authToken, navigate, from]);

  const handleLogin = async (formData) => {
    try {
      const response = await api.post(endpoints.login, formData);
      const { user, access_token } = response.data;
      setAuthToken(access_token);
      setUserData(user);
      navigate(from, { replace: true });
    } catch (error) {
      const message = error.response?.data?.message || 'Login gagal. Silakan coba lagi.';
      throw new Error(message);
    }
  };

  return (
    <Layout showHeader={false} showFooter={false}>
      <div className="min-h-screen bg-white flex flex-col items-center overflow-x-hidden font-sans">
        
        {/* HEADER SECTION: Background Biru + Double Wave */}
        <div className="relative w-full h-[38vh] bg-gradient-to-tr from-[#60EFFF] to-[#0072FF] flex flex-col items-center justify-center shrink-0">
          
          {/* LOGO SECTION */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="z-30 flex flex-col items-center -mt-8"
          >
            <img 
              src="/logo_1.jpg-removebg-preview (1).png" 
              alt="Logo Catur Jaya Mandiri" 
              className="w-44 sm:w-52 drop-shadow-xl"
            />
          </motion.div>

          {/* WAVE CONTAINER: Ini kunci lekukannya bro */}
          <div className="absolute bottom-0 w-full leading-[0] z-20">
            <svg 
              viewBox="0 0 500 150" 
              preserveAspectRatio="none" 
              className="relative block w-full h-[80px] sm:h-[120px]"
            >
              {/* Layer 1: Ungu (Aksen Bawah) */}
              <path 
                d="M0,180 C100,150 400,-45 550, C150 120 L500,80 L0,150 Z" 
                fill="#4A3AFF" 
              />
              {/* Layer 2: Putih (Background Bawah) */}
              <path 
                d="M0,80 C150,170 350,-30 500,80 L500,150 L0,150 Z" 
                fill="#ffffff" 
              />
            </svg>
          </div>
        </div>

        {/* FORM SECTION */}
        <div className="w-full max-w-md px-8 flex flex-col items-center -mt-2 z-30">
          
          {/* Judul & Subjudul - Font Fix */}
            <div className="text-center mt-4 mb-8">
              <h1 className="text-3xl font-[900] text-[#333333] tracking-tight font-sans">
                hello!
              </h1>
              <p className="text-gray-400 font-medium text-[15px] mt-1 tracking-wide">
                Sign in to continue.
              </p>
            </div>

          {/* Login Form Component */}
          <div className="w-full">
            <LoginForm onSubmit={handleLogin} />
          </div>

          {/* FOOTER SECTION */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 w-full flex flex-col items-center pb-10"
          >
            <p className="text-gray-400 text-sm mb-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#4A3AFF] font-bold hover:underline">
                Sign Up
              </Link>
            </p>

            {/* Tombol Back to Home */}
            <Link
              to="/"
              className="flex items-center text-[10px] font-bold text-gray-300 hover:text-blue-500 transition-all uppercase tracking-[0.2em]"
            >
              <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;