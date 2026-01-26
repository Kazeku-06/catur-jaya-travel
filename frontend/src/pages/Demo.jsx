import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { authService } from '../services/authService';

const Demo = () => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const navigate = useNavigate();

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  const handleAdminLogin = async () => {
    setLoading(true);
    try {
      const response = await authService.login({
        email: 'admin@travel.com',
        password: 'password123'
      });
      
      showAlert('success', 'Login admin berhasil! Mengalihkan ke dashboard...');
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    } catch (error) {
      console.error('Login error:', error);
      showAlert('error', 'Login gagal. Pastikan backend sudah berjalan dan seeder admin sudah dijalankan.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserLogin = async () => {
    setLoading(true);
    try {
      // Try to register a demo user first
      try {
        await authService.register({
          name: 'Demo User',
          email: 'user@demo.com',
          password: 'password123',
          password_confirmation: 'password123'
        });
      } catch (regError) {
        // User might already exist, try to login
      }

      const response = await authService.login({
        email: 'user@demo.com',
        password: 'password123'
      });
      
      showAlert('success', 'Login user berhasil! Mengalihkan ke beranda...');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Login error:', error);
      showAlert('error', 'Login gagal. Pastikan backend sudah berjalan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 py-12">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                🚀 Demo Catur Jaya Travel
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Sistem manajemen travel dengan frontend React dan backend Laravel
              </p>
              
              {alert.show && (
                <Alert
                  type={alert.type}
                  message={alert.message}
                  onClose={() => setAlert({ show: false, type: '', message: '' })}
                  className="mb-6"
                />
              )}
            </div>

            {/* Demo Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Admin Demo */}
              <motion.div
                className="bg-white rounded-xl shadow-lg p-8"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Admin Dashboard</h3>
                  <p className="text-gray-600 mb-6">
                    Akses panel admin untuk mengelola trips, travels, dan transaksi dengan API JSON-only
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                    <h4 className="font-semibold text-gray-900 mb-2">Fitur Admin:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>✅ CRUD Trips dengan upload gambar</li>
                      <li>✅ CRUD Travels dengan upload gambar</li>
                      <li>✅ Dashboard dengan statistik</li>
                      <li>✅ JSON-only API integration</li>
                      <li>✅ Base64 & URL image upload</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3 mb-6 text-sm">
                    <p className="text-blue-800">
                      <strong>Login:</strong> admin@travel.com<br />
                      <strong>Password:</strong> password123
                    </p>
                  </div>

                  <Button
                    onClick={handleAdminLogin}
                    loading={loading}
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    {loading ? 'Logging in...' : 'Login sebagai Admin'}
                  </Button>
                </div>
              </motion.div>

              {/* User Demo */}
              <motion.div
                className="bg-white rounded-xl shadow-lg p-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">User Interface</h3>
                  <p className="text-gray-600 mb-6">
                    Pengalaman user untuk melihat dan memesan trips & travels
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                    <h4 className="font-semibold text-gray-900 mb-2">Fitur User:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>✅ Browse trips & travels</li>
                      <li>✅ Detail pages dengan gambar</li>
                      <li>✅ Responsive mobile design</li>
                      <li>✅ Smooth animations</li>
                      <li>✅ Error handling</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 rounded-lg p-3 mb-6 text-sm">
                    <p className="text-green-800">
                      <strong>Login:</strong> user@demo.com<br />
                      <strong>Password:</strong> password123<br />
                      <em>(akan dibuat otomatis)</em>
                    </p>
                  </div>

                  <Button
                    onClick={handleUserLogin}
                    loading={loading}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? 'Logging in...' : 'Login sebagai User'}
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* Technical Info */}
            <motion.div
              className="bg-white rounded-xl shadow-lg p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                🛠️ Technical Stack
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Frontend (React)</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>⚛️ React 18 dengan Hooks</li>
                    <li>🎨 Tailwind CSS untuk styling</li>
                    <li>🎭 Framer Motion untuk animasi</li>
                    <li>🛣️ React Router untuk routing</li>
                    <li>📡 Axios untuk API calls</li>
                    <li>🔒 Protected routes & auth</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Backend (Laravel)</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>🐘 Laravel 11 framework</li>
                    <li>🔐 Sanctum authentication</li>
                    <li>📊 MySQL database</li>
                    <li>🖼️ Image upload & storage</li>
                    <li>📝 JSON-only API endpoints</li>
                    <li>✅ Validation & error handling</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Persyaratan:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Backend Laravel harus berjalan di <code>http://localhost:8000</code></li>
                  <li>• Database sudah di-migrate dan di-seed</li>
                  <li>• Storage link sudah dibuat (<code>php artisan storage:link</code>)</li>
                  <li>• Admin seeder sudah dijalankan</li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Demo;