import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Ticket, Calendar, Clock, MapPin, Film, Building2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../lib/api';

const MyReservations = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/reservations' } });
      return;
    }
    api.getMyReservations()
      .then(setReservations)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  if (loading) return <div className="page-loader"><div className="loader-ring" /></div>;

  return (
    <div className="movies-page" style={{ paddingTop: 120, paddingBottom: 80 }}>
      <div className="section-header" style={{ padding: '0 60px', marginBottom: 40 }}>
        <h1><Ticket size={32} style={{ verticalAlign: 'middle', marginRight: 12 }} />Mes réservations</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>Historique de vos séances au cinéma</p>
      </div>

      {error && <div className="auth-error" style={{ margin: '0 60px 24px' }}>{error}</div>}

      {!reservations.length && !error && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <Film size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
          <p>Aucune réservation pour le moment.</p>
          <Link to="/movies" style={{ marginTop: 20, display: 'inline-block' }}>
            <button type="button" className="btn-primary">Réserver un film</button>
          </Link>
        </div>
      )}

      <div style={{ display: 'grid', gap: 20, padding: '0 60px', maxWidth: 900, margin: '0 auto' }}>
        {reservations.map(r => (
          <div key={r.id} className="reservation-card" style={{
            background: 'var(--card-bg)',
            borderRadius: 16,
            padding: 24,
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <h2 style={{ marginBottom: 12, fontSize: '1.4rem' }}>{r.movieTitle}</h2>
            {r.cinemaName && (
              <p style={{ color: 'var(--primary)', fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Building2 size={16} /> {r.cinemaName}
                {r.cinemaCity && <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>({r.cinemaCity})</span>}
              </p>
            )}
            {r.cinemaAddress && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 10 }}>
                <MapPin size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                {r.cinemaAddress}
              </p>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              <span><Calendar size={14} /> {r.sessionDate}</span>
              <span><Clock size={14} /> {r.sessionTime}</span>
              <span>{r.roomName}</span>
            </div>
            <p style={{ marginTop: 14 }}>
              Sièges : <strong style={{ color: 'var(--primary)' }}>{r.seatLabels?.join(', ')}</strong>
            </p>
            <p style={{ marginTop: 8, color: 'var(--gold)', fontWeight: 700 }}>
              {Number(r.totalPrice).toFixed(2)} € · {r.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyReservations;
