import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.signup(form);
      const data = await api.signin({ email: form.email, password: form.password });
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Erreur réseau. Vérifiez que le serveur est démarré.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ backgroundImage: 'url(https://image.tmdb.org/t/p/original/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg)' }}>
      <div className="auth-overlay" />
      <div className="auth-card">
        <div className="auth-logo">CINEVERSE</div>
        <h1 className="auth-title">Créer un compte</h1>
        <p className="auth-sub">Rejoignez des milliers de cinéphiles</p>
        {error && <div className="auth-error">{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form-row">
            <div className="form-group">
              <label>Prénom</label>
              <input name="firstName" type="text" className="form-input" placeholder="Jean"
                value={form.firstName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Nom</label>
              <input name="lastName" type="text" className="form-input" placeholder="Dupont"
                value={form.lastName} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label>Adresse email</label>
            <input name="email" type="email" className="form-input" placeholder="jean@exemple.fr"
              value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input name="password" type="password" className="form-input" placeholder="Minimum 6 caractères"
              value={form.password} onChange={handleChange} required minLength={6} />
          </div>
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Création du compte...' : 'Créer mon compte'}
          </button>
        </form>
        <div className="auth-footer">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
