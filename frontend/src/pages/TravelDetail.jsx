import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Breadcrumb from '../components/navigation/Breadcrumb';
import TravelCard from '../components/cards/TravelCard';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { transactionService } from '../services/transactionService';
import api, { endpoints } from '../config/api';
import { formatCurrency, formatDate, getImageUrl } from '../utils/helpers';

const TravelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [authToken] = useLocalStorage('auth_token', null);
  
  const [travel, setTravel] = useState(null);
  const [relatedTravels, setRelatedTravels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [bookingData, setBookingData] = useState({
    passengers: 1,
    departure_date: '',
    pickup_location: '',
    destination_address: '',
    special_requests: '',
  });

  useEffect(() => {
    fetchTravelDetail();
  }, [id]);

  const fetchTravelDetail = async () => {
    try {
      setLoading(true);
      
      // Fetch travel detail
      const travelRes = await api.get(endpoints.travelDetail(id));
      
      // Backend response structure
      const travelData = travelRes.data.data;
      
      if (!travelData) {
        console.error('No travel data received');
        navigate('/travels');
        return;
      }
      
      // Map backend fields to frontend expected structure with safe fallbacks
      const mappedTravel = {
        id: travelData.id,
        name: travelData.title || travelData.origin + ' - ' + travelData.destination || 'Travel Tidak Diketahui',
        title: travelData.title || travelData.origin + ' - ' + travelData.destination || 'Travel Tidak Diketahui',
        description: travelData.description || 'Deskripsi tidak tersedia',
        price: travelData.price_per_person || travelData.price || 0,
        duration: travelData.duration || 'Durasi tidak diketahui',
        departure_location: travelData.origin || 'Lokasi tidak diketahui',
        destination_location: travelData.destination || 'Lokasi tidak diketahui',
        vehicle_type: travelData.vehicle_type || 'Kendaraan tidak diketahui',
        is_available: travelData.is_active !== undefined ? travelData.is_active : true,
        is_active: travelData.is_active !== undefined ? travelData.is_active : true,
        // Add default values for fields that might not exist in backend
        image: travelData.image || '/images/travel-placeholder.jpg',
        image_url: travelData.image_url || null,
        images: travelData.images || [travelData.image_url || travelData.image || '/images/travel-placeholder.jpg'],
        departure_date: travelData.departure_date || null,
        departure_time: travelData.departure_time || null,
        category: travelData.category || 'Travel',
        facilities: travelData.facilities || [],
        terms: travelData.terms || [],
        created_at: travelData.created_at,
        updated_at: travelData.updated_at,
      };
      
      setTravel(mappedTravel);
      
      // Fetch related travels separately to avoid blocking main content
      try {
        const relatedRes = await api.get(endpoints.travels);
        const allTravels = relatedRes.data.data || [];
        
        // Filter related travels (exclude current travel)
        const related = allTravels
          .filter(t => t.id !== id)
          .slice(0, 4)
          .map(t => ({
            ...t,
            name: t.title || t.origin + ' - ' + t.destination || 'Travel Tidak Diketahui',
            is_available: t.is_active !== undefined ? t.is_active : true,
          }));
        
        setRelatedTravels(related);
      } catch (relatedError) {
        console.error('Error fetching related travels:', relatedError);
        // Don't fail the whole page if related travels fail
        setRelatedTravels([]);
      }
      
    } catch (error) {
      console.error('Error fetching travel detail:', error);
      
      // More specific error handling
      if (error.response?.status === 404) {
        navigate('/travels');
      } else if (error.response?.status === 500) {
        console.error('Server error:', error.response.data);
        // Stay on page but show error state
      } else {
        console.error('Network or other error:', error.message);
        // Stay on page but show error state
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!authToken) {
      navigate('/login', { state: { from: `/travels/${id}` } });
      return;
    }

    // Validate required fields
    if (!travel?.departure_date && !bookingData.departure_date) {
      alert('Silakan pilih tanggal keberangkatan');
      return;
    }

    try {
      setBookingLoading(true);
      
      // Use the transaction service with proper booking data
      const response = await transactionService.createTravelTransaction(id, {
        passengers: bookingData.passengers,
        departure_date: travel?.departure_date || bookingData.departure_date,
        pickup_location: bookingData.pickup_location || travel?.departure_location || '',
        destination_address: bookingData.destination_address || travel?.destination_location || '',
        contact_phone: '+62812345678', // You might want to get this from user profile
        special_requests: bookingData.special_requests
      });

      // Backend response: { message: "...", data: { transaction_id, order_id, snap_token, ... } }
      const transactionData = response.data;
      
      // If Midtrans integration is available, redirect to payment
      if (transactionData.snap_token) {
        // Implement Midtrans Snap payment here
        // For now, redirect to success page
        navigate(`/payment/success?transaction_id=${transactionData.transaction_id}`);
      } else {
        // Fallback to success page
        navigate(`/payment/success?order_id=${transactionData.order_id}`);
      }
      
    } catch (error) {
      console.error('Error creating booking:', error);
      const errorMessage = error.response?.data?.message || 'Gagal membuat booking. Silakan coba lagi.';
      alert(errorMessage);
    } finally {
      setBookingLoading(false);
      setShowBookingModal(false);
    }
  };

  const breadcrumbItems = [
    { label: 'Beranda', href: '/' },
    { label: 'Travel', href: '/travels' },
    { label: travel?.name || travel?.title || 'Detail Travel' }
  ];

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-96 bg-gray-300 rounded-xl mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
              <div>
                <div className="h-64 bg-gray-300 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!travel) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Travel tidak ditemukan</h1>
          <Button onClick={() => navigate('/travels')}>
            Kembali ke Daftar Travel
          </Button>
        </div>
      </Layout>
    );
  }

  const totalPrice = (travel?.price || 0) * bookingData.passengers;
  const images = travel?.images || [travel?.image] || ['/images/travel-placeholder.jpg'];

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
          {/* Image Gallery */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-96 lg:h-[500px]">
              <div className="lg:col-span-3">
                <img
                  src={getImageUrl(images[selectedImage] || images[0])}
                  alt={travel?.name || travel?.title || 'Travel'}
                  className="w-full h-full object-cover rounded-xl cursor-pointer"
                  onClick={() => setSelectedImage(selectedImage)}
                  onError={(e) => {
                    e.target.src = '/images/travel-placeholder.jpg';
                  }}
                />
              </div>
              
              {images.length > 1 && (
                <div className="grid grid-cols-4 lg:grid-cols-1 gap-2 lg:gap-4">
                  {images.slice(0, 4).map((image, index) => (
                    <img
                      key={index}
                      src={getImageUrl(image)}
                      alt={`${travel?.name || travel?.title || 'Travel'} ${index + 1}`}
                      className={`w-full h-20 lg:h-24 object-cover rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedImage === index ? 'ring-2 ring-primary-500' : 'hover:opacity-80'
                      }`}
                      onClick={() => setSelectedImage(index)}
                      onError={(e) => {
                        e.target.src = '/images/travel-placeholder.jpg';
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Title and Basic Info */}
              <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      {travel?.name || travel?.title || 'Travel Tidak Diketahui'}
                    </h1>
                    <div className="flex items-center space-x-4 text-gray-600 mb-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{travel?.departure_location || 'Lokasi'} → {travel?.destination_location || 'Tujuan'}</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{travel?.duration || 'Durasi tidak diketahui'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <Badge variant={travel?.is_available ? 'success' : 'error'}>
                      {travel?.is_available ? 'Tersedia' : 'Tidak Tersedia'}
                    </Badge>
                    {travel?.category && (
                      <Badge variant="secondary" className="mt-2">
                        {travel.category}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Departure Info */}
                {travel?.departure_date && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center text-blue-800">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium">
                        {travel.departure_date ? `Keberangkatan: ${formatDate(travel.departure_date)}` : 'Jadwal akan ditentukan'}
                      </span>
                    </div>
                    {travel?.departure_time && (
                      <div className="flex items-center text-blue-700 mt-1">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Jam: {travel.departure_time}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Price */}
                <div className="text-3xl font-bold text-primary-600">
                  {formatCurrency(travel?.price || 0)}
                  <span className="text-lg text-gray-600 font-normal">/orang</span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Deskripsi</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed">{travel?.description || 'Deskripsi tidak tersedia'}</p>
                </div>
              </div>

              {/* Facilities */}
              {travel?.facilities && travel.facilities.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Fasilitas</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {travel.facilities.map((facility, index) => (
                      <div key={index} className="flex items-center text-gray-600">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm">{facility}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Terms & Conditions */}
              {travel?.terms && travel.terms.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Syarat & Ketentuan</h2>
                  <ul className="space-y-2">
                    {travel.terms.map((term, index) => (
                      <li key={index} className="flex items-start text-gray-600">
                        <span className="text-primary-600 mr-2 mt-1">•</span>
                        <span className="text-sm">{term}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>

            {/* Booking Sidebar */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Booking Travel</h3>
                
                <div className="space-y-4 mb-6">
                  {/* Passengers */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jumlah Penumpang
                    </label>
                    <select
                      value={bookingData.passengers}
                      onChange={(e) => setBookingData({
                        ...bookingData,
                        passengers: parseInt(e.target.value)
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} orang
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Departure Date */}
                  {!travel?.departure_date && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tanggal Keberangkatan
                      </label>
                      <input
                        type="date"
                        value={bookingData.departure_date}
                        onChange={(e) => setBookingData({
                          ...bookingData,
                          departure_date: e.target.value
                        })}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>
                  )}

                  {/* Pickup Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lokasi Penjemputan
                    </label>
                    <input
                      type="text"
                      value={bookingData.pickup_location}
                      onChange={(e) => setBookingData({
                        ...bookingData,
                        pickup_location: e.target.value
                      })}
                      placeholder={`Alamat lengkap di ${travel?.departure_location || 'kota asal'}`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Destination Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat Tujuan
                    </label>
                    <input
                      type="text"
                      value={bookingData.destination_address}
                      onChange={(e) => setBookingData({
                        ...bookingData,
                        destination_address: e.target.value
                      })}
                      placeholder={`Alamat lengkap di ${travel?.destination_location || 'kota tujuan'}`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Price Summary */}
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">
                      {formatCurrency(travel?.price || 0)} x {bookingData.passengers} orang
                    </span>
                    <span className="font-medium">{formatCurrency(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-primary-600">{formatCurrency(totalPrice)}</span>
                  </div>
                </div>

                {/* Booking Button */}
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={!travel?.is_available || (!travel?.departure_date && !bookingData.departure_date) || !bookingData.pickup_location}
                  loading={bookingLoading}
                  onClick={() => setShowBookingModal(true)}
                >
                  {!travel?.is_available ? 'Tidak Tersedia' : 'Booking Sekarang'}
                </Button>

                {/* Contact Info */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Butuh bantuan?</p>
                  <div className="flex items-center text-sm text-primary-600">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>+62 812-3456-7890</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Related Travels */}
          {relatedTravels.length > 0 && (
            <motion.div
              className="mt-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Travel Lainnya</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedTravels.map((relatedTravel) => (
                  <TravelCard key={relatedTravel.id} travel={relatedTravel} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      <Modal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title="Konfirmasi Booking"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">{travel?.name || travel?.title || 'Travel'}</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Rute: {travel?.departure_location || 'Lokasi'} → {travel?.destination_location || 'Tujuan'}</p>
              <p>Jumlah Penumpang: {bookingData.passengers} orang</p>
              {(travel?.departure_date || bookingData.departure_date) && (
                <p>Tanggal Keberangkatan: {formatDate(travel?.departure_date || bookingData.departure_date)}</p>
              )}
              {bookingData.pickup_location && (
                <p>Lokasi Penjemputan: {bookingData.pickup_location}</p>
              )}
              {bookingData.destination_address && (
                <p>Alamat Tujuan: {bookingData.destination_address}</p>
              )}
              <p className="font-medium text-lg text-primary-600">
                Total: {formatCurrency(totalPrice)}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Permintaan Khusus (Opsional)
            </label>
            <textarea
              value={bookingData.special_requests}
              onChange={(e) => setBookingData({
                ...bookingData,
                special_requests: e.target.value
              })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Masukkan permintaan khusus jika ada..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setShowBookingModal(false)}
            >
              Batal
            </Button>
            <Button
              variant="primary"
              fullWidth
              loading={bookingLoading}
              onClick={handleBooking}
            >
              Konfirmasi Booking
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default TravelDetail;