import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Tambah Link
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Breadcrumb from '../components/navigation/Breadcrumb';
import TripCard from '../components/cards/TripCard';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { authService } from '../services/authService';
import api, { endpoints } from '../config/api';
import { formatCurrency, formatDate, getImageUrl } from '../utils/helpers';

const TripDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [authToken] = useLocalStorage('auth_token', null);
  const [userData] = useLocalStorage('user_data', null);
  
  const [trip, setTrip] = useState(null);
  const [relatedTrips, setRelatedTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  const isAdmin = authService.isAdmin();

  useEffect(() => {
    fetchTripDetail();
  }, [id]);

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
        capacity: tripData.capacity || 1,
        remaining_quota: tripData.remaining_quota !== undefined ? tripData.remaining_quota : tripData.quota || 0,
        is_available: tripData.is_active !== undefined ? tripData.is_active : true,
        is_active: tripData.is_active !== undefined ? tripData.is_active : true,
        is_available_for_booking: tripData.is_available_for_booking !== undefined ? tripData.is_available_for_booking : tripData.is_active,
        is_quota_full: tripData.is_quota_full !== undefined ? tripData.is_quota_full : false,
        image: tripData.image || '/images/trip-placeholder.jpg',
        image_url: tripData.image_url || null,
        images: tripData.images || [tripData.image_url || tripData.image || '/images/trip-placeholder.jpg'],
        rating: tripData.rating || null,
        total_reviews: tripData.total_reviews || 0,
        category: tripData.category || 'Wisata',
        rundown: tripData.rundown || [],
        facilities: tripData.facilities || [],
        itinerary: tripData.itinerary || [],
        includes: tripData.includes || [],
        excludes: tripData.excludes || [],
      };
      
      setTrip(mappedTrip);

      try {
        const relatedRes = await api.get(endpoints.trips);
        const allTrips = relatedRes.data.data || [];
        const related = allTrips
          .filter(t => t.id !== id)
          .slice(0, 4)
          .map(t => ({
            ...t,
            name: t.title || 'Trip Tidak Diketahui',
            is_available: t.is_active !== undefined ? t.is_active : true,
          }));
        setRelatedTrips(related);
      } catch (e) { console.error(e); }
      
    } catch (error) {
      console.error('Error:', error);
      if (error.response?.status === 404) navigate('/trips');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <Layout>
      <div className="max-w-4xl mx-auto animate-pulse p-4">
        <div className="h-64 bg-gray-200 rounded-xl mb-4"></div>
        <div className="h-20 bg-gray-200 rounded-xl mb-4"></div>
      </div>
    </Layout>
  );

  const images = trip?.images || [trip?.image];

  // Breadcrumb items - Pastikan path benar
  const breadcrumbItems = [
    { label: 'Beranda', path: '/' },
    { label: 'Paket Trip', path: '/trips' },
    { label: trip?.name || 'Detail Trip', path: `/trips/${id}`, active: true },
  ];

  return (
    <Layout>
      <div className="bg-[#F8F9FA] min-h-screen">
        
        {/* Navigasi Breadcrumb (Navigasi Atas) */}
        <div className="container mx-auto px-4 py-3">
          <nav className="flex text-sm text-gray-500 space-x-2 overflow-x-auto whitespace-nowrap py-1">
            {breadcrumbItems.map((item, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && <span className="mx-2 text-gray-300">/</span>}
                {item.active ? (
                  <span className="text-blue-500 font-bold truncate max-w-[150px]">{item.label}</span>
                ) : (
                  <Link to={item.path} className="hover:text-blue-500 transition-colors">
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

       {/* HERO SECTION - Diperbesar lebarnya, diatur tingginya agar tetap proporsional */}
        <div className="container mx-auto px-0 sm:px-4 mt-4">
          <div className="relative h-[250px] md:h-[350px] w-full overflow-hidden sm:rounded-[2rem] shadow-lg">
            <img
              src={getImageUrl(images[selectedImage])}
              alt={trip?.name}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>
        </div>

        {/* CONTENT CONTAINER */}
        <div className="container mx-auto px-4 -mt-16 relative z-10 pb-20">
          <div className="max-w-4xl mx-auto">
            
            {/* CARD 1: Judul & Lokasi */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white rounded-3xl p-6 shadow-xl mb-6 border border-gray-100"
            >
              <div className="flex items-center mb-4">
                <div className="bg-blue-500 p-2.5 rounded-xl mr-4 shadow-lg shadow-blue-100 flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 leading-tight">{trip?.name}</h2>
                  <p className="text-gray-400 font-medium text-sm">{trip?.location}</p>
                </div>
              </div>
              <hr className="my-4 border-gray-50" />
              <div className="flex items-center text-gray-500">
                <div className="bg-orange-100 p-2 rounded-lg mr-3 text-orange-600 flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm">Mulai dari <span className="text-blue-500 font-bold text-base ml-1">{formatCurrency(trip?.price)} / orang</span></span>
              </div>
            </motion.div>

            {/* CARD 2: Deskripsi & Fasilitas */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg mb-8 border border-gray-100"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-3">Detail Perjalanan</h3>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-8">
                {trip?.description}
              </p>
              
              <hr className="my-6 border-gray-100" />

              <h3 className="text-lg font-bold text-gray-900 mb-5">Fasilitas</h3>
              <div className="grid grid-cols-2 gap-x-3 gap-y-5">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 bg-blue-50 text-blue-500 p-2.5 rounded-xl"><i className="fas fa-car text-base"></i></div>
                  <span className="font-semibold text-gray-700 text-xs sm:text-sm">Transport Jeep</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 bg-blue-50 text-blue-500 p-2.5 rounded-xl"><i className="fas fa-user-shield text-base"></i></div>
                  <span className="font-semibold text-gray-700 text-xs sm:text-sm">Guide</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 bg-blue-50 text-blue-500 p-2.5 rounded-xl"><i className="fas fa-hotel text-base"></i></div>
                  <span className="font-semibold text-gray-700 text-xs sm:text-sm">Hotel</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 bg-blue-50 text-blue-500 p-2.5 rounded-xl"><i className="fas fa-ticket-alt text-base"></i></div>
                  <span className="font-semibold text-gray-700 text-xs sm:text-sm">Tiket All-in</span>
                </div>
              </div>

              {/* Bantuan Section */}
              <div className="mt-10 pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-400 font-medium mb-2">Butuh bantuan?</p>
                <div className="flex items-center text-blue-500 font-bold text-sm">
                  <div className="bg-blue-50 p-2 rounded-full mr-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span>+62 813-4647-4165</span>
                </div>
              </div>
            </motion.div>

            {/* BAR BOOKING BAWAH (Sticky) */}
            <div className="bg-white rounded-2xl p-4 shadow-2xl border border-gray-50 flex items-center justify-between sticky bottom-6 z-20">
              <div className="pl-2">
                <p className="text-lg font-black text-gray-900 leading-none">
                  {formatCurrency(trip?.price)} <span className="text-xs font-normal text-gray-400">/ pax</span>
                </p>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Travel Services</p>
              </div>
              <Button
                className="!rounded-xl px-6 py-3.5 !bg-blue-500 hover:!bg-blue-600 text-white font-bold transition-all shadow-lg text-sm sm:text-base"
                disabled={!trip?.is_available_for_booking || isAdmin}
                onClick={() => {
                  if (isAdmin) return alert('Admin tidak bisa booking');
                  if (!authToken) navigate('/login', { state: { from: `/trips/${id}` } });
                  else navigate(`/trips/${id}/booking`);
                }}
              >
                Booking Sekarang
              </Button>
            </div>

            {/* REKOMENDASI TRIP LAINNYA */}
            {relatedTrips.length > 0 && (
              <div className="mt-16">
                <div className="flex justify-between items-end mb-6 px-2">
                  <h2 className="text-xl font-bold text-gray-900">Rekomendasi Trip</h2>
                  <button onClick={() => navigate('/trips')} className="text-blue-500 font-semibold text-xs hover:underline">Lihat Semua</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {relatedTrips.map((relatedTrip) => (
                    <TripCard key={relatedTrip.id} trip={relatedTrip} />
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

export default TripDetail;