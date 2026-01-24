import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Alert from '../ui/Alert';
import { adminService, imageHelpers } from '../../services/adminService';

const TravelForm = ({ travel = null, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    origin: travel?.origin || '',
    destination: travel?.destination || '',
    vehicle_type: travel?.vehicle_type || '',
    price_per_person: travel?.price_per_person || '',
    is_active: travel?.is_active !== undefined ? travel.is_active : true
  });

  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imageMethod, setImageMethod] = useState('file'); // 'file' or 'url'
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate image
      const errors = imageHelpers.validateImage(file);
      if (errors.length > 0) {
        showAlert('error', errors.join(', '));
        return;
      }
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare data for JSON-only API
      const travelData = await imageHelpers.prepareTravelData(
        formData,
        imageMethod === 'file' ? imageFile : null,
        imageMethod === 'url' ? imageUrl : null
      );

      // For CREATE operations, image is required
      if (!travel && !travelData.image_base64 && !travelData.image_url) {
        throw new Error('Gambar wajib diisi untuk membuat travel baru');
      }

      let response;
      if (travel) {
        // Update existing travel
        response = await adminService.travels.update(travel.id, travelData);
      } else {
        // Create new travel
        response = await adminService.travels.create(travelData);
      }

      showAlert('success', response.message || 'Travel berhasil disimpan');
      
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error) {
      console.error('Error saving travel:', error);
      showAlert('error', error.message || 'Gagal menyimpan travel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {travel ? 'Edit Travel' : 'Tambah Travel Baru'}
      </h2>

      {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ show: false, type: '', message: '' })}
          className="mb-6"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Asal"
            name="origin"
            value={formData.origin}
            onChange={handleInputChange}
            required
            placeholder="Jakarta"
          />

          <Input
            label="Tujuan"
            name="destination"
            value={formData.destination}
            onChange={handleInputChange}
            required
            placeholder="Bandung"
          />

          <Input
            label="Jenis Kendaraan"
            name="vehicle_type"
            value={formData.vehicle_type}
            onChange={handleInputChange}
            required
            placeholder="Bus Executive"
          />

          <Input
            label="Harga per Orang"
            name="price_per_person"
            type="number"
            value={formData.price_per_person}
            onChange={handleInputChange}
            required
            placeholder="75000"
          />

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
              Travel Aktif
            </label>
          </div>
        </div>

        {/* Image Upload - JSON Only */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gambar Travel {!travel && <span className="text-red-500">*</span>}
          </label>
          
          {/* Image Method Selection */}
          <div className="flex space-x-4 mb-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="imageMethod"
                value="file"
                checked={imageMethod === 'file'}
                onChange={(e) => setImageMethod(e.target.value)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Upload File</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="imageMethod"
                value="url"
                checked={imageMethod === 'url'}
                onChange={(e) => setImageMethod(e.target.value)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">URL Gambar</span>
            </label>
          </div>

          {imageMethod === 'file' ? (
            <div>
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                onChange={handleImageFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Format: JPEG, PNG, JPG, WEBP. Maksimal 5MB.
              </p>
              {imageFile && (
                <p className="mt-2 text-sm text-green-600">
                  File dipilih: {imageFile.name}
                </p>
              )}
            </div>
          ) : (
            <div>
              <Input
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                type="url"
              />
              <p className="mt-1 text-sm text-gray-500">
                Masukkan URL gambar yang valid. Backend akan mengunduh dan menyimpan gambar secara otomatis.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Batal
            </Button>
          )}
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Menyimpan...' : (travel ? 'Update Travel' : 'Tambah Travel')}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default TravelForm;