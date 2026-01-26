import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Breadcrumb from '../components/navigation/Breadcrumb';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { transactionService } from '../services/transactionService';
import api, { endpoints } from '../config/api';
import { formatCurrency, formatDate, getImageUrl } from '../utils/helpers';

const Payment = () => {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [authToken] = useLocalStorage('auth_token', null);
  
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [midtransConfig, setMidtransConfig] = useState(null);

  // Get data from navigation state if available
  const stateData = location.state || {};

  useEffect(() => {
    if (!authToken) {
      navigate('/login');
      return;
    }
    
    fetchTransactionDetail();
    fetchMidtransConfig();
  }, [transactionId, authToken, navigate]);

  const fetchTransactionDetail = async () => {
    try {
      setLoading(true);
      
      // If we have transaction data from state, use it temporarily
      if (stateData.transaction) {
        setTransaction({
          ...stateData.transaction,
          item: stateData.trip || stateData.travel,
          bookingData: stateData.bookingData
        });
      }
      
      // Fetch fresh data from API
      const response = await transactionService.getTransactionDetail(transactionId);
      setTransaction(response.data);
    } catch (error) {
      console.error('Error fetching transaction:', error);
      if (error.response?.status === 404) {
        navigate('/my-bookings');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchMidtransConfig = async () => {
    try {
      const response = await api.get(endpoints.midtransConfig);
      setMidtransConfig(response.data);
      
      // Load Midtrans Snap script
      const script = document.createElement('script');
      script.src = response.data.is_production 
        ? 'https://app.midtrans.com/snap/snap.js'
        : 'https://app.sandbox.midtrans.com/snap/snap.js';
      script.setAttribute('data-client-key', response.data.client_key);
      document.head.appendChild(script);
    } catch (error) {
      console.error('Error fetching Midtrans config:', error);
    }
  };

  const handlePayment = () => {
    if (!transaction?.snap_token) {
      alert('Token pembayaran tidak tersedia. Silakan coba lagi.');
      return;
    }

    setPaymentLoading(true);

    window.snap.pay(transaction.snap_token, {
      onSuccess: function(result) {
        console.log('Payment success:', result);
        setPaymentLoading(false);
        navigate(`/payment/success?transaction_id=${transactionId}`);
      },
      onPending: function(result) {
        console.log('Payment pending:', result);
        setPaymentLoading(false);
        navigate(`/payment/pending?transaction_id=${transactionId}`);
      },
      onError: function(result) {
        console.log('Payment error:', result);
        setPaymentLoading(false);
        navigate(`/payment/failed?transaction_id=${transactionId}`);
      },
      onClose: function() {
        console.log('Payment popup closed');
        setPaymentLoading(false);
      }
    });
  };

  const breadcrumbItems = [
    { label: 'Beranda', href: '/' },
    { label: 'Pembayaran' }
  ];

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/3 mb-8"></div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!transaction) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Transaksi tidak ditemukan</h1>
          <Button onClick={() => navigate('/my-bookings')}>
            Lihat Riwayat Booking
          </Button>
        </div>
      </Layout>
    );
  }

  const item = transaction.item;
  const isTrip = transaction.transaction_type === 'trip';

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Payment Header */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Pembayaran</h1>
              <p className="text-gray-600">Selesaikan pembayaran untuk menyelesaikan booking Anda</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Booking Details */}
              <motion.div
                className="lg:col-span-2 space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {/* Item Details */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Detail Pesanan</h2>
                  
                  <div className="flex items-start space-x-4">
                    <img
                      src={getImageUrl(item?.image_url || item?.image)}
                      alt={item?.name || item?.title}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = isTrip ? '/images/trip-placeholder.jpg' : '/images/travel-placeholder.jpg';
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {item?.name || item?.title || (isTrip ? 'Trip' : 'Travel')}
                      </h3>
                      {isTrip ? (
                        <>
                          <p className="text-sm text-gray-600 mb-1">{item?.location}</p>
                          <p className="text-sm text-gray-600">{item?.duration}</p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm text-gray-600 mb-1">
                            {item?.departure_location} → {item?.destination_location}
                          </p>
                          <p className="text-sm text-gray-600">{item?.vehicle_type}</p>
                        </>
                      )}
                    </div>
                    <Badge variant="warning">Menunggu Pembayaran</Badge>
                  </div>
                </div>

                {/* Booking Information */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Informasi Booking</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Order ID</p>
                      <p className="font-medium">{transaction.order_id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {isTrip ? 'Jumlah Peserta' : 'Jumlah Penumpang'}
                      </p>
                      <p className="font-medium">
                        {transaction.participants || transaction.passengers || 1} orang
                      </p>
                    </div>
                    {transaction.departure_date && (
                      <div>
                        <p className="text-sm text-gray-600">Tanggal Keberangkatan</p>
                        <p className="font-medium">{formatDate(transaction.departure_date)}</p>
                      </div>
                    )}
                    {transaction.contact_phone && (
                      <div>
                        <p className="text-sm text-gray-600">Nomor Telepon</p>
                        <p className="font-medium">{transaction.contact_phone}</p>
                      </div>
                    )}
                    {transaction.pickup_location && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600">Lokasi Penjemputan</p>
                        <p className="font-medium">{transaction.pickup_location}</p>
                      </div>
                    )}
                    {transaction.destination_address && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600">Alamat Tujuan</p>
                        <p className="font-medium">{transaction.destination_address}</p>
                      </div>
                    )}
                    {transaction.special_requests && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600">Permintaan Khusus</p>
                        <p className="font-medium">{transaction.special_requests}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Payment Summary */}
              <motion.div
                className="lg:col-span-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Ringkasan Pembayaran</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">{formatCurrency(transaction.total_price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Biaya Admin</span>
                      <span className="font-medium">Gratis</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-primary-600">{formatCurrency(transaction.total_price)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Button */}
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={paymentLoading}
                    onClick={handlePayment}
                    disabled={!transaction.snap_token}
                  >
                    Bayar Sekarang
                  </Button>

                  {/* Payment Methods Info */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-3">Metode Pembayaran:</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center">
                        <div className="bg-gray-100 rounded p-2 mb-1">
                          <span className="text-xs font-medium">BANK</span>
                        </div>
                        <span className="text-xs text-gray-600">Transfer</span>
                      </div>
                      <div className="text-center">
                        <div className="bg-gray-100 rounded p-2 mb-1">
                          <span className="text-xs font-medium">CARD</span>
                        </div>
                        <span className="text-xs text-gray-600">Kartu</span>
                      </div>
                      <div className="text-center">
                        <div className="bg-gray-100 rounded p-2 mb-1">
                          <span className="text-xs font-medium">E-WALLET</span>
                        </div>
                        <span className="text-xs text-gray-600">Digital</span>
                      </div>
                    </div>
                  </div>

                  {/* Security Info */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span>Pembayaran aman dengan Midtrans</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Help Section */}
            <motion.div
              className="mt-12 bg-white rounded-xl p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Butuh Bantuan?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Hubungi Customer Service</h4>
                  <div className="flex items-center text-sm text-primary-600 mb-2">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>+62 812-3456-7890</span>
                  </div>
                  <div className="flex items-center text-sm text-primary-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>support@caturjayatravel.com</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Jam Operasional</h4>
                  <p className="text-sm text-gray-600">
                    Senin - Jumat: 08:00 - 17:00 WIB<br />
                    Sabtu - Minggu: 09:00 - 15:00 WIB
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Payment;