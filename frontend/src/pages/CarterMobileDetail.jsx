import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Breadcrumb from '../components/navigation/Breadcrumb';
import CarterMobileCard from '../components/cards/CarterMobileCard';
import api, { endpoints } from '../config/api';
import { formatCurrency, getImageUrl, generateWhatsAppUrl } from '../utils/helpers';

const CarterMobileDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [carterMobile, setCarterMobile] = useState(null);
  const [relatedCarters, setRelatedCarters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchCarterMobileDetail();
  }, [id]);

  const fetchCarterMobileDetail = async () => {
    try {
      setLoading(true);
      
      const [carterRes, relatedRes] = await Promise.all([
        api.get(endpoints.carterMobileDetail(id)),
        api.get(`${endpoints.carterMobiles}?limit=4&exclude=${id}`)
      ]);
      
      setCarterMobile(carterRes.data.data);
      setRelatedCarters(relatedRes.data.data || []);
      
    } catch (error) {
      console.error('Error fetching carter mobile detail:', error);
      if (error.response?.status === 404) {
        navigate('/carter-mobiles');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppContact = () => {
    const message = `Halo, saya tertarik dengan carter mobil ${carterMobile.name}. 

Detail mobil:
- Nama: ${carterMobile.name}
- Kapasitas: ${carterMobile.capacity} orang
- Harga: ${formatCurrency(carterMobile.price_per_day)}/hari
- Transmisi: ${carterMobile.transmission}
- Bahan Bakar: ${carterMobile.fuel_type}

Bisakah Anda memberikan informasi lebih lanjut dan ketersediaan?`;

    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
    const whatsappUrl = generateWhatsAppUrl(whatsappNumber, message);
    
    window.open(whatsappUrl, '_blank');
  };

  const breadcrumbItems = [
    { label: 'Beranda', href: '/' },
    { label: 'Carter Mobil', href: '/carter-mobiles' },
    { label: carterMobile?.name || 'Detail Carter Mobil' }
  ];

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-96 bg-gray-300 rounded-xl mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
              <div>
                <div className="h-64 bg-gray-300 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!carterMobile) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Carter mobil tidak ditemukan</h1>
          <Button onClick={() => navigate('/carter-mobiles')}>
            Kembali ke Daftar Carter Mobil
          </Button>
        </div>
      </Layout>
    );
  }

  const images = carterMobile.images || [carterMobile.image];

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Image Gallery */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-96 lg:h-[500px]">
              <div className="lg:col-span-3">
                <img
                  src={getImageUrl(images[selectedImage])}
                  alt={carterMobile.name}
                  className="w-full h-full object-cover rounded-xl cursor-pointer"
                  onClick={() => setSelectedImage(selectedImage)}
                />
              </div>
              
              {images.length > 1 && (
                <div className="grid grid-cols-4 lg:grid-cols-1 gap-2 lg:gap-4">
                  {images.slice(0, 4).map((image, index) => (
                    <img
                      key={index}
                      src={getImageUrl(image)}
                      alt={`${carterMobile.name} ${index + 1}`}
                      className={`w-full h-20 lg:h-24 object-cover rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedImage === index ? 'ring-2 ring-primary-500' : 'hover:opacity-80'
                      }`}
                      onClick={() => setSelectedImage(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Title and Basic Info */}
              <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      {carterMobile.name}
                    </h1>
                    <div className="flex items-center space-x-4 text-gray-600 mb-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>{carterMobile.capacity} orang</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{carterMobile.transmission}</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>{carterMobile.fuel_type}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <Badge variant={carterMobile.is_available ? 'success' : 'error'}>
                      {carterMobile.is_available ? 'Tersedia' : 'Tidak Tersedia'}
                    </Badge>
                  </div>
                </div>

                {/* Rating */}
                {carterMobile.rating && (
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(carterMobile.rating) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-gray-600">
                      {carterMobile.rating.toFixed(1)} ({carterMobile.total_reviews} ulasan)
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="text-3xl font-bold text-primary-600">
                  {formatCurrency(carterMobile.price_per_day)}
                  <span className="text-lg text-gray-600 font-normal">/hari</span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Deskripsi</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed">{carterMobile.description}</p>
                </div>
              </div>

              {/* Specifications */}
              <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Spesifikasi</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Kapasitas</div>
                    <div className="font-semibold text-gray-900">{carterMobile.capacity} orang</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Transmisi</div>
                    <div className="font-semibold text-gray-900">{carterMobile.transmission}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Bahan Bakar</div>
                    <div className="font-semibold text-gray-900">{carterMobile.fuel_type}</div>
                  </div>
                  {carterMobile.year && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Tahun</div>
                      <div className="font-semibold text-gray-900">{carterMobile.year}</div>
                    </div>
                  )}
                  {carterMobile.engine && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Mesin</div>
                      <div className="font-semibold text-gray-900">{carterMobile.engine}</div>
                    </div>
                  )}
                  {carterMobile.luggage_capacity && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Bagasi</div>
                      <div className="font-semibold text-gray-900">{carterMobile.luggage_capacity}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              {carterMobile.features && carterMobile.features.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Fitur</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {carterMobile.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-gray-600">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Terms & Conditions */}
              {carterMobile.terms && carterMobile.terms.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Syarat & Ketentuan</h2>
                  <ul className="space-y-2">
                    {carterMobile.terms.map((term, index) => (
                      <li key={index} className="flex items-start text-gray-600">
                        <span className="text-primary-600 mr-2 mt-1">•</span>
                        <span className="text-sm">{term}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>

            {/* Contact Sidebar */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Hubungi Kami</h3>
                
                {/* Price Info */}
                <div className="bg-primary-50 rounded-lg p-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600 mb-1">
                      {formatCurrency(carterMobile.price_per_day)}
                    </div>
                    <div className="text-sm text-primary-700">per hari</div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-4 mb-6">
                  <div className="text-center text-gray-600">
                    <p className="text-sm mb-4">
                      Untuk informasi lebih lanjut dan pemesanan, silakan hubungi kami melalui WhatsApp
                    </p>
                  </div>
                </div>

                {/* WhatsApp Button */}
                <Button
                  variant="success"
                  size="lg"
                  fullWidth
                  disabled={!carterMobile.is_available}
                  onClick={handleWhatsAppContact}
                  leftIcon={
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.382z"/>
                    </svg>
                  }
                >
                  {!carterMobile.is_available ? 'Tidak Tersedia' : 'Hubungi via WhatsApp'}
                </Button>

                {/* Additional Info */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Driver berpengalaman</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Asuransi perjalanan</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>BBM sudah termasuk</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Layanan 24/7</span>
                    </div>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Kontak langsung:</p>
                  <div className="flex items-center text-sm text-primary-600">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>+62 812-3456-7890</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Related Carter Mobiles */}
          {relatedCarters.length > 0 && (
            <motion.div
              className="mt-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Mobil Carter Lainnya</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedCarters.map((relatedCarter) => (
                  <CarterMobileCard key={relatedCarter.id} carterMobile={relatedCarter} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CarterMobileDetail;