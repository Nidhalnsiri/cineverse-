import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, ChevronRight, Play } from 'lucide-react';
import { api, posterBackdrop } from '../lib/api';
import MoviePoster from '../components/MoviePoster';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getMovies()
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        if (list.length > 0) {
          setHero(list[0]);
          setMovies(list);
        }
      })
      .catch(err => setError(err.message || 'Impossible de charger les films'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      <div
        className="hero"
        style={{
          backgroundImage: hero
            ? `url(${posterBackdrop(hero.posterUrl)})`
            : 'url(https://image.tmdb.org/t/p/original/8rpDcsfLJypbO6vtecsmEZzAUdi.jpg)'
        }}
      >
        <div className="hero-overlay" />
        <div className="hero-content animate-up">
          {hero && (
            <>
              <div className="hero-badge">
                <Play size={12} fill="white" /> À l&apos;affiche
              </div>
              <h1 className="hero-title">{hero.title}</h1>
              <div className="hero-meta">
                <span className="hero-rating">
                  <Star size={16} fill="currentColor" /> {hero.imdbRating}/10
                </span>
                <span><Clock size={16} /> {hero.duration} min</span>
                <span>{hero.genre}</span>
              </div>
              <p className="hero-subtitle">{hero.description?.substring(0, 160)}...</p>
            </>
          )}
          <div className="hero-buttons">
            <Link to={hero ? `/movies/${hero.id}` : '/movies'}>
              <button type="button" className="btn-primary">
                <Play size={18} fill="white" /> Réserver
              </button>
            </Link>
            <Link to="/movies">
              <button type="button" className="btn-secondary">Tous les films</button>
            </Link>
          </div>
        </div>
      </div>

      <section className="movies-section">
        <div className="section-header">
          <h2 className="section-title">Films en ce moment</h2>
          <Link to="/movies" className="section-link" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            Voir tout <ChevronRight size={16} />
          </Link>
        </div>
        {error && (
          <p className="auth-error" style={{ margin: '0 0 20px' }}>
            {error} — vérifiez que le backend tourne sur le port 8081.
          </p>
        )}
        {loading && (
          <div className="page-loader" style={{ minHeight: 120 }}>
            <div className="loader-ring" />
          </div>
        )}
        <div className="movies-row">
          {movies.map((movie) => (
            <Link to={`/movies/${movie.id}`} key={movie.id}>
              <div className="movie-card">
                <MoviePoster src={movie.posterUrl} alt={movie.title} />
                <div className="movie-info">
                  <h3>{movie.title}</h3>
                  <p>{movie.genre} · {movie.duration} min</p>
                  <span className="book-btn">Réserver</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
