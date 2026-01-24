import { motion } from 'framer-motion';

const SkeletonLoader = ({ className = '', children }) => {
  return (
    <motion.div
      className={`bg-gray-200 rounded animate-pulse ${className}`}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        repeatType: 'reverse',
      }}
    >
      {children}
    </motion.div>
  );
};

// Card skeleton
export const CardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
    <SkeletonLoader className="h-48 w-full" />
    <div className="space-y-2">
      <SkeletonLoader className="h-4 w-3/4" />
      <SkeletonLoader className="h-4 w-1/2" />
      <SkeletonLoader className="h-6 w-1/4" />
    </div>
  </div>
);

// List skeleton
export const ListSkeleton = ({ count = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="flex space-x-4 p-4 bg-white rounded-lg shadow">
        <SkeletonLoader className="w-16 h-16 rounded" />
        <div className="flex-1 space-y-2">
          <SkeletonLoader className="h-4 w-3/4" />
          <SkeletonLoader className="h-4 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

export default SkeletonLoader;