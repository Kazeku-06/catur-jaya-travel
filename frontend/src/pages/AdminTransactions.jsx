import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../components/Layout/AdminLayout';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { formatCurrency, formatDate } from '../utils/helpers';
import api from '../config/api';

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Filters and pagination
  const [filters, setFilters] = useState({
    payment_status: '',
    transaction_type: '',
    start_date: '',
    end_date: '',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  // Load transactions with pagination
  const loadTransactions = async (page = 1) => {
    try {
      setLoading(true);
      console.log('Loading transactions with filters:', filters, 'page:', page);
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('per_page', 10); // 10 items per page
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await api.get(`/admin/transactions?${params}`);
      console.log('Transactions loaded:', response.data);
      
      setTransactions(response.data.data || []);
      setPagination(response.data.pagination || null);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading transactions:', error);
      showAlert('error', 'Gagal memuat data transaksi');
    } finally {
      setLoading(false);
    }
  };

  // Load statistics
  const loadStatistics = async () => {
    try {
      const response = await api.get('/admin/transactions/statistics');
      console.log('Statistics loaded:', response.data);
      setStatistics(response.data.data || {});
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  // Load transaction detail
  const loadTransactionDetail = async (transactionId) => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/transactions/${transactionId}`);
      console.log('Transaction detail loaded:', response.data);
      
      // Handle the new API response structure
      const transactionData = response.data.data;
      setSelectedTransaction({
        ...transactionData.transaction,
        referenced_item: transactionData.referenced_item
      });
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error loading transaction detail:', error);
      showAlert('error', 'Gagal memuat detail transaksi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions(1);
    loadStatistics();
  }, []);

  useEffect(() => {
    loadTransactions(1); // Reset to page 1 when filters change
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      payment_status: '',
      transaction_type: '',
      start_date: '',
      end_date: '',
      search: ''
    });
  };

  const handlePageChange = (page) => {
    loadTransactions(page);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Menunggu' },
      paid: { bg: 'bg-green-100', text: 'text-green-800', label: 'Lunas' },
      failed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Gagal' },
      expired: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Expired' },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const typeConfig = {
      trip: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Trip' },
      travel: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Travel' },
    };
    
    const config = typeConfig[type] || typeConfig.trip;
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              className="bg-white rounded-lg shadow p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Transaksi</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.total_transactions || 0}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-lg shadow p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Transaksi Lunas</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.paid_transactions || 0}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-lg shadow p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Menunggu Pembayaran</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.pending_transactions || 0}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-lg shadow p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Pendapatan</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(statistics.total_revenue || 0)}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {alert.show && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ show: false, type: '', message: '' })}
          />
        )}

        {/* Filters */}
        <motion.div
          className="bg-white rounded-lg shadow p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Transaksi</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {/* Payment Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status Pembayaran
              </label>
              <select
                value={filters.payment_status}
                onChange={(e) => handleFilterChange('payment_status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Semua Status</option>
                <option value="pending">Menunggu</option>
                <option value="paid">Lunas</option>
                <option value="failed">Gagal</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            {/* Transaction Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Transaksi
              </label>
              <select
                value={filters.transaction_type}
                onChange={(e) => handleFilterChange('transaction_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Semua Jenis</option>
                <option value="trip">Trip</option>
                <option value="travel">Travel</option>
              </select>
            </div>

            {/* Start Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Mulai
              </label>
              <input
                type="date"
                value={filters.start_date}
                onChange={(e) => handleFilterChange('start_date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* End Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Akhir
              </label>
              <input
                type="date"
                value={filters.end_date}
                onChange={(e) => handleFilterChange('end_date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Clear Filters Button */}
            <div className="flex items-end">
              <Button
                onClick={clearFilters}
                variant="outline"
                className="w-full"
              >
                Reset Filter
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cari Transaksi
            </label>
            <input
              type="text"
              placeholder="Cari berdasarkan Order ID, nama customer, atau email..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </motion.div>

        {/* Transactions Table */}
        <motion.div
          className="bg-white rounded-lg shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Daftar Transaksi</h3>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Memuat data transaksi...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jenis
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Peserta/Penumpang
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
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.midtrans_order_id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{transaction.user?.name}</div>
                        <div className="text-sm text-gray-500">{transaction.user?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getTypeBadge(transaction.transaction_type)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {transaction.transaction_type === 'trip' ? 'Trip Package' : 'Travel Service'}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {transaction.reference_id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.participants || transaction.passengers || '-'} orang
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(transaction.total_price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(transaction.payment_status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(transaction.created_at)}</div>
                        {transaction.departure_date && (
                          <div className="text-sm text-gray-500">
                            Berangkat: {formatDate(transaction.departure_date)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => loadTransactionDetail(transaction.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {transactions.length === 0 && !loading && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Tidak ada transaksi yang ditemukan</p>
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.last_page > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Menampilkan {pagination.from || 0} - {pagination.to || 0} dari {pagination.total} transaksi
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className={`px-3 py-2 text-sm font-medium rounded-lg ${
                      currentPage <= 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Sebelumnya
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                      let pageNum;
                      if (pagination.last_page <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= pagination.last_page - 2) {
                        pageNum = pagination.last_page - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= pagination.last_page}
                    className={`px-3 py-2 text-sm font-medium rounded-lg ${
                      currentPage >= pagination.last_page
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Transaction Detail Modal */}
        {showDetailModal && selectedTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Detail Transaksi
                  </h3>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="px-6 py-4 space-y-4">
                {/* Transaction Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Order ID</label>
                    <p className="text-sm text-gray-900">{selectedTransaction.midtrans_order_id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <div className="mt-1">
                      {getStatusBadge(selectedTransaction.payment_status)}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Jenis</label>
                    <div className="mt-1">
                      {getTypeBadge(selectedTransaction.transaction_type)}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total</label>
                    <p className="text-sm text-gray-900 font-semibold">
                      {formatCurrency(selectedTransaction.total_price)}
                    </p>
                  </div>
                </div>

                {/* Referenced Item Info */}
                {selectedTransaction.referenced_item && (
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-2">
                      Informasi {selectedTransaction.transaction_type === 'trip' ? 'Trip' : 'Travel'}
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          {selectedTransaction.transaction_type === 'trip' ? 'Nama Trip' : 'Rute Travel'}
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedTransaction.referenced_item.title || 
                           selectedTransaction.referenced_item.name ||
                           `${selectedTransaction.referenced_item.origin} - ${selectedTransaction.referenced_item.destination}`}
                        </p>
                      </div>
                      {selectedTransaction.transaction_type === 'trip' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Lokasi</label>
                            <p className="text-sm text-gray-900">{selectedTransaction.referenced_item.location}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Durasi</label>
                            <p className="text-sm text-gray-900">{selectedTransaction.referenced_item.duration}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Harga per Orang</label>
                            <p className="text-sm text-gray-900">{formatCurrency(selectedTransaction.referenced_item.price)}</p>
                          </div>
                        </>
                      )}
                      {selectedTransaction.transaction_type === 'travel' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Jenis Kendaraan</label>
                            <p className="text-sm text-gray-900">{selectedTransaction.referenced_item.vehicle_type}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Harga per Orang</label>
                            <p className="text-sm text-gray-900">{formatCurrency(selectedTransaction.referenced_item.price_per_person)}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Customer Info */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-2">Informasi Customer</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nama</label>
                      <p className="text-sm text-gray-900">{selectedTransaction.user?.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-sm text-gray-900">{selectedTransaction.user?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-2">Detail Pemesanan</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedTransaction.participants && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Peserta</label>
                        <p className="text-sm text-gray-900">{selectedTransaction.participants} orang</p>
                      </div>
                    )}
                    {selectedTransaction.passengers && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Penumpang</label>
                        <p className="text-sm text-gray-900">{selectedTransaction.passengers} orang</p>
                      </div>
                    )}
                    {selectedTransaction.departure_date && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Tanggal Keberangkatan</label>
                        <p className="text-sm text-gray-900">{formatDate(selectedTransaction.departure_date)}</p>
                      </div>
                    )}
                    {selectedTransaction.contact_phone && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Telepon</label>
                        <p className="text-sm text-gray-900">{selectedTransaction.contact_phone}</p>
                      </div>
                    )}
                    {selectedTransaction.pickup_location && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Lokasi Penjemputan</label>
                        <p className="text-sm text-gray-900">{selectedTransaction.pickup_location}</p>
                      </div>
                    )}
                    {selectedTransaction.destination_address && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Alamat Tujuan</label>
                        <p className="text-sm text-gray-900">{selectedTransaction.destination_address}</p>
                      </div>
                    )}
                  </div>
                  
                  {selectedTransaction.special_requests && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">Permintaan Khusus</label>
                      <p className="text-sm text-gray-900">{selectedTransaction.special_requests}</p>
                    </div>
                  )}
                </div>

                {/* Payment Information */}
                {selectedTransaction.payments && selectedTransaction.payments.length > 0 && (
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-2">Informasi Pembayaran</h4>
                    <div className="space-y-2">
                      {selectedTransaction.payments.map((payment, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Jenis Pembayaran</label>
                              <p className="text-sm text-gray-900">{payment.payment_type}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Status Transaksi</label>
                              <p className="text-sm text-gray-900">{payment.transaction_status}</p>
                            </div>
                            <div className="col-span-2">
                              <label className="block text-sm font-medium text-gray-700">Waktu Pembayaran</label>
                              <p className="text-sm text-gray-900">{formatDate(payment.created_at)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-2">Waktu</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Dibuat</label>
                      <p className="text-sm text-gray-900">{formatDate(selectedTransaction.created_at)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Diupdate</label>
                      <p className="text-sm text-gray-900">{formatDate(selectedTransaction.updated_at)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex justify-end">
                  <Button
                    onClick={() => setShowDetailModal(false)}
                    variant="outline"
                  >
                    Tutup
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminTransactions;