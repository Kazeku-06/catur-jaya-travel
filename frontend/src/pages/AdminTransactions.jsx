import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminLayout from '../components/Layout/AdminLayout';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import api from '../config/api';
import { formatCurrency, formatDate } from '../utils/helpers';

const AdminTransactions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(searchParams.get('status') || 'all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchBookings();
  }, [currentPage, filter, searchTerm]);

  // Update URL params when filter, search, or page changes
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filter !== 'all') {
      params.set('status', filter);
    }
    
    if (searchTerm.trim()) {
      params.set('search', searchTerm.trim());
    }
    
    if (currentPage > 1) {
      params.set('page', currentPage.toString());
    }
    
    setSearchParams(params);
  }, [filter, searchTerm, currentPage, setSearchParams]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        per_page: 5, // Changed to 5 items per page
      });

      if (filter !== 'all') {
        params.append('status', filter);
      }

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await api.get(`/admin/bookings?${params}`);
      setBookings(response.data.data || []);
      
      if (response.data.pagination) {
        setTotalPages(response.data.pagination.last_page);
        setTotalItems(response.data.pagination.total);
      }
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

  const getStatusLabel = (status) => {
    const labels = {
      menunggu_pembayaran: 'Menunggu Pembayaran',
      menunggu_validasi: 'Menunggu Validasi',
      lunas: 'Lunas',
      ditolak: 'Ditolak',
      expired: 'Expired'
    };
    return labels[status] || status;
  };

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

  const handleStatusChange = async () => {
    if (!selectedBooking || !newStatus) return;

    try {
      setActionLoading(true);
      
      if (newStatus === 'lunas') {
        await api.put(`/admin/bookings/${selectedBooking.id}/approve`);
      } else if (newStatus === 'ditolak') {
        await api.put(`/admin/bookings/${selectedBooking.id}/reject`, {
          reason: rejectReason
        });
      } else {
        // For other status changes, we might need a general update endpoint
        // For now, we'll handle specific cases
        alert('Status ini belum bisa diubah secara manual');
        return;
      }

      await fetchBookings();
      setShowStatusModal(false);
      setNewStatus('');
      setRejectReason('');
      alert('Status berhasil diubah');
    } catch (error) {
      console.error('Error changing status:', error);
      alert('Gagal mengubah status');
    } finally {
      setActionLoading(false);
    }
  };

  const showBookingDetail = (booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const showStatusChangeModal = (booking) => {
    setSelectedBooking(booking);
    setNewStatus(booking.status);
    setShowStatusModal(true);
  };

  const filteredBookings = bookings;

  if (loading) {
    return (
      <AdminLayout>
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
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Kelola Transaksi</h1>
        <p className="text-gray-600">Kelola semua booking dan ubah status transaksi</p>
      </motion.div>

          {/* Search and Filters */}
          <motion.div
            className="mb-6 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Search */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Cari berdasarkan nama, email, atau nama pemesan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <Button
                  onClick={fetchBookings}
                  variant="primary"
                >
                  Cari
                </Button>
              </div>
            </div>

            {/* Filter Tabs */}
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
                  onClick={() => {
                    setFilter(tab.key);
                    setCurrentPage(1);
                  }}
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
            {/* Table Header Info */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Daftar Transaksi</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Menampilkan {bookings.length} dari {totalItems} transaksi (5 per halaman)
                  </p>
                </div>
                {filter !== 'all' && (
                  <Badge variant="info">
                    Filter: {getStatusLabel(filter)}
                  </Badge>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID Booking
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Catalog
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
                        <div className="text-sm font-mono text-gray-900">
                          {booking.id.substring(0, 8)}...
                        </div>
                      </td>
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
                          <div className="text-sm text-gray-500">
                            {booking.booking_data?.nomor_hp}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(booking.total_price)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.booking_data?.jumlah_orang} orang
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(booking.status)}
                          <button
                            onClick={() => showStatusChangeModal(booking)}
                            className="text-xs text-primary-600 hover:text-primary-800"
                          >
                            Ubah
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(booking.created_at)}
                        </div>
                        {booking.expired_at && (
                          <div className="text-xs text-red-500">
                            Expired: {formatDate(booking.expired_at)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => showBookingDetail(booking)}
                        >
                          Detail
                        </Button>
                        {booking.status === 'menunggu_validasi' && (
                          <>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleApprove(booking.id)}
                              loading={actionLoading}
                            >
                              Setujui
                            </Button>
                          </>
                        )}
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
                    : `Tidak ada booking dengan status ${getStatusLabel(filter)}.`
                  }
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <Button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                  >
                    Sebelumnya
                  </Button>
                  <Button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                  >
                    Selanjutnya
                  </Button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Menampilkan <span className="font-medium">{((currentPage - 1) * 5) + 1}</span> sampai{' '}
                      <span className="font-medium">{Math.min(currentPage * 5, totalItems)}</span> dari{' '}
                      <span className="font-medium">{totalItems}</span> transaksi
                      {' '}(Halaman <span className="font-medium">{currentPage}</span> dari{' '}
                      <span className="font-medium">{totalPages}</span>)
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <Button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        variant="outline"
                        size="sm"
                        className="rounded-l-md"
                      >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                      </Button>
                      <Button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        variant="outline"
                        size="sm"
                      >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </Button>
                      
                      {/* Page Numbers */}
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        // Show first page, last page, current page, and pages around current
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <Button
                              key={pageNumber}
                              onClick={() => setCurrentPage(pageNumber)}
                              variant={currentPage === pageNumber ? 'primary' : 'outline'}
                              size="sm"
                              className="min-w-[40px]"
                            >
                              {pageNumber}
                            </Button>
                          );
                        } else if (
                          pageNumber === currentPage - 2 ||
                          pageNumber === currentPage + 2
                        ) {
                          return <span key={pageNumber} className="px-2 py-2 text-gray-500">...</span>;
                        }
                        return null;
                      })}
                      
                      <Button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        variant="outline"
                        size="sm"
                      >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </Button>
                      <Button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        variant="outline"
                        size="sm"
                        className="rounded-r-md"
                      >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </Button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

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
                  <span className="text-gray-600">ID Booking:</span>
                  <p className="font-mono font-medium">{selectedBooking.id}</p>
                </div>
                <div>
                  <span className="text-gray-600">Catalog:</span>
                  <p className="font-medium">{selectedBooking.catalog?.title || selectedBooking.catalog?.name}</p>
                </div>
                <div>
                  <span className="text-gray-600">Tipe:</span>
                  <p className="font-medium">{selectedBooking.catalog_type === 'trip' ? 'Paket Trip' : 'Travel'}</p>
                </div>
                <div>
                  <span className="text-gray-600">User:</span>
                  <p className="font-medium">{selectedBooking.user?.name} ({selectedBooking.user?.email})</p>
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
                  <span className="text-gray-600">Tanggal Keberangkatan:</span>
                  <p className="font-medium">{formatDate(selectedBooking.booking_data?.tanggal_keberangkatan)}</p>
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
                <div>
                  <span className="text-gray-600">Expired:</span>
                  <p className="font-medium">{formatDate(selectedBooking.expired_at)}</p>
                </div>
              </div>
              
              {selectedBooking.booking_data?.catatan_tambahan && (
                <div className="mt-4">
                  <span className="text-gray-600">Catatan Tambahan:</span>
                  <p className="font-medium mt-1">{selectedBooking.booking_data.catatan_tambahan}</p>
                </div>
              )}
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

            {/* Quick Actions */}
            {selectedBooking.status === 'menunggu_validasi' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
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

      {/* Status Change Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Ubah Status Booking"
        size="md"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Saat Ini
              </label>
              <div>{getStatusBadge(selectedBooking.status)}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Baru
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Pilih Status</option>
                <option value="menunggu_pembayaran">Menunggu Pembayaran</option>
                <option value="menunggu_validasi">Menunggu Validasi</option>
                <option value="lunas">Lunas</option>
                <option value="ditolak">Ditolak</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            {newStatus === 'ditolak' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alasan Penolakan
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Masukkan alasan penolakan..."
                />
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowStatusModal(false)}
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                variant="primary"
                onClick={handleStatusChange}
                loading={actionLoading}
                disabled={!newStatus || newStatus === selectedBooking.status}
                className="flex-1"
              >
                Ubah Status
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default AdminTransactions;