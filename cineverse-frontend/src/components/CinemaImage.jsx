import React, { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';

const DEFAULT_CINEMA_IMG =
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';

const CinemaImage = ({ src, alt, className = '' }) => {
  const [url, setUrl] = useState(src || DEFAULT_CINEMA_IMG);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setUrl(src || DEFAULT_CINEMA_IMG);
    setFailed(false);
  }, [src]);

  if (failed) {
    return (
      <div className={`cinema-image-fallback ${className}`}>
        <Building2 size={48} />
        <span>{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => {
        if (url !== DEFAULT_CINEMA_IMG) setUrl(DEFAULT_CINEMA_IMG);
        else setFailed(true);
      }}
    />
  );
};

export default CinemaImage;
