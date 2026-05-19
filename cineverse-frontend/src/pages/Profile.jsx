import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Bookmark, Ticket, Film, MapPin, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user, logout, watchlist } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="auth-page" style={{ minHeight: '80vh', alignItems: 'flex-start', paddingTop: 140 }}>
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <h1 className="auth-title">Mon compte</h1>
          <p className="auth-sub">Connectez-vous pour accéder à votre profil</p>
          <Link to="/login"><button type="button" className="auth-submit">Se connecter</button></Link>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="profile-page">
      <div className="profile-hero">
        <div className="profile-avatar">
          <User size={40} />
        </div>
        <h1>{user.firstName} {user.lastName}</h1>
        <p><Mail size={14} /> {user.email}</p>
      </div>

      <div className="profile-grid">
        <Link to="/mylist" className="profile-card">
          <Bookmark size={28} color="var(--primary)" />
          <h3>Ma liste</h3>
          <p>{watchlist.length} film{watchlist.length !== 1 ? 's' : ''} sauvegardé{watchlist.length !== 1 ? 's' : ''}</p>
        </Link>
        <Link to="/reservations" className="profile-card">
          <Ticket size={28} color="var(--gold)" />
          <h3>Mes billets</h3>
          <p>Historique de vos réservations</p>
        </Link>
        <Link to="/movies" className="profile-card">
          <Film size={28} color="var(--primary)" />
          <h3>Films</h3>
          <p>Parcourir le catalogue</p>
        </Link>
        <Link to="/cinemas" className="profile-card">
          <MapPin size={28} color="var(--gold)" />
          <h3>Cinémas</h3>
          <p>7 salles en Tunisie</p>
        </Link>
      </div>

      <button type="button" className="profile-logout" onClick={handleLogout}>
        <LogOut size={18} /> Déconnexion
      </button>
    </div>
  );
};

export default Profile;
