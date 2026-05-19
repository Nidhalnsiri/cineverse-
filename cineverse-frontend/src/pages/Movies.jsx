import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Search } from 'lucide-react';
import { api } from '../lib/api';
import MoviePoster from '../components/MoviePoster';

const GENRES = ['Tous', 'Sci-Fi', 'Action', 'Crime', 'Drame', 'Aventure', 'Sport', 'Documentaire'];

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getMovies()
      .then(data => { setMovies(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = movies;
    if (activeFilter !== 'Tous') {
      list = list.filter(m => m.genre?.toLowerCase().includes(activeFilter.toLowerCase()));
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(m =>
        m.title?.toLowerCase().includes(q) ||
        m.director?.toLowerCase().includes(q) ||
        m.genre?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [movies, activeFilter, search]);

  return (
    <div className="movies-page">
      <h1>Tous les Films</h1>
      <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>{filtered.length} film{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}</p>

      <div className="movies-search">
        <Search size={18} />
        <input
          type="search"
          placeholder="Rechercher un film, réalisateur, genre..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

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
      ) : filtered.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 60 }}>Aucun film ne correspond à votre recherche.</p>
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
