import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import Button from '../components/ui/Button';
import TripCard from '../components/cards/TripCard';
import TravelCard from '../components/cards/TravelCard';
import api, { endpoints } from '../config/api';
import { getTodayString, getMaxDateString, validateTravelDate } from '../utils/dateValidation';
import { getDailyRandomizedContent, getFallbackContent } from '../utils/dailyRandomizer';
import { formatCurrency } from '../utils/helpers';

const Home = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [featuredTrips, setFeaturedTrips] = useState([]);
  const [featuredTravels, setFeaturedTravels] = useState([]);
  const [dailyContent, setDailyContent] = useState([]);
  const [searchData, setSearchData] = useState({
    destination: searchParams.get('q') || '',
    travelDates: searchParams.get('date') || ''
  });
  const [dateError, setDateError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Mendapatkan tanggal hari ini dan maksimal 1 tahun ke depan untuk validasi
  const todayString = getTodayString();
  const maxDateString = getMaxDateString();

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [tripsRes, travelsRes] = await Promise.all([
        api.get(endpoints.trips),
        api.get(endpoints.travels),
      ]);

      const trips = tripsRes.data.data || [];
      const travels = travelsRes.data.data || [];

      setFeaturedTrips(trips.slice(0, 3));
      setFeaturedTravels(travels.slice(0, 3));
      
      // Ambil 3 konten acak (untuk Desktop butuh 3, untuk Mobile kita ambil 2 saja nanti)
      const randomContent = getDailyRandomizedContent(trips, travels, 3);
      const finalContent = randomContent.length > 0 ? randomContent : getFallbackContent();
      
      setDailyContent(finalContent);
    } catch (error) {
      console.error('Error fetching home data:', error);
      setDailyContent(getFallbackContent());
    }
  };

  // Validasi tanggal menggunakan utility function
  const validateDate = (selectedDate) => {
    const validation = validateTravelDate(selectedDate);
    
    if (!validation.isValid) {
      setDateError(validation.error);
      return false;
    }
    
    setDateError('');
    return true;
  };

  // Handle perubahan tanggal dengan validasi
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const newSearchData = {...searchData, travelDates: selectedDate};
    setSearchData(newSearchData);
    validateDate(selectedDate);
    
    // Update URL params
    updateSearchParams(newSearchData);
  };

  // Handle perubahan destination
  const handleDestinationChange = (e) => {
    const destination = e.target.value;
    const newSearchData = {...searchData, destination};
    setSearchData(newSearchData);
    
    // Update URL params
    updateSearchParams(newSearchData);
  };

  // Update URL search params
  const updateSearchParams = (data) => {
    const params = new URLSearchParams();
    
    if (data.destination.trim()) {
      params.set('q', data.destination.trim());
    }
    
    if (data.travelDates) {
      params.set('date', data.travelDates);
    }
    
    setSearchParams(params);
  };

  // Fungsi Search dengan validasi yang lebih ketat
  const handleSearch = async () => {
    // Validasi input
    if (!searchData.destination.trim()) {
      alert('Mohon masukkan destinasi yang ingin Anda kunjungi');
      return;
    }

    if (!searchData.travelDates) {
      alert('Mohon pilih tanggal perjalanan Anda');
      return;
    }

    // Validasi ulang tanggal sebelum search
    if (!validateDate(searchData.travelDates)) {
      return;
    }

    setIsSearching(true);
    
    try {
      const params = new URLSearchParams();
      
      if (searchData.destination.trim()) {
        params.append('q', searchData.destination.trim());
      }
      
      if (searchData.travelDates) {
        params.append('date', searchData.travelDates);
      }

      // Pindah ke halaman trips dengan membawa filter di URL
      navigate(`/trips?${params.toString()}`);
    } catch (error) {
      console.error('Error during search:', error);
      alert('Terjadi kesalahan saat mencari. Silakan coba lagi.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-visible">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <img
            src="/images/hero-mountain.jpg"
            alt="Beautiful Mountain View"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2070&q=80';
            }}
          />
        </div>

        <div className="relative z-20 container mx-auto px-4 text-center text-white -mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-sm md:text-lg mb-2 drop-shadow-md font-medium">Welcome To Catur Jaya Mandiri Travel Services</p>
            <h1 className="text-3xl md:text-6xl font-bold leading-tight drop-shadow-xl text-balance">
              Shaping Growth Through<br />Trusted Excellence
            </h1>
          </motion.div>
        </div>

        {/* Floating Search Form */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-30 w-full max-w-md px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl p-6 border border-gray-100"
          >
            {/* Input Destination */}
            <div className="mb-4 border-b border-gray-100 pb-3">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <div className="flex-1 text-left">
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">Destination</label>
                  <input
                    type="text"
                    placeholder="Tell us where you want to go"
                    value={searchData.destination}
                    onChange={handleDestinationChange}
                    className="w-full text-sm text-gray-500 focus:outline-none bg-transparent py-1 border-none focus:ring-0"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Input Travel Dates dengan Validasi Lengkap */}
            <div className="mb-4 border-b border-gray-100 pb-3">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div className="flex-1 text-left">
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">Travel Dates</label>
                  <input
                    type="date"
                    min={todayString} // Tidak bisa pilih tanggal sebelum hari ini
                    max={maxDateString} // Maksimal 1 tahun ke depan
                    value={searchData.travelDates}
                    onChange={handleDateChange}
                    className={`w-full text-sm focus:outline-none bg-transparent py-1 border-none focus:ring-0 appearance-none ${
                      dateError ? 'text-red-500' : 'text-gray-500'
                    }`}
                    style={{ colorScheme: 'light' }}
                    required
                  />
                </div>
              </div>
              {/* Error Message untuk Tanggal */}
              {dateError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-xs text-red-500 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {dateError}
                </motion.div>
              )}
            </div>

            <Button
              onClick={handleSearch}
              disabled={isSearching || !!dateError || !searchData.destination.trim() || !searchData.travelDates}
              className={`w-full py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
                isSearching || !!dateError || !searchData.destination.trim() || !searchData.travelDates
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#00a3ff] hover:bg-[#008ce6] text-white'
              }`}
            >
              {isSearching ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Searching...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search Tour
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="pt-56 pb-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Rekomendasi Hari Ini</h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-sm leading-relaxed">
              Jelajahi pilihan terbaik hari ini! Rekomendasi trip dan travel yang berubah setiap hari untuk memberikan Anda pengalaman baru yang menarik dengan #CaturJayaMandiriTravelServices!
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto justify-center items-stretch">
            {/* LOGIKA KARTU ACAK:
              - Di Desktop (md): Muncul 3 kartu (index 0, 1, 2)
              - Di Mobile: Muncul 2 kartu (index 0, 1) dan kartu ke-3 di-hidden
            */}
            {dailyContent.map((item, index) => (
              <motion.div
                key={`${item.type}-${item.id || index}`}
                // md:flex = tampil di desktop, ${index === 2 ? 'hidden md:flex' : 'flex'} = kartu ke-3 sembunyi di mobile
                className={`relative h-72 w-full md:w-1/3 overflow-hidden rounded-2xl shadow-md group cursor-pointer ${
                  index === 2 ? 'hidden md:flex' : 'flex'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={item.detailLink} className="block w-full h-full">
                  <img
                    src={item.image}
                    alt={item.displayName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 text-white text-left">
                    <div className="flex items-center mb-2">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                        item.type === 'trip' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
                      }`}>
                        {item.type === 'trip' ? 'TRIP' : 'TRAVEL'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-1">{item.displayName}</h3>
                    <div className="w-12 h-1 bg-[#00a3ff] my-2"></div>
                    <p className="text-xs opacity-90 mb-1">{item.displayLocation}</p>
                    <p className="text-lg font-bold text-[#00a3ff]">
                      {formatCurrency(item.displayPrice)}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* KARTU PLAN YOUR NEXT JOURNEY:
              - md:hidden = Sembunyi di Desktop
              - block = Muncul di Mobile
            */}
            <div className="md:hidden bg-[#b3b3b3] rounded-2xl p-6 text-white relative overflow-hidden shadow-md text-left w-full h-72 flex flex-col justify-between">
              <div>
                <span className="bg-[#ff8a00] text-[10px] uppercase font-bold px-3 py-1 rounded-md mb-3 inline-block tracking-tighter w-fit">
                  Travel Services
                </span>
                <h3 className="text-2xl font-bold mb-2 leading-tight">Plan Your<br />Next Journey!</h3>
                <p className="text-[11px] opacity-90 max-w-[200px] leading-relaxed">
                  Intercity travel service with door-to-door pickup, comfortable and practical for daily trips.
                </p>
              </div>
              
              <Link to="/travels" className="block w-full">
                <Button className="bg-[#00a3ff] hover:bg-[#008ce6] border-none text-white w-full py-2 rounded-lg font-bold text-sm">
                  Book Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Trips Section */}
        {featuredTrips.length > 0 && (
          <section className="py-12 md:py-20 bg-white">
            <div className="container mx-auto px-4">
              {/* Header Section: Stacked on mobile, side-by-side on desktop */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12">
                <div className="text-left">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    Paket Trip Populer
                  </h2>
                  <p className="text-sm md:text-base text-gray-600">
                    Destinasi wisata favorit pilihan traveler
                  </p>
                </div>
                
                {/* Button: Full width on mobile, auto width on desktop */}
                <div className="w-full md:w-auto">
                  <Link to="/trips">
                    <Button 
                      variant="outline" 
                      className="w-full md:w-auto border-blue-500 text-blue-500 hover:bg-blue-50 rounded-xl py-2.5 md:py-2 text-sm font-medium"
                    >
                      Lihat Semua
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Grid: 1 column on mobile, 3 on desktop */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {featuredTrips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            </div>
          </section>
        )}

      {/* Featured Travels Section */}
        {featuredTravels.length > 0 && (
          <section className="py-12 md:py-20 bg-gray-50">
            <div className="container mx-auto px-4">
              {/* Header Section: Stacked on mobile, side-by-side on desktop */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12">
                <div className="text-left">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    Layanan Travel Terpercaya
                  </h2>
                  <p className="text-sm md:text-base text-gray-600">
                    Perjalanan antar kota yang nyaman dan aman
                  </p>
                </div>
                
                {/* Button: Full width on mobile, auto width on desktop */}
                <div className="w-full md:w-auto">
                  <Link to="/travels">
                    <Button 
                      variant="outline" 
                      className="w-full md:w-auto border-blue-500 text-blue-500 hover:bg-blue-50 rounded-xl py-2.5 md:py-2 text-sm font-medium"
                    >
                      Lihat Semua
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Grid: 1 column on mobile, 3 on desktop */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-left">
                {featuredTravels.map((travel) => (
                  <TravelCard key={travel.id} travel={travel} />
                ))}
              </div>
            </div>
          </section>
        )}

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-16">Mengapa Memilih Kami?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Terpercaya', desc: 'Lebih dari 5 tahun melayani pelanggan' },
              { title: 'Harga Terjangkau', desc: 'Paket wisata dengan harga kompetitif' },
              { title: 'Pelayanan 24/7', desc: 'Tim kami siap membantu kapan saja' }
            ].map((f, i) => (
              <div key={i} className="p-4">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">{i+1}</div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#2563EB] text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Siap Memulai Petualangan Anda?</h2>
          <p className="mb-8 opacity-90">Pilih paket wisata impian Anda dan buat kenangan tak terlupakan.</p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to="/trips">
              <button className="!bg-[#FFB800] hover:bg-[#e6a600] text-white-900 font-bold py-3 px-10 rounded-full transition-all duration-300 shadow-lg transform hover:scale-105 active:scale-95">
                Pilih Paket Trip
              </button>
            </Link>

            {/* Tombol Travel (Outline) */}
            <Link to="/travels">
              <button className="bg-transparent border-2 border-white text-white font-bold py-3 px-10 rounded-full hover:bg-white/10 transition-all duration-300">
                Lihat Travel
              </button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;