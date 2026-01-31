import { Suspense } from 'react';
import { motion } from 'framer-motion';
import Header from '../layout/Header';
import Footer from './Footer';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="loading-spinner"></div>
  </div>
);

const Layout = ({ children, showHeader = true, showFooter = true, className = '' }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && <Header />}
      
      <main className={`flex-1 ${showHeader ? 'pt-16 lg:pt-20' : ''} ${className}`}>
        <Suspense fallback={<LoadingSpinner />}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </Suspense>
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;