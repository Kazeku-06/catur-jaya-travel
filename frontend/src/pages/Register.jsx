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
    if (authToken) {
      navigate(from, { replace: true });
    }
  }, [authToken, navigate, from]);

  const handleRegister = async (formData) => {
    try {
      const response = await api.post(endpoints.register, formData);
      navigate('/login', { 
        state: { 
          from,
          message: response.data.message || 'Registrasi berhasil! Silakan login.' 
        } 
      });
    } catch (error) {
      let message = 'Registrasi gagal. Silakan coba lagi.';
      if (error.response?.data?.errors) {
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
      <div className="min-h-screen bg-white flex flex-col items-center overflow-x-hidden font-sans">
        
        {/* HEADER SECTION: Background Biru + Double Wave (Identik dengan Login) */}
        <div className="relative w-full h-[35vh] bg-gradient-to-tr from-[#60EFFF] to-[#0072FF] flex flex-col items-center justify-center shrink-0">
          
          {/* LOGO SECTION */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="z-30 flex flex-col items-center -mt-8"
          >
            <img 
              src="/logo_1.jpg-removebg-preview (1).png" 
              alt="Logo Catur Jaya Mandiri" 
              className="w-40 sm:w-48 drop-shadow-xl"
            />
          </motion.div>

          {/* WAVE CONTAINER: 2 Lengkungan (Kiri naik, Tengah lembah, Kanan naik lagi) */}
          <div className="absolute bottom-0 w-full leading-[0] z-20">
            <svg 
              viewBox="0 0 500 150" 
              preserveAspectRatio="none" 
              className="relative block w-full h-[80px] sm:h-[110px]"
            >
              {/* Layer 1: Ungu (Aksen Bawah) */}
              <path 
                d="MM0,180 C100,150 400,-45 550, C150 120 L500,80 L0,150 Z" 
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
        <div className="w-full max-w-md px-8 flex flex-col items-center -mt-4 z-30">
          
           {/* Judul & Subjudul - Font Fix */}
            <div className="text-center mt-4 mb-8">
              <h1 className="text-3xl font-[900] text-[#333333] tracking-tight font-sans">
                hello!
              </h1>
              <p className="text-gray-400 font-medium text-[15px] mt-1 tracking-wide">
                Sign Up to continue.
              </p>
            </div>

          {/* Register Form Component */}
          <div className="w-full">
            <RegisterForm onSubmit={handleRegister} />
          </div>

          {/* FOOTER SECTION */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 w-full flex flex-col items-center pb-10"
          >
            <p className="text-gray-400 text-sm mb-6">
              Already have an account?{' '}
              <Link to="/login" className="text-[#4A3AFF] font-bold hover:underline">
                Sign In
              </Link>
            </p>

            {/* Tombol Back to Home */}
            <Link
              to="/"
              className="flex items-center text-[10px] font-bold text-gray-300 honver:text-blue-500 transition-all uppercase tracking-[0.2em]"
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

export default Register;