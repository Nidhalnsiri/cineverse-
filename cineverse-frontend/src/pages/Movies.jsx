import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';
import { api } from '../lib/api';
import MoviePoster from '../components/MoviePoster';

const GENRES = ['Tous', 'Sci-Fi', 'Action', 'Crime', 'Drame', 'Aventure'];

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Tous');

  useEffect(() => {
    api.getMovies()
      .then(data => { setMovies(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = activeFilter === 'Tous'
    ? movies
    : movies.filter(m => m.genre?.includes(activeFilter));

  return (
    <div className="movies-page">
      <h1>Tous les Films</h1>
      <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>{movies.length} films à l&apos;affiche</p>
      <div className="movies-filters">
        {GENRES.map(g => (
          <button
            key={g}
            type="button"
            className={`filter-btn ${activeFilter === g ? 'active' : ''}`}
            onClick={() => setActiveFilter(g)}
          >{g}</button>
        ))}
      </div>
      {loading ? (
        <div className="page-loader"><div className="loader-ring" /></div>
      ) : (
        <div className="movies-grid">
          {filtered.map(movie => (
            <Link to={`/movies/${movie.id}`} key={movie.id}>
              <div className="movie-card">
                <MoviePoster src={movie.posterUrl} alt={movie.title} />
                <div className="movie-info">
                  <h3>{movie.title}</h3>
                  <p style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Star size={12} fill="var(--gold)" color="var(--gold)" /> {movie.imdbRating}
                    <Clock size={12} style={{ marginLeft: 6 }} /> {movie.duration} min
                  </p>
                  <span className="book-btn">Réserver →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Movies;
