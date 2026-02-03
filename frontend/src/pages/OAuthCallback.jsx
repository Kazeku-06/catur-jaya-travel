import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../services/authService';
import Layout from '../components/Layout/Layout';
import Alert from '../components/ui/Alert';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('Memproses login Google...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get parameters from URL
        const token = searchParams.get('token');
        const error = searchParams.get('error');
        const errorMessage = searchParams.get('message');

        if (error) {
          // Handle error from backend
          setStatus('error');
          setMessage(getErrorMessage(error, errorMessage));
          return;
        }

        if (!token) {
          setStatus('error');
          setMessage('Token tidak ditemukan. Silakan coba login lagi.');
          return;
        }

        // Handle successful OAuth callback
        await authService.handleGoogleCallback(token);
        
        setStatus('success');
        setMessage('Login berhasil! Mengalihkan ke dashboard...');
        
        // Redirect after short delay
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 2000);

      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setMessage(error.message || 'Terjadi kesalahan saat memproses login Google.');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  const getErrorMessage = (errorCode, errorMessage) => {
    const errorMessages = {
      'INVALID_STATE': 'Sesi login Google tidak valid. Silakan coba lagi.',
      'DATA_INCOMPLETE': 'Data dari Google tidak lengkap. Pastikan Anda memberikan izin email dan profil.',
      'OAUTH_ERROR': 'Terjadi kesalahan saat login dengan Google. Silakan coba lagi.',
      'ADMIN_NOT_ALLOWED': 'Admin tidak dapat login menggunakan Google. Silakan gunakan email dan password.',
      'GOOGLE_USER_RESET_NOT_ALLOWED': 'Akun ini menggunakan login Google. Reset password tidak tersedia.'
    };

    return errorMessages[errorCode] || errorMessage || 'Terjadi kesalahan yang tidak diketahui.';
  };

  const handleRetry = () => {
    navigate('/login', { replace: true });
  };

  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  return (
    <Layout showHeader={false} showFooter={false}>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <motion.div
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Status Icon */}
          <div className="mb-6">
            {status === 'processing' && (
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="animate-spin w-8 h-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}

            {status === 'success' && (
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}

            {status === 'error' && (
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {status === 'processing' && 'Memproses Login'}
            {status === 'success' && 'Login Berhasil!'}
            {status === 'error' && 'Login Gagal'}
          </h2>

          {/* Message */}
          <div className="mb-8">
            <Alert
              type={status === 'error' ? 'error' : status === 'success' ? 'success' : 'info'}
              message={message}
              isVisible={true}
              showIcon={false}
            />
          </div>

          {/* Action Buttons */}
          {status === 'error' && (
            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Coba Login Lagi
              </button>
              <button
                onClick={handleGoHome}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Kembali ke Beranda
              </button>
            </div>
          )}

          {status === 'success' && (
            <div className="text-sm text-gray-500">
              Anda akan dialihkan secara otomatis...
            </div>
          )}

          {status === 'processing' && (
            <div className="text-sm text-gray-500">
              Mohon tunggu sebentar...
            </div>
          )}

          {/* Google Logo */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-2 text-gray-400">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm">Google OAuth</span>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default OAuthCallback;