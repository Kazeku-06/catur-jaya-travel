import {useState, useEffect} from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import Layout from '../components/Layout/Layout';
import Button from '../components/ui/Button';
import {useLocalStorage} from '../hooks/useLocalStorage';
import {authService} from '../services/authService';
import api, {endpoints} from '../config/api';
import {formatCurrency, getImageUrl} from '../utils/helpers';

const TripDetail = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [authToken] = useLocalStorage('auth_token', null);

    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);

    const isAdmin = authService.isAdmin();

    useEffect(() => {
        fetchTripDetail();
        window.scrollTo(0, 0);
    }, [id]);

    const fetchTripDetail = async () => {
        try {
            setLoading(true);
            const tripRes = await api.get(endpoints.tripDetail(id));
            const tripData = tripRes.data.data;

            if (! tripData) {
                navigate('/trips');
                return;
            }

            const mappedTrip = {
                id: tripData.id,
                name: tripData.title || 'Trip Tidak Diketahui',
                description: tripData.description || 'Deskripsi tidak tersedia',
                price: tripData.price || 0,
                duration: tripData.duration || 'Durasi tidak diketahui',
                location: tripData.location || 'Lokasi tidak diketahui',
                is_available_for_booking: tripData.is_available_for_booking !== undefined ? tripData.is_available_for_booking : tripData.is_active,
                is_quota_full: tripData.is_quota_full !== undefined ? tripData.is_quota_full : false,
                images: tripData.images || [tripData.image_url || tripData.image || '/images/trip-placeholder.jpg'],
                facilities: Array.isArray(tripData.facilities) ? tripData.facilities : [],
                itinerary: Array.isArray(tripData.itinerary) ? tripData.itinerary : []
            };

            setTrip(mappedTrip);

        } catch (error) {
            console.error('Error:', error);
            if (error.response ?. status === 404) 
                navigate('/trips');
            
        } finally {
            setLoading(false);
        }
    };

    if (loading) 
        return (
            <Layout>
                <div className="max-w-4xl mx-auto animate-pulse p-4">
                    <div className="h-64 bg-gray-200 rounded-3xl mb-4"></div>
                    <div className="h-40 bg-gray-200 rounded-3xl"></div>
                </div>
            </Layout>
        );
    

    const images = trip ?. images || [];

    const breadcrumbItems = [
        {
            label: 'Beranda',
            path: '/'
        }, {
            label: 'Paket Trip',
            path: '/trips'
        }, {
            label: trip ?. name || 'Detail Trip',
            path: `/trips/${id}`,
            active: true
        },
    ];

    return (
        <Layout>
            <div className="bg-[#F8F9FA] min-h-screen">

                {/* Navigasi Breadcrumb */}
                <div className="container mx-auto px-4 py-3">
                    <nav className="flex text-sm text-gray-500 space-x-2 overflow-x-auto whitespace-nowrap py-1">
                        {
                        breadcrumbItems.map((item, index) => (
                            <div key={index}
                                className="flex items-center">
                                {
                                index > 0 && <span className="mx-2 text-gray-300">/</span>
                            }
                                {
                                item.active ? (
                                    <span className="text-blue-500 font-bold truncate max-w-[150px]">
                                        {
                                        item.label
                                    }</span>
                                ) : (
                                    <Link to={
                                            item.path
                                        }
                                        className="hover:text-blue-500 transition-colors">
                                        {
                                        item.label
                                    } </Link>
                                )
                            } </div>
                        ))
                    } </nav>
                </div>

                {/* HERO SECTION */}
                <div className="container mx-auto px-0 sm:px-4 mt-4">
                    <div className="relative h-[250px] md:h-[400px] w-full overflow-hidden sm:rounded-[2rem] shadow-lg">
                        <img src={
                                getImageUrl(images[selectedImage])
                            }
                            alt={
                                trip ?. name
                            }
                            className="w-full h-full object-cover object-center"/>
                        <div className="absolute inset-0 bg-black/20"/>
                    </div>
                </div>

                {/* CONTENT CONTAINER UTAMA */}
                <div className="container mx-auto px-4 -mt-16 relative z-10 pb-24">

                    <div className="max-w-4xl mx-auto">
                        {/* CARD 1: Judul & Lokasi */}
                        <motion.div initial={
                                {
                                    y: 20,
                                    opacity: 0
                                }
                            }
                            animate={
                                {
                                    y: 0,
                                    opacity: 1
                                }
                            }
                            className="bg-white rounded-3xl p-6 shadow-xl mb-6 border border-gray-100">
                            <div className="flex items-center mb-4">
                                <div className="bg-blue-600 p-2.5 rounded-xl mr-4 shadow-lg shadow-blue-100 flex-shrink-0">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">
                                        {
                                        trip ?. name
                                    }</h2>
                                    <p className="text-gray-400 font-medium text-sm">
                                        {
                                        trip ?. location
                                    }
                                        • {
                                        trip ?. duration
                                    }</p>
                                </div>
                            </div>
                            <hr className="my-4 border-gray-50"/>
                            <div className="flex items-center text-gray-500">
                                <div className="bg-orange-100 p-2 rounded-lg mr-3 text-orange-600 flex-shrink-0">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                                    </svg>
                                </div>
                                <span className="text-xs sm:text-sm font-medium">Mulai dari
                                    <span className="text-blue-600 font-black text-base md:text-lg ml-1">
                                        {
                                        formatCurrency(trip ?. price)
                                    }
                                        / trip</span>
                                </span>
                            </div>
                        </motion.div>

                        {/* CARD 2: Deskripsi, Fasilitas & Itinerary */}
                        <motion.div initial={
                                {
                                    y: 20,
                                    opacity: 0
                                }
                            }
                            animate={
                                {
                                    y: 0,
                                    opacity: 1
                                }
                            }
                            transition={
                                {delay: 0.1}
                            }
                            className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg mb-8 border border-gray-100">
                            <h3 className="text-lg font-black text-gray-900 mb-3">Detail Perjalanan</h3>
                            <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-8 whitespace-pre-line">
                                {
                                trip ?. description
                            } </p>

                            <hr className="my-6 border-gray-100"/>

                            <h3 className="text-lg font-black text-gray-900 mb-5">Fasilitas</h3>
                            {
                            trip ?. facilities ?. length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                                    {
                                    trip.facilities.map((item, index) => (
                                        <div key={index}
                                            className="flex items-center p-3 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-200 transition-colors">
                                            <div className="flex-shrink-0 bg-blue-100 text-blue-600 p-1.5 rounded-lg mr-3">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"/>
                                                </svg>
                                            </div>
                                            <span className="font-bold text-gray-700 text-xs sm:text-sm truncate"
                                                title={item}>
                                                {item} </span>
                                        </div>
                                    ))
                                } </div>
                            ) : (
                                <p className="text-gray-400 text-sm italic mb-8">Fasilitas tidak dicantumkan.</p>
                            )
                        }

                            {
                            trip ?. itinerary ?. length > 0 && (
                                <>
                                    <h3 className="text-lg font-black text-gray-900 mb-5">Rencana Perjalanan</h3>
                                    <div className="space-y-4 mb-8 px-2">
                                        {
                                        trip.itinerary.map((step, index) => (
                                            <div key={index}
                                                className="flex space-x-4">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-3 h-3 rounded-full bg-blue-500 mt-1.5 ring-4 ring-blue-50"></div>
                                                    {
                                                    index !== trip.itinerary.length - 1 && <div className="w-0.5 h-full bg-blue-100 my-1"></div>
                                                } </div>
                                                <div className="pb-4">
                                                    <p className="text-sm text-gray-700 font-bold leading-snug">
                                                        {step}</p>
                                                </div>
                                            </div>
                                        ))
                                    } </div>
                                </>
                            )
                        }

                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <p className="text-xs text-gray-400 font-bold mb-2 uppercase tracking-wider">Butuh bantuan?</p>
                                <div className="flex items-center text-blue-600 font-black text-sm">
                                    <div className="bg-blue-50 p-2 rounded-full mr-3">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                        </svg>
                                    </div>
                                    <span>+62 813-4647-4165</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* BAR BOOKING BAWAH (Sticky) */}
                        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/50 flex items-center justify-between sticky bottom-6 z-20">
                            <div className="pl-2">
                                <p className="text-xl font-black text-gray-900 leading-none">
                                    {
                                    formatCurrency(trip ?. price)
                                }
                                    <span className="text-xs font-normal text-gray-400">/ trip</span>
                                </p>
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 italic">Instant Confirmation</p>
                            </div>
                            <Button className="!rounded-xl px-8 py-3.5 !bg-blue-600 hover:!bg-blue-700 text-white font-black transition-all shadow-lg text-sm sm:text-base"
                                disabled={
                                    !trip ?. is_available_for_booking || isAdmin
                                }
                                onClick={
                                    () => {
                                        if (isAdmin) 
                                            return alert('Admin tidak bisa booking');
                                        
                                        if (!authToken) 
                                            navigate('/login', {
                                                state: {
                                                    from: `/trips/${id}`
                                                }
                                            });
                                         else 
                                            navigate(`/trips/${id}/booking`);
                                        
                                    }
                            }>
                                {
                                trip ?. is_quota_full ? 'Kuota Habis' : 'Booking Sekarang'
                            } </Button>
                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default TripDetail;
