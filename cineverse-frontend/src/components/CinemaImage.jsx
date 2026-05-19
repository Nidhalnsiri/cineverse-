import React, { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';

const FALLBACKS = {
  'Pathé Tunis City': 'https://images.unsplash.com/photo-1598899134739-f2c5b08accd8?auto=format&fit=crop&w=900&q=80',
  'Pathé Les Berges du Lac': 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80',
  'Azur City La Marsa': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
  'Le Palace Sousse': 'https://images.unsplash.com/photo-1507676180810-ef002b6856a1?auto=format&fit=crop&w=900&q=80',
  'Pathé Sfax': 'https://images.unsplash.com/photo-1522869635100-904f7a5fa963?auto=format&fit=crop&w=900&q=80',
  'Colisée Nabeul': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=80',
  'Cinéplex Hammamet': 'https://images.unsplash.com/photo-1571004348644-fac41007e7f2?auto=format&fit=crop&w=900&q=80',
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
