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

const TravelBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [authToken] = useLocalStorage('auth_token', null);
  const [userData] = useLocalStorage('user_data', null);
  
  const [travel, setTravel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    passengers: 1,
    departure_date: '',
    pickup_location: '',
    destination_address: '',
    contact_phone: userData?.phone || '',
    special_requests: '',
  });

  useEffect(() => {
    if (!authToken) {
      navigate('/login', { state: { from: `/travels/${id}/booking` } });
      return;
    }
    fetchTravelDetail();
  }, [id, authToken, navigate]);

  const fetchTravelDetail = async () => {
    try {
      setLoading(true);
      const travelRes = await api.get(endpoints.travelDetail(id));
      const travelData = travelRes.data.data;
      
      if (!travelData) {
        navigate('/travels');
        return;
      }
      
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
        image: travelData.image || '/images/travel-placeholder.jpg',
        image_url: travelData.image_url || null,
        departure_date: travelData.departure_date || null,
        departure_time: travelData.departure_time || null,
      };
      
      setTravel(mappedTravel);
      
      // Set default pickup and destination if travel has fixed schedule
      if (mappedTravel.departure_date) {
        setBookingData(prev => ({
          ...prev,
          departure_date: mappedTravel.departure_date
        }));
      }
    } catch (error) {
      console.error('Error fetching travel detail:', error);
      navigate('/travels');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!travel?.departure_date && !bookingData.departure_date) {
      alert('Silakan pilih tanggal keberangkatan');
      return;
    }
    
    if (!bookingData.pickup_location) {
      alert('Silakan masukkan lokasi penjemputan');
      return;
    }
    
    if (!bookingData.contact_phone) {
      alert('Silakan masukkan nomor telepon');
      return;
    }

    try {
      setBookingLoading(true);
      
      const response = await transactionService.createTravelTransaction(id, {
        ...bookingData,
        departure_date: travel?.departure_date || bookingData.departure_date
      });
      const transactionData = response.data;
      
      // Redirect to payment page with transaction data
      navigate(`/payment/${transactionData.transaction_id}`, {
        state: {
          transaction: transactionData,
          travel: travel,
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
    { label: 'Travel', href: '/travels' },
    { label: travel?.name || 'Travel', href: `/travels/${id}` },
    { label: 'Booking' }
  ];

  const totalPrice = (travel?.price || 0) * bookingData.passengers;

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
            {/* Travel Summary */}
            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Form Pemesanan Travel</h1>
              
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <img
                  src={getImageUrl(travel.image_url || travel.image)}
                  alt={travel.name}
                  className="w-20 h-20 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = '/images/travel-placeholder.jpg';
                  }}
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{travel.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {travel.departure_location} → {travel.destination_location}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">{travel.vehicle_type}</p>
                  {travel.departure_date && (
                    <p className="text-sm text-blue-600 mb-2">
                      Keberangkatan: {formatDate(travel.departure_date)}
                      {travel.departure_time && ` - ${travel.departure_time}`}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary-600">
                      {formatCurrency(travel.price)}/orang
                    </span>
                    <Badge variant={travel.is_available ? 'success' : 'error'}>
                      {travel.is_available ? 'Tersedia' : 'Tidak Tersedia'}
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
                  {/* Passengers */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jumlah Penumpang *
                    </label>
                    <select
                      value={bookingData.passengers}
                      onChange={(e) => setBookingData({
                        ...bookingData,
                        passengers: parseInt(e.target.value)
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} orang
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Departure Date - only show if travel doesn't have fixed date */}
                  {!travel?.departure_date && (
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
                  )}

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
                </div>

                {/* Pickup Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lokasi Penjemputan *
                  </label>
                  <input
                    type="text"
                    value={bookingData.pickup_location}
                    onChange={(e) => setBookingData({
                      ...bookingData,
                      pickup_location: e.target.value
                    })}
                    placeholder={`Alamat lengkap di ${travel.departure_location}`}
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
                    placeholder={`Alamat lengkap di ${travel.destination_location}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
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
                    placeholder="Masukkan permintaan khusus jika ada (bantuan kursi roda, dll.)"
                  />
                </div>

                {/* Price Summary */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Ringkasan Harga</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {formatCurrency(travel.price)} x {bookingData.passengers} orang
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
                    onClick={() => navigate(`/travels/${id}`)}
                    className="flex-1"
                  >
                    Kembali
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={bookingLoading}
                    disabled={!travel.is_available}
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

export default TravelBooking;