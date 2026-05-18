import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, LogOut, Film, Home, MapPin, Ticket } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';

  return (
    <nav className={`navbar ${scrolled || !isHome ? 'navbar-scrolled' : ''}`}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <div className="navbar-logo">CINEVERSE</div>
      </Link>

      <ul className="navbar-links">
        <li><Link to="/"><Home size={15} style={{verticalAlign:'middle', marginRight:5}}/>Accueil</Link></li>
        <li><Link to="/movies"><Film size={15} style={{verticalAlign:'middle', marginRight:5}}/>Films</Link></li>
        <li><Link to="/cinemas"><MapPin size={15} style={{verticalAlign:'middle', marginRight:5}}/>Cinémas</Link></li>
        {user && (
          <li><Link to="/reservations"><Ticket size={15} style={{verticalAlign:'middle', marginRight:5}}/>Mes billets</Link></li>
        )}
      </ul>

      {user ? (
        <div className="navbar-user">
          <User size={16} style={{ color: 'var(--text-muted)' }} />
          <span className="navbar-username">{user.firstName || user.email}</span>
          <button onClick={logout} className="logout-btn">
            <LogOut size={15} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            Déconnexion
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/login"><button className="login-btn">Connexion</button></Link>
          <Link to="/register"><button className="btn-primary" style={{padding:'9px 22px', fontSize:'0.9rem'}}>S'inscrire</button></Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
