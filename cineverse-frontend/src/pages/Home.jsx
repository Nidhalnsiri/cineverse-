import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, ChevronRight, Play } from 'lucide-react';
import { api, posterBackdrop } from '../lib/api';
import MoviePoster from '../components/MoviePoster';

const SLIDE_MS = 7000;
const FADE_MS = 800;
const HERO_COUNT = 8;

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [contentVisible, setContentVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const heroSlides = movies.slice(0, HERO_COUNT);
  const hero = heroSlides[slideIndex] ?? null;

  useEffect(() => {
    api.getMovies()
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setMovies(list);
        setSlideIndex(0);
      })
      .catch(err => setError(err.message || 'Impossible de charger les films'))
      .finally(() => setLoading(false));
  }, []);

  const goToSlide = useCallback((nextIndex) => {
    if (heroSlides.length <= 1) return;
    setContentVisible(false);
    setTimeout(() => {
      setSlideIndex(nextIndex % heroSlides.length);
      setContentVisible(true);
    }, FADE_MS);
  }, [heroSlides.length]);

  const nextSlide = useCallback(() => {
    goToSlide((slideIndex + 1) % heroSlides.length);
  }, [slideIndex, heroSlides.length, goToSlide]);

  useEffect(() => {
    if (heroSlides.length <= 1 || paused) return undefined;

    timerRef.current = setInterval(nextSlide, SLIDE_MS);
    return () => clearInterval(timerRef.current);
  }, [heroSlides.length, paused, nextSlide, slideIndex]);

  const handleDotClick = (i) => {
    if (i === slideIndex) return;
    goToSlide(i);
  };

  return (
    <div className="home">
      <section
        className="hero hero-carousel"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {heroSlides.map((movie, i) => (
          <div
            key={movie.id}
            className={`hero-bg-layer ${i === slideIndex ? 'hero-bg-active' : ''}`}
            style={{ backgroundImage: `url(${posterBackdrop(movie.posterUrl)})` }}
            aria-hidden={i !== slideIndex}
          />
        ))}
        {!heroSlides.length && (
          <div
            className="hero-bg-layer hero-bg-active"
            style={{ backgroundImage: 'url(https://image.tmdb.org/t/p/original/8rpDcsfLJypbO6vtecsmEZzAUdi.jpg)' }}
          />
        )}

        <div className="hero-overlay" />

        <div className={`hero-content ${contentVisible ? 'hero-content-visible' : 'hero-content-hidden'}`}>
          {hero && (
            <>
              <div className="hero-badge">
                <Play size={12} fill="white" /> À l&apos;affiche
              </div>
              <h1 className="hero-title" key={hero.id}>{hero.title}</h1>
              <div className="hero-meta">
                <span className="hero-rating">
                  <Star size={16} fill="currentColor" /> {hero.imdbRating}/10
                </span>
                <span><Clock size={16} /> {hero.duration} min</span>
                <span>{hero.genre}</span>
              </div>
              <p className="hero-subtitle">
                {hero.description?.length > 160
                  ? `${hero.description.substring(0, 160)}...`
                  : hero.description}
              </p>
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

        {heroSlides.length > 1 && (
          <>
            <div className="hero-dots">
              {heroSlides.map((movie, i) => (
                <button
                  key={movie.id}
                  type="button"
                  className={`hero-dot ${i === slideIndex ? 'hero-dot-active' : ''}`}
                  onClick={() => handleDotClick(i)}
                  aria-label={`Afficher ${movie.title}`}
                />
              ))}
            </div>
            <div className="hero-progress">
              <div
                className={`hero-progress-bar ${paused ? 'hero-progress-paused' : ''}`}
                key={`${slideIndex}-${paused}`}
                style={{ animationDuration: `${SLIDE_MS}ms` }}
              />
            </div>
          </>
        )}
      </section>

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
