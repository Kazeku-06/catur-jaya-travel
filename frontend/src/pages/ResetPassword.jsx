import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Alert from '../components/ui/Alert';
import { authService } from '../services/authService';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    email: '',
    token: '',
    password: '',
    password_confirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    if (!email || !token) {
      setError('Link reset password tidak valid. Silakan minta link reset password baru.');
      return;
    }

    setFormData(prev => ({
      ...prev,
      email,
      token
    }));
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.password) {
      errors.password = 'Password baru wajib diisi';
    } else if (formData.password.length < 8) {
      errors.password = 'Password minimal 8 karakter';
    }

    if (!formData.password_confirmation) {
      errors.password_confirmation = 'Konfirmasi password wajib diisi';
    } else if (formData.password !== formData.password_confirmation) {
      errors.password_confirmation = 'Konfirmasi password tidak cocok';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');

      await authService.resetPassword(formData);

      alert('Password berhasil direset. Silakan login dengan password baru Anda.');
      navigate('/login');
    } catch (error) {
      console.error('Reset password error:', error);

      // Handle specific Google user error
      if (error.response?.data?.error === 'GOOGLE_USER_RESET_NOT_ALLOWED') {
        setError(
          'Akun ini menggunakan login Google. Reset password tidak tersedia. Silakan login menggunakan Google.'
        );
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Terjadi kesalahan. Silakan coba lagi atau minta link reset password baru.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!formData.email || !formData.token) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 space-y-4">
            <Alert variant="error">
              Link reset password tidak valid. Silakan minta link reset password baru.
            </Alert>

            <div className="text-center">
              <Link
                to="/forgot-password"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Minta Link Reset Password Baru
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">

          {/* Header */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-gray-900">
              Reset Password
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Masukkan password baru untuk akun:
              <span className="block font-medium text-gray-800 mt-1">
                {formData.email}
              </span>
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            className="bg-white rounded-xl shadow-md p-6 sm:p-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && <Alert variant="error">{error}</Alert>}

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password Baru
                </label>
                <div className="mt-1">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Masukkan password baru"
                    disabled={loading}
                    error={validationErrors.password}
                  />
                </div>
                {validationErrors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.password}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                  Konfirmasi Password Baru
                </label>
                <div className="mt-1">
                  <Input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    placeholder="Konfirmasi password baru"
                    disabled={loading}
                    error={validationErrors.password_confirmation}
                  />
                </div>
                {validationErrors.password_confirmation && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.password_confirmation}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Mereset Password...' : 'Reset Password'}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-200" />
              <span className="px-3 text-sm text-gray-500">Atau</span>
              <div className="flex-1 border-t border-gray-200" />
            </div>

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                Kembali ke halaman login
              </Link>
            </div>
          </motion.div>

          {/* Security Info */}
          <motion.div
            className="rounded-xl border border-yellow-200 bg-yellow-50 p-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="flex gap-3">
              <svg
                className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>

              <div>
                <h3 className="text-sm font-semibold text-yellow-800">
                  Keamanan
                </h3>
                <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-yellow-700">
                  <li>Setelah reset, Anda akan logout dari semua perangkat</li>
                  <li>Gunakan password yang kuat dan unik</li>
                  <li>Jangan bagikan password kepada siapa pun</li>
                </ul>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </Layout>
  );
};

export default ResetPassword;
