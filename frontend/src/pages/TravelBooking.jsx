import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import Button from '../components/ui/Button';
import Breadcrumb from '../components/navigation/Breadcrumb';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { authService } from '../services/authService';
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
    nama_pemesan: userData?.name || '',
    nomor_hp: userData?.phone || '',
    email: userData?.email || '',
    passengers: 1,
    jumlah_barang: 'Pilih jumlah Barang',
    alamat_jemput: '',
    alamat_tujuan: '',
    tanggal_keberangkatan: '',
    catatan_tambahan: '',
  });

  useEffect(() => {
    if (!authToken) {
      navigate('/login', { state: { from: `/travels/${id}/booking` } });
      return;
    }
    if (authService.isAdmin()) {
      alert('Admin tidak dapat melakukan booking.');
      navigate(`/travels/${id}`);
      return;
    }
    fetchTravelDetail();
  }, [id, authToken, navigate]);

  const fetchTravelDetail = async () => {
    try {
      setLoading(true);
      const travelRes = await api.get(endpoints.travelDetail(id));
      const travelData = travelRes.data.data;
      
      const mappedTravel = {
        id: travelData.id,
        name: travelData.title || `${travelData.origin} - ${travelData.destination}`,
        origin: travelData.origin || 'Malang',
        destination: travelData.destination || 'Surabaya',
        price: travelData.price_per_person || travelData.price || 0,
        image_url: travelData.image_url || null,
        departure_date: travelData.departure_date || '',
        capacity: travelData.capacity || 10,
      };
      
      setTravel(mappedTravel);
      if (mappedTravel.departure_date) {
        setBookingData(prev => ({ ...prev, tanggal_keberangkatan: mappedTravel.departure_date }));
      }
    } catch (error) {
      navigate('/travels');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      setBookingLoading(true);
      const response = await transactionService.createTravelTransaction(id, bookingData);
      navigate(`/payment/${response.data.booking_id}`, {
        state: { booking: response.data, catalog: travel, bookingData }
      });
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal membuat booking.');
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

  if (loading || !travel) return <Layout><div className="p-20 text-center">Memuat...</div></Layout>;

  return (
    <Layout>
      {/* Navbar & Breadcrumb tetap dari Layout kamu */}
      <div className="bg-white border-b px-4 py-3">
        <div className="container mx-auto">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      <div className="bg-[#F8F9FB] min-h-screen pb-32">
        {/* Hero Image Section */}
        <div className="w-full h-64 md:h-80 relative">
          <img 
            src={getImageUrl(travel.image_url)} 
            className="w-full h-full object-cover" 
            alt="Travel Hero"
          />
        </div>

        {/* Form Content */}
        <div className="max-w-2xl mx-auto px-4 -mt-16 relative z-10">
          <form onSubmit={handleBookingSubmit} className="space-y-6">
            
            {/* Card 1: Data Pemesanan */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100"
            >
              <h2 className="text-xl font-bold text-gray-900">Isi Data Pemesanan</h2>
              <p className="text-gray-400 text-sm mb-8">Lengkapi data untuk melanjutkan booking</p>

              <div className="space-y-5">
                {/* Nama Lengkap */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
                  <input
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-400 transition-all"
                    value={bookingData.nama_pemesan}
                    onChange={(e) => setBookingData({...bookingData, nama_pemesan: e.target.value})}
                  />
                </div>

                {/* Nomor HP */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor HP</label>
                  <input
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-400"
                    value={bookingData.nomor_hp}
                    onChange={(e) => setBookingData({...bookingData, nomor_hp: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      placeholder="example@email.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none"
                      value={bookingData.email}
                      onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                    />
                  </div>
                  {/* Tanggal */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Keberangkatan</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Pilih Tanggal"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none bg-white"
                        value={bookingData.tanggal_keberangkatan ? formatDate(bookingData.tanggal_keberangkatan) : ''}
                        readOnly
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]">▶</span>
                    </div>
                  </div>
                </div>

                {/* Jumlah Anggota */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Jumlah Anggota</label>
                  <div className="relative">
                    <select 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl appearance-none outline-none text-gray-500 bg-white"
                      value={bookingData.passengers}
                      onChange={(e) => setBookingData({...bookingData, passengers: parseInt(e.target.value)})}
                    >
                      {[...Array(travel.capacity)].map((_, i) => (
                        <option key={i+1} value={i+1}>{i+1} orang</option>
                      ))}
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]">▶</span>
                  </div>
                </div>

                {/* Alamat jemput */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Alamat jemput</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none"
                    value={bookingData.alamat_jemput}
                    onChange={(e) => setBookingData({...bookingData, alamat_jemput: e.target.value})}
                  />
                </div>

                {/* Alamat Tujuan */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Alamat Tujuan</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none"
                    value={bookingData.alamat_tujuan}
                    onChange={(e) => setBookingData({...bookingData, alamat_tujuan: e.target.value})}
                  />
                </div>
              </div>
            </motion.div>

            {/* Card 2: Ringkasan Harga */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Ringkasan Harga</h3>
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="bg-[#BCE7FF] px-4 py-4 font-semibold text-blue-800 w-1/3 text-sm">Travel</td>
                      <td className="bg-[#D9F1FF] px-4 py-4 text-blue-800 font-medium text-sm">
                        {travel.origin} - {travel.destination}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 text-sm">
                      <td className="px-4 py-4 text-gray-500">Jumlah Peserta</td>
                      <td className="px-4 py-4 text-gray-900 font-semibold">{bookingData.passengers} orang</td>
                    </tr>
                    <tr className="border-b border-gray-100 text-sm">
                      <td className="px-4 py-4 text-gray-500">Harga per Orang</td>
                      <td className="px-4 py-4 text-gray-900 font-semibold">{formatCurrency(travel.price)}</td>
                    </tr>
                    <tr className="text-sm">
                      <td className="px-4 py-4 text-gray-500">Total Harga</td>
                      <td className="px-4 py-4 text-gray-900 font-bold">{formatCurrency(totalPrice)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Sticky Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t p-4 z-50">
              <div className="container mx-auto max-w-2xl">
                <div className="bg-[#E0F2FF] rounded-2xl p-4 flex justify-between items-center shadow-sm">
                  <span className="text-xl font-extrabold text-gray-900 pl-2">{formatCurrency(totalPrice)}</span>
                  <Button
                    type="submit"
                    className="!bg-[#008CD9] !text-white !rounded-xl !px-8 !py-3 !font-bold hover:bg-[#0077B8] transition-colors"
                    loading={bookingLoading}
                  >
                    Lanjutkan Booking
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default TravelBooking;