import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Star, Clock, Trash2, Film } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../lib/api';
import MoviePoster from '../components/MoviePoster';

const MyList = () => {
  const { watchlist, toggleWatchlist } = useContext(AuthContext);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMovies()
      .then(all => {
        const ids = new Set(watchlist.map(Number));
        setMovies(all.filter(m => ids.has(Number(m.id))));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [watchlist]);

  const handleRemove = (e, movieId) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatchlist(movieId);
  };

  return (
    <div className="mylist-page">
      <div className="mylist-header">
        <h1><Bookmark size={32} /> Ma liste</h1>
        <p>Les films que vous souhaitez voir — {watchlist.length} titre{watchlist.length !== 1 ? 's' : ''}</p>
      </div>

      {loading ? (
        <div className="page-loader"><div className="loader-ring" /></div>
      ) : movies.length === 0 ? (
        <div className="mylist-empty">
          <Film size={56} style={{ opacity: 0.4, marginBottom: 20 }} />
          <h2>Votre liste est vide</h2>
          <p>Ajoutez des films depuis leur fiche en cliquant sur « Ma liste ».</p>
          <Link to="/movies"><button type="button" className="btn-primary">Découvrir les films</button></Link>
        </div>
      ) : (
        <div className="movies-grid mylist-grid">
          {movies.map(movie => (
            <Link to={`/movies/${movie.id}`} key={movie.id} className="mylist-card-wrap">
              <div className="movie-card mylist-card">
                <button
                  type="button"
                  className="mylist-remove"
                  title="Retirer de ma liste"
                  onClick={e => handleRemove(e, movie.id)}
                >
                  <Trash2 size={16} />
                </button>
                <MoviePoster src={movie.posterUrl} alt={movie.title} />
                <div className="movie-info">
                  <h3>{movie.title}</h3>
                  <p style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Star size={12} fill="var(--gold)" color="var(--gold)" /> {movie.imdbRating}
                    <Clock size={12} style={{ marginLeft: 6 }} /> {movie.duration} min
                  </p>
                  <span className="book-btn">Voir les séances →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyList;
