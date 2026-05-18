import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext();

const WATCHLIST_KEY = 'cv_watchlist';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('cv_user');
    if (stored) setUser(JSON.parse(stored));
    const wl = localStorage.getItem(WATCHLIST_KEY);
    if (wl) setWatchlist(JSON.parse(wl));
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('cv_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cv_user');
  };

  const toggleWatchlist = useCallback((movieId) => {
    setWatchlist(prev => {
      const id = Number(movieId);
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isInWatchlist = useCallback(
    (movieId) => watchlist.includes(Number(movieId)),
    [watchlist]
  );

  return (
    <AuthContext.Provider value={{ user, login, logout, watchlist, toggleWatchlist, isInWatchlist }}>
      {children}
    </AuthContext.Provider>
  );
};
