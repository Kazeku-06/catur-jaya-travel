import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatCurrency, getImageUrl, truncateText, generateWhatsAppUrl } from '../../utils/helpers';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const CarterMobileCard = ({ carterMobile, className = '' }) => {
  const {
    id,
    name,
    description,
    price_per_day,
    capacity,
    fuel_type,
    transmission,
    image,
    rating,
    total_reviews,
    is_available,
    features,
  } = carterMobile;

  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const message = `Halo, saya tertarik dengan carter mobil ${name}. Bisakah Anda memberikan informasi lebih lanjut?`;
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
    const whatsappUrl = generateWhatsAppUrl(whatsappNumber, message);
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.div
      className={`card hover:shadow-xl transition-all duration-300 ${className}`}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/carter-mobiles/${id}`} className="block">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={getImageUrl(image)}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            loading="lazy"
          />
          
          {/* Badge */}
          <div className="absolute top-3 left-3">
            <Badge variant={is_available ? 'success' : 'error'}>
              {is_available ? 'Tersedia' : 'Tidak Tersedia'}
            </Badge>
          </div>
          
          {/* Price */}
          <div className="absolute bottom-3 right-3 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-3 py-1">
            <span className="text-lg font-bold text-primary-600">
              {formatCurrency(price_per_day)}/hari
            </span>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {name}
          </h3>
          
          {/* Description */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {truncateText(description, 100)}
          </p>
          
          {/* Specifications */}
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 mb-3">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{capacity} orang</span>
            </div>
            
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>{fuel_type}</span>
            </div>
            
            <div className="flex items-center col-span-2">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{transmission}</span>
            </div>
          </div>
          
          {/* Features */}
          {features && features.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {features.slice(0, 3).map((feature, index) => (
                  <Badge key={index} variant="info" size="sm">
                    {feature}
                  </Badge>
                ))}
                {features.length > 3 && (
                  <Badge variant="default" size="sm">
                    +{features.length - 3} lainnya
                  </Badge>
                )}
              </div>
            </div>
          )}
          
          {/* Rating */}
          {rating && (
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {rating.toFixed(1)} ({total_reviews} ulasan)
                </span>
              </div>
            </div>
          )}
          
          {/* WhatsApp Button */}
          <Button
            variant="success"
            size="sm"
            fullWidth
            onClick={handleWhatsAppClick}
            leftIcon={
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.382z"/>
              </svg>
            }
          >
            Hubungi via WhatsApp
          </Button>
        </div>
      </Link>
    </motion.div>
  );
};

export default CarterMobileCard;