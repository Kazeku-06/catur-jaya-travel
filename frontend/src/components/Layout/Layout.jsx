import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import LoadingSpinner from '../LoadingSpinner';
import { useApp } from '../../store/AppContext';
import { useAuth } from '../../store/AuthContext';

const Layout = ({ children }) => {
  const { loading, error, successMessage, clearError, clearSuccessMessage } = useApp();
  const { loading: authLoading } = useAuth();

  // Show global loading on initial auth check
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Global Loading Overlay */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-lg p-6 text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Processing...</p>
          </div>
        </motion.div>
      )}

      {/* Global Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="bg-red-500 text-white px-4 py-3 text-center relative"
        >
          <span>{error}</span>
          <button
            onClick={clearError}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200"
          >
            ×
          </button>
        </motion.div>
      )}

      {/* Global Success Message */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="bg-green-500 text-white px-4 py-3 text-center relative"
        >
          <span>{successMessage}</span>
          <button
            onClick={clearSuccessMessage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200"
          >
            ×
          </button>
        </motion.div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;