import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatCurrency, getImageUrl, truncateText } from '../../utils/helpers';
import Badge from '../ui/Badge';

const TripCard = ({ trip, className = '' }) => {
  const {
    id,
    title, // Backend uses 'title' instead of 'name'
    name, // Fallback if 'name' is provided
    description,
    price,
    duration,
    location,
    image,
    category,
    rating,
    total_reviews,
    is_active, // Backend uses 'is_active' instead of 'is_available'
    is_available, // Fallback if 'is_available' is provided
  } = trip;

  // Use title or name, and is_active or is_available
  const displayName = title || name;
  const available = is_active !== undefined ? is_active : is_available;

  return (
    <motion.div
      className={`card hover:shadow-xl transition-all duration-300 ${className}`}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/trips/${id}`} className="block">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={getImageUrl(image)}
            alt={displayName}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            loading="lazy"
          />
          
          {/* Badge */}
          <div className="absolute top-3 left-3">
            <Badge variant={available ? 'success' : 'error'}>
              {available ? 'Tersedia' : 'Tidak Tersedia'}
            </Badge>
          </div>
          
          {/* Category */}
          {category && (
            <div className="absolute top-3 right-3">
              <Badge variant="primary">{category}</Badge>
            </div>
          )}
          
          {/* Price */}
          <div className="absolute bottom-3 right-3 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-3 py-1">
            <span className="text-lg font-bold text-primary-600">
              {formatCurrency(price)}
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
            {truncateText(description, 100)}
          </p>
          
          {/* Details */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{location}</span>
            </div>
            
            {duration && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{duration}</span>
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

export default TripCard;