import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Breadcrumb from '../components/navigation/Breadcrumb';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { authService } from '../services/authService';
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
    nama_pemesan: userData?.name || '',
    nomor_hp: userData?.phone || '',
    tanggal_keberangkatan: '',
    catatan_tambahan: '',
  });

  useEffect(() => {
    if (!authToken) {
      navigate('/login', { state: { from: `/trips/${id}/booking` } });
      return;
    }
    
    // Check if user is admin and redirect to detail page
    if (authService.isAdmin()) {
      alert('Admin tidak dapat melakukan booking. Anda akan diarahkan ke halaman detail.');
      navigate(`/trips/${id}`);
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
        remaining_quota: tripData.remaining_quota !== undefined ? tripData.remaining_quota : tripData.quota || 0,
        is_available: tripData.is_active !== undefined ? tripData.is_active : true,
        is_available_for_booking: tripData.is_available_for_booking !== undefined ? tripData.is_available_for_booking : tripData.is_active,
        is_quota_full: tripData.is_quota_full !== undefined ? tripData.is_quota_full : false,
        image: tripData.image || '/images/trip-placeholder.jpg',
        image_url: tripData.image_url || null,
      };
      
      // If trip is not available for booking, redirect back to detail page
      if (!mappedTrip.is_available_for_booking) {
        if (mappedTrip.is_quota_full) {
          alert('Maaf, kuota trip ini sudah penuh. Anda akan diarahkan ke halaman detail.');
        } else {
          alert('Trip ini tidak tersedia untuk booking. Anda akan diarahkan ke halaman detail.');
        }
        navigate(`/trips/${id}`);
        return;
      }
      
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
    
    // Check if trip is available for booking
    if (!trip.is_available_for_booking) {
      if (trip.is_quota_full) {
        alert('Maaf, kuota trip ini sudah penuh');
      } else {
        alert('Trip ini tidak tersedia untuk booking');
      }
      return;
    }
    
    // Validate required fields
    if (!bookingData.nama_pemesan) {
      alert('Silakan masukkan nama pemesan');
      return;
    }
    
    if (!bookingData.nomor_hp) {
      alert('Silakan masukkan nomor HP');
      return;
    }
    
    if (!bookingData.tanggal_keberangkatan) {
      alert('Silakan pilih tanggal keberangkatan');
      return;
    }

    try {
      setBookingLoading(true);
      
      const response = await transactionService.createTripTransaction(id, bookingData);
      const bookingResult = response.data;
      
      // Redirect to payment page with booking data
      navigate(`/payment/${bookingResult.booking_id}`, {
        state: {
          booking: bookingResult,
          catalog: trip,
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

  const totalPrice = trip?.price || 0;

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
                  {trip.quota !== undefined && trip.remaining_quota !== undefined && (
                    <p className={`text-sm mb-2 ${trip.is_quota_full ? 'text-red-600' : trip.remaining_quota <= 2 ? 'text-orange-600' : 'text-green-600'}`}>
                      Sisa kuota: {trip.remaining_quota} dari {trip.quota}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary-600">
                      {formatCurrency(trip.price)}
                    </span>
                    <Badge variant={trip.is_quota_full ? 'warning' : trip.is_available_for_booking ? 'success' : 'error'}>
                      {trip.is_quota_full ? 'Kuota Penuh' : trip.is_available_for_booking ? 'Tersedia' : 'Tidak Tersedia'}
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
                  {/* Nama Pemesan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Pemesan *
                    </label>
                    <input
                      type="text"
                      value={bookingData.nama_pemesan}
                      onChange={(e) => setBookingData({
                        ...bookingData,
                        nama_pemesan: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Nomor HP */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor HP *
                    </label>
                    <input
                      type="tel"
                      value={bookingData.nomor_hp}
                      onChange={(e) => setBookingData({
                        ...bookingData,
                        nomor_hp: e.target.value
                      })}
                      placeholder="+62812345678"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Departure Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Keberangkatan *
                    </label>
                    <input
                      type="date"
                      value={bookingData.tanggal_keberangkatan}
                      onChange={(e) => setBookingData({
                        ...bookingData,
                        tanggal_keberangkatan: e.target.value
                      })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Catatan Tambahan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catatan Tambahan
                  </label>
                  <textarea
                    value={bookingData.catatan_tambahan}
                    onChange={(e) => setBookingData({
                      ...bookingData,
                      catatan_tambahan: e.target.value
                    })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Masukkan catatan tambahan jika ada (makanan vegetarian, alergi, dll.)"
                  />
                </div>

                {/* Price Summary */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Ringkasan Harga</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Harga Trip Private
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
                    disabled={!trip.is_available_for_booking}
                    className="flex-1"
                  >
                    {trip.is_quota_full ? 'Kuota Penuh' : 'Lanjutkan Pembayaran'}
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