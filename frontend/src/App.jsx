import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ErrorBoundary from './components/ErrorBoundary';
import { useLocalStorage } from './hooks/useLocalStorage';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Trips = lazy(() => import('./pages/Trips'));
const TripDetail = lazy(() => import('./pages/TripDetail'));
const Travels = lazy(() => import('./pages/Travels'));
const TravelDetail = lazy(() => import('./pages/TravelDetail'));
const Login = lazy(() => import('./pages/Login'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const OAuthCallback = lazy(() => import('./pages/OAuthCallback'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminTrips = lazy(() => import('./pages/AdminTrips'));
const AdminTravels = lazy(() => import('./pages/AdminTravels'));
const AdminBookings = lazy(() => import('./pages/AdminBookings'));
const AdminNotifications = lazy(() => import('./pages/AdminNotifications'));
const AdminTransactions = lazy(() => import('./pages/AdminTransactions'));
const MyBookings = lazy(() => import('./pages/MyBookings'));
const TripBooking = lazy(() => import('./pages/TripBooking'));
const TravelBooking = lazy(() => import('./pages/TravelBooking'));
const Payment = lazy(() => import('./pages/Payment'));

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

// Admin Route component (requires admin role)
const AdminRoute = ({ children }) => {
  const [authToken] = useLocalStorage('auth_token', null);
  const [userData] = useLocalStorage('user_data', null);
  
  if (!authToken) {
    return <Navigate to="/veteran" replace />;
  }
  
  if (!userData || userData.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
          <p className="text-gray-600 mb-8">Akses ditolak. Anda tidak memiliki izin admin.</p>
          <a 
            href="/" 
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            Kembali ke Beranda
          </a>
        </div>
      </div>
    );
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
                <Route path="/about" element={<About />} />
                
                {/* Trips Routes */}
                <Route path="/trips" element={<Trips />} />
                <Route path="/trips/:id" element={<TripDetail />} />
                <Route 
                  path="/trips/:id/booking" 
                  element={
                    <ProtectedRoute>
                      <TripBooking />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Travels Routes */}
                <Route path="/travels" element={<Travels />} />
                <Route path="/travels/:id" element={<TravelDetail />} />
                <Route 
                  path="/travels/:id/booking" 
                  element={
                    <ProtectedRoute>
                      <TravelBooking />
                    </ProtectedRoute>
                  } 
                />
                
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
                  path="/veteran" 
                  element={
                    <PublicRoute>
                      <AdminLogin />
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
                <Route 
                  path="/forgot-password" 
                  element={
                    <PublicRoute>
                      <ForgotPassword />
                    </PublicRoute>
                  } 
                />
                <Route 
                  path="/reset-password" 
                  element={<ResetPassword />} 
                />
                
                {/* OAuth Callback Route */}
                <Route 
                  path="/oauth/callback" 
                  element={<OAuthCallback />} 
                />
                
                {/* Payment Route */}
                <Route 
                  path="/payment/:bookingId" 
                  element={
                    <ProtectedRoute>
                      <Payment />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Protected User Routes */}
                <Route 
                  path="/my-bookings" 
                  element={
                    <ProtectedRoute>
                      <MyBookings />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Admin Routes */}
                <Route 
                  path="/admin" 
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/trips" 
                  element={
                    <AdminRoute>
                      <AdminTrips />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/travels" 
                  element={
                    <AdminRoute>
                      <AdminTravels />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/bookings" 
                  element={
                    <AdminRoute>
                      <AdminBookings />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/notifications" 
                  element={
                    <AdminRoute>
                      <AdminNotifications />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/transactions" 
                  element={
                    <AdminRoute>
                      <AdminTransactions />
                    </AdminRoute>
                  } 
                />
                
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
