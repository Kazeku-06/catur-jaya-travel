import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import Button from '../components/ui/Button';
import TripCard from '../components/cards/TripCard';
import TravelCard from '../components/cards/TravelCard';
import api, { endpoints } from '../config/api';
import { formatCurrency, getImageUrl } from '../utils/helpers';

const Home = () => {
  const [featuredTrips, setFeaturedTrips] = useState([]);
  const [featuredTravels, setFeaturedTravels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState({
    destination: '',
    travelDates: ''
  });

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      
      const [tripsRes, travelsRes] = await Promise.all([
        api.get(endpoints.trips),
        api.get(endpoints.travels),
      ]);

      setFeaturedTrips(tripsRes.data.data?.slice(0, 3) || []);
      setFeaturedTravels(travelsRes.data.data?.slice(0, 3) || []);
      
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchData.destination) {
      window.location.href = `/trips?q=${encodeURIComponent(searchData.destination)}`;
    } else {
      window.location.href = '/trips';
    }
  };

  const destinations = [
    {
      name: 'Bromo',
      tours: '78 Tours',
      image: '/images/destinations/bromo.jpg',
      link: '/trips?destination=bromo'
    },
    {
      name: 'Tumpak Sewu',
      tours: '45 Tours', 
      image: '/images/destinations/tumpak-sewu.jpg',
      link: '/trips?destination=tumpak-sewu'
    },
    {
      name: 'Sarangan',
      tours: '34 Tours',
      image: '/images/destinations/sarangan.jpg', 
      link: '/trips?destination=sarangan'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60 z-10"></div>
          <img
            src="/images/hero-mountain.jpg"
            alt="Beautiful Mountain View"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-20 container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            {/* Company Logo/Name */}
            <div className="mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold">Catur Jaya Mandiri</h3>
                  <p className="text-sm text-gray-300">Travel Services</p>
                </div>
              </div>
            </div>

            <p className="text-lg text-gray-300 mb-2">Welcome To Catur Jaya Mandiri Travel Services</p>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
              Shaping Growth Through
              <br />
              <span className="text-primary-400">Trusted Excellence</span>
            </h1>

            {/* Search Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-md mx-auto bg-white rounded-lg p-6 text-gray-900"
            >
              {/* Destination Input */}
              <div className="mb-4">
                <div className="flex items-center text-gray-600 mb-2">
                  <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span className="font-medium">Destination</span>
                </div>
                <input
                  type="text"
                  placeholder="Tell us where you want to go"
                  value={searchData.destination}
                  onChange={(e) => setSearchData({...searchData, destination: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Travel Dates Input */}
              <div className="mb-6">
                <div className="flex items-center text-gray-600 mb-2">
                  <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">Travel Dates</span>
                </div>
                <input
                  type="date"
                  value={searchData.travelDates}
                  onChange={(e) => setSearchData({...searchData, travelDates: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search Tour
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Destinations Section */}
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
              Destinations
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Jelajahi beragam destinasi menakjukan di seluruh dunia dan rasakan pesona setiap musim yang memikat di setiap langkah perjalanan Anda yang tak terlupakan dengan #CaturJayaMandiriTravelServices!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {destinations.map((destination, index) => (
              <motion.div
                key={index}
                className="relative group cursor-pointer overflow-hidden rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <Link to={destination.link}>
                  <div className="relative h-80 overflow-hidden rounded-xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10"></div>
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        const fallbackImages = [
                          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                          'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                        ];
                        e.target.src = fallbackImages[index] || fallbackImages[0];
                      }}
                    />
                    
                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                      <h3 className="text-2xl font-bold text-white mb-2">{destination.name}</h3>
                      <p className="text-gray-300">{destination.tours}</p>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-primary-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-15"></div>
                  </div>
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
                <p className="text-lg text-gray-600">
                  Destinasi wisata favorit pilihan traveler
                </p>
              </div>
              <Link to="/trips">
                <Button variant="outline">Lihat Semua Trip</Button>
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTrips.map((trip, index) => (
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

      {/* Featured Travels */}
      {featuredTravels.length > 0 && (
        <section className="py-20 bg-gray-50">
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
                  Layanan Travel Terpercaya
                </h2>
                <p className="text-lg text-gray-600">
                  Perjalanan antar kota yang nyaman dan aman
                </p>
              </div>
              <Link to="/travels">
                <Button variant="outline">Lihat Semua Travel</Button>
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTravels.map((travel, index) => (
                <motion.div
                  key={travel.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <TravelCard travel={travel} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mengapa Memilih Kami?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Pengalaman bertahun-tahun dalam industri travel membuat kami memahami kebutuhan perjalanan Anda
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Terpercaya & Berpengalaman',
                description: 'Lebih dari 5 tahun melayani ribuan pelanggan dengan kepuasan tinggi'
              },
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                ),
                title: 'Harga Terjangkau',
                description: 'Paket wisata dengan harga kompetitif tanpa mengurangi kualitas pelayanan'
              },
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                  </svg>
                ),
                title: 'Pelayanan 24/7',
                description: 'Tim customer service siap membantu Anda kapan saja dibutuhkan'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="text-center p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-primary-600 mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
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
              <Link to="/travels">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
                  Lihat Travel
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