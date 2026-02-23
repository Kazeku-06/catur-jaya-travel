import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import Button from '../components/ui/Button';
import TripCard from '../components/cards/TripCard';
import TravelCard from '../components/cards/TravelCard';
import { catalogService } from '../services/catalogService';
import { getTodayString, getMaxDateString, validateTravelDate } from '../utils/dateValidation';
import { getDailyRandomizedContent, getFallbackContent } from '../utils/dailyRandomizer';

const Home = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // State Management
    const [featuredTrips, setFeaturedTrips] = useState([]);
    const [featuredTravels, setFeaturedTravels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchData, setSearchData] = useState({
        destination: searchParams.get('q') || '',
        travelDates: searchParams.get('date') || ''
    });
    const [dateError, setDateError] = useState('');

    const todayString = getTodayString();
    const maxDateString = getMaxDateString();

    // Fetch Data on Mount
    useEffect(() => {
        const fetchHomeData = async () => {
            setIsLoading(true);
            try {
                const [tripsData, travelsData] = await Promise.all([
                    catalogService.getTrips(),
                    catalogService.getTravels(),
                ]);

                const trips = tripsData?.data || [];
                const travels = travelsData?.data || [];

                setFeaturedTrips(trips.slice(0, 3));
                setFeaturedTravels(travels.slice(0, 3));

                // Jika butuh dailyContent untuk section tambahan nantinya:
                // const randomContent = getDailyRandomizedContent(trips, travels, 3);
            } catch (error) {
                console.error('Error fetching home data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    // Date Validation Logic
    const validateDate = (selectedDate) => {
        if (!selectedDate) return false;
        const validation = validateTravelDate(selectedDate);
        if (!validation.isValid) {
            setDateError(validation.error);
            return false;
        }
        setDateError('');
        return true;
    };

    // Search Handler
    const handleSearch = () => {
        const isDateValid = validateDate(searchData.travelDates);

        if (!searchData.destination.trim() || !searchData.travelDates || !isDateValid) {
            alert('Mohon isi destinasi dan tanggal keberangkatan dengan benar.');
            return;
        }

        const query = encodeURIComponent(searchData.destination.trim());
        navigate(`/trips?q=${query}&date=${searchData.travelDates}`);
    };

    // Helper for broken images
    const handleImageError = (e) => {
        e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2070&q=80';
    };

    return (
        <Layout>
            {/* Hero Section */}
            <section className="relative h-[70vh] flex items-center justify-center overflow-visible">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/40 z-10"></div>
                    <img
                        src="/images/hero-mountain.jpg"
                        alt="Hero"
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                    />
                </div>
                <div className="relative z-20 container mx-auto px-4 text-center text-white -mt-20">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <p className="text-sm md:text-lg mb-2 drop-shadow-md font-medium">Welcome To Catur Jaya Mandiri Travel Services</p>
                        <h1 className="text-3xl md:text-6xl font-bold leading-tight drop-shadow-xl">Shaping Growth Through<br />Trusted Excellence</h1>
                    </motion.div>
                </div>

                {/* Search Bar */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-30 w-full max-w-2xl px-4">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-2xl px-10 py-8 border border-gray-100">

                        {/* Input Destination */}
                        <div className="mb-5 border-b border-gray-100 pb-3 text-left">
                            <label className="block text-[11px] font-bold text-black uppercase tracking-wide mb-1">
                                Destination
                            </label>
                            <input
                                type="text"
                                placeholder="Tell us where you want to go"
                                value={searchData.destination}
                                onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
                                className="w-full text-sm focus:outline-none bg-transparent font-medium placeholder:text-gray-400 text-gray-700"
                            />
                        </div>

                        {/* Input Travel Dates */}
                        <div className="mb-6 border-b border-gray-100 pb-3 text-left">
                            <label className="block text-[11px] font-bold text-black uppercase tracking-wide mb-1">
                                Travel Dates
                            </label>
                            <input
                                type="date"
                                min={todayString}
                                max={maxDateString}
                                value={searchData.travelDates}
                                onChange={(e) => {
                                    setSearchData({ ...searchData, travelDates: e.target.value });
                                    validateDate(e.target.value);
                                }}
                                className={`w-full text-sm focus:outline-none bg-transparent font-medium ${dateError ? 'text-red-500' : 'text-gray-700'}`}
                            />
                            {dateError && <p className="text-[10px] text-red-500 mt-1">{dateError}</p>}
                        </div>

                        <Button
                            onClick={handleSearch}
                            className="w-full py-4 rounded-xl font-bold bg-[#00a3ff] hover:bg-[#008ce6] text-white shadow-lg transition-all"
                        >
                            Search Tour
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Recommendations Section */}
            <section className="pt-48 md:pt-40 pb-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Rekomendasi Hari Ini</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto text-xs md:text-sm leading-relaxed px-4">
                            Pilihan terbaik hari ini untuk perjalanan Anda bersama #CaturJayaMandiriTravelServices!
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                        {/* Card 1: Poster Tumpak Sewu */}
                        <motion.div
                            className="relative aspect-square w-full max-w-[310px] md:max-w-full overflow-hidden rounded-3xl shadow-lg group cursor-pointer bg-white flex border border-gray-100"
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                            <Link to="/trips/tumpak-sewu" className="block w-full h-full p-3">
                                <img
                                    src="privat_trip_tumpak_sewu (1).jpeg"
                                    alt="Private Trip Tumpak Sewu"
                                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                                    onError={handleImageError}
                                />
                            </Link>
                        </motion.div>

                        {/* Card 2: Poster Bromo */}
                        <motion.div
                            className="relative aspect-square w-full max-w-[310px] md:max-w-full overflow-hidden rounded-3xl shadow-lg group cursor-pointer bg-[#2D2D2D] flex border border-gray-800"
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                            <Link to="/trips/bromo" className="block w-full h-full p-3">
                                <img
                                    src="privat_trip_bromo (1).jpeg"
                                    alt="Private Trip Bromo"
                                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                                    onError={handleImageError}
                                />
                            </Link>
                        </motion.div>

                        {/* Card 3: Plan Your Next Journey */}
                        <motion.div
                            className="relative aspect-square w-full max-w-[310px] md:max-w-full overflow-hidden rounded-3xl shadow-lg flex bg-[#A3A3A3] p-6 md:p-8 flex-col justify-between items-start text-left"
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                            <div>
                                <div className="bg-[#FF8A00] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider mb-3 md:mb-4 inline-block shadow-sm">
                                    Travel Services
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-white leading-tight mb-2">
                                    Plan Your<br />Next Journey!
                                </h3>
                                <p className="text-white/95 text-[11px] md:text-sm leading-relaxed line-clamp-3">
                                    Intercity travel service with door-to-door pickup, comfortable and practical for your daily needs.
                                </p>
                            </div>
                            <Link to="/travels" className="w-full">
                                <button className="bg-[#00A3FF] hover:bg-[#0086D1] text-white font-bold py-3 md:py-4 px-6 rounded-xl transition-all shadow-md active:scale-95 text-sm w-full">
                                    Book Now
                                </button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Featured Travels Section */}
            {!isLoading && featuredTravels.length > 0 && (
                <section className="py-12 md:py-20 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                            <div className="text-left">
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Layanan Travel Terpercaya</h2>
                                <p className="text-sm md:text-base text-gray-600">Perjalanan antar kota yang nyaman dan aman</p>
                            </div>
                            <Link to="/travels">
                                <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-50 rounded-xl">Lihat Semua</Button>
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {featuredTravels.map((travel) => (
                                <div key={travel.id} className="transform scale-95 md:scale-100 origin-top">
                                    <TravelCard travel={travel} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Featured Trips Section */}
            {!isLoading && featuredTrips.length > 0 && (
                <section className="py-12 md:py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                            <div className="text-left">
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Paket Trip Terpopuler</h2>
                                <p className="text-sm md:text-base text-gray-600">Pilihan paket wisata favorit untuk petualangan Anda</p>
                            </div>
                            <Link to="/trips">
                                <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-50 rounded-xl">Lihat Semua</Button>
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {featuredTrips.map((trip) => (
                                <div key={trip.id} className="transform scale-95 md:scale-100 origin-top">
                                    <TripCard trip={trip} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Why Choose Us */}
            <section className="py-20 bg-white border-t border-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-16">Mengapa Memilih Kami?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { title: 'Terpercaya', desc: 'Lebih dari 5 tahun melayani pelanggan' },
                            { title: 'Harga Terjangkau', desc: 'Paket wisata dengan harga kompetitif' },
                            { title: 'Pelayanan 24/7', desc: 'Tim kami siap membantu kapan saja' }
                        ].map((f, i) => (
                            <div key={i} className="p-4">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">{i + 1}</div>
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
                    <p className="mb-10 opacity-90 text-sm md:text-base">
                        Pilih paket wisata impian Anda dan buat kenangan tak terlupakan
                    </p>
                    <div className="flex flex-row justify-center items-center gap-4">
                        <Link to="/trips">
                            <button className="bg-[#FFB800] hover:bg-[#e6a600] text-white font-bold py-3 px-6 md:px-10 rounded-xl transition-all duration-300 shadow-md active:scale-95 text-sm md:text-base">
                                Pilih Paket Trip
                            </button>
                        </Link>
                        <Link to="/travels">
                            <button className="bg-transparent border-2 border-white text-white font-bold py-3 px-6 md:px-10 rounded-xl hover:bg-white/10 transition-all duration-300 text-sm md:text-base">
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