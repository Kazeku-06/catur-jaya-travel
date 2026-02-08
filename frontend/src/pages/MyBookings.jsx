import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { bookingService } from '../services/bookingService';
import { formatCurrency, formatDate } from '../utils/helpers';

const MyBookings = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [authToken] = useLocalStorage('auth_token', null);
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingTicket, setDownloadingTicket] = useState(null);
  const [filter, setFilter] = useState(searchParams.get('status') || 'all'); // all, menunggu_pembayaran, menunggu_validasi, lunas, ditolak, expired

  useEffect(() => {
    if (!authToken) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [authToken, navigate]);

  // Update URL params when filter changes
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filter !== 'all') {
      params.set('status', filter);
    }
    
    setSearchParams(params);
  }, [filter, setSearchParams]);

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

  const handleDownloadTicket = async (booking) => {
    try {
      setDownloadingTicket(booking.id);
      await bookingService.downloadTicket(booking.id);
      // Success feedback could be added here if needed
    } catch (error) {
      console.error('Error downloading ticket:', error);
      alert('Gagal mengunduh tiket. Silakan coba lagi.');
    } finally {
      setDownloadingTicket(null);
    }
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
      <div className="bg-gray-50 min-h-screen pb-8">
        <div className="container mx-auto px-4 py-6 md:py-8">
          {/* Header */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Booking Saya</h1>
            <p className="text-sm md:text-base text-gray-600">Kelola dan lihat status booking Anda</p>
          </motion.div>

          {/* Filter Tabs - Mobile Optimized */}
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-white rounded-2xl p-2 shadow-sm overflow-x-auto">
              <div className="flex gap-2 min-w-max md:min-w-0 md:flex-wrap">
                {[
                  { key: 'all', label: 'Semua' },
                  { key: 'menunggu_pembayaran', label: 'Menunggu Bayar' },
                  { key: 'menunggu_validasi', label: 'Validasi' },
                  { key: 'lunas', label: 'Lunas' },
                  { key: 'ditolak', label: 'Ditolak' },
                  { key: 'expired', label: 'Expired' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    className={`px-3 py-2 rounded-xl text-xs md:text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                      filter === tab.key
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Bookings List - Mobile Optimized Cards */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {filteredBookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {filter === 'all' ? 'Belum ada booking' : `Tidak ada booking`}
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  {filter === 'all' 
                    ? 'Mulai jelajahi paket trip dan travel kami'
                    : 'Coba ubah filter untuk melihat booking lainnya'
                  }
                </p>
                {filter === 'all' && (
                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <Button onClick={() => navigate('/trips')} className="!rounded-2xl">
                      Lihat Paket Trip
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/travels')} className="!rounded-2xl">
                      Lihat Travel
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              filteredBookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  className="bg-white rounded-3xl p-5 md:p-6 shadow-lg hover:shadow-xl transition-shadow duration-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  {/* Header with Title and Status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-base md:text-lg font-bold text-gray-900 truncate">
                          {booking.catalog?.title || booking.catalog?.name || 
                           (booking.catalog?.origin && booking.catalog?.destination 
                             ? `${booking.catalog.origin} - ${booking.catalog.destination}`
                             : 'Booking')}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {getTransactionTypeLabel(booking.catalog_type)}
                        </Badge>
                      </div>
                      {booking.booking_code && (
                        <p className="text-xs md:text-sm text-gray-600 font-mono">
                          {booking.booking_code}
                        </p>
                      )}
                    </div>
                    <div className="ml-3 flex-shrink-0">
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>

                  {/* Booking Details Grid - Mobile Optimized */}
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-xs md:text-sm text-gray-600">Nama Pemesan</span>
                      <span className="text-xs md:text-sm font-medium text-gray-900 text-right">
                        {booking.booking_data?.nama_pemesan}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-xs md:text-sm text-gray-600">Nomor HP</span>
                      <span className="text-xs md:text-sm font-medium text-gray-900">
                        {booking.booking_data?.nomor_hp}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-xs md:text-sm text-gray-600">Jumlah Orang</span>
                      <span className="text-xs md:text-sm font-medium text-gray-900">
                        {booking.booking_data?.jumlah_orang} orang
                      </span>
                    </div>
                    
                    {booking.booking_data?.tanggal_keberangkatan && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-xs md:text-sm text-gray-600">Tanggal Berangkat</span>
                        <span className="text-xs md:text-sm font-medium text-gray-900">
                          {formatDate(booking.booking_data.tanggal_keberangkatan)}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-xs md:text-sm text-gray-600">Tanggal Booking</span>
                      <span className="text-xs md:text-sm font-medium text-gray-900">
                        {formatDate(booking.created_at)}
                      </span>
                    </div>

                    {booking.expired_at && booking.status === 'menunggu_pembayaran' && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-xs md:text-sm text-gray-600">Batas Waktu</span>
                        <span className="text-xs md:text-sm font-medium text-red-600">
                          {formatDate(booking.expired_at)}
                        </span>
                      </div>
                    )}

                    {/* Total Price - Prominent */}
                    <div className="flex justify-between items-center pt-3">
                      <span className="text-sm md:text-base font-bold text-gray-900">Total Harga</span>
                      <span className="text-lg md:text-xl font-bold text-blue-600">
                        {formatCurrency(booking.total_price)}
                      </span>
                    </div>

                    {/* Payment Status Indicator */}
                    {booking.payment_proof && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                        <p className="text-xs md:text-sm text-green-800 flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Bukti pembayaran sudah diupload
                        </p>
                      </div>
                    )}

                    {booking.booking_data?.catatan_tambahan && (
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-600 mb-1 font-medium">Catatan:</p>
                        <p className="text-xs text-gray-700">{booking.booking_data.catatan_tambahan}</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons - Mobile Optimized */}
                  <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
                    {booking.status === 'menunggu_pembayaran' && !booking.is_expired && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handlePayment(booking)}
                        className="w-full !rounded-xl !py-3 !font-bold"
                      >
                         Bayar Sekarang
                      </Button>
                    )}
                    
                    {(booking.status === 'expired' || booking.status === 'ditolak') && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleBookingAgain(booking)}
                        className="w-full !rounded-xl !py-3"
                      >
                         Booking Ulang
                      </Button>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/payment/${booking.id}`)}
                        className="flex-1 !rounded-xl"
                      >
                         Detail
                      </Button>

                      {booking.status === 'lunas' && booking.can_download_ticket && (
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={downloadingTicket === booking.id}
                          onClick={() => handleDownloadTicket(booking)}
                          className="flex-1 !rounded-xl"
                        >
                          {downloadingTicket === booking.id ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Loading...
                            </>
                          ) : (
                            <> Tiket</>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>

          {/* Help Section - Mobile Optimized */}
          {filteredBookings.length > 0 && (
            <motion.div
              className="mt-8 bg-white rounded-3xl p-5 md:p-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4">Butuh Bantuan?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-blue-50 rounded-2xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm md:text-base">Customer Service</h4>
                  <div className="space-y-2">
                    <a href="tel:+6281234567890" className="flex items-center text-xs md:text-sm text-blue-600 hover:text-blue-700">
                      <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>+62 812-3456-7890</span>
                    </a>
                    <a href="mailto:support@caturjayatravel.com" className="flex items-center text-xs md:text-sm text-blue-600 hover:text-blue-700">
                      <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="truncate">caturjayamandiri4@gmail.com</span>
                    </a>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm md:text-base">Jam Operasional</h4>
                  <div className="text-xs md:text-sm text-gray-600 space-y-1">
                    <p>Senin - Jumat: 08:00 - 17:00</p>
                    <p>Sabtu - Minggu: 09:00 - 15:00</p>
                    <p className="text-xs text-gray-500 mt-2">Waktu Indonesia Barat (WIB)</p>
                  </div>
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