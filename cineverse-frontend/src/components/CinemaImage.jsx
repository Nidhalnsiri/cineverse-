import React, { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';

const FALLBACKS = {
  'Pathé Tunis City': 'https://picsum.photos/id/312/900/500',
  'Pathé Les Berges du Lac': 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80',
  'Azur City La Marsa': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
  'Le Palace Sousse': 'https://picsum.photos/id/174/900/500',
  'Pathé Sfax': 'https://picsum.photos/id/433/900/500',
  'Colisée Nabeul': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=80',
  'Cinéplex Hammamet': 'https://picsum.photos/id/1003/900/500',
};

const CinemaImage = ({ src, alt, className = '' }) => {
  const fallback = FALLBACKS[alt] || Object.values(FALLBACKS)[0];
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
