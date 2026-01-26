import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Breadcrumb from '../components/navigation/Breadcrumb';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { transactionService } from '../services/transactionService';
import api, { endpoints } from '../config/api';
import { formatCurrency, formatDate, getImageUrl } from '../utils/helpers';

const TripBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [authToken] = useLocalStorage('auth_token', null);
  const [userData] = useLocalStorage('user_data', null);
  
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    participants: 1,
    departure_date: '',
    special_requests: '',
    contact_phone: userData?.phone || '',
    emergency_contact: '',
  });

  useEffect(() => {
    if (!authToken) {
      navigate('/login', { state: { from: `/trips/${id}/booking` } });
      return;
    }
    fetchTripDetail();
  }, [id, authToken, navigate]);

  const fetchTripDetail = async () => {
    try {
      setLoading(true);
      const tripRes = await api.get(endpoints.tripDetail(id));
      const tripData = tripRes.data.data;
      
      if (!tripData) {
        navigate('/trips');
        return;
      }
      
      const mappedTrip = {
        id: tripData.id,
        name: tripData.title || 'Trip Tidak Diketahui',
        title: tripData.title || 'Trip Tidak Diketahui',
        description: tripData.description || 'Deskripsi tidak tersedia',
        price: tripData.price || 0,
        duration: tripData.duration || 'Durasi tidak diketahui',
        location: tripData.location || 'Lokasi tidak diketahui',
        quota: tripData.quota || 0,
        is_available: tripData.is_active !== undefined ? tripData.is_active : true,
        image: tripData.image || '/images/trip-placeholder.jpg',
        image_url: tripData.image_url || null,
      };
      
      setTrip(mappedTrip);
    } catch (error) {
      console.error('Error fetching trip detail:', error);
      navigate('/trips');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!bookingData.departure_date) {
      alert('Silakan pilih tanggal keberangkatan');
      return;
    }
    
    if (!bookingData.contact_phone) {
      alert('Silakan masukkan nomor telepon');
      return;
    }

    try {
      setBookingLoading(true);
      
      const response = await transactionService.createTripTransaction(id, bookingData);
      const transactionData = response.data;
      
      // Redirect to payment page with transaction data
      navigate(`/payment/${transactionData.transaction_id}`, {
        state: {
          transaction: transactionData,
          trip: trip,
          bookingData: bookingData
        }
      });
      
    } catch (error) {
      console.error('Error creating booking:', error);
      const errorMessage = error.response?.data?.message || 'Gagal membuat booking. Silakan coba lagi.';
      alert(errorMessage);
    } finally {
      setBookingLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: 'Beranda', href: '/' },
    { label: 'Paket Trip', href: '/trips' },
    { label: trip?.name || 'Trip', href: `/trips/${id}` },
    { label: 'Booking' }
  ];

  const totalPrice = (trip?.price || 0) * bookingData.participants;

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-8"></div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
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
          <div className="max-w-4xl mx-auto">
            {/* Trip Summary */}
            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Form Pemesanan Trip</h1>
              
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <img
                  src={getImageUrl(trip.image_url || trip.image)}
                  alt={trip.name}
                  className="w-20 h-20 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = '/images/trip-placeholder.jpg';
                  }}
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{trip.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{trip.location}</p>
                  <p className="text-sm text-gray-600 mb-2">{trip.duration}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary-600">
                      {formatCurrency(trip.price)}/orang
                    </span>
                    <Badge variant={trip.is_available ? 'success' : 'error'}>
                      {trip.is_available ? 'Tersedia' : 'Tidak Tersedia'}
                    </Badge>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Booking Form */}
            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Participants */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jumlah Peserta *
                    </label>
                    <select
                      value={bookingData.participants}
                      onChange={(e) => setBookingData({
                        ...bookingData,
                        participants: parseInt(e.target.value)
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      {[...Array(Math.min(trip.quota || 10, 10))].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} orang
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Departure Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Keberangkatan *
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

                  {/* Contact Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Telepon *
                    </label>
                    <input
                      type="tel"
                      value={bookingData.contact_phone}
                      onChange={(e) => setBookingData({
                        ...bookingData,
                        contact_phone: e.target.value
                      })}
                      placeholder="+62812345678"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kontak Darurat
                    </label>
                    <input
                      type="text"
                      value={bookingData.emergency_contact}
                      onChange={(e) => setBookingData({
                        ...bookingData,
                        emergency_contact: e.target.value
                      })}
                      placeholder="Nama - Nomor Telepon"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permintaan Khusus
                  </label>
                  <textarea
                    value={bookingData.special_requests}
                    onChange={(e) => setBookingData({
                      ...bookingData,
                      special_requests: e.target.value
                    })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Masukkan permintaan khusus jika ada (makanan vegetarian, alergi, dll.)"
                  />
                </div>

                {/* Price Summary */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Ringkasan Harga</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {formatCurrency(trip.price)} x {bookingData.participants} orang
                        </span>
                        <span className="font-medium">{formatCurrency(totalPrice)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                        <span>Total</span>
                        <span className="text-primary-600">{formatCurrency(totalPrice)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => navigate(`/trips/${id}`)}
                    className="flex-1"
                  >
                    Kembali
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={bookingLoading}
                    disabled={!trip.is_available}
                    className="flex-1"
                  >
                    Lanjutkan Pembayaran
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TripBooking;