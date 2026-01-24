import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiUser, FiLogOut, FiHome } from 'react-icons/fi';
import { useAuth } from '../../store/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
            onClick={closeMenu}
          >
            {import.meta.env.VITE_APP_NAME}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/trips" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Paket Trip
            </Link>
            <Link 
              to="/travels" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Travel
            </Link>
            <Link 
              to="/carter-mobiles" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Carter Mobil
            </Link>
            
            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Hi, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
                >
                  <FiLogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-gray-200 py-4"
            >
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/" 
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={closeMenu}
                >
                  <FiHome size={16} />
                  <span>Home</span>
                </Link>
                <Link 
                  to="/trips" 
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={closeMenu}
                >
                  Paket Trip
                </Link>
                <Link 
                  to="/travels" 
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={closeMenu}
                >
                  Travel
                </Link>
                <Link 
                  to="/carter-mobiles" 
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={closeMenu}
                >
                  Carter Mobil
                </Link>
                
                {/* Mobile Auth Section */}
                <div className="border-t border-gray-200 pt-4">
                  {isAuthenticated ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 text-gray-700">
                        <FiUser size={16} />
                        <span>Hi, {user?.name}</span>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
                      >
                        <FiLogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Link 
                        to="/login" 
                        className="block text-blue-600 hover:text-blue-700 transition-colors"
                        onClick={closeMenu}
                      >
                        Login
                      </Link>
                      <Link 
                        to="/register" 
                        className="block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
                        onClick={closeMenu}
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;