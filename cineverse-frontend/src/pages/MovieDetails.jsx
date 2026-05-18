import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Play, Plus, Check, Star, Clock, Calendar, X, User, ArrowLeft } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { api, posterBackdrop, trailerEmbed } from '../lib/api';
import MoviePoster from '../components/MoviePoster';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, toggleWatchlist, isInWatchlist } = useContext(AuthContext);
  const [movie, setMovie] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const inList = isInWatchlist(id);

  useEffect(() => {
    Promise.all([api.getMovie(id), api.getSessionsByMovie(id)])
      .then(([movieData, sessionData]) => {
        setMovie(movieData);
        setSessions(Array.isArray(sessionData) ? sessionData : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSessionClick = (sessionId) => {
    if (!user) {
      navigate('/login', { state: { from: `/booking/${sessionId}` } });
      return;
    }
    navigate(`/booking/${sessionId}`);
  };

  const formatTime = (time) => (time ? String(time).substring(0, 5) : '');
  const formatLang = (s) => {
    let tag = s.language === 'VF' ? 'VF' : 'VOSTFR';
    if (s.room?.name?.includes('IMAX')) tag += ' · IMAX';
    if (s.room?.name?.includes('VIP')) tag += ' · VIP';
    return tag;
  };

  if (loading) return <div className="page-loader"><div className="loader-ring" /></div>;

  if (!movie) {
    return (
      <div style={{ padding: '150px 60px', textAlign: 'center' }}>
        <h2>Film introuvable</h2>
        <Link to="/movies"><button type="button" className="btn-primary" style={{ marginTop: 20 }}>Retour aux films</button></Link>
      </div>
    );
  }

  return (
    <div className="movie-details-page">
      <div
        className="backdrop-container"
        style={{ backgroundImage: `url(${posterBackdrop(movie.posterUrl)})` }}
      >
        <div className="backdrop-overlay" />
        <div className="details-layout">
          <div className="details-poster">
            <MoviePoster src={movie.posterUrl} alt={movie.title} className="details-poster-img" />
          </div>
          <div className="details-content">
            <div className="movie-badges">
              {movie.minAge && <span className="badge badge-age">+{movie.minAge}</span>}
              {movie.genre?.split('/').map(g => (
                <span key={g} className="badge badge-genre">{g.trim()}</span>
              ))}
            </div>
            <h1 className="details-title">{movie.title}</h1>
            <div className="details-meta">
              <span className="rating-star">
                <Star size={16} fill="currentColor" color="#f5c518" /> {movie.imdbRating}/10
              </span>
              <span><Clock size={15} /> {movie.duration} min</span>
              {movie.releaseDate && (
                <span><Calendar size={15} /> {new Date(movie.releaseDate).getFullYear()}</span>
              )}
            </div>
            <p className="details-description">{movie.description}</p>
            <p className="details-cast">
              <strong>Réalisateur :</strong> {movie.director} · <strong>Avec :</strong> {movie.actors}
            </p>
            <div className="details-actions">
              <button type="button" className="btn-primary" onClick={() => setShowTrailer(true)}>
                <Play size={18} fill="white" /> Bande-annonce
              </button>
              {user ? (
                <button
                  type="button"
                  className={`btn-secondary ${inList ? 'btn-watchlist-active' : ''}`}
                  onClick={() => toggleWatchlist(Number(id))}
                >
                  {inList ? <Check size={18} /> : <Plus size={18} />}
                  {inList ? 'Dans Ma liste' : 'Ma liste'}
                </button>
              ) : (
                <Link to="/login">
                  <button type="button" className="btn-secondary"><User size={18} /> Connexion</button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="sessions-section">
        <h2>Séances disponibles aujourd&apos;hui</h2>
        {sessions.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>Aucune séance pour aujourd&apos;hui.</p>
        ) : (
          <div className="sessions-grid">
            {sessions.map(session => (
              <button
                key={session.id}
                type="button"
                className="session-card"
                onClick={() => handleSessionClick(session.id)}
              >
                <div className="session-time">{formatTime(session.time)}</div>
                <div className="session-type">{formatLang(session)}</div>
                <div className="session-lang">{session.room?.name}</div>
                <div className="session-price">{session.price?.toFixed(2)} €</div>
              </button>
            ))}
          </div>
        )}
        {!user && sessions.length > 0 && (
          <p style={{ color: 'var(--text-muted)', marginTop: 20 }}>
            <Link to="/login">Connectez-vous</Link> pour réserver.
          </p>
        )}
      </div>

      <div style={{ padding: '0 60px 50px' }}>
        <Link to="/movies">
          <button type="button" className="btn-secondary" style={{ fontSize: '0.9rem', padding: '10px 22px' }}>
            <ArrowLeft size={16} /> Retour aux films
          </button>
        </Link>
      </div>

      {showTrailer && (
        <div className="modal-overlay" onClick={() => setShowTrailer(false)}>
          <div style={{ position: 'relative' }}>
            <button type="button" className="modal-close" onClick={() => setShowTrailer(false)}>
              <X size={28} />
            </button>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <iframe src={trailerEmbed(movie.trailerUrl)} allow="autoplay; fullscreen" allowFullScreen title="Bande annonce" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
