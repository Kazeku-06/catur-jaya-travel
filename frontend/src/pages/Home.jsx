import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import TripCard from '../components/cards/TripCard';
import TravelCard from '../components/cards/TravelCard';
import CarterMobileCard from '../components/cards/CarterMobileCard';
import SearchForm from '../components/forms/SearchForm';
import api, { endpoints } from '../config/api';
import { formatCurrency } from '../utils/helpers';

const Home = () => {
  const [featuredTrips, setFeaturedTrips] = useState([]);
  const [featuredTravels, setFeaturedTravels] = useState([]);
  const [featuredCarters, setFeaturedCarters] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      
      // Fetch featured content
      const [tripsRes, travelsRes, cartersRes] = await Promise.all([
        api.get(`${endpoints.trips}?featured=true&limit=6`),
        api.get(`${endpoints.travels}?featured=true&limit=6`),
        api.get(`${endpoints.carterMobiles}?featured=true&limit=6`),
      ]);

      setFeaturedTrips(tripsRes.data.data || []);
      setFeaturedTravels(travelsRes.data.data || []);
      setFeaturedCarters(cartersRes.data.data || []);
      
      // Mock testimonials data
      setTestimonials([
        {
          id: 1,
          name: 'Sarah Wijaya',
          location: 'Jakarta',
          rating: 5,
          comment: 'Pengalaman yang luar biasa! Pelayanan sangat memuaskan dan destinasi wisata yang dipilih sangat menarik.',
          avatar: '/images/testimonials/sarah.jpg'
        },
        {
          id: 2,
          name: 'Ahmad Rizki',
          location: 'Bandung',
          rating: 5,
          comment: 'Trip ke Bali bersama Catur Jaya Travel sangat berkesan. Guide yang ramah dan profesional.',
          avatar: '/images/testimonials/ahmad.jpg'
        },
        {
          id: 3,
          name: 'Maya Sari',
          location: 'Surabaya',
          rating: 4,
          comment: 'Harga terjangkau dengan kualitas pelayanan yang baik. Pasti akan menggunakan jasa mereka lagi.',
          avatar: '/images/testimonials/maya.jpg'
        }
      ]);
      
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchData) => {
    // Navigate to search results page
    const params = new URLSearchParams();
    if (searchData.query) params.append('q', searchData.query);
    if (searchData.filters.category) params.append('category', searchData.filters.category);
    if (searchData.filters.priceRange) params.append('price', searchData.filters.priceRange);
    if (searchData.filters.location) params.append('location', searchData.filters.location);
    
    window.location.href = `/trips?${params.toString()}`;
  };

  const services = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Paket Trip',
      description: 'Nikmati paket wisata lengkap dengan destinasi menarik dan harga terjangkau.',
      link: '/trips'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      title: 'Travel Antar Kota',
      description: 'Layanan travel nyaman dan aman untuk perjalanan antar kota di seluruh Indonesia.',
      link: '/travels'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      title: 'Carter Mobil',
      description: 'Sewa mobil dengan driver berpengalaman untuk perjalanan yang fleksibel.',
      link: '/carter-mobiles'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Pelanggan Puas' },
    { number: '500+', label: 'Destinasi Wisata' },
    { number: '50+', label: 'Kota Tujuan' },
    { number: '5', label: 'Tahun Pengalaman' }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40 z-10"></div>
          <img
            src="/images/hero-bg.jpg"
            alt="Beautiful Indonesia"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="relative z-20 container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Jelajahi Keindahan
              <span className="block text-primary-400">Indonesia Bersama Kami</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-200">
              Temukan pengalaman wisata tak terlupakan dengan paket trip, travel, dan carter mobil terpercaya
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/trips">
                <Button variant="primary" size="lg">
                  Jelajahi Paket Trip
                </Button>
              </Link>
              <Link to="/travels">
                <Button variant="outline" size="lg">
                  Lihat Travel
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <SearchForm
              onSearch={handleSearch}
              showFilters={true}
              placeholder="Cari destinasi impian Anda..."
            />
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Layanan Terbaik Kami
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Kami menyediakan berbagai layanan perjalanan untuk memenuhi kebutuhan wisata Anda
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="text-primary-600 mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <Link to={service.link}>
                  <Button variant="outline" size="sm">
                    Pelajari Lebih Lanjut
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Trips */}
      {featuredTrips.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              className="flex items-center justify-between mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Paket Trip Populer
                </h2>
                <p className="text-xl text-gray-600">
                  Destinasi wisata favorit pilihan traveler
                </p>
              </div>
              <Link to="/trips">
                <Button variant="outline">Lihat Semua</Button>
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTrips.slice(0, 6).map((trip, index) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <TripCard trip={trip} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-primary-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Apa Kata Mereka
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Testimoni dari pelanggan yang telah merasakan pengalaman berwisata bersama kami
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="bg-white rounded-xl p-6 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-gray-600 mb-6 italic">"{testimonial.comment}"</p>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-semibold">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-500 text-sm">{testimonial.location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Siap Memulai Petualangan Anda?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-primary-100">
              Jangan tunggu lagi! Pilih paket wisata impian Anda dan buat kenangan tak terlupakan bersama keluarga dan teman-teman.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/trips">
                <Button variant="secondary" size="lg">
                  Pilih Paket Trip
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg">
                  Hubungi Kami
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;