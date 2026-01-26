import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { formatCurrency, formatDate } from '../utils/helpers';
import api, { endpoints } from '../config/api';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  const transactionId = searchParams.get('transaction_id');
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    if (transactionId || orderId) {
      fetchTransactionDetail();
    }
  }, [transactionId, orderId]);

  const fetchTransactionDetail = async () => {
    try {
      setLoading(true);
      const id = transactionId || orderId;
      const response = await api.get(endpoints.transactionDetail(id));
      setTransaction(response.data.data);
    } catch (error) {
      console.error('Error fetching transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Success Icon */}
          <motion.div
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-2xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Pembayaran Berhasil!
          </motion.h1>

          {/* Message */}
          <motion.p
            className="text-gray-600 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Terima kasih! Pembayaran Anda telah berhasil diproses. 
            Kami akan mengirimkan konfirmasi booking ke email Anda.
          </motion.p>

          {/* Transaction Details */}
          {!loading && transaction && (
            <motion.div
              className="bg-gray-50 rounded-lg p-4 mb-8 text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h3 className="font-semibold text-gray-900 mb-3">Detail Transaksi</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID Transaksi:</span>
                  <span className="font-medium">{transaction.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Paket:</span>
                  <span className="font-medium">{transaction.trip?.name || transaction.travel?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Jumlah:</span>
                  <span className="font-medium">{formatCurrency(transaction.total_amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tanggal:</span>
                  <span className="font-medium">{transaction.created_at ? formatDate(transaction.created_at) : '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600">Berhasil</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="bg-gray-50 rounded-lg p-4 mb-8">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link to="/my-bookings" className="block">
              <Button variant="primary" size="lg" fullWidth>
                Lihat Riwayat Booking
              </Button>
            </Link>
            
            <Link to="/" className="block">
              <Button variant="outline" size="lg" fullWidth>
                Kembali ke Beranda
              </Button>
            </Link>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="mt-8 pt-6 border-t border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <p className="text-sm text-gray-600 mb-2">
              Butuh bantuan? Hubungi customer service kami
            </p>
            <div className="flex items-center justify-center text-sm text-primary-600">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>+62 812-3456-7890</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default PaymentSuccess;