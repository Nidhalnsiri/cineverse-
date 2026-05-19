import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, LogOut, Film, Home, MapPin, Ticket, Bookmark } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, logout, watchlist } = useContext(AuthContext);

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
        <li>
          <Link to="/mylist" className="nav-mylist">
            <Bookmark size={15} style={{verticalAlign:'middle', marginRight:5}}/>
            Ma liste
            {watchlist.length > 0 && <span className="nav-badge">{watchlist.length}</span>}
          </Link>
        </li>
        {user && (
          <li><Link to="/reservations"><Ticket size={15} style={{verticalAlign:'middle', marginRight:5}}/>Mes billets</Link></li>
        )}
      </ul>

      {user ? (
        <div className="navbar-user">
          <Link to="/profile" className="navbar-profile-link">
            <User size={16} />
            <span className="navbar-username">{user.firstName || user.email}</span>
          </Link>
          <button onClick={logout} className="logout-btn">
            <LogOut size={15} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            Déconnexion
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/login"><button className="login-btn">Connexion</button></Link>
          <Link to="/register"><button className="btn-primary" style={{padding:'9px 22px', fontSize:'0.9rem'}}>S&apos;inscrire</button></Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
