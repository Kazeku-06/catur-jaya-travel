import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../components/Layout/AdminLayout';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import Image from '../components/ui/Image';
import TripForm from '../components/admin/TripForm';
import TravelForm from '../components/admin/TravelForm';
import { adminService } from '../services/adminService';
import { formatCurrency } from '../utils/helpers';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('trips');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [trips, setTrips] = useState([]);
  const [travels, setTravels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  // Load data
  const loadTrips = async () => {
    try {
      setLoading(true);
      const response = await adminService.trips.getAll();
      setTrips(response.data || []);
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

  const loadTravels = async () => {
    try {
      setLoading(true);
      const response = await adminService.travels.getAll();
      setTravels(response.data || []);
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

  // Handle form success
  const handleFormSuccess = (data) => {
    showAlert('success', `${activeTab === 'trips' ? 'Trip' : 'Travel'} berhasil disimpan`);
    setShowForm(false);
    setEditItem(null);
    
    // Reload data
    if (activeTab === 'trips') {
      loadTrips();
    } else {
      loadTravels();
    }
  };

  // Handle delete
  const handleDelete = async (id, type) => {
    if (!confirm(`Yakin ingin menghapus ${type} ini?`)) return;

    try {
      if (type === 'trip') {
        await adminService.trips.delete(id);
        loadTrips();
      } else {
        await adminService.travels.delete(id);
        loadTravels();
      }
      showAlert('success', `${type === 'trip' ? 'Trip' : 'Travel'} berhasil dihapus`);
    } catch (error) {
      console.error('Error deleting:', error);
      showAlert('error', `Gagal menghapus ${type}`);
    }
  };

  // Handle edit
  const handleEdit = (item) => {
    setEditItem(item);
    setShowForm(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stats Cards */}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Trips</p>
                <p className="text-2xl font-bold text-gray-900">{trips.length}</p>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Travels</p>
                <p className="text-2xl font-bold text-gray-900">{travels.length}</p>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Trips Aktif</p>
                <p className="text-2xl font-bold text-gray-900">
                  {trips.filter(trip => trip.is_active).length}
                </p>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Travels Aktif</p>
                <p className="text-2xl font-bold text-gray-900">
                  {travels.filter(travel => travel.is_active).length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
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
          <div className="p-6">
            {showForm ? (
              <div>
                {activeTab === 'trips' ? (
                  <TripForm
                    trip={editItem}
                    onSuccess={handleFormSuccess}
                    onCancel={() => {
                      setShowForm(false);
                      setEditItem(null);
                    }}
                  />
                ) : (
                  <TravelForm
                    travel={editItem}
                    onSuccess={handleFormSuccess}
                    onCancel={() => {
                      setShowForm(false);
                      setEditItem(null);
                    }}
                  />
                )}
              </div>
            ) : (
              <div>
                {/* Add Button */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {activeTab === 'trips' ? 'Daftar Trips' : 'Daftar Travels'}
                  </h2>
                  <Button
                    onClick={() => setShowForm(true)}
                    className="bg-primary-600 hover:bg-primary-700"
                  >
                    Tambah {activeTab === 'trips' ? 'Trip' : 'Travel'}
                  </Button>
                </div>

                {/* Data Table */}
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Memuat data...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
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
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Aksi
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
                                  debug={process.env.NODE_ENV === 'development'}
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
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                <button
                                  onClick={() => handleEdit(trip)}
                                  className="text-primary-600 hover:text-primary-900"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(trip.id, 'trip')}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Hapus
                                </button>
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
                                  debug={process.env.NODE_ENV === 'development'}
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
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                <button
                                  onClick={() => handleEdit(travel)}
                                  className="text-primary-600 hover:text-primary-900"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(travel.id, 'travel')}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Hapus
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>

                    {((activeTab === 'trips' && trips.length === 0) || 
                      (activeTab === 'travels' && travels.length === 0)) && (
                      <div className="text-center py-8">
                        <p className="text-gray-500">
                          Belum ada {activeTab === 'trips' ? 'trips' : 'travels'} yang tersedia
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;