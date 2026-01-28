import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../components/Layout/AdminLayout';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { formatCurrency, formatDate } from '../utils/helpers';
import api from '../config/api';

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    payment_status: '',
    transaction_type: '',
    start_date: '',
    end_date: '',
    search: ''
  });

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  // Load transactions
  const loadTransactions = async () => {
    try {
      setLoading(true);
      console.log('Loading transactions with filters:', filters);
      
      // Build query parameters
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await api.get(`/admin/transactions?${params}`);
      console.log('Transactions loaded:', response.data);
      
      setTransactions(response.data.data || []);
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
      
      setSelectedTransaction(response.data.data);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error loading transaction detail:', error);
      showAlert('error', 'Gagal memuat detail transaksi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
    loadStatistics();
  }, []);

  useEffect(() => {
    loadTransactions();
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(transaction.total_price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(transaction.payment_status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(transaction.created_at)}
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

              {transactions.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Tidak ada transaksi yang ditemukan</p>
                </div>
              )}
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