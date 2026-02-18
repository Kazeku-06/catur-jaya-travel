import {useState, useEffect} from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import Layout from '../components/Layout/Layout';
import Button from '../components/ui/Button';
import {useLocalStorage} from '../hooks/useLocalStorage';
import {authService} from '../services/authService';
import api, {endpoints} from '../config/api';
import {formatCurrency, getImageUrl} from '../utils/helpers';

const TravelDetail = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [authToken] = useLocalStorage('auth_token', null);
    const [travel, setTravel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);

    const isAdmin = authService.isAdmin();

    useEffect(() => {
        fetchTravelDetail();
        window.scrollTo(0, 0);
    }, [id]);

    const fetchTravelDetail = async () => {
        try {
            setLoading(true);
            const travelRes = await api.get(endpoints.travelDetail(id));
            const travelData = travelRes.data.data;

            if (! travelData) {
                navigate('/travels');
                return;
            }

            const mappedTravel = {
                ... travelData,
                name: travelData.title || `${
                    travelData.origin
                } - ${
                    travelData.destination
                }`,
                price: travelData.price_per_person || travelData.price || 0,
                images: travelData.images || [travelData.image_url || travelData.image || '/images/travel-placeholder.jpg'],
                facilities: travelData.facilities || [],
                rundown: travelData.rundown || [],
                is_available: travelData.is_active !== undefined ? travelData.is_active : true
            };

            setTravel(mappedTravel);
        } catch (error) {
            console.error('Error fetching travel detail:', error);
            if (error.response ?. status === 404) 
                navigate('/travels');
            
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
    

    const images = travel ?. images || [];

    const breadcrumbItems = [
        {
            label: 'Beranda',
            href: '/'
        }, {
            label: 'Travel',
            href: '/travels'
        }, {
            label: travel ?. name || 'Detail',
            href: `/travels/${id}`
        },
    ];

    return (
        <Layout>
            <div className="bg-[#F8F9FA] min-h-screen">

                {/* BREADCRUMB SECTION */}
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
                                index === breadcrumbItems.length - 1 ? (
                                    <span className="text-blue-500 font-bold truncate max-w-[150px]">
                                        {
                                        item.label
                                    }</span>
                                ) : (
                                    <Link to={
                                            item.href
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
                                travel ?. name
                            }
                            className="w-full h-full object-cover object-center"/>
                        <div className="absolute inset-0 bg-black/20"/>
                    </div>
                </div>

                {/* MAIN CONTENT */}
                <div className="container mx-auto px-4 -mt-16 relative z-10 pb-24">

                    <div className="max-w-4xl mx-auto">

                        {/* CARD 1: Judul & Rute */}
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
                            <div className="flex items-center mb-6">
                                <div className="bg-blue-600 p-2.5 rounded-xl mr-4 shadow-lg shadow-blue-100 flex-shrink-0">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">Layanan Travel Antar Kota</h2>
                                    <p className="text-gray-400 font-medium text-sm">Regular Service • Door to Door</p>
                                </div>
                            </div>

                            <div className="relative space-y-6 pl-6 mb-6">
                                <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-blue-50"></div>

                                <div className="flex items-start gap-4 relative">
                                    <div className="w-5 h-5 bg-green-500 rounded-full mt-1 z-10 border-4 border-white shadow"></div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Penjemputan</p>
                                        <p className="text-base font-extrabold text-gray-800 uppercase">
                                            {
                                            travel ?. origin || 'Kota Asal'
                                        } </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 relative">
                                    <div className="w-5 h-5 bg-red-500 rounded-full mt-1 z-10 border-4 border-white shadow"></div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Tujuan</p>
                                        <p className="text-base font-extrabold text-gray-800 uppercase">
                                            {
                                            travel ?. destination || 'Kota Tujuan'
                                        } </p>
                                    </div>
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
                                <span className="text-xs sm:text-sm font-medium">
                                    Mulai dari
                                    <span className="text-blue-600 font-black text-base md:text-lg ml-1">
                                        {
                                        formatCurrency(travel ?. price)
                                    }
                                        / orang</span>
                                </span>
                            </div>
                        </motion.div>

                        {/* CARD 2: Deskripsi & Fasilitas */}
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
                            <h3 className="text-lg font-black text-gray-900 mb-4">Detail Perjalanan</h3>
                            <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-8 whitespace-pre-line">
                                {
                                travel ?. description
                            } </p>

                            <hr className="my-8 border-gray-100"/>

                            <h3 className="text-lg font-black text-gray-900 mb-6">Fasilitas Unggulan</h3>
                            {
                            travel ?. facilities ?. length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                    {
                                    travel.facilities.map((facility, i) => (
                                        <div key={i}
                                            className="flex items-center p-3 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-blue-200 transition-colors">
                                            <div className="flex-shrink-0 bg-blue-100 text-blue-600 p-1.5 rounded-lg mr-3">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"/>
                                                </svg>
                                            </div>
                                            <span className="font-bold text-gray-700 text-xs sm:text-sm truncate"
                                                title={facility}>
                                                {facility} </span>
                                        </div>
                                    ))
                                } </div>
                            ) : (
                                <p className="text-gray-400 text-sm italic mb-8">Informasi fasilitas belum tersedia.</p>
                            )
                        } </motion.div>

                        {/* CARD 3: Jadwal Keberangkatan */}
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
                                {delay: 0.2}
                            }
                            className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg mb-8 border border-gray-100">
                            <h3 className="text-lg font-black text-gray-900 mb-6">Jadwal Keberangkatan</h3>
                            <div className="space-y-4 px-2">
                                {
                                travel ?. rundown ?. length > 0 ? (travel.rundown.map((item, i) => (
                                    <div key={i}
                                        className="flex space-x-4 group">
                                        <div className="flex flex-col items-center">
                                            <div className="w-3 h-3 rounded-full bg-blue-500 mt-1.5 ring-4 ring-blue-50"></div>
                                            {
                                            i !== travel.rundown.length - 1 && <div className="w-0.5 h-full bg-blue-100 my-1"></div>
                                        } </div>
                                        <div className="pb-6 flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-black text-blue-600">
                                                    {
                                                    item.time || item.jam
                                                }</span>
                                            </div>
                                            <p className="text-sm text-gray-700 font-bold leading-snug uppercase tracking-tight">
                                                {
                                                item.activity || item.kegiatan
                                            }</p>
                                        </div>
                                    </div>
                                ))) : (
                                    <div className="p-8 text-center text-gray-400 text-sm italic">Jadwal segera diperbarui</div>
                                )
                            } </div>
                            <p className="text-[10px] text-gray-400 italic mt-2 font-medium border-t pt-4">* Jadwal dapat berubah sewaktu-waktu tergantung kondisi lalu lintas.</p>
                        </motion.div>

                        {/* STICKY BOOKING BAR */}
                        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/50 flex items-center justify-between sticky bottom-6 z-50">
                            <div className="pl-2">
                                <p className="text-xl font-black text-gray-900 leading-none">
                                    {
                                    formatCurrency(travel ?. price)
                                }
                                    <span className="text-xs font-normal text-gray-400">/ orang</span>
                                </p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 italic">Travel Services</p>
                            </div>

                            <Button className="!rounded-xl px-8 py-3.5 !bg-blue-600 hover:!bg-blue-700 text-white font-black transition-all shadow-lg text-sm sm:text-base"
                                disabled={
                                    isAdmin || (travel ?. is_available === false)
                                }
                                onClick={
                                    () => {
                                        if (isAdmin) {
                                            alert('Admin tidak bisa booking');
                                            return;
                                        }
                                        if (!authToken) {
                                            navigate('/login', {
                                                state: {
                                                    from: `/travels/${id}`
                                                }
                                            });
                                        } else {
                                            navigate(`/travels/${id}/booking`);
                                        }
                                    }
                            }>
                                {
                                isAdmin ? 'Mode Admin' : 'Booking Sekarang'
                            } </Button>
                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    );
};


export default TravelDetail;
