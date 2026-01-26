import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../components/Layout/AdminLayout';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import TravelForm from '../components/admin/TravelForm';
import { adminService } from '../services/adminService';
import { formatCurrency, getImageUrl } from '../utils/helpers';

const AdminTravels = () => {
  const [showForm, setShowForm] = useState(false);
  const [editTravel, setEditTravel] = useState(null);
  const [travels, setTravels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  // Load travels
  const loadTravels = async () => {
    try {
      setLoading(true);
      const response = await adminService.travels.getAll();
      setTravels(response.data || []);
    } catch (error) {
      console.error('Error loading travels:', error);
      showAlert('error', 'Gagal memuat data travels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTravels();
  }, []);

  // Handle form success
  const handleFormSuccess = (data) => {
    showAlert('success', 'Travel berhasil disimpan');
    setShowForm(false);
    setEditTravel(null);
    loadTravels();
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus travel ini?')) return;

    try {
      await adminService.travels.delete(id);
      loadTravels();
      showAlert('success', 'Travel berhasil dihapus');
    } catch (error) {
      console.error('Error deleting travel:', error);
      showAlert('error', 'Gagal menghapus travel');
    }
  };

  // Handle edit
  const handleEdit = (travel) => {
    setEditTravel(travel);
    setShowForm(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {alert.show && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ show: false, type: '', message: '' })}
          />
        )}

        {showForm ? (
          <TravelForm
            travel={editTravel}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false);
              setEditTravel(null);
            }}
          />
        ) : (
          <div className="bg-white rounded-lg shadow">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Daftar Travels</h2>
                  <p className="text-gray-600 mt-1">Kelola semua layanan travel</p>
                </div>
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-primary-600 hover:bg-primary-700"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Tambah Travel
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="text-gray-500 mt-4">Memuat data travels...</p>
                </div>
              ) : travels.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada travels</h3>
                  <p className="text-gray-500 mb-6">Mulai dengan menambahkan travel pertama Anda</p>
                  <Button
                    onClick={() => setShowForm(true)}
                    className="bg-primary-600 hover:bg-primary-700"
                  >
                    Tambah Travel Pertama
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {travels.map((travel, index) => (
                    <motion.div
                      key={travel.id}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {/* Image */}
                      <div className="relative h-48">
                        <img
                          src={getImageUrl(travel.image_url || travel.image)}
                          alt={`${travel.origin} - ${travel.destination}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/images/travel-placeholder.jpg';
                          }}
                        />
                        <div className="absolute top-3 right-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            travel.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {travel.is_active ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {travel.origin} → {travel.destination}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          🚌 {travel.vehicle_type}
                        </p>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-lg font-bold text-primary-600">
                              {formatCurrency(travel.price_per_person)}
                            </p>
                            <p className="text-xs text-gray-500">
                              per orang
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(travel)}
                            className="flex-1"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(travel.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Hapus
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminTravels;