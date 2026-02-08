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
  
  // LOGIKA DETEKTOR TANGGAL (Hari Ini)
  const today = new Date().toISOString().split('T')[0];

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
    } catch (error) {
      navigate('/travels');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if(!bookingData.tanggal_keberangkatan) {
      alert('Mohon pilih tanggal keberangkatan.');
      return;
    }
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

  if (loading || !travel) return <Layout><div className="p-20 text-center font-sans">Memuat...</div></Layout>;

  return (
    <Layout>
      <div className="bg-white border-b px-4 py-3">
        <div className="container mx-auto">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      <div className="bg-[#F8F9FB] min-h-screen pb-20 font-sans">
        {/* Hero Section */}
        <div className="w-full h-64 md:h-80 relative">
          <img 
            src={getImageUrl(travel.image_url)} 
            className="w-full h-full object-cover" 
            alt="Travel Hero"
          />
        </div>

        <div className="max-w-2xl mx-auto px-4 -mt-16 relative z-10">
          <form onSubmit={handleBookingSubmit} className="space-y-6">
            
            {/* Card 1: Form Data */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-xl border border-gray-100"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Isi Data Pemesanan</h2>
                  <p className="text-gray-400 text-sm mt-1">Lengkapi data untuk melanjutkan booking</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-400 transition-all"
                      value={bookingData.nama_pemesan}
                      onChange={(e) => setBookingData({...bookingData, nama_pemesan: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor HP</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-400"
                      value={bookingData.nomor_hp}
                      onChange={(e) => setBookingData({...bookingData, nomor_hp: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-400"
                      value={bookingData.email}
                      onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Keberangkatan</label>
                    <input
                      type="date"
                      min={today} // DETEKTOR: Tidak bisa pilih tanggal lampau
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-400 bg-white cursor-pointer"
                      value={bookingData.tanggal_keberangkatan}
                      onChange={(e) => setBookingData({...bookingData, tanggal_keberangkatan: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Jumlah Anggota</label>
                  <select 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl appearance-none outline-none bg-white text-gray-700 cursor-pointer"
                    value={bookingData.passengers}
                    onChange={(e) => setBookingData({...bookingData, passengers: parseInt(e.target.value)})}
                  >
                    {[...Array(travel.capacity)].map((_, i) => (
                      <option key={i+1} value={i+1}>{i+1} orang</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Alamat Jemput</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-400"
                      value={bookingData.alamat_jemput}
                      onChange={(e) => setBookingData({...bookingData, alamat_jemput: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Alamat Tujuan</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-400"
                      value={bookingData.alamat_tujuan}
                      onChange={(e) => setBookingData({...bookingData, alamat_tujuan: e.target.value})}
                      required
                    />
                  </div>
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
                      <td className="bg-[#BCE7FF] px-4 py-4 font-bold text-blue-800 w-1/3 text-sm">Travel</td>
                      <td className="bg-[#D9F1FF] px-4 py-4 text-blue-800 font-semibold text-sm">
                        {travel.origin} - {travel.destination}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 text-sm">
                      <td className="px-4 py-4 text-gray-500">Jumlah Peserta</td>
                      <td className="px-4 py-4 text-gray-900 font-bold">{bookingData.passengers} orang</td>
                    </tr>
                    <tr className="border-b border-gray-100 text-sm">
                      <td className="px-4 py-4 text-gray-500">Harga per Orang</td>
                      <td className="px-4 py-4 text-gray-900 font-bold">{formatCurrency(travel.price)}</td>
                    </tr>
                    <tr className="text-sm">
                      <td className="px-4 py-4 text-gray-500 font-medium">Total Harga</td>
                      <td className="px-4 py-4 text-gray-900 font-black">{formatCurrency(totalPrice)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* ACTION BAR: RESPONSIVE */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2 }}
              className="bg-[#E0F2FF] rounded-2xl p-5 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 shadow-lg border border-white"
            >
              <div className="flex flex-col items-center md:items-start">
                <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Total Pembayaran</span>
                <span className="text-2xl font-black text-gray-900">{formatCurrency(totalPrice)}</span>
              </div>
              <Button
                type="submit"
                className="w-full md:w-auto !bg-[#008CD9] !text-white !rounded-xl !px-10 !py-4 !font-bold hover:bg-[#0077B8] transition-all transform active:scale-95 shadow-md"
                loading={bookingLoading}
              >
                Lanjutkan Booking
              </Button>
            </motion.div>

          </form>
        </div>
      </div>
    </Layout>
  );
};

export default TravelBooking;