import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import Button from '../ui/Button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [authToken] = useLocalStorage('auth_token', null);
  const [userData] = useLocalStorage('user_data', null);
  
  const location = useLocation();
  const navigate = useNavigate();

  const isDarkHeroPage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    navigate('/');
    setShowProfileMenu(false);
    setIsMenuOpen(false);
  };

  const navigation = [
    { name: 'Beranda', href: '/' },
    { name: 'Paket Trip', href: '/trips' },
    { name: 'Travel', href: '/travels' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-white shadow-md'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-13 h-12 lg:w-14 lg:h-14 overflow-hidden flex items-center justify-center">
              <img 
                src="logo_1.jpg-removebg-preview.png" 
                alt="Catur Jaya Mandiri Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg lg:text-xl font-bold text-gray-900 leading-tight">
                Catur Jaya Mandiri
              </span>
              <span className="text-xs lg:text-sm font-semibold text-gray-600 tracking-wider -mt-1">
                Tour & Travel
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 flex-1 ml-60">

            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`font-medium transition-colors duration-200 ${
                  isActive(item.href) ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth & Profile Dropdown */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {authToken ? (userData?.name?.charAt(0)?.toUpperCase() || 'U') : '?'}
                  </span>
                </div>
                <span className="text-gray-700 font-medium">
                  {authToken ? (userData?.name || 'User') : 'Menu'}
                </span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="bg-[#0095f6] p-4 flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-300 rounded-full border-2 border-white/50 flex items-center justify-center overflow-hidden">
                        <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-white font-bold leading-tight truncate">
                          {!authToken ? "Anonymous" : (userData?.name || "User")}
                        </h4>
                        <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest">
                          {!authToken 
                            ? "Guest" 
                            : userData?.role === 'admin' 
                              ? "ADMIN" 
                              : "CUSTOMER"}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white">
                      {authToken && userData?.role === 'admin' ? (
                        <Link to="/admin" onClick={() => setShowProfileMenu(false)} className="flex items-center space-x-4 px-5 py-4 text-primary-600 hover:bg-primary-50 border-b border-gray-100 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          </svg>
                          <span className="font-bold">Admin Dashboard</span>
                        </Link>
                      ) : (
                        <>
                         
                          <Link to="/my-bookings" onClick={() => setShowProfileMenu(false)} className="flex items-center space-x-4 px-5 py-3 text-gray-600 hover:bg-gray-50 border-b border-gray-100">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <span className="font-medium">Bookings</span>
                          </Link>
                          <Link to="/contact" onClick={() => setShowProfileMenu(false)} className="flex items-center space-x-4 px-5 py-3 text-gray-600 hover:bg-gray-50 border-b border-gray-100">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            <span className="font-medium">Contact</span>
                          </Link>
                          <Link to="/about" onClick={() => setShowProfileMenu(false)} className="flex items-center space-x-4 px-5 py-3 text-gray-600 hover:bg-gray-50 border-b border-gray-100">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span className="font-medium">About us</span>
                          </Link>
                        </>
                      )}
                    </div>

                    <div className="p-4 bg-gray-50/50">
                      {authToken ? (
                        <button
                          onClick={handleLogout}
                          className="w-full bg-[#0095f6] hover:bg-blue-600 text-white font-bold py-2.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                          <span>Keluar</span>
                        </button>
                      ) : (
                        <Link to="/login" onClick={() => setShowProfileMenu(false)}>
                          <button className="w-full bg-[#0095f6] hover:bg-blue-600 text-white font-bold py-2.5 rounded-xl transition-all shadow-md active:scale-95">
                            Masuk
                          </button>
                        </Link>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu - MODIFIED TO MATCH DESIRED STYLE */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="lg:hidden bg-white border-t border-gray-200 shadow-xl overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="py-4 space-y-1 px-4">
                {navigation.map((item) => (
                  <Link 
                    key={item.name} 
                    to={item.href} 
                    className={`block px-4 py-2 text-base font-medium rounded-lg transition-colors ${
                      isActive(item.href) ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}

                <div className="mt-6 rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  {/* Header Biru Versi Mobile */}
                  <div className="bg-[#0095f6] p-4 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full border-2 border-white/50 flex items-center justify-center overflow-hidden">
                      <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-white font-bold leading-tight truncate">
                        {!authToken ? "Anonymous" : (userData?.name || "User")}
                      </h4>
                      <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest">
                        {!authToken 
                          ? "Guest" 
                          : userData?.role === 'admin' 
                            ? "ADMIN" 
                            : "CUSTOMER"}
                      </p>
                    </div>
                  </div>

                  {/* Menu List Versi Mobile */}
                  <div className="bg-white">
                    {authToken && userData?.role === 'admin' ? (
                      <Link to="/admin" className="flex items-center space-x-4 px-5 py-4 text-primary-600 hover:bg-primary-50 border-b border-gray-100 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        </svg>
                        <span className="font-bold">Admin Dashboard</span>
                      </Link>
                    ) : (
                      <>
                        <Link to="/my-bookings" className="flex items-center space-x-4 px-5 py-3 text-gray-600 hover:bg-gray-50 border-b border-gray-100">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          <span className="font-medium">Bookings</span>
                        </Link>
                        <Link to="/contact" className="flex items-center space-x-4 px-5 py-3 text-gray-600 hover:bg-gray-50 border-b border-gray-100">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                          <span className="font-medium">Contact</span>
                        </Link>
                      </>
                    )}
                  </div>

                  {/* Tombol Logout/Masuk Versi Mobile */}
                  <div className="p-4 bg-gray-50/50">
                    {authToken ? (
                      <button
                        onClick={handleLogout}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        <span>Keluar</span>
                      </button>
                    ) : (
                      <Link to="/login" className="block">
                        <button className="w-full bg-[#0095f6] hover:bg-blue-600 text-white font-bold py-2.5 rounded-xl transition-all shadow-md active:scale-95">
                          Masuk
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;