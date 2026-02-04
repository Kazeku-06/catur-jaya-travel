import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Breadcrumb from '../components/navigation/Breadcrumb';
import TravelCard from '../components/cards/TravelCard';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { authService } from '../services/authService';
import api, { endpoints } from '../config/api';
import { formatCurrency, formatDate, getImageUrl } from '../utils/helpers';

const TravelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [authToken] = useLocalStorage('auth_token', null);
  const [userData] = useLocalStorage('user_data', null);
  
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
        id: travelData.id,
        name: travelData.title || travelData.origin + ' - ' + travelData.destination || 'Travel Tidak Diketahui',
        title: travelData.title || travelData.origin + ' - ' + travelData.destination || 'Travel Tidak Diketahui',
        description: travelData.description || 'Deskripsi tidak tersedia',
        price: travelData.price_per_person || travelData.price || 0,
        duration: travelData.duration || 'Durasi tidak diketahui',
        departure_location: travelData.origin || 'Lokasi tidak diketahui',
        destination_location: travelData.destination || 'Lokasi tidak diketahui',
        vehicle_type: travelData.vehicle_type || 'Kendaraan tidak diketahui',
        capacity: travelData.capacity || null,
        is_available: travelData.is_active !== undefined ? travelData.is_active : true,
        image: travelData.image || '/images/travel-placeholder.jpg',
        image_url: travelData.image_url || null,
        images: travelData.images || [travelData.image_url || travelData.image || '/images/travel-placeholder.jpg'],
        departure_date: travelData.departure_date || null,
        departure_time: travelData.departure_time || null,
        category: travelData.category || 'Travel',
        rundown: travelData.rundown || [],
        facilities: travelData.facilities || [],
        terms: travelData.terms || [],
      };
      
      setTravel(mappedTravel);
      
      try {
        const relatedRes = await api.get(endpoints.travels);
        const allTravels = relatedRes.data.data || [];
        const related = allTravels
          .filter(t => t.id !== id)
          .slice(0, 4)
          .map(t => ({
            ...t,
            name: t.title || t.origin + ' - ' + t.destination || 'Travel Tidak Diketahui',
            is_available: t.is_active !== undefined ? t.is_active : true,
          }));
        setRelatedTravels(related);
      } catch (e) { setRelatedTravels([]); }
      
    } catch (error) {
      if (error.response?.status === 404) navigate('/travels');
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: 'Beranda', href: '/' },
    { label: 'Travel', href: '/travels' },
    { label: travel?.name || 'Detail Travel' }
  ];

  if (loading) return (
    <Layout>
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="h-96 bg-gray-200 rounded-xl mb-8"></div>
      </div>
    </Layout>
  );

  const images = travel?.images || [travel?.image];

  return (
    <Layout>
      <div className="bg-white min-h-screen pb-24 lg:pb-12">
        {/* Desktop Breadcrumb Only */}
        <div className="hidden lg:block bg-gray-50 border-b">
          <div className="container mx-auto px-4 py-4">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        {/* Hero Section (Main Image) */}
        <div className="relative h-[40vh] lg:h-[60vh] w-full">
          <img
            src={getImageUrl(images[selectedImage])}
            className="w-full h-full object-cover"
            alt={travel?.name}
          />
          {/* Overlay gradient untuk mobile agar logo perusahaan terlihat jika ada */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent lg:hidden"></div>
        </div>

        <div className="container mx-auto px-4">
          <div className="relative -mt-16 lg:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Info & Details */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Floating Header Card (Sesuai Gambar) */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-xl lg:text-3xl font-bold text-gray-900">{travel?.name}</h1>
                    <p className="text-gray-500 text-sm mt-1">{travel?.departure_location}, {travel?.destination_location}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium">
                    Mulai dari <span className="text-blue-500">{formatCurrency(travel?.price)} / orang</span>
                    {travel?.capacity && (
                      <span className="ml-2 text-sm text-gray-500">• Kapasitas: {travel.capacity} orang</span>
                    )}
                  </p>
                </div>
              </motion.div>

              {/* Detail Perjalanan Section */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Detail Perjalanan</h2>
                <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                  {travel?.description}
                </p>

                <div className="mt-8">
                  <h3 className="text-md font-bold text-gray-900 mb-4">Fasilitas</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Hardcoded icons to match your Bromo design example if data is generic */}
                    {travel?.facilities.map((facility, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                          {/* Logika Ikon Sederhana */}
                          {facility.toLowerCase().includes('transport') || facility.toLowerCase().includes('jeep') ? (
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                          ) : facility.toLowerCase().includes('hotel') ? (
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" /></svg>
                          ) : (
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                          )}
                        </div>
                        <span className="text-sm text-gray-700 font-medium">{facility}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Desktop Sidebar / Price Info */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-24">
                <h3 className="font-bold text-gray-900 mb-4 text-xl">Booking Travel</h3>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-blue-600">{formatCurrency(travel?.price)}</span>
                  <span className="text-gray-500"> / orang</span>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={!travel?.is_available || isAdmin}
                  onClick={() => {
                    if (isAdmin) return alert('Admin tidak dapat booking.');
                    if (!authToken) navigate('/login', { state: { from: `/travels/${id}` } });
                    else navigate(`/travels/${id}/booking`);
                  }}
                >
                  Booking Sekarang
                </Button>
              </div>
            </div>

          </div>

          {/* Related Travels */}
          {relatedTravels.length > 0 && (
            <div className="mt-12 mb-12">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Travel Lainnya</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedTravels.map((t) => (
                  <TravelCard key={t.id} travel={t} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Sticky Booking Bar (Sesuai Gambar) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50">
          <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
            <div>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(travel?.price)} <span className="text-xs font-normal text-gray-500">/ orang</span></p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Travel Services</p>
            </div>
            <button
              disabled={!travel?.is_available || isAdmin}
              onClick={() => {
                if (!authToken) navigate('/login', { state: { from: `/travels/${id}` } });
                else navigate(`/travels/${id}/booking`);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-200"
            >
              Pesan Sekarang
            </button>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default TravelDetail;