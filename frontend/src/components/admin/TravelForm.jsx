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
    rundown: travel?.rundown || [{ time: '', activity: '' }],
    facilities: travel?.facilities || [''],
    price_per_person: travel?.price_per_person || '',
    capacity: travel?.capacity || '',
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

  const handleRundownChange = (index, field, value) => {
    const newRundown = [...formData.rundown];
    newRundown[index] = { ...newRundown[index], [field]: value };
    setFormData(prev => ({ ...prev, rundown: newRundown }));
  };

  const addRundownItem = () => {
    setFormData(prev => ({
      ...prev,
      rundown: [...prev.rundown, { time: '', activity: '' }]
    }));
  };

  const removeRundownItem = (index) => {
    if (formData.rundown.length > 1) {
      const newRundown = formData.rundown.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, rundown: newRundown }));
    }
  };

  const handleFacilityChange = (index, value) => {
    const newFacilities = [...formData.facilities];
    newFacilities[index] = value;
    setFormData(prev => ({ ...prev, facilities: newFacilities }));
  };

  const addFacilityItem = () => {
    setFormData(prev => ({
      ...prev,
      facilities: [...prev.facilities, '']
    }));
  };

  const removeFacilityItem = (index) => {
    if (formData.facilities.length > 1) {
      const newFacilities = formData.facilities.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, facilities: newFacilities }));
    }
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

          <Input
            label="Kapasitas Penumpang"
            name="capacity"
            type="number"
            value={formData.capacity}
            onChange={handleInputChange}
            required
            placeholder="45"
            min="1"
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

        {/* Rundown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rundown Perjalanan
          </label>
          <div className="space-y-3">
            {formData.rundown.map((item, index) => (
              <div key={index} className="flex gap-3 items-start">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Waktu (contoh: 08:00)"
                    value={item.time}
                    onChange={(e) => handleRundownChange(index, 'time', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                  <input
                    type="text"
                    placeholder="Kegiatan (contoh: Keberangkatan dari terminal)"
                    value={item.activity}
                    onChange={(e) => handleRundownChange(index, 'activity', e.target.value)}
                    className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeRundownItem(index)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
                  disabled={formData.rundown.length === 1}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addRundownItem}
            className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Tambah Kegiatan
          </button>
        </div>

        {/* Facilities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fasilitas
          </label>
          <div className="space-y-3">
            {formData.facilities.map((facility, index) => (
              <div key={index} className="flex gap-3 items-center">
                <input
                  type="text"
                  placeholder="Contoh: AC, Toilet, WiFi"
                  value={facility}
                  onChange={(e) => handleFacilityChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeFacilityItem(index)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
                  disabled={formData.facilities.length === 1}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addFacilityItem}
            className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Tambah Fasilitas
          </button>
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