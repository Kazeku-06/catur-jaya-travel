import {useState, useEffect} from 'react';
import {Link, useNavigate, useSearchParams} from 'react-router-dom';
import {motion} from 'framer-motion';
import Layout from '../components/Layout/Layout';
import Button from '../components/ui/Button';
import TripCard from '../components/cards/TripCard';
import TravelCard from '../components/cards/TravelCard';
import {catalogService} from '../services/catalogService';
import {getTodayString, getMaxDateString, validateTravelDate} from '../utils/dateValidation';
import {getDailyRandomizedContent, getFallbackContent} from '../utils/dailyRandomizer';
import {formatCurrency} from '../utils/helpers';

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

    const todayString = getTodayString();
    const maxDateString = getMaxDateString();

    useEffect(() => {
        fetchHomeData();
    }, []);

    const fetchHomeData = async () => {
        try {
            const [tripsData, travelsData] = await Promise.all([catalogService.getTrips(), catalogService.getTravels(),]);

            const trips = tripsData.data || [];
            const travels = travelsData.data || [];

            setFeaturedTrips(trips.slice(0, 3));
            setFeaturedTravels(travels.slice(0, 3));

            const randomContent = getDailyRandomizedContent(trips, travels, 3);
            const finalContent = randomContent.length > 0 ? randomContent : getFallbackContent();

            setDailyContent(finalContent);
        } catch (error) {
            console.error('Error fetching home data:', error);
            const fallback = getFallbackContent();
            setDailyContent(fallback);
            setFeaturedTrips([]);
            setFeaturedTravels([]);
        }
    };

    const validateDate = (selectedDate) => {
        const validation = validateTravelDate(selectedDate);
        if (! validation.isValid) {
            setDateError(validation.error);
            return false;
        }
        setDateError('');
        return true;
    };

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        const newSearchData = {
            ...searchData,
            travelDates: selectedDate
        };
        setSearchData(newSearchData);
        validateDate(selectedDate);
        updateSearchParams(newSearchData);
    };

    const handleDestinationChange = (e) => {
        const destination = e.target.value;
        const newSearchData = {
            ...searchData,
            destination
        };
        setSearchData(newSearchData);
        updateSearchParams(newSearchData);
    };

    const updateSearchParams = (data) => {
        const params = new URLSearchParams();
        if (data.destination.trim()) 
            params.set('q', data.destination.trim());
        
        if (data.travelDates) 
            params.set('date', data.travelDates);
        
        setSearchParams(params);
    };

    const handleSearch = async () => {
        if (!searchData.destination.trim()) {
            alert('Mohon masukkan destinasi yang ingin Anda kunjungi');
            return;
        }
        if (!searchData.travelDates) {
            alert('Mohon pilih tanggal perjalanan Anda');
            return;
        }
        if (! validateDate(searchData.travelDates)) 
            return;
        

        setIsSearching(true);
        try {
            const params = new URLSearchParams();
            if (searchData.destination.trim()) 
                params.append('q', searchData.destination.trim());
            
            if (searchData.travelDates) 
                params.append('date', searchData.travelDates);
            

            navigate(`/trips?${
                params.toString()
            }`);
        } catch (error) {
            console.error('Error during search:', error);
            alert('Terjadi kesalahan saat mencari. Silakan coba lagi.');
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <Layout> {/* Hero Section */}
            <section className="relative h-[70vh] flex items-center justify-center overflow-visible">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/40 z-10"></div>
                    <img src="/images/hero-mountain.jpg" alt="Hero" className="w-full h-full object-cover"
                        onError={
                            (e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2070&q=80';
                            }
                        }/>
                </div>

            <div className="relative z-20 container mx-auto px-4 text-center text-white -mt-20">
                <motion.div initial={
                        {
                            opacity: 0,
                            y: 30
                        }
                    }
                    animate={
                        {
                            opacity: 1,
                            y: 0
                        }
                    }
                    transition={
                        {duration: 0.8}
                }>
                    <p className="text-sm md:text-lg mb-2 drop-shadow-md font-medium">Welcome To Catur Jaya Mandiri Travel Services</p>
                    <h1 className="text-3xl md:text-6xl font-bold leading-tight drop-shadow-xl text-balance">
                        Shaping Growth Through<br/>Trusted Excellence
                    </h1>
                </motion.div>
            </div>

            {/* Hero Section Form - GABUNGAN KODE BARU */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-30 w-full max-w-2xl px-4">
                <motion.div initial={
                        {
                            opacity: 0,
                            scale: 0.9
                        }
                    }
                    animate={
                        {
                            opacity: 1,
                            scale: 1
                        }
                    }
                    className="bg-white rounded-2xl shadow-2xl px-10 py-8 border border-gray-100">
                    { /* Input Destination */}
                    <div className="mb-5 border-b border-gray-100 pb-3">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                            <div className="flex-1 text-left">
                                {/* Hapus font-sans, biarkan mengikuti font utama */}
                                <label className="block text-[10px] font-bold text-gray-900 uppercase tracking-[0.2em] mb-1">Destination</label>
                                <input type="text" placeholder="Tell us where you want to go"
                                    value={
                                        searchData.destination
                                    }
                                    onChange={handleDestinationChange}
                                    className="w-full text-sm text-gray-700 focus:outline-none bg-transparent py-1 border-none focus:ring-0 p-0 font-medium placeholder:text-gray-400"
                                    required/>
                            </div>
                        </div>
                    </div> { /* Input Travel Dates */
                    }
                    <div className="mb-6 border-b border-gray-100 pb-3">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                            <div className="flex-1 text-left">
                                {/* Hapus font-sans di sini juga */}
                                <label className="block text-[10px] font-bold text-gray-900 uppercase tracking-[0.2em] mb-1">Travel Dates</label>
                                <input type="date"
                                    min={todayString}
                                    max={maxDateString}
                                    value={
                                        searchData.travelDates
                                    }
                                    onChange={handleDateChange}
                                    className={
                                        `w-full text-sm focus:outline-none bg-transparent py-1 border-none focus:ring-0 appearance-none p-0 font-medium ${
                                            dateError ? 'text-red-500' : 'text-gray-700'
                                        }`
                                    }
                                    style={
                                        {
                                            colorScheme: 'light'
                                        }
                                    }
                                    required/>
                            </div>
                    </div>
                    {
                    dateError && <div className="mt-2 text-[10px] text-red-500 flex items-center font-medium">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        {dateError}</div>} 
                        </div>


                    <Button onClick={handleSearch}
                        disabled={
                            isSearching || !!dateError || !searchData.destination.trim() || !searchData.travelDates
                        }
                        className={
                            `w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 font-sans ${
                                isSearching || !!dateError || !searchData.destination.trim() || !searchData.travelDates ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#00a3ff] hover:bg-[#008ce6] text-white shadow-lg'
                            }`
                    }>
                        {
                        isSearching ? 'Searching...' : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                </svg>
                                Search Tour
                            </>
                        )
                    } </Button>
                </motion.div>
            </div>
        </section>

        {/* Recommendations Section */}
        <section className="pt-56 pb-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Rekomendasi Hari Ini</h2>
                    <p className="text-gray-600 max-w-3xl mx-auto text-sm leading-relaxed">
                        Jelajahi pilihan terbaik hari ini! Rekomendasi trip dan travel yang berubah setiap hari untuk memberikan Anda pengalaman baru yang menarik dengan #CaturJayaMandiriTravelServices!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-stretch">
                    {
                    dailyContent.map((item, index) => (
                        <motion.div key={
                                `${
                                    item.type
                                }-${
                                    item.id || index
                                }`
                            }
                            className={
                                `relative h-64 md:h-80 w-full max-w-[320px] md:max-w-none mx-auto overflow-hidden rounded-2xl md:rounded-3xl shadow-lg group cursor-pointer flex ${
                                    index === 2 ? 'hidden lg:flex' : 'flex'
                                }`
                            }
                            initial={
                                {
                                    opacity: 0,
                                    y: 20
                                }
                            }
                            whileInView={
                                {
                                    opacity: 1,
                                    y: 0
                                }
                            }
                            viewport={
                                {once: true}
                            }
                            transition={
                                {
                                    duration: 0.5,
                                    delay: index * 0.1
                                }
                        }>
                            <Link to={
                                    item.detailLink
                                }
                                className="block w-full h-full">
                                <img src={
                                        item.image
                                    }
                                    alt={
                                        item.displayName
                                    }
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-5 left-5 right-5 md:bottom-8 md:left-8 md:right-8 text-white text-left">
                                    <div className="flex items-center mb-2 md:mb-3">
                                        <span className={
                                            `px-3 py-1 text-[10px] tracking-widest font-black rounded-lg ${
                                                item.type === 'trip' ? 'bg-blue-600' : 'bg-orange-500'
                                            }`
                                        }>
                                            {
                                            item.type === 'trip' ? 'TRIP' : 'TRAVEL'
                                        } </span>
                                    </div>
                                    <h3 className="text-lg md:text-xl font-extrabold mb-1 group-hover:text-blue-400 transition-colors">
                                        {
                                        item.displayName
                                    } </h3>
                                    <div className="w-8 h-1 md:w-10 md:h-1 bg-blue-500 my-2 md:my-3 transition-all group-hover:w-20"></div>
                                    <p className="text-[10px] md:text-xs opacity-80 mb-1 font-medium">
                                        {
                                        item.displayLocation
                                    } </p>
                                    <p className="text-lg md:text-xl font-black text-white">
                                        {
                                        formatCurrency(item.displayPrice)
                                    } </p>
                                </div>
                            </Link>
                        </motion.div>
                    ))
                }

                    {/* Plan Your Next Journey Card - Mobile Only */}
                    <motion.div className="relative min-h-[16rem] md:min-h-[20rem] w-full max-w-[320px] md:max-w-none mx-auto overflow-hidden rounded-2xl md:rounded-3xl shadow-lg flex lg:hidden bg-[#A3A3A3] p-8 md:p-10 flex-col justify-start items-start text-left"
                        initial={
                            {
                                opacity: 0,
                                y: 20
                            }
                        }
                        whileInView={
                            {
                                opacity: 1,
                                y: 0
                            }
                        }
                        viewport={
                            {once: true}
                        }
                        transition={
                            {
                                duration: 0.5,
                                delay: 0.3
                            }
                    }>
                        <div className="bg-[#FF8A00] text-white text-[10px] font-bold px-4 py-1.5 rounded-lg uppercase tracking-wider mb-5">Travel Services</div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-3">Plan Your<br/>Next Journey!</h3>
                        <p className="text-white/90 text-xs md:text-sm leading-relaxed mb-6">Intercity travel service with door-to-door pickup, comfortable and practical for daily trips.</p>
                        <Link to="/travels" className="mt-auto w-full">
                            <button className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg active:scale-95 text-sm md:text-base">Book Now</button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>

        {/* Featured Travels Section */}
        {
        featuredTravels.length > 0 && (
            <section className="py-12 md:py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12 max-w-[300px] md:max-w-none mx-auto">
                        <div className="text-left">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Layanan Travel Terpercaya</h2>
                            <p className="text-sm md:text-base text-gray-600">Perjalanan antar kota yang nyaman dan aman</p>
                        </div>
                        <div className="w-full md:w-auto">
                            <Link to="/travels">
                                <Button variant="outline" className="w-full md:w-auto border-blue-500 text-blue-500 hover:bg-blue-50 rounded-xl py-2.5 md:py-2 text-sm font-medium">Lihat Semua</Button>
                            </Link>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {
                        featuredTravels.map((travel) => (
                            <div key={
                                    travel.id
                                }
                                className="w-full max-w-[300px] md:max-w-none mx-auto">
                                <TravelCard travel={travel}/>
                            </div>
                        ))
                    } </div>
                </div>
            </section>
        )
    }

        {/* Featured Trips Section */}
        {
        featuredTrips.length > 0 && (
            <section className="py-12 md:py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12 max-w-[300px] md:max-w-none mx-auto">
                        <div className="text-left">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Paket Trip Terpopuler</h2>
                            <p className="text-sm md:text-base text-gray-600">Pilihan paket wisata favorit untuk petualangan Anda</p>
                        </div>
                        <div className="w-full md:w-auto">
                            <Link to="/trips">
                                <Button variant="outline" className="w-full md:w-auto border-blue-500 text-blue-500 hover:bg-blue-50 rounded-xl py-2.5 md:py-2 text-sm font-medium">Lihat Semua</Button>
                            </Link>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {
                        featuredTrips.map((trip) => (
                            <div key={
                                    trip.id
                                }
                                className="w-full max-w-[300px] md:max-w-none mx-auto">
                                <TripCard trip={trip}/>
                            </div>
                        ))
                    } </div>
                </div>
            </section>
        )
    }

        {/* Why Choose Us */}
        <section className="py-20">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-16">Mengapa Memilih Kami?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {
                    [
                        {
                            title: 'Terpercaya',
                            desc: 'Lebih dari 5 tahun melayani pelanggan'
                        }, {
                            title: 'Harga Terjangkau',
                            desc: 'Paket wisata dengan harga kompetitif'
                        }, {
                            title: 'Pelayanan 24/7',
                            desc: 'Tim kami siap membantu kapan saja'
                        }
                    ].map((f, i) => (
                        <div key={i}
                            className="p-4">
                            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                                {
                                i + 1
                            } </div>
                            <h3 className="text-xl font-bold mb-2">
                                {
                                f.title
                            }</h3>
                            <p className="text-gray-600 text-sm">
                                {
                                f.desc
                            }</p>
                        </div>
                    ))
                } </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-[#2563EB] text-white text-center">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-4">Siap Memulai Petualangan Anda?</h2>
                <p className="mb-8 opacity-90">Pilih paket wisata impian Anda dan buat kenangan tak terlupakan.</p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Link to="/trips">
                        <button className="!bg-[#FFB800] hover:bg-[#e6a600] text-white-900 font-bold py-3 px-10 rounded-full transition-all duration-300 shadow-lg transform hover:scale-105 active:scale-95">Pilih Paket Trip</button>
                    </Link>
                    <Link to="/travels">
                        <button className="bg-transparent border-2 border-white text-white font-bold py-3 px-10 rounded-full hover:bg-white/10 transition-all duration-300">Lihat Travel</button>
                    </Link>
                </div>
            </div>
        </section>
    </Layout>
    );
};

export default Home;
