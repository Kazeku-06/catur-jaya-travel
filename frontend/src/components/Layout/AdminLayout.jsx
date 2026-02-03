import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { logout } from '../../utils/auth';
import Button from '../ui/Button';
import Logo from '../ui/Logo';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const [userData] = useLocalStorage('user_data', null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    console.log('AdminLayout logout clicked');
    logout();
  };

  const sidebarItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
        </svg>
      )
    },
    {
      name: 'Trips',
      href: '/admin/trips',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      name: 'Travels',
      href: '/admin/travels',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      )
    },
    {
      name: 'Notifikasi',
      href: '/admin/notifications',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      )
    },
    {
      name: 'Transaksi',
      href: '/admin/transactions',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed on mobile, Sticky on desktop */}
      <div 
        style={{ backgroundColor: '#0d1b2a' }}
        className={`
          fixed lg:sticky top-0 left-0 z-50 w-64 h-screen flex-shrink-0 shadow-lg flex flex-col border-r border-gray-800
          transform transition-transform duration-300 ease-in-out lg:transform-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo Section */}
        <div className="p-6 flex-shrink-0">
          <Link to="/" className="flex items-center space-x-2">
            <Logo size="small" />
            {/* Text logo dipaksa putih agar kontras dengan sidebar gelap */}
            <span className="text-xl font-bold text-white">Admin Panel</span>
          </Link>
        </div>

        {/* Navigation Section - Scrollable if needed */}
        <nav className="px-4 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}  
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info & Logout - Fixed at bottom */}
        <div 
          style={{ backgroundColor: '#0d1b2a' }}
          className="flex-shrink-0 p-4 border-t border-gray-800"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {userData?.name?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {userData?.name || 'Admin'}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {userData?.email || 'admin@caturjaya.com'}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Link to="/" className="flex-1">
              <Button variant="outline" size="sm" fullWidth className="border-gray-700 text-gray-300 hover:bg-gray-800">
                Ke Website
              </Button>
            </Link>
            <button 
              onClick={handleLogout}
              className="px-3 py-1 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded border border-red-900/50 transition-colors"
            >
              Keluar
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area - Only this area scrolls on desktop */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0 lg:h-screen lg:overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {userData?.name?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Top Bar - Sticky within main content */}
        <header className="hidden lg:block bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {location.pathname === '/admin' && 'Dashboard'}
                  {location.pathname === '/admin/trips' && 'Kelola Trips'}
                  {location.pathname === '/admin/travels' && 'Kelola Travels'}
                  {location.pathname === '/admin/transactions' && 'Kelola Transaksi'}
                  {location.pathname === '/admin/notifications' && 'Notifikasi'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {location.pathname === '/admin' && 'Selamat datang di panel admin Catur Jaya Travel'}
                  {location.pathname === '/admin/trips' && 'Kelola paket trip wisata'}
                  {location.pathname === '/admin/travels' && 'Kelola layanan travel'}
                  {location.pathname === '/admin/transactions' && 'Kelola transaksi dan pembayaran'}
                  {location.pathname === '/admin/notifications' && 'Notifikasi'}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {new Date().toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date().toLocaleTimeString('id-ID')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content - This is the only scrollable area on desktop */}
        <main className="flex-1 p-4 lg:p-6 lg:overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;