import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatCurrency, getImageUrl, truncateText } from '../../utils/helpers';
import Badge from '../ui/Badge';

const TravelCard = ({ travel, className = '' }) => {
  const {
    id,
    origin, // Backend field
    destination, // Backend field
    vehicle_type, // Backend field
    price_per_person, // Backend field
    is_active, // Backend field
    // Fallback fields if frontend structure is used
    name,
    departure_location,
    destination_location,
    price,
    is_available,
    description,
    image,
    rating,
    total_reviews,
    departure_date,
  } = travel;

  // Map backend fields to frontend display
  const displayName = name || `${origin} - ${destination}`;
  const departureLocation = departure_location || origin;
  const destinationLocation = destination_location || destination;
  const displayPrice = price || price_per_person;
  const available = is_active !== undefined ? is_active : (is_available !== undefined ? is_available : true);
  const displayDescription = description || `Perjalanan ${vehicle_type || 'travel'} dari ${origin} ke ${destination}`;

  return (
    <motion.div
      className={`card hover:shadow-xl transition-all duration-300 ${className}`}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/travels/${id}`} className="block">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={getImageUrl(travel.image_url || travel.image) || '/images/travel-placeholder.jpg'}
            alt={displayName}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            loading="lazy"
            onError={(e) => {
              if (e.target.src !== '/images/travel-placeholder.jpg') {
                e.target.src = '/images/travel-placeholder.jpg';
              }
            }}
          />
          
          {/* Badge */}
          <div className="absolute top-3 left-3">
            <Badge variant={available ? 'success' : 'error'}>
              {available ? 'Tersedia' : 'Tidak Tersedia'}
            </Badge>
          </div>
          
          {/* Vehicle Type */}
          {vehicle_type && (
            <div className="absolute top-3 right-3">
              <Badge variant="secondary">{vehicle_type}</Badge>
            </div>
          )}
          
          {/* Price */}
          <div className="absolute bottom-3 right-3 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-3 py-1">
            <span className="text-lg font-bold text-primary-600">
              {formatCurrency(displayPrice)}
            </span>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {displayName}
          </h3>
          
          {/* Description */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {truncateText(displayDescription, 100)}
          </p>
          
          {/* Route */}
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">
              {departureLocation} → {destinationLocation}
            </span>
          </div>
          
          {/* Details */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            {vehicle_type && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <span>{vehicle_type}</span>
              </div>
            )}
            
            {departure_date && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{new Date(departure_date).toLocaleDateString('id-ID')}</span>
              </div>
            )}
          </div>
          
          {/* Rating */}
          {rating && (
            <div className="flex items-center justify-between">
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
                  {rating.toFixed(1)} ({total_reviews || 0} ulasan)
                </span>
              </div>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default TravelCard;