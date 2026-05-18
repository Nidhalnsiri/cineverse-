import React, { useState, useEffect } from 'react';
import { Film } from 'lucide-react';

const MoviePoster = ({ src, alt, className = 'movie-poster' }) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div className={`${className} poster-fallback`}>
        <Film size={40} />
        <span>{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
};

export default MoviePoster;
