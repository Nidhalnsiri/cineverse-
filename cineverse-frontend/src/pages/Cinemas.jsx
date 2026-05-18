import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, Users, Building2, Star } from 'lucide-react';
import { api } from '../lib/api';
import CinemaImage from '../components/CinemaImage';

const Cinemas = () => {
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cityFilter, setCityFilter] = useState('Tous');

  useEffect(() => {
    api.getCinemas()
      .then(setCinemas)
      .catch(err => setError(err.message || 'Impossible de charger les cinémas'))
      .finally(() => setLoading(false));
  }, []);

  const cities = useMemo(() => {
    const set = new Set(cinemas.map(c => c.city).filter(Boolean));
    return ['Tous', ...Array.from(set).sort()];
  }, [cinemas]);

  const filtered = useMemo(() => {
    if (cityFilter === 'Tous') return cinemas;
    return cinemas.filter(c => c.city === cityFilter);
  }, [cinemas, cityFilter]);

  const totalSeats = (cinema) =>
    (cinema.rooms || []).reduce((sum, r) => sum + (r.capacity || 0), 0);

  if (loading) {
    return (
      <div className="page-loader" style={{ paddingTop: 120 }}>
        <div className="loader-ring" />
      </div>
    );
  }

  return (
    <div className="cinemas-page">
      <div className="cinemas-hero">
        <h1><MapPin size={36} /> Cinémas en Tunisie</h1>
        <p>Pathé, Azur City, Le Palace, Colisée et plus — réservez près de chez vous</p>
        <div className="cinemas-stats">
          <span><Building2 size={16} /> {cinemas.length} cinémas</span>
          <span><Users size={16} /> {(cinemas.reduce((s, c) => s + totalSeats(c), 0)).toLocaleString('fr-FR')} places</span>
        </div>
      </div>

      {error && <p className="auth-error cinemas-error">{error}</p>}

      <div className="city-filters">
        {cities.map(city => (
          <button
            key={city}
            type="button"
            className={`city-chip ${cityFilter === city ? 'city-chip-active' : ''}`}
            onClick={() => setCityFilter(city)}
          >
            {city}
          </button>
        ))}
      </div>

      <div className="cinemas-grid">
        {filtered.map(c => (
          <article key={c.id} className="cinema-card">
            <div className="cinema-card-image">
              <CinemaImage src={c.imageUrl} alt={c.name} />
              <span className="cinema-brand">{c.brand || 'Cinéma'}</span>
              <span className="cinema-city-badge">{c.city}</span>
            </div>
            <div className="cinema-card-body">
              <h2>{c.name}</h2>
              <p className="cinema-address">
                <MapPin size={14} /> {c.address}
              </p>
              <div className="cinema-rooms">
                {(c.rooms || []).map(room => (
                  <div key={room.id} className="cinema-room-row">
                    <span className="room-name">
                      {room.name?.includes('IMAX') && <Star size={12} fill="var(--gold)" color="var(--gold)" />}
                      {room.name}
                    </span>
                    <span className="room-capacity">{room.capacity} places</span>
                  </div>
                ))}
              </div>
              <p className="cinema-total">
                Capacité totale : <strong>{totalSeats(c)} places</strong>
              </p>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && !error && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>
          Aucun cinéma dans cette ville.
        </p>
      )}
    </div>
  );
};

export default Cinemas;
