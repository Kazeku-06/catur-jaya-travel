import React, { useState, useEffect } from 'react';
import { getImageUrl } from '../../utils/helpers';

const Image = ({ 
  src, 
  alt, 
  fallback = '/images/placeholder.jpg',
  className = '',
  onError,
  onLoad,
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState(() => src ? getImageUrl(src, fallback) : fallback);
  const [isLoading, setIsLoading] = useState(!!src);
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    const processedUrl = src ? getImageUrl(src, fallback) : fallback;
    if (imageSrc !== processedUrl) {
      setImageSrc(processedUrl);
      setIsLoading(!!src);
    }
  }, [src, fallback, imageSrc]);

  const handleLoad = (e) => {
    setIsLoading(false);
    setHasError(false);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    setIsLoading(false);
    setHasError(true);
    
    // Try fallback if not already using it
    if (imageSrc !== fallback) {
      setImageSrc(fallback);
      return;
    }
    
    if (onError) onError(e);
  };

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
      
      <img
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
        {...props}
      />
      
      {hasError && imageSrc === fallback && (
        <div className="absolute inset-0 bg-gray-100 rounded flex items-center justify-center">
          <div className="text-center text-gray-500">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-xs">Image not found</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Image;