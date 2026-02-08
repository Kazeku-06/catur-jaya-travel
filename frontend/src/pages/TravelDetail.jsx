import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import Button from '../components/ui/Button';
import Breadcrumb from '../components/navigation/Breadcrumb';
import TravelCard from '../components/cards/TravelCard';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { authService } from '../services/authService';
import api, { endpoints } from '../config/api';
import { formatCurrency, getImageUrl } from '../utils/helpers';

const TravelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [authToken] = useLocalStorage('auth_token', null);
  const [travel, setTravel] = useState(null);
  const [relatedTravels, setRelatedTravels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  const isAdmin = authService.isAdmin();

  useEffect(() => {
    fetchTravelDetail();
  }, [id]);


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
        ...travelData,
        name: travelData.title || `${travelData.origin} - ${travelData.destination}`,
        price: travelData.price_per_person || travelData.price || 0,
        images: travelData.images || [travelData.image_url || travelData.image || '/images/travel-placeholder.jpg'],
        facilities: travelData.facilities || [],
        rundown: travelData.rundown || [],
        is_available: travelData.is_active !== undefined ? travelData.is_active : true, // Map is_active to is_available
      };
      
      
      setTravel(mappedTravel);
      
      try {
        const relatedRes = await api.get(endpoints.travels);
        const related = (relatedRes.data.data || [])
          .filter(t => t.id !== id)
          .slice(0, 4);
        setRelatedTravels(related);
      } catch (e) { setRelatedTravels([]); }
      
    } catch (error) {
      console.error('Error fetching travel detail:', error);
      if (error.response?.status === 404) navigate('/travels');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <Layout>
      <div className="max-w-4xl mx-auto animate-pulse p-4">
        <div className="h-64 bg-gray-200 rounded-3xl mb-4"></div>
        <div className="h-40 bg-gray-200 rounded-3xl"></div>
      </div>
    </Layout>
  );

  const images = travel?.images || [];

  const breadcrumbItems = [
    { label: 'Beranda', href: '/' },
    { label: 'Trevel', href: '/travels' },
    { label: travel?.name || 'Detail', href: `/travels/${id}` },
  ];

  return (
    <Layout>
      <div className="bg-[#F9FBFC] min-h-screen pb-32">

        {/* BREADCRUMB SECTION (DIPISAH DARI HERO) */}
        <div className="bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 py-4 max-w-6xl">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        {/* HERO SECTION */}
        <div className="relative h-[350px] md:h-[450px] w-full overflow-hidden">
          <img
            src={getImageUrl(images[selectedImage])}
            alt={travel?.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* CONTENT CONTAINER */}
        <div className="container mx-auto px-4 -mt-20 relative z-10">
          <div className="max-w-4xl mx-auto relative">

            {/* CARD 1 */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-xl shadow-blue-900/5 border border-white mb-6"
            >
              <h2 className="text-xl font-black text-gray-900 mb-6">Layanan Travel Antar Kota</h2>
              
              <div className="relative space-y-6 pl-6">
                <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-blue-100"></div>

                <div className="flex items-start gap-4 relative">
                  <div className="w-5 h-5 bg-green-500 rounded-full mt-1 z-10 border-4 border-white shadow"></div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Penjemputan</p>
                    <p className="text-sm sm:text-base font-bold text-gray-800">
                      {travel?.origin || travel?.departure_location || 'Kota Asal'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 relative">
                  <div className="w-5 h-5 bg-red-500 rounded-full mt-1 z-10 border-4 border-white shadow"></div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Tujuan</p>
                    <p className="text-sm sm:text-base font-bold text-gray-800">
                      {travel?.destination || travel?.destination_location || 'Kota Tujuan'}
                    </p>
                  </div>
                </div>
              </div>

              <hr className="my-6 border-gray-100" />

              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium text-sm">
                  Mulai dari 
                  <span className="text-blue-500 font-black text-lg ml-1">
                    {formatCurrency(travel?.price)} / orang
                  </span>
                </p>
              </div>
            </motion.div>

            {/* CARD 2 */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-xl shadow-blue-900/5 border border-white mb-6"
            >
              <h3 className="text-lg font-black text-gray-900 mb-4">Detail Perjalanan</h3>
              <p className="text-gray-500 leading-relaxed text-sm sm:text-base mb-10">
                {travel?.description}
              </p>
              
              <hr className="border-gray-100 mb-8" />
              
             {/* LAYOUT FASILITAS MENYAMPING (GRID) */}
              {travel?.facilities?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {travel.facilities.map((facility, i) => (
                    <div key={i} className="flex items-center p-3 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex-shrink-0 bg-blue-100 text-blue-600 p-1.5 rounded-lg mr-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="font-semibold text-gray-700 text-xs sm:text-sm truncate">
                        {facility}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm italic">Fasilitas belum tersedia</p>
              )}
            </motion.div>
           

            {/* CARD 3 */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-xl shadow-blue-900/5 border border-white mb-6"
            >
              <h3 className="text-lg font-black text-gray-900 mb-6">Jadwal Keberangkatan</h3>
              <div className="space-y-0 border border-gray-100 rounded-2xl overflow-hidden">
                {travel?.rundown?.length > 0 ? (
                  travel.rundown.map((item, i) => (
                    <div key={i} className={`flex items-center justify-between p-4 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-100 last:border-0`}>
                      <div className="flex items-center gap-3">
                         <i className={`fas ${item.time?.toLowerCase().includes('pagi') || item.jam?.toLowerCase().includes('0') ? 'fa-sun text-orange-400' : 'fa-moon text-blue-400'} text-sm`}></i>
                         <span className="text-sm font-bold text-gray-700">{item.time || item.jam}</span>
                      </div>
                      <span className="text-sm text-gray-500 font-medium">{item.activity || item.kegiatan}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-400 text-sm italic">Jadwal belum tersedia</div>
                )}
              </div>
              <p className="text-[10px] text-gray-400 italic mt-4 font-medium">* jadwal dapat menyesuaikan kondisi lalu lintas.</p>
            </motion.div>

            {/* BAR BOOKING BAWAH (Sticky) */}
            <div className="bg-white rounded-2xl p-4 shadow-2xl border border-gray-50 flex items-center justify-between sticky bottom-6 z-50 mt-6">
              <div className="pl-2">
                <p className="text-lg font-black text-gray-900 leading-none">
                  {formatCurrency(travel?.price)}
                  <span className="text-xs font-normal text-gray-400"> / orang</span>
                </p>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                  Travel Services
                </p>
                {/* Debug info - remove in production */}
              </div>

              <Button
                className="!rounded-xl px-6 py-3.5 !bg-blue-500 hover:!bg-blue-600 text-white font-bold transition-all shadow-lg text-sm sm:text-base relative z-10"
                disabled={isAdmin || (travel?.is_available === false)}
                onClick={() => {
                  
                  if (isAdmin) {
                    alert('Admin tidak bisa booking');
                    return;
                  }
                  
                  if (!authToken) {
                    navigate('/login', { state: { from: `/travels/${id}` } });
                  } else {
                    navigate(`/travels/${id}/booking`);
                  }
                }}
              >
                {isAdmin ? 'Admin Mode' : 'Booking Sekarang'}
              </Button>
            </div>


            {/* RELATED */}
            {relatedTravels.length > 0 && (
              <div className="mt-16">
                <div className="flex justify-between items-center mb-8 px-2">
                  <h2 className="text-xl font-black text-gray-900">Rekomendasi Travel</h2>
                  <button onClick={() => navigate('/travels')} className="text-blue-500 font-bold text-sm hover:underline">Lihat Semua</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedTravels.map((t) => (
                    <TravelCard key={t.id} travel={t} />  
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TravelDetail;
