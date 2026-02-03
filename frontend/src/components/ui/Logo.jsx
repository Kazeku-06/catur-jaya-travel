import React, { useState } from 'react';

const Logo = ({ 
  className = "w-full h-full object-contain", 
  size = "medium",
  fallbackBg = "bg-primary-600"
}) => {
  const [imageError, setImageError] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);

  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12 lg:w-14 lg:h-14",
    large: "w-16 h-16 lg:w-20 lg:h-20"
  };

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
    } else {
      setFallbackError(true);
    }
  };

  if (fallbackError) {
    // Final fallback - text logo
    return (
      <div className={`${sizeClasses[size]} ${fallbackBg} rounded-lg flex items-center justify-center`}>
        <span className="text-white font-bold text-lg">CJ</span>
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} overflow-hidden flex items-center justify-center`}>
      <img 
        src={imageError ? "/logo 1.jpg.jpeg" : "/logo_1.jpg-removebg-preview.png"}
        alt="Catur Jaya Mandiri Logo" 
        className={className}
        onError={handleImageError}
        loading="eager"
      />
    </div>
  );
};

export default Logo;