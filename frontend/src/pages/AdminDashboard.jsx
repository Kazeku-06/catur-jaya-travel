import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../components/Layout/AdminLayout';
import Alert from '../components/ui/Alert';
import Image from '../components/ui/Image';
import Pagination from '../components/ui/Pagination';
import { adminService } from '../services/adminService';
import { formatCurrency } from '../utils/helpers';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('trips');
  const [trips, setTrips] = useState([]);
  const [travels, setTravels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  
  // Pagination states
  const [tripsPagination, setTripsPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    from: 0,
    to: 0,
    per_page: 5
  });
  
  const [travelsPagination, setTravelsPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    from: 0,
    to: 0,
    per_page: 5
  });

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  // Load data
  const loadTrips = async (page = 1) => {
    try {
      setLoading(true);
      const response = await adminService.trips.getAll({ page, per_page: 5 });
      setTrips(response.data || []);
      setTripsPagination(response.pagination || {});
      showAlert('success', 'Data trips berhasil dimuat');
    } catch (error) {
      console.error('Error loading trips:', error);
      
      if (error.response?.status === 401) {
        showAlert('error', 'Session expired. Please login again.');
      } else if (error.response?.status === 403) {
        showAlert('error', 'Access denied. Admin role required.');
      } else {
        showAlert('error', `Gagal memuat data trips: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadTravels = async (page = 1) => {
    try {
      setLoading(true);
      const response = await adminService.travels.getAll({ page, per_page: 5 });
      setTravels(response.data || []);
      setTravelsPagination(response.pagination || {});
      showAlert('success', 'Data travels berhasil dimuat');
    } catch (error) {
      console.error('Error loading travels:', error);
      
      if (error.response?.status === 401) {
        showAlert('error', 'Session expired. Please login again.');
      } else if (error.response?.status === 403) {
        showAlert('error', 'Access denied. Admin role required.');
      } else {
        showAlert('error', `Gagal memuat data travels: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'trips') {
      loadTrips();
    } else if (activeTab === 'travels') {
      loadTravels();
    }
  }, [activeTab]);

  // Handle pagination
  const handlePageChange = (page) => {
    if (activeTab === 'trips') {
      loadTrips(page);
    } else if (activeTab === 'travels') {
      loadTravels(page);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-4 lg:space-y-6 min-w-0">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
          <motion.div
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 lg:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-4 h-4 lg:w-6 lg:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <div className="ml-2 lg:ml-4 min-w-0 flex-1">
                <p className="text-xs lg:text-sm font-medium text-gray-600 truncate">Total Trips</p>
                <p className="text-lg lg:text-2xl font-bold text-gray-900">{trips.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 lg:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-4 h-4 lg:w-6 lg:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div className="ml-2 lg:ml-4 min-w-0 flex-1">
                <p className="text-xs lg:text-sm font-medium text-gray-600 truncate">Total Travels</p>
                <p className="text-lg lg:text-2xl font-bold text-gray-900">{travels.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 lg:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-4 h-4 lg:w-6 lg:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-2 lg:ml-4 min-w-0 flex-1">
                <p className="text-xs lg:text-sm font-medium text-gray-600 truncate">Trips Aktif</p>
                <p className="text-lg lg:text-2xl font-bold text-gray-900">
                  {trips.filter(trip => trip.is_active).length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 lg:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-4 h-4 lg:w-6 lg:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-2 lg:ml-4 min-w-0 flex-1">
                <p className="text-xs lg:text-sm font-medium text-gray-600 truncate">Travels Aktif</p>
                <p className="text-lg lg:text-2xl font-bold text-gray-900">
                  {travels.filter(travel => travel.is_active).length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-4 lg:mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-4 lg:space-x-8 px-4 lg:px-6">
              <button
                onClick={() => setActiveTab('trips')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'trips'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Trips
              </button>
              <button
                onClick={() => setActiveTab('travels')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'travels'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Travels
              </button>
            </nav>
          </div>
        </div>

        {alert.show && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ show: false, type: '', message: '' })}
          />
        )}

        {/* Main Content */}
        <motion.div
          className="bg-white rounded-lg shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="p-4 lg:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-3 sm:space-y-0">
              <h2 className="text-lg lg:text-xl font-semibold text-gray-900">
                {activeTab === 'trips' ? 'Daftar Trips' : 'Daftar Travels'}
              </h2>
            </div>

            {/* Data Table */}
            {loading ? (
              <div className="text-center py-12 lg:py-16">
                <div className="max-w-sm mx-auto">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <p className="text-gray-500 text-sm">Memuat data {activeTab === 'trips' ? 'trips' : 'travels'}...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Gambar
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {activeTab === 'trips' ? 'Nama Trip' : 'Rute'}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Harga
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {activeTab === 'trips' ? (
                        trips.map((trip) => (
                          <tr key={trip.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Image
                                src={trip.image_url || trip.image}
                                alt={trip.title}
                                className="h-12 w-12 object-cover rounded-lg"
                                fallback="/images/trip-placeholder.jpg"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{trip.title}</div>
                              <div className="text-sm text-gray-500">{trip.location}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(trip.price)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                trip.is_active 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {trip.is_active ? 'Aktif' : 'Nonaktif'}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        travels.map((travel) => (
                          <tr key={travel.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Image
                                src={travel.image_url || travel.image}
                                alt={`${travel.origin} - ${travel.destination}`}
                                className="h-12 w-12 object-cover rounded-lg"
                                fallback="/images/travel-placeholder.jpg"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {travel.origin} - {travel.destination}
                              </div>
                              <div className="text-sm text-gray-500">{travel.vehicle_type}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(travel.price_per_person)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                travel.is_active 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {travel.is_active ? 'Aktif' : 'Nonaktif'}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-4">
                  {activeTab === 'trips' ? (
                    trips.map((trip) => (
                      <div key={trip.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <div className="flex">
                          {/* Image Section */}
                          <div className="flex-shrink-0 w-24 h-24 relative">
                            <Image
                              src={trip.image_url || trip.image}
                              alt={trip.title}
                              className="w-full h-full object-cover"
                              fallback="/images/trip-placeholder.jpg"
                            />
                            <div className="absolute top-1 right-1">
                              <span className={`inline-flex px-1.5 py-0.5 text-xs font-semibold rounded-full ${
                                trip.is_active 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {trip.is_active ? 'Aktif' : 'Nonaktif'}
                              </span>
                            </div>
                          </div>
                          
                          {/* Content Section */}
                          <div className="flex-1 p-3 min-w-0">
                            <div className="flex flex-col h-full">
                              {/* Title and Location */}
                              <div className="flex-1">
                                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                                  {trip.title}
                                </h3>
                                <div className="space-y-1">
                                  <p className="text-xs text-gray-600 flex items-center">
                                    <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    </svg>
                                    <span className="truncate">{trip.location}</span>
                                  </p>
                                  <p className="text-xs text-gray-600 flex items-center">
                                    <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{trip.duration}</span>
                                  </p>
                                </div>
                              </div>
                              
                              {/* Price */}
                              <div className="mt-2">
                                <p className="text-sm font-bold text-primary-600">
                                  {formatCurrency(trip.price)}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Kuota: {trip.quota} orang
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    travels.map((travel) => (
                      <div key={travel.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <div className="flex">
                          {/* Image Section */}
                          <div className="flex-shrink-0 w-24 h-24 relative">
                            <Image
                              src={travel.image_url || travel.image}
                              alt={`${travel.origin} - ${travel.destination}`}
                              className="w-full h-full object-cover"
                              fallback="/images/travel-placeholder.jpg"
                            />
                            <div className="absolute top-1 right-1">
                              <span className={`inline-flex px-1.5 py-0.5 text-xs font-semibold rounded-full ${
                                travel.is_active 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {travel.is_active ? 'Aktif' : 'Nonaktif'}
                              </span>
                            </div>
                          </div>
                          
                          {/* Content Section */}
                          <div className="flex-1 p-3 min-w-0">
                            <div className="flex flex-col h-full">
                              {/* Route and Vehicle */}
                              <div className="flex-1">
                                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                                  {travel.origin} - {travel.destination}
                                </h3>
                                <div className="space-y-1">
                                  <p className="text-xs text-gray-600 flex items-center">
                                    <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                    </svg>
                                    <span>{travel.vehicle_type}</span>
                                  </p>
                                  {travel.departure_time && (
                                    <p className="text-xs text-gray-600 flex items-center">
                                      <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                      <span>{travel.departure_time}</span>
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              {/* Price */}
                              <div className="mt-2">
                                <p className="text-sm font-bold text-primary-600">
                                  {formatCurrency(travel.price_per_person)}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Per orang
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {/* Pagination */}
            {((activeTab === 'trips' && trips.length > 0) || 
              (activeTab === 'travels' && travels.length > 0)) && (
              <div className="px-4 lg:px-6 py-4 border-t border-gray-200 bg-gray-50 mt-6">
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                  <div className="text-sm text-gray-700 text-center sm:text-left">
                    Menampilkan {activeTab === 'trips' ? tripsPagination.from : travelsPagination.from || 0} - {activeTab === 'trips' ? tripsPagination.to : travelsPagination.to || 0} dari {activeTab === 'trips' ? tripsPagination.total : travelsPagination.total} {activeTab === 'trips' ? 'trips' : 'travels'}
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <Pagination
                      currentPage={activeTab === 'trips' ? tripsPagination.current_page : travelsPagination.current_page}
                      totalPages={activeTab === 'trips' ? tripsPagination.last_page : travelsPagination.last_page}
                      onPageChange={handlePageChange}
                      from={activeTab === 'trips' ? tripsPagination.from : travelsPagination.from}
                      to={activeTab === 'trips' ? tripsPagination.to : travelsPagination.to}
                      total={activeTab === 'trips' ? tripsPagination.total : travelsPagination.total}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {((activeTab === 'trips' && trips.length === 0) || 
              (activeTab === 'travels' && travels.length === 0)) && !loading && (
              <div className="text-center py-12 lg:py-16">
                <div className="max-w-sm mx-auto">
                  <svg className="w-16 h-16 lg:w-20 lg:h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {activeTab === 'trips' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    )}
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Belum ada {activeTab === 'trips' ? 'trips' : 'travels'}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {activeTab === 'trips' 
                      ? 'Data paket trip wisata akan ditampilkan di sini'
                      : 'Data layanan travel akan ditampilkan di sini'
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;