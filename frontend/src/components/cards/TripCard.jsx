import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getImageUrl } from '../../utils/helpers';

const TripCard = ({ trip, className = '' }) => {
  const {
    id,
    title, // Backend uses 'title' instead of 'name'
    name, // Fallback if 'name' is provided
    image,
  } = trip;

  // Use title or name
  const displayName = title || name || 'Trip Tidak Diketahui';

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
        </div>
        
        {/* Content - Only Name */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 text-center line-clamp-2">
            {displayName}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
};

export default TripCard;