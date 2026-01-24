import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ErrorBoundary from './components/ErrorBoundary';
import { useLocalStorage } from './hooks/useLocalStorage';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const Trips = lazy(() => import('./pages/Trips'));
const TripDetail = lazy(() => import('./pages/TripDetail'));
const Travels = lazy(() => import('./pages/Travels'));
const TravelDetail = lazy(() => import('./pages/TravelDetail'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const PaymentPending = lazy(() => import('./pages/PaymentPending'));
const PaymentFailed = lazy(() => import('./pages/PaymentFailed'));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="loading-spinner"></div>
  </div>
);

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const [authToken] = useLocalStorage('auth_token', null);
  
  if (!authToken) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Public Route component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const [authToken] = useLocalStorage('auth_token', null);
  
  if (authToken) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <AnimatePresence mode="wait">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                
                {/* Trips Routes */}
                <Route path="/trips" element={<Trips />} />
                <Route path="/trips/:id" element={<TripDetail />} />
                
                {/* Travels Routes */}
                <Route path="/travels" element={<Travels />} />
                <Route path="/travels/:id" element={<TravelDetail />} />
                
                {/* Auth Routes */}
                <Route 
                  path="/login" 
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  } 
                />
                <Route 
                  path="/register" 
                  element={
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  } 
                />
                
                {/* Payment Status Routes */}
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/payment/pending" element={<PaymentPending />} />
                <Route path="/payment/failed" element={<PaymentFailed />} />
                
                {/* Protected Routes */}
                {/* Add more protected routes here as needed */}
                
                {/* Catch all route - 404 */}
                <Route 
                  path="*" 
                  element={
                    <div className="min-h-screen flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                        <p className="text-gray-600 mb-8">Halaman tidak ditemukan</p>
                        <a 
                          href="/" 
                          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                        >
                          Kembali ke Beranda
                        </a>
                      </div>
                    </div>
                  } 
                />
              </Routes>
            </Suspense>
          </AnimatePresence>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
