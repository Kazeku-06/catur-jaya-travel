import { Component } from 'react';
import { motion } from 'framer-motion';
import Button from './ui/Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('Error caught by boundary:', error, errorInfo);
    }
    
    // Here you could also log the error to an error reporting service
    // logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <motion.div
            className="max-w-md w-full text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Error Icon */}
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            {/* Error Message */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Oops! Terjadi Kesalahan
            </h1>
            
            <p className="text-gray-600 mb-8">
              Maaf, terjadi kesalahan yang tidak terduga. Tim kami telah diberitahu 
              dan sedang bekerja untuk memperbaikinya.
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={this.handleReload}
                variant="primary"
                size="lg"
                fullWidth
              >
                Muat Ulang Halaman
              </Button>
              
              <Button
                onClick={this.handleGoHome}
                variant="outline"
                size="lg"
                fullWidth
              >
                Kembali ke Beranda
              </Button>
            </div>

            {/* Error Details (Development Only) */}
            {import.meta.env.DEV && this.state.error && (
              <motion.details
                className="mt-8 text-left bg-gray-100 rounded-lg p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                  Detail Error (Development)
                </summary>
                <div className="text-sm text-gray-600 space-y-2">
                  <div>
                    <strong>Error:</strong>
                    <pre className="mt-1 text-xs bg-red-50 p-2 rounded overflow-auto">
                      {this.state.error.toString()}
                    </pre>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Stack Trace:</strong>
                      <pre className="mt-1 text-xs bg-red-50 p-2 rounded overflow-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </motion.details>
            )}
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;