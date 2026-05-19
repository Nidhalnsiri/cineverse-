import React from 'react';
import { Link } from 'react-router-dom';
import { Film, MapPin, Bookmark, Ticket } from 'lucide-react';

const Footer = () => (
  <footer className="site-footer">
    <div className="footer-inner">
      <div className="footer-brand">
        <span className="navbar-logo">CINEVERSE</span>
        <p>Réservez vos places dans les meilleurs cinémas de Tunisie.</p>
      </div>
      <div className="footer-links">
        <h4>Navigation</h4>
        <Link to="/movies"><Film size={14} /> Films</Link>
        <Link to="/cinemas"><MapPin size={14} /> Cinémas</Link>
        <Link to="/mylist"><Bookmark size={14} /> Ma liste</Link>
        <Link to="/reservations"><Ticket size={14} /> Mes billets</Link>
      </div>
      <div className="footer-links">
        <h4>Villes</h4>
        <span>Tunis · La Marsa · Sousse</span>
        <span>Sfax · Nabeul · Hammamet</span>
      </div>
    </div>
    <div className="footer-bottom">
      © {new Date().getFullYear()} CineVerse — Projet cinéma Tunisie
    </div>
  </footer>
);

export default Footer;
