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
    { label: 'My Bookings', href: '/my-bookings' },
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
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Booking Status */}
            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Pembayaran</h1>
                <Badge 
                  variant={
                    booking.status === 'lunas' ? 'success' :
                    booking.status === 'menunggu_validasi' ? 'warning' :
                    booking.status === 'ditolak' ? 'error' :
                    booking.status === 'expired' ? 'error' : 'info'
                  }
                >
                  {booking.status === 'menunggu_pembayaran' ? 'Menunggu Pembayaran' :
                   booking.status === 'menunggu_validasi' ? 'Menunggu Validasi' :
                   booking.status === 'lunas' ? 'Lunas' :
                   booking.status === 'ditolak' ? 'Ditolak' :
                   booking.status === 'expired' ? 'Expired' : booking.status}
                </Badge>
              </div>

              {/* Booking Details */}
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg mb-6">
                <img
                  src={getImageUrl(booking.catalog?.image_url || booking.catalog?.image)}
                  alt={booking.catalog?.title || booking.catalog?.name}
                  className="w-20 h-20 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = booking.catalog_type === 'trip' 
                      ? '/images/trip-placeholder.jpg' 
                      : '/images/travel-placeholder.jpg';
                  }}
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {booking.catalog?.title || booking.catalog?.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {booking.catalog_type === 'trip' ? 'Paket Trip' : 'Travel'}
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Nama Pemesan:</span>
                      <p className="font-medium">{booking.booking_data?.nama_pemesan}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Nomor HP:</span>
                      <p className="font-medium">{booking.booking_data?.nomor_hp}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Tanggal Keberangkatan:</span>
                      <p className="font-medium">{formatDate(booking.booking_data?.tanggal_keberangkatan)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Jumlah Orang:</span>
                      <p className="font-medium">{booking.booking_data?.jumlah_orang} orang</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-600">
                    {formatCurrency(booking.total_price)}
                  </p>
                </div>
              </div>

              {/* Expired Warning */}
              {isExpired && booking.status === 'menunggu_pembayaran' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Booking Expired
                      </h3>
                      <p className="text-sm text-red-700 mt-1">
                        Booking ini telah expired karena belum ada pembayaran dalam 24 jam. Silakan booking ulang.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Countdown Timer */}
              {canUploadPayment && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Batas Waktu Pembayaran
                      </h3>
                      <p className="text-sm text-yellow-700 mt-1">
                        Silakan lakukan pembayaran sebelum {formatDate(booking.expired_at)} pukul {new Date(booking.expired_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Payment Instructions */}
            {canUploadPayment && (
              <motion.div
                className="bg-white rounded-xl p-6 shadow-sm mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Instruksi Pembayaran</h2>
                
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Langkah Pembayaran:</h3>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                      <li>Pilih bank tujuan transfer di bawah ini</li>
                      <li>Transfer sesuai nominal yang tertera</li>
                      <li>Simpan bukti transfer</li>
                      <li>Upload bukti transfer di form di bawah</li>
                      <li>Tunggu validasi dari admin (maksimal 1x24 jam)</li>
                    </ol>
                  </div>

                  {/* Bank Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Pilih Bank Tujuan Transfer:
                    </label>
                    <div className="space-y-3">
                      {Object.values(bankAccounts).map((bank, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                <span className="text-primary-600 font-bold text-sm">{bank.bank}</span>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">Bank {bank.bank}</h4>
                                <p className="text-sm text-gray-600">Transfer Bank</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="space-y-1 text-sm">
                                <div>
                                  <span className="text-gray-600">No. Rekening:</span>
                                  <p className="font-mono font-bold text-gray-900">{bank.accountNumber}</p>
                                </div>
                                <div>
                                  <span className="text-gray-600">Atas Nama:</span>
                                  <p className="font-medium text-gray-900">{bank.accountName}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Total yang harus dibayar:</h4>
                    <p className="text-2xl font-bold text-primary-600">{formatCurrency(booking.total_price)}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Transfer tepat sesuai nominal di atas untuk mempercepat proses validasi
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Upload Payment Proof */}
            {canUploadPayment && (
              <motion.div
                className="bg-white rounded-xl p-6 shadow-sm mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Upload Bukti Pembayaran</h2>
                
                <div className="space-y-4">
                  {/* Bank Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Tujuan Transfer *
                    </label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="">Pilih Bank Tujuan Transfer</option>
                      {Object.entries(bankAccounts).map(([key, bank]) => (
                        <option key={key} value={key}>
                          Bank {bank.bank} - {bank.accountNumber} ({bank.accountName})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Selected Bank Details */}
                  {selectedBank && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">Detail Transfer:</h4>
                      <div className="space-y-1 text-sm text-blue-800">
                        <p><span className="font-medium">Bank:</span> {bankAccounts[selectedBank].bank}</p>
                        <p><span className="font-medium">No. Rekening:</span> {bankAccounts[selectedBank].accountNumber}</p>
                        <p><span className="font-medium">Atas Nama:</span> {bankAccounts[selectedBank].accountName}</p>
                        <p><span className="font-medium">Jumlah Transfer:</span> <span className="font-bold text-lg">{formatCurrency(booking.total_price)}</span></p>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pilih File Bukti Transfer *
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Format: JPG, PNG, GIF, WEBP. Maksimal 5MB.
                    </p>
                  </div>

                  {previewUrl && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preview:
                      </label>
                      <img
                        src={previewUrl}
                        alt="Preview bukti pembayaran"
                        className="max-w-xs h-auto border border-gray-300 rounded-lg"
                      />
                    </div>
                  )}

                  <Button
                    onClick={handleUploadPaymentProof}
                    loading={uploadLoading}
                    disabled={!selectedFile || !selectedBank}
                    className="w-full"
                  >
                    Upload Bukti Pembayaran
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Payment Proof Status */}
            {booking.payment_proof && (
              <motion.div
                className="bg-white rounded-xl p-6 shadow-sm mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Bukti Pembayaran</h2>
                
                <div className="flex items-start space-x-4">
                  <img
                    src={booking.payment_proof.image_url}
                    alt="Bukti pembayaran"
                    className="w-32 h-32 object-cover border border-gray-300 rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">
                      Diupload pada: {formatDate(booking.payment_proof.uploaded_at)}
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        {booking.status === 'menunggu_validasi' 
                          ? 'Bukti pembayaran sedang divalidasi oleh admin. Mohon tunggu maksimal 1x24 jam.'
                          : booking.status === 'lunas'
                          ? 'Pembayaran telah disetujui. Booking Anda sudah lunas.'
                          : booking.status === 'ditolak'
                          ? 'Pembayaran ditolak. Silakan booking ulang.'
                          : 'Status pembayaran tidak diketahui.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/my-bookings')}
                className="flex-1"
              >
                Kembali ke My Bookings
              </Button>
              
              {(booking.status === 'expired' || booking.status === 'ditolak') && (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate(`/${booking.catalog_type}s/${booking.catalog_id}`)}
                  className="flex-1"
                >
                  Booking Ulang
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Payment;