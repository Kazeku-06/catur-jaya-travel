import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Breadcrumb from '../components/navigation/Breadcrumb';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { bookingService } from '../services/bookingService';
import { paymentService } from '../services/paymentService';
import { formatCurrency, formatDate, getImageUrl } from '../utils/helpers';

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [authToken] = useLocalStorage('auth_token', null);
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedBank, setSelectedBank] = useState('');

  // Get data from navigation state if available
  const stateData = location.state || {};

  useEffect(() => {
    if (!authToken) {
      navigate('/login');
      return;
    }
    
    fetchBookingDetail();
  }, [bookingId, authToken, navigate]);

  const fetchBookingDetail = async () => {
    try {
      setLoading(true);
      
      // If we have booking data from state, use it temporarily
      if (stateData.booking) {
        setBooking({
          ...stateData.booking,
          catalog: stateData.catalog,
          booking_data: stateData.bookingData
        });
      }
      
      // Fetch fresh data from API
      const response = await bookingService.getBookingDetail(bookingId);
      setBooking(response.data);
    } catch (error) {
      console.error('Error fetching booking:', error);
      if (error.response?.status === 404) {
        navigate('/my-bookings');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('File harus berupa gambar (JPG, PNG, GIF, WEBP)');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUploadPaymentProof = async () => {
    if (!selectedBank) {
      alert('Silakan pilih bank tujuan transfer');
      return;
    }

    if (!selectedFile) {
      alert('Silakan pilih file bukti pembayaran');
      return;
    }

    try {
      setUploadLoading(true);
      
      await paymentService.uploadPaymentProof(bookingId, selectedFile, bankAccounts[selectedBank]?.bank);
      
      // Refresh booking data
      await fetchBookingDetail();
      
      // Clear selected file and bank
      setSelectedFile(null);
      setPreviewUrl(null);
      setSelectedBank('');
      
      alert('Bukti pembayaran berhasil diupload. Menunggu validasi admin.');
    } catch (error) {
      console.error('Error uploading payment proof:', error);
      const errorMessage = error.response?.data?.message || 'Gagal mengupload bukti pembayaran';
      alert(errorMessage);
    } finally {
      setUploadLoading(false);
    }
  };

  const bankAccounts = paymentService.getBankAccounts();

  const breadcrumbItems = [
    { label: 'Beranda', href: '/' },
    { 
      label: booking?.catalog_type === 'trip' ? 'Trip' : 'Travel', 
      href: booking?.catalog_type === 'trip' ? '/trips' : '/travels' 
    },
    { 
      label: booking?.catalog?.title || booking?.catalog?.name || 'Detail', 
      href: booking?.catalog_type === 'trip' 
        ? `/trips/${booking?.catalog_id}` 
        : `/travels/${booking?.catalog_id}` 
    },
    { label: 'Booking', href: '/my-bookings' },
    { label: 'Pembayaran' }
  ];

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-8"></div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!booking) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking tidak ditemukan</h1>
          <Button onClick={() => navigate('/my-bookings')}>
            Kembali ke My Bookings
          </Button>
        </div>
      </Layout>
    );
  }

  const isExpired = new Date(booking.expired_at) < new Date();
  const canUploadPayment = booking.status === 'menunggu_pembayaran' && !isExpired;

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen pb-20 md:pb-8">
        {/* Breadcrumb Navigation - Above Image */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        <div className="container mx-auto px-4 py-4 md:py-8">
          <div className="max-w-4xl mx-auto">
            {/* Hero Image - Mobile Optimized */}
            <motion.div
              className="bg-white rounded-3xl overflow-hidden shadow-lg mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative h-48 md:h-64">
                <img
                  src={getImageUrl(booking.catalog?.image_url || booking.catalog?.image)}
                  alt={booking.catalog?.title || booking.catalog?.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = booking.catalog_type === 'trip' 
                      ? '/images/trip-placeholder.jpg' 
                      : '/images/travel-placeholder.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            </motion.div>

            {/* Payment Method & Upload - Mobile First Design */}
            {canUploadPayment && (
              <>
                <motion.div
                  className="bg-white rounded-3xl p-5 md:p-6 shadow-lg mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h2 className="text-lg font-bold text-gray-900 mb-3">Metode Pembayaran</h2>
                  <p className="text-sm text-gray-500 mb-4">Pilih metode pembayaran yang tersedia</p>

                  {/* Transfer Bank Option */}
                  <div className="border-2 border-blue-100 bg-blue-50 rounded-2xl p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">Transfer Bank</h3>
                        <p className="text-xs text-gray-600 mb-3">
                          Pilih bank dan transfer sesuai nominal
                        </p>
                        
                        {/* Bank Selection Dropdown */}
                        <select
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                          <option value="">Pilih Bank Tujuan</option>
                          {Object.entries(bankAccounts).map(([key, bank]) => (
                            <option key={key} value={key}>
                              Bank {bank.bank} - {bank.accountName}
                            </option>
                          ))}
                        </select>

                        {/* Selected Bank Details */}
                        {selectedBank && (
                          <div className="mt-3 p-3 bg-white rounded-xl border border-gray-200">
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Bank:</span>
                                <span className="font-semibold text-gray-900">{bankAccounts[selectedBank].bank}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">No. Rekening:</span>
                                <span className="font-mono font-semibold text-gray-900">{bankAccounts[selectedBank].accountNumber}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Atas Nama:</span>
                                <span className="font-semibold text-gray-900">{bankAccounts[selectedBank].accountName}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Upload Payment Proof */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Bukti Transfer
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-400 transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="payment-proof-upload"
                      />
                      <label htmlFor="payment-proof-upload" className="cursor-pointer">
                        {previewUrl ? (
                          <div className="space-y-2">
                            <img
                              src={previewUrl}
                              alt="Preview"
                              className="max-h-40 mx-auto rounded-lg"
                            />
                            <p className="text-sm text-green-600 font-medium">✓ File terpilih</p>
                            <p className="text-xs text-gray-500">Klik untuk mengganti</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </div>
                            <p className="text-sm text-gray-600 font-medium">Pilih file bukti transfer</p>
                            <p className="text-xs text-gray-500">JPG, PNG, max 5MB</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </motion.div>

                {/* Countdown Timer */}
                <motion.div
                  className="bg-yellow-50 border-2 border-yellow-200 rounded-3xl p-5 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-yellow-900 mb-1">Batas Waktu Pembayaran</h3>
                      <p className="text-sm text-yellow-800">
                        {formatDate(booking.expired_at)} • {new Date(booking.expired_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </>
            )}

            {/* Payment Proof Status */}
            {booking.payment_proof && (
              <motion.div
                className="bg-white rounded-3xl p-5 md:p-6 shadow-lg mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h2 className="text-lg font-bold text-gray-900 mb-4">Bukti Pembayaran</h2>
                
                <div className="flex items-start space-x-4">
                  <img
                    src={booking.payment_proof.image_url}
                    alt="Bukti pembayaran"
                    className="w-24 h-24 object-cover border-2 border-gray-200 rounded-xl"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">
                      Diupload: {formatDate(booking.payment_proof.uploaded_at)}
                    </p>
                    <div className={`rounded-xl p-3 ${
                      booking.status === 'menunggu_validasi' ? 'bg-yellow-50 border border-yellow-200' :
                      booking.status === 'lunas' ? 'bg-green-50 border border-green-200' :
                      'bg-red-50 border border-red-200'
                    }`}>
                      <p className={`text-sm ${
                        booking.status === 'menunggu_validasi' ? 'text-yellow-800' :
                        booking.status === 'lunas' ? 'text-green-800' :
                        'text-red-800'
                      }`}>
                        {booking.status === 'menunggu_validasi' 
                          ? '⏳ Sedang divalidasi admin (maks 1x24 jam)'
                          : booking.status === 'lunas'
                          ? '✓ Pembayaran disetujui'
                          : '✗ Pembayaran ditolak'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Price Summary Card - Mobile Optimized */}
            <motion.div
              className="bg-white rounded-3xl p-5 md:p-6 shadow-lg mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4">Ringkasan Harga</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-start py-2 border-b border-gray-100">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {booking.catalog_type === 'trip' ? 'Paket Trip' : 'Travel'}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {booking.catalog?.title || booking.catalog?.name}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900 ml-2">
                    {booking.booking_data?.tanggal_keberangkatan ? formatDate(booking.booking_data.tanggal_keberangkatan) : '-'}
                  </p>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Jumlah Peserta</span>
                  <span className="text-sm font-medium text-gray-900">{booking.booking_data?.jumlah_orang || 1} orang</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Harga per Orang</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(booking.total_price / (booking.booking_data?.jumlah_orang || 1))}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3">
                  <span className="text-base font-bold text-gray-900">Total Harga</span>
                  <span className="text-xl font-bold text-blue-600">
                    {formatCurrency(booking.total_price)}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Expired/Rejected Warning */}
            {(isExpired || booking.status === 'ditolak') && (
              <motion.div
                className="bg-red-50 border-2 border-red-200 rounded-3xl p-5 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-red-900 mb-1">
                      {isExpired ? 'Booking Expired' : 'Pembayaran Ditolak'}
                    </h3>
                    <p className="text-sm text-red-800">
                      {isExpired 
                        ? 'Booking expired karena belum ada pembayaran dalam 24 jam. Silakan booking ulang.'
                        : 'Pembayaran Anda ditolak. Silakan booking ulang dan pastikan bukti transfer valid.'
                      }
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Action Buttons - Mobile Optimized */}
            <motion.div
              className="sticky bottom-0 left-0 right-0 bg-white border-t-2 border-gray-100 p-4 md:relative md:border-0 md:bg-transparent md:p-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {canUploadPayment ? (
                <Button
                  onClick={handleUploadPaymentProof}
                  loading={uploadLoading}
                  disabled={!selectedFile || !selectedBank}
                  className="w-full !rounded-2xl !py-4 !text-base !font-bold shadow-lg"
                  variant="primary"
                >
                  Lanjutkan Pembayaran
                </Button>
              ) : (
                <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate('/my-bookings')}
                    className="flex-1 !rounded-2xl"
                  >
                    Kembali ke My Bookings
                  </Button>
                  
                  {(booking.status === 'expired' || booking.status === 'ditolak') && (
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => navigate(`/${booking.catalog_type}s/${booking.catalog_id}`)}
                      className="flex-1 !rounded-2xl"
                    >
                      Booking Ulang
                    </Button>
                  )}
                </div>
              )}
            </motion.div>
          </div>  
        </div>
      </div>
    </Layout>
  );
};

export default Payment;