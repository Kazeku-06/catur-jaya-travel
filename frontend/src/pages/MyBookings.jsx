import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { bookingService } from '../services/bookingService';
import { formatCurrency, formatDate, getImageUrl } from '../utils/helpers';

const MyBookings = () => {
  const navigate = useNavigate();
  const [authToken] = useLocalStorage('auth_token', null);
  const [userData] = useLocalStorage('user_data', null);
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, menunggu_pembayaran, menunggu_validasi, lunas, ditolak, expired

  useEffect(() => {
    if (!authToken) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [authToken, navigate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getUserBookings();
      setBookings(response.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      menunggu_pembayaran: { variant: 'warning', label: 'Menunggu Pembayaran' },
      menunggu_validasi: { variant: 'info', label: 'Menunggu Validasi' },
      lunas: { variant: 'success', label: 'Lunas' },
      ditolak: { variant: 'error', label: 'Ditolak' },
      expired: { variant: 'error', label: 'Expired' }
    };
    
    const config = statusConfig[status] || { variant: 'secondary', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTransactionTypeLabel = (type) => {
    return type === 'trip' ? 'Paket Trip' : 'Travel';
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const handlePayment = (booking) => {
    navigate(`/payment/${booking.id}`);
  };

  const handleBookingAgain = (booking) => {
    const path = booking.catalog_type === 'trip' 
      ? `/trips/${booking.catalog?.id}` 
      : `/travels/${booking.catalog?.id}`;
    navigate(path);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-8"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm mb-4">
                <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Saya</h1>
            <p className="text-gray-600">Kelola dan lihat status booking Anda</p>
          </motion.div>

          {/* Filter Tabs */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex flex-wrap gap-2 bg-white rounded-lg p-2 shadow-sm">
              {[
                { key: 'all', label: 'Semua' },
                { key: 'menunggu_pembayaran', label: 'Menunggu Pembayaran' },
                { key: 'menunggu_validasi', label: 'Menunggu Validasi' },
                { key: 'lunas', label: 'Lunas' },
                { key: 'ditolak', label: 'Ditolak' },
                { key: 'expired', label: 'Expired' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    filter === tab.key
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Bookings List */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {filteredBookings.length === 0 ? (
              <div className="bg-white rounded-xl p-8 shadow-sm text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {filter === 'all' ? 'Belum ada booking' : `Tidak ada booking dengan status ${filter}`}
                </h3>
                <p className="text-gray-600 mb-6">
                  {filter === 'all' 
                    ? 'Mulai jelajahi paket trip dan travel kami untuk membuat booking pertama Anda.'
                    : 'Coba ubah filter untuk melihat booking lainnya.'
                  }
                </p>
                {filter === 'all' && (
                  <div className="flex justify-center space-x-4">
                    <Button onClick={() => navigate('/trips')}>
                      Lihat Paket Trip
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/travels')}>
                      Lihat Travel
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              filteredBookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    {/* Booking Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {booking.catalog?.title || booking.catalog?.name || 
                               (booking.catalog?.origin && booking.catalog?.destination 
                                 ? `${booking.catalog.origin} - ${booking.catalog.destination}`
                                 : 'Booking')}
                            </h3>
                            <Badge variant="secondary">
                              {getTransactionTypeLabel(booking.catalog_type)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            Booking ID: {booking.id}
                          </p>
                          <p className="text-sm text-gray-600">
                            Tanggal Booking: {formatDate(booking.created_at)}
                          </p>
                          {booking.expired_at && (
                            <p className="text-sm text-gray-600">
                              Batas Waktu: {formatDate(booking.expired_at)}
                            </p>
                          )}
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>

                      {/* Booking Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">
                            Nama Pemesan:
                            <span className="font-medium text-gray-900 ml-1">
                              {booking.booking_data?.nama_pemesan}
                            </span>
                          </p>
                          <p className="text-sm text-gray-600">
                            Nomor HP:
                            <span className="font-medium text-gray-900 ml-1">
                              {booking.booking_data?.nomor_hp}
                            </span>
                          </p>
                          <p className="text-sm text-gray-600">
                            Jumlah Orang:
                            <span className="font-medium text-gray-900 ml-1">
                              {booking.booking_data?.jumlah_orang} orang
                            </span>
                          </p>
                          {booking.booking_data?.tanggal_keberangkatan && (
                            <p className="text-sm text-gray-600">
                              Tanggal Keberangkatan:
                              <span className="font-medium text-gray-900 ml-1">
                                {formatDate(booking.booking_data.tanggal_keberangkatan)}
                              </span>
                            </p>
                          )}
                        </div>
                        <div>
                          <p className="text-lg font-bold text-primary-600">
                            {formatCurrency(booking.total_price)}
                          </p>
                          {booking.booking_data?.catatan_tambahan && (
                            <p className="text-sm text-gray-600 mt-1">
                              Catatan: {booking.booking_data.catatan_tambahan}
                            </p>
                          )}
                          {booking.payment_proof && (
                            <p className="text-sm text-green-600 mt-1">
                              ✓ Bukti pembayaran sudah diupload
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-2 lg:ml-6 lg:flex-shrink-0">
                      {booking.status === 'menunggu_pembayaran' && !booking.is_expired && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handlePayment(booking)}
                        >
                          Bayar Sekarang
                        </Button>
                      )}
                      
                      {(booking.status === 'expired' || booking.status === 'ditolak') && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleBookingAgain(booking)}
                        >
                          Booking Ulang
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/payment/${booking.id}`)}
                      >
                        Lihat Detail
                      </Button>

                      {booking.status === 'lunas' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            // You can implement download invoice/ticket functionality here
                            alert('Fitur download tiket akan segera tersedia');
                          }}
                        >
                          Download Tiket
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>

          {/* Help Section */}
          {filteredBookings.length > 0 && (
            <motion.div
              className="mt-12 bg-white rounded-xl p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
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
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyBookings;