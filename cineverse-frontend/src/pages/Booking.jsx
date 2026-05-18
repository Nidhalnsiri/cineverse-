import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Armchair, CheckCircle, ArrowLeft, AlertCircle, MapPin, Building2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../lib/api';

const seatLabel = (s) => `${s.rowNum}${s.colNum}`;

const Booking = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [session, setSession] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const [error, setError] = useState('');
  const [occupiedIds, setOccupiedIds] = useState(new Set());

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: `/booking/${sessionId}` } });
      return;
    }
    api.getSession(sessionId)
      .then(async (sess) => {
        setSession(sess);
        if (sess.room?.id) {
          const [roomSeats, occupied] = await Promise.all([
            api.getSeatsByRoom(sess.room.id),
            api.getOccupiedSeats(sessionId),
          ]);
          setSeats(roomSeats.sort((a, b) =>
            a.rowNum.localeCompare(b.rowNum) || a.colNum - b.colNum
          ));
          setOccupiedIds(new Set(occupied));
        }
      })
      .catch(() => setError('Impossible de charger la séance.'))
      .finally(() => setLoading(false));
  }, [sessionId, user, navigate]);

  const rows = useMemo(() => {
    const map = new Map();
    seats.forEach(seat => {
      if (!map.has(seat.rowNum)) map.set(seat.rowNum, []);
      map.get(seat.rowNum).push(seat);
    });
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [seats]);

  const selectedSeats = seats.filter(s => selectedIds.includes(s.id));
  const basePrice = session?.price ?? 12.5;
  const total = selectedSeats.reduce(
    (sum, s) => sum + (s.type === 'VIP' ? basePrice + 3 : basePrice), 0
  );
  const cinema = session?.room?.cinema;
  const timeStr = session?.time ? String(session.time).substring(0, 5) : '';

  const toggleSeat = (seat) => {
    if (occupiedIds.has(seat.id)) return;
    setSelectedIds(prev =>
      prev.includes(seat.id) ? prev.filter(id => id !== seat.id) : [...prev, seat.id]
    );
  };

  const getSeatClass = (seat) => {
    if (occupiedIds.has(seat.id)) return 'seat-occupied';
    if (selectedIds.includes(seat.id)) return 'seat-selected';
    if (seat.type === 'VIP') return 'seat-vip';
    return 'seat-available';
  };

  const handlePayment = async () => {
    if (!selectedIds.length || !user) return;
    setPaying(true);
    setError('');
    try {
      const reservation = await api.createReservation({
        sessionId: Number(sessionId),
        seatIds: selectedIds,
      });
      setConfirmed({
        labels: selectedSeats.map(seatLabel).join(', '),
        total: reservation.totalPrice ?? total,
        cinemaName: reservation.cinemaName,
        cinemaCity: reservation.cinemaCity,
        cinemaAddress: reservation.cinemaAddress,
        roomName: reservation.roomName,
        movieTitle: reservation.movieTitle,
        sessionDate: reservation.sessionDate,
        sessionTime: reservation.sessionTime,
      });
    } catch (err) {
      setError(err.message || 'Échec de la réservation.');
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <div className="page-loader"><div className="loader-ring" /></div>;

  if (confirmed) {
    return (
      <div className="booking-page">
        <div className="ticket-confirm">
          <CheckCircle size={80} color="var(--primary)" style={{ marginBottom: 24 }} />
          <h1>Réservation confirmée !</h1>
          <p className="ticket-movie">{confirmed.movieTitle}</p>
          <p className="ticket-cinema">
            <Building2 size={20} /> {confirmed.cinemaName}
            {confirmed.cinemaCity && <span> · {confirmed.cinemaCity}</span>}
          </p>
          {confirmed.cinemaAddress && (
            <p className="ticket-address"><MapPin size={14} /> {confirmed.cinemaAddress}</p>
          )}
          <p className="ticket-meta">
            {confirmed.sessionDate} · {confirmed.sessionTime} · {confirmed.roomName}
          </p>
          <p className="ticket-seats">Sièges : <strong>{confirmed.labels}</strong></p>
          <p className="ticket-total">Total payé : <strong>{Number(confirmed.total).toFixed(2)} €</strong></p>
          <div className="ticket-actions">
            <Link to="/reservations"><button type="button" className="btn-secondary">Mes réservations</button></Link>
            <Link to="/movies"><button type="button" className="btn-primary">Autres films</button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <Link to={session?.movie ? `/movies/${session.movie.id}` : '/movies'}>
        <button type="button" className="btn-secondary" style={{ marginBottom: 30, padding: '9px 20px', fontSize: '0.9rem' }}>
          <ArrowLeft size={15} /> Retour
        </button>
      </Link>
      <h1>Choisissez vos sièges</h1>
      <p className="booking-subtitle">
        {session?.movie?.title} · {timeStr} · {session?.language} · {session?.room?.name}
      </p>
      {cinema && (
        <p className="booking-cinema-info">
          <Building2 size={16} /> <strong>{cinema.name}</strong>
          {cinema.city && <> · {cinema.city}</>}
          {cinema.address && <span className="booking-cinema-address"><MapPin size={13} /> {cinema.address}</span>}
        </p>
      )}
      {error && (
        <div className="auth-error" style={{ marginBottom: 20, maxWidth: 560, display: 'flex', gap: 8, alignItems: 'center' }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}
      <div className="cinema-screen"><span>ÉCRAN</span></div>
      <div className="seats-container">
        {rows.map(([row, rowSeats]) => (
          <div key={row} className="seat-row">
            <div className="row-label">{row}</div>
            {rowSeats.map(seat => (
              <div
                key={seat.id}
                role="button"
                tabIndex={0}
                className={`seat ${getSeatClass(seat)}`}
                onClick={() => toggleSeat(seat)}
                onKeyDown={e => e.key === 'Enter' && toggleSeat(seat)}
                title={`Siège ${seatLabel(seat)}${seat.type === 'VIP' ? ' — VIP' : ''}`}
              >
                <Armchair size={22} />
              </div>
            ))}
            <div className="row-label">{row}</div>
          </div>
        ))}
      </div>
      <div className="legend">
        <div className="legend-item"><div className="seat seat-available"><Armchair size={18} /></div> Disponible</div>
        <div className="legend-item"><div className="seat seat-vip"><Armchair size={18} /></div> VIP (+3€)</div>
        <div className="legend-item"><div className="seat seat-selected"><Armchair size={18} /></div> Sélectionné</div>
        <div className="legend-item"><div className="seat seat-occupied"><Armchair size={18} /></div> Occupé</div>
      </div>
      {selectedIds.length > 0 && (
        <div className="booking-summary animate-up">
          <h2>Résumé</h2>
          {cinema && (
            <div className="summary-row">
              <span>Cinéma</span>
              <span style={{ color: 'var(--primary)', fontWeight: 700, textAlign: 'right' }}>{cinema.name}</span>
            </div>
          )}
          <div className="summary-row">
            <span>Sièges</span>
            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{selectedSeats.map(seatLabel).join(', ')}</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>{total.toFixed(2)} €</span>
          </div>
          <button type="button" className="pay-btn" onClick={handlePayment} disabled={paying}>
            {paying ? 'Confirmation...' : `Confirmer · ${total.toFixed(2)} €`}
          </button>
        </div>
      )}
    </div>
  );
};

export default Booking;
