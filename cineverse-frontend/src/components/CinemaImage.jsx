import React, { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';

const DEFAULT_CINEMA_IMAGE =
  'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80';

const CinemaImage = ({ src, alt, className = '' }) => {
  const fallback = DEFAULT_CINEMA_IMAGE;
  const [url, setUrl] = useState(src || fallback);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setUrl(src || fallback);
    setFailed(false);
  }, [src, alt, fallback]);

  if (failed) {
    return (
      <div className={`cinema-image-fallback ${className}`} data-cinema={alt}>
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
        if (url !== fallback) setUrl(fallback);
        else setFailed(true);
      }}
    />
  );
};

export default CinemaImage;
