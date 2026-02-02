import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { useLocalStorage } from '../hooks/useLocalStorage';
import api from '../config/api';
import { formatCurrency, formatDate } from '../utils/helpers';

const AdminBookings = () => {
  const [authToken] = useLocalStorage('auth_token', null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/bookings');
      setBookings(response.data.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
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

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const handleApprove = async (bookingId) => {
    try {
      setActionLoading(true);
      await api.put(`/admin/bookings/${bookingId}/approve`);
      await fetchBookings();
      setShowDetailModal(false);
      alert('Pembayaran berhasil disetujui');
    } catch (error) {
      console.error('Error approving booking:', error);
      alert('Gagal menyetujui pembayaran');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (bookingId) => {
    try {
      setActionLoading(true);
      await api.put(`/admin/bookings/${bookingId}/reject`, {
        reason: rejectReason
      });
      await fetchBookings();
      setShowDetailModal(false);
      setRejectReason('');
      alert('Pembayaran berhasil ditolak');
    } catch (error) {
      console.error('Error rejecting booking:', error);
      alert('Gagal menolak pembayaran');
    } finally {
      setActionLoading(false);
    }
  };

  const showBookingDetail = (booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-8"></div>
            {[...Array(5)].map((_, i) => (
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Kelola Booking</h1>
            <p className="text-gray-600">Validasi pembayaran dan kelola booking pelanggan</p>
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

          {/* Bookings Table */}
          <motion.div
            className="bg-white rounded-xl shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pelanggan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.catalog?.title || booking.catalog?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.catalog_type === 'trip' ? 'Paket Trip' : 'Travel'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.user?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.booking_data?.nama_pemesan}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(booking.total_price)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(booking.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(booking.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => showBookingDetail(booking)}
                        >
                          Detail
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredBookings.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Tidak ada booking
                </h3>
                <p className="text-gray-600">
                  {filter === 'all' 
                    ? 'Belum ada booking yang masuk.'
                    : `Tidak ada booking dengan status ${filter}.`
                  }
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Detail Booking"
        size="lg"
      >
        {selectedBooking && (
          <div className="space-y-6">
            {/* Booking Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Booking</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Catalog:</span>
                  <p className="font-medium">{selectedBooking.catalog?.title || selectedBooking.catalog?.name}</p>
                </div>
                <div>
                  <span className="text-gray-600">Tipe:</span>
                  <p className="font-medium">{selectedBooking.catalog_type === 'trip' ? 'Paket Trip' : 'Travel'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Nama Pemesan:</span>
                  <p className="font-medium">{selectedBooking.booking_data?.nama_pemesan}</p>
                </div>
                <div>
                  <span className="text-gray-600">Nomor HP:</span>
                  <p className="font-medium">{selectedBooking.booking_data?.nomor_hp}</p>
                </div>
                <div>
                  <span className="text-gray-600">Jumlah Orang:</span>
                  <p className="font-medium">{selectedBooking.booking_data?.jumlah_orang} orang</p>
                </div>
                <div>
                  <span className="text-gray-600">Total Harga:</span>
                  <p className="font-medium text-primary-600">{formatCurrency(selectedBooking.total_price)}</p>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <div className="mt-1">{getStatusBadge(selectedBooking.status)}</div>
                </div>
                <div>
                  <span className="text-gray-600">Tanggal Booking:</span>
                  <p className="font-medium">{formatDate(selectedBooking.created_at)}</p>
                </div>
              </div>
            </div>

            {/* Payment Proof */}
            {selectedBooking.payment_proof && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Bukti Pembayaran</h3>
                <div className="flex items-start space-x-4">
                  <img
                    src={selectedBooking.payment_proof.image_url}
                    alt="Bukti pembayaran"
                    className="w-48 h-48 object-cover border border-gray-300 rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">
                      Diupload: {formatDate(selectedBooking.payment_proof.uploaded_at)}
                    </p>
                    {selectedBooking.payment_proof.bank_name && (
                      <p className="text-sm text-gray-600 mb-2">
                        Bank: {selectedBooking.payment_proof.bank_name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            {selectedBooking.status === 'menunggu_validasi' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Validasi Pembayaran</h3>
                <div className="space-y-4">
                  <div className="flex space-x-3">
                    <Button
                      variant="success"
                      onClick={() => handleApprove(selectedBooking.id)}
                      loading={actionLoading}
                      className="flex-1"
                    >
                      Setujui Pembayaran
                    </Button>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alasan Penolakan (opsional)
                    </label>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Masukkan alasan jika menolak pembayaran..."
                    />
                  </div>
                  
                  <Button
                    variant="error"
                    onClick={() => handleReject(selectedBooking.id)}
                    loading={actionLoading}
                    className="w-full"
                  >
                    Tolak Pembayaran
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default AdminBookings;