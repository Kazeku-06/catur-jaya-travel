import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getImageUrl, formatCurrency } from '../../utils/helpers';
import { authService } from '../../services/authService';
import Badge from '../ui/Badge';

const TripCard = ({ trip, className = '' }) => {
  const {
    id,
    title, // Backend uses 'title' instead of 'name'
    name, // Fallback if 'name' is provided
    image,
    price,
    is_active, // Backend field for availability
    location,
    duration,
  } = trip;

  // Use title or name
  const displayName = title || name || 'Trip Tidak Diketahui';
  const isAvailable = is_active !== undefined ? is_active : true;
  const isAdmin = authService.isAdmin();

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
            src={getImageUrl(trip.image_url || trip.image)}
            alt={displayName}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            loading="lazy"
          />
          
          {/* Availability Badge */}
          <div className="absolute top-3 left-3">
            {isAdmin ? (
              <Badge variant="info">Admin View</Badge>
            ) : (
              <Badge variant={isAvailable ? 'success' : 'error'}>
                {isAvailable ? 'Tersedia' : 'Tidak Tersedia'}
              </Badge>
            )}
          </div>
          
          {/* Price Badge */}
          {price && (
            <div className="absolute bottom-3 right-3 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-3 py-1">
              <span className="text-lg font-bold text-primary-600">
                {formatCurrency(price)}
              </span>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 text-center line-clamp-2 mb-2">
            {displayName}
          </h3>
          
          {/* Location and Duration */}
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            {location && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{location}</span>
              </div>
            )}
            {duration && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{duration}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default TripCard;