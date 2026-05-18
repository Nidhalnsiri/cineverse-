import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { api } from '../lib/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.signin({ email, password });
      login(data);
      navigate(from);
    } catch (err) {
      setError(err.message === 'Bad credentials'
        ? 'Email ou mot de passe incorrect'
        : err.message || 'Erreur réseau. Vérifiez que le serveur est démarré.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ backgroundImage: 'url(https://image.tmdb.org/t/p/original/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg)' }}>
      <div className="auth-overlay" />
      <div className="auth-card">
        <div className="auth-logo">CINEVERSE</div>
        <h1 className="auth-title">Connexion</h1>
        <p className="auth-sub">Bon retour parmi nous !</p>
        {error && <div className="auth-error">{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Adresse email</label>
            <input type="email" className="form-input" placeholder="jean@exemple.fr"
              value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input type="password" className="form-input" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        <div className="auth-footer">
          Première fois sur CineVerse ? <Link to="/register">Créer un compte</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
