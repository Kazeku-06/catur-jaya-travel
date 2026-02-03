/**
 * Daily randomization utility for home page content
 * Generates consistent random content that changes every 24 hours
 */

/**
 * Get a seed based on current date (changes every 24 hours)
 * @returns {number} Daily seed number
 */
export const getDailySeed = () => {
  const today = new Date();
  const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  
  // Simple hash function to convert date string to number
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash);
};

/**
 * Seeded random number generator
 * @param {number} seed - Seed for random generation
 * @returns {function} Random function that returns values between 0 and 1
 */
export const createSeededRandom = (seed) => {
  let currentSeed = seed;
  
  return () => {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
  };
};

/**
 * Shuffle array using seeded random
 * @param {Array} array - Array to shuffle
 * @param {number} seed - Seed for randomization
 * @returns {Array} Shuffled array
 */
export const shuffleWithSeed = (array, seed) => {
  const shuffled = [...array];
  const random = createSeededRandom(seed);
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
};

/**
 * Get daily randomized content for home page
 * @param {Array} trips - Array of trips
 * @param {Array} travels - Array of travels
 * @param {number} count - Number of items to return (default: 2)
 * @returns {Array} Mixed and randomized trips/travels
 */
export const getDailyRandomizedContent = (trips = [], travels = [], count = 2) => {
  const seed = getDailySeed();
  
  // Combine trips and travels with type indicators
  const allContent = [
    ...trips.map(trip => ({
      ...trip,
      type: 'trip',
      displayName: trip.title || trip.name || 'Trip Wisata',
      displayLocation: trip.location || 'Lokasi tidak diketahui',
      displayPrice: trip.price || 0,
      detailLink: `/trip/${trip.id}`,
      image: trip.image_url || trip.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    })),
    ...travels.map(travel => ({
      ...travel,
      type: 'travel',
      displayName: `${travel.origin || 'Kota A'} - ${travel.destination || 'Kota B'}`,
      displayLocation: travel.vehicle_type || 'Kendaraan',
      displayPrice: travel.price_per_person || 0,
      detailLink: `/travel/${travel.id}`,
      image: travel.image_url || travel.image || 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }))
  ];
  
  // If no content available, return empty array (fallback will be used)
  if (allContent.length === 0) {
    return [];
  }
  
  // Shuffle and take the requested count
  const shuffled = shuffleWithSeed(allContent, seed);
  return shuffled.slice(0, Math.min(count, allContent.length));
};

/**
 * Get fallback content when API data is not available
 * @returns {Array} Fallback content array
 */
export const getFallbackContent = () => {
  const seed = getDailySeed();
  const random = createSeededRandom(seed);
  
  const fallbackItems = [
    {
      type: 'trip',
      displayName: 'Bromo Sunrise Adventure',
      displayLocation: 'Malang, Jawa Timur',
      displayPrice: 750000,
      detailLink: '/trips',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Nikmati keindahan sunrise di Gunung Bromo'
    },
    {
      type: 'travel',
      displayName: 'Jakarta - Bandung',
      displayLocation: 'Travel Executive',
      displayPrice: 150000,
      detailLink: '/travels',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Perjalanan nyaman Jakarta - Bandung'
    },
    {
      type: 'trip',
      displayName: 'Tumpak Sewu Waterfall',
      displayLocation: 'Lumajang, Jawa Timur',
      displayPrice: 650000,
      detailLink: '/trips',
      image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Jelajahi air terjun terindah di Jawa Timur'
    },
    {
      type: 'travel',
      displayName: 'Surabaya - Malang',
      displayLocation: 'Travel VIP',
      displayPrice: 120000,
      detailLink: '/travels',
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Perjalanan cepat dan aman'
    },
    {
      type: 'trip',
      displayName: 'Telaga Sarangan',
      displayLocation: 'Magetan, Jawa Timur',
      displayPrice: 550000,
      detailLink: '/trips',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Danau indah di kaki Gunung Lawu'
    }
  ];
  
  // Shuffle and return 2 items
  const shuffled = shuffleWithSeed(fallbackItems, seed);
  return shuffled.slice(0, 2);
};