import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Breadcrumb from '../components/navigation/Breadcrumb';
import TripCard from '../components/cards/TripCard';
import { useLocalStorage } from '../hooks/useLocalStorage';
import api, { endpoints } from '../config/api';
import { formatCurrency, formatDate, getImageUrl } from '../utils/helpers';

const TripDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [authToken] = useLocalStorage('auth_token', null);
  
  const [trip, setTrip] = useState(null);
  const [relatedTrips, setRelatedTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [bookingData, setBookingData] = useState({
    participants: 1,
    departure_date: '',
    special_requests: '',
  });

  useEffect(() => {
    fetchTripDetail();
  }, [id]);

  const fetchTripDetail = async () => {
    try {
      setLoading(true);
      
      const [tripRes, relatedRes] = await Promise.all([
        api.get(endpoints.tripDetail(id)),
        api.get(`${endpoints.trips}?limit=4&exclude=${id}`)
      ]);
      
      setTrip(tripRes.data.data);
      setRelatedTrips(relatedRes.data.data || []);
      
    } catch (error) {
      console.error('Error fetching trip detail:', error);
      if (error.response?.status === 404) {
        navigate('/trips');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!authToken) {
      navigate('/login', { state: { from: `/trips/${id}` } });
      return;
    }

    try {
      setBookingLoading(true);
      
      const response = await api.post(endpoints.transactions, {
        trip_id: id,
        participants: bookingData.participants,
        departure_date: bookingData.departure_date,
        special_requests: bookingData.special_requests,
      });

      // Redirect to payment page
      navigate(`/payment/${response.data.data.id}`);
      
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Gagal membuat booking. Silakan coba lagi.');
    } finally {
      setBookingLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: 'Beranda', href: '/' },
    { label: 'Paket Trip', href: '/trips' },
    { label: trip?.name || 'Detail Trip' }
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

  if (!trip) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Trip tidak ditemukan</h1>
          <Button onClick={() => navigate('/trips')}>
            Kembali ke Daftar Trip
          </Button>
        </div>
      </Layout>
    );
  }

  const totalPrice = trip.price * bookingData.participants;
  const images = trip.images || [trip.image];

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
                  src={getImageUrl(images[selectedImage])}
                  alt={trip.name}
                  className="w-full h-full object-cover rounded-xl cursor-pointer"
                  onClick={() => setSelectedImage(selectedImage)}
                />
              </div>
              
              {images.length > 1 && (
                <div className="grid grid-cols-4 lg:grid-cols-1 gap-2 lg:gap-4">
                  {images.slice(0, 4).map((image, index) => (
                    <img
                      key={index}
                      src={getImageUrl(image)}
                      alt={`${trip.name} ${index + 1}`}
                      className={`w-full h-20 lg:h-24 object-cover rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedImage === index ? 'ring-2 ring-primary-500' : 'hover:opacity-80'
                      }`}
                      onClick={() => setSelectedImage(index)}
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
                      {trip.name}
                    </h1>
                    <div className="flex items-center space-x-4 text-gray-600 mb-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{trip.location}</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{trip.duration}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <Badge variant={trip.is_available ? 'success' : 'error'}>
                      {trip.is_available ? 'Tersedia' : 'Tidak Tersedia'}
                    </Badge>
                    {trip.category && (
                      <Badge variant="primary" className="mt-2">
                        {trip.category}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Rating */}
                {trip.rating && (
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(trip.rating) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-gray-600">
                      {trip.rating.toFixed(1)} ({trip.total_reviews} ulasan)
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="text-3xl font-bold text-primary-600">
                  {formatCurrency(trip.price)}
                  <span className="text-lg text-gray-600 font-normal">/orang</span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Deskripsi</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed">{trip.description}</p>
                </div>
              </div>

              {/* Itinerary */}
              {trip.itinerary && trip.itinerary.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Itinerary</h2>
                  <div className="space-y-4">
                    {trip.itinerary.map((item, index) => (
                      <div key={index} className="flex">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-4">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.title}</h3>
                          <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                          {item.time && (
                            <p className="text-primary-600 text-sm mt-1">{item.time}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Includes & Excludes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {trip.includes && trip.includes.length > 0 && (
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Termasuk</h3>
                    <ul className="space-y-2">
                      {trip.includes.map((item, index) => (
                        <li key={index} className="flex items-center text-gray-600">
                          <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {trip.excludes && trip.excludes.length > 0 && (
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tidak Termasuk</h3>
                    <ul className="space-y-2">
                      {trip.excludes.map((item, index) => (
                        <li key={index} className="flex items-center text-gray-600">
                          <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Booking Sidebar */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Booking Trip</h3>
                
                <div className="space-y-4 mb-6">
                  {/* Participants */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jumlah Peserta
                    </label>
                    <select
                      value={bookingData.participants}
                      onChange={(e) => setBookingData({
                        ...bookingData,
                        participants: parseInt(e.target.value)
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
                </div>

                {/* Price Summary */}
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">
                      {formatCurrency(trip.price)} x {bookingData.participants} orang
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
                  disabled={!trip.is_available || !bookingData.departure_date}
                  loading={bookingLoading}
                  onClick={() => setShowBookingModal(true)}
                >
                  {!trip.is_available ? 'Tidak Tersedia' : 'Booking Sekarang'}
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

          {/* Related Trips */}
          {relatedTrips.length > 0 && (
            <motion.div
              className="mt-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Trip Lainnya</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedTrips.map((relatedTrip) => (
                  <TripCard key={relatedTrip.id} trip={relatedTrip} />
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
            <h4 className="font-medium text-gray-900 mb-2">{trip.name}</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Jumlah Peserta: {bookingData.participants} orang</p>
              <p>Tanggal Keberangkatan: {formatDate(bookingData.departure_date)}</p>
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

export default TripDetail;