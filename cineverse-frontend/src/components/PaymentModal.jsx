import React, { useState, useEffect } from 'react';
import { X, CreditCard, Lock, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../lib/api';

const CARD_TYPES = [
  { id: 'visa', label: 'Visa', color: '#1a1f71' },
  { id: 'mastercard', label: 'Mastercard', color: '#eb001b' },
  { id: 'cib', label: 'CIB / Poste', color: '#006633' },
  { id: 'bank', label: 'Carte bancaire', color: '#333' },
];

const formatCardNumber = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
};

const formatExpiry = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const PaymentModal = ({ total, movieTitle, userId, onClose, onSuccess }) => {
  const [cardType, setCardType] = useState('visa');
  const [savedCard, setSavedCard] = useState(null);
  const [loadingCard, setLoadingCard] = useState(true);
  const [form, setForm] = useState({
    holder: '',
    number: '',
    expiry: '',
    cvv: '',
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    setLoadingCard(true);
    setForm({ holder: '', number: '', expiry: '', cvv: '' });
    setErrors({});
    api.getSavedCard()
      .then(card => {
        setSavedCard(card);
        if (card.registered) {
          setCardType(card.cardType || 'visa');
          setForm({
            holder: card.cardHolder || '',
            number: '',
            expiry: card.expiry || '',
            cvv: '',
          });
        } else {
          setSavedCard(card);
        }
      })
      .catch(() => setSavedCard({
        registered: false,
        message: "Premier paiement : entrez un numéro à 16 chiffres — il sera lié à ce compte.",
      }))
      .finally(() => setLoadingCard(false));
  }, [userId]);

  const handleChange = (field, value) => {
    let v = value;
    if (field === 'number') v = formatCardNumber(value);
    if (field === 'expiry') v = formatExpiry(value);
    if (field === 'cvv') v = value.replace(/\D/g, '').slice(0, 4);
    setForm(prev => ({ ...prev, [field]: v }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.holder.trim() || form.holder.trim().length < 3) {
      e.holder = 'Nom du titulaire requis';
    }
    const rawNum = form.number.replace(/\s/g, '');
    if (rawNum.length !== 16) {
      e.number = 'Entrez exactement 16 chiffres';
    } else if (!/^\d{16}$/.test(rawNum)) {
      e.number = 'Uniquement des chiffres';
    }
    const [mm, yy] = form.expiry.split('/');
    if (!mm || !yy || mm.length !== 2 || yy.length !== 2) {
      e.expiry = 'Date invalide (MM/AA)';
    } else {
      const month = parseInt(mm, 10);
      if (month < 1 || month > 12) e.expiry = 'Mois invalide';
    }
    if (form.cvv.length < 3) e.cvv = 'CVV requis (3 ou 4 chiffres)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildPaymentPayload = () => ({
    cardType,
    cardHolder: form.holder.trim(),
    cardNumber: form.number.replace(/\s/g, ''),
    expiry: form.expiry,
    cvv: form.cvv,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setProcessing(true);
    setErrors({});
    await new Promise(r => setTimeout(r, 1200));
    try {
      await onSuccess(buildPaymentPayload());
    } catch (err) {
      setErrors({ submit: err.message || 'Échec du paiement. Réessayez.' });
      setProcessing(false);
      return;
    }
    setProcessing(false);
  };

  const previewBrand = CARD_TYPES.find(c => c.id === cardType);
  const maskedHint = savedCard?.registered
    ? `•••• •••• •••• ${savedCard.cardLastFour}`
    : form.number || '•••• •••• •••• ••••';

  return (
    <div className="payment-overlay" onClick={onClose}>
      <div className="payment-modal" onClick={ev => ev.stopPropagation()}>
        <button type="button" className="payment-close" onClick={onClose} aria-label="Fermer">
          <X size={22} />
        </button>

        <div className="payment-header">
          <CreditCard size={28} color="var(--primary)" />
          <div>
            <h2>Paiement sécurisé</h2>
            <p>{movieTitle} · <strong>{total.toFixed(2)} €</strong></p>
          </div>
        </div>

        {!loadingCard && savedCard?.message && (
          <p className={`payment-saved-hint ${savedCard.registered ? 'payment-saved-locked' : ''}`}>
            <AlertCircle size={16} />
            {savedCard.message}
          </p>
        )}

        <div className="payment-card-preview" style={{ background: `linear-gradient(135deg, ${previewBrand?.color} 0%, #1a1a22 100%)` }}>
          <div className="payment-card-chip" />
          <p className="payment-card-number">{maskedHint}</p>
          <div className="payment-card-footer">
            <span>{form.holder || 'NOM PRÉNOM'}</span>
            <span>{form.expiry || 'MM/AA'}</span>
          </div>
          <span className="payment-card-brand">{previewBrand?.label}</span>
        </div>

        <form className="payment-form" onSubmit={handleSubmit}>
          <label className="payment-label">Type de carte</label>
          <div className="payment-card-types">
            {CARD_TYPES.map(c => (
              <button
                key={c.id}
                type="button"
                className={`payment-type-btn ${cardType === c.id ? 'payment-type-active' : ''}`}
                onClick={() => setCardType(c.id)}
                disabled={savedCard?.registered}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="form-group">
            <label>Titulaire de la carte</label>
            <input
              type="text"
              className="form-input"
              placeholder="Jean Dupont"
              value={form.holder}
              onChange={e => handleChange('holder', e.target.value)}
              autoComplete="cc-name"
            />
            {errors.holder && <span className="payment-field-error">{errors.holder}</span>}
          </div>

          <div className="form-group">
            <label>
              Numéro de carte
              {savedCard?.registered && (
                <span className="payment-label-hint"> (même carte que votre premier paiement)</span>
              )}
            </label>
            <input
              type="text"
              className="form-input"
              placeholder={savedCard?.registered
                ? `•••• •••• •••• ${savedCard.cardLastFour}`
                : '1234 5678 9012 3456'}
              value={form.number}
              onChange={e => handleChange('number', e.target.value)}
              inputMode="numeric"
              autoComplete="cc-number"
            />
            {errors.number && <span className="payment-field-error">{errors.number}</span>}
          </div>

          <div className="payment-row">
            <div className="form-group">
              <label>Expiration</label>
              <input
                type="text"
                className="form-input"
                placeholder="MM/AA"
                value={form.expiry}
                onChange={e => handleChange('expiry', e.target.value)}
                inputMode="numeric"
                autoComplete="cc-exp"
              />
              {errors.expiry && <span className="payment-field-error">{errors.expiry}</span>}
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input
                type="password"
                className="form-input"
                placeholder="•••"
                value={form.cvv}
                onChange={e => handleChange('cvv', e.target.value)}
                maxLength={4}
                inputMode="numeric"
                autoComplete="cc-csc"
              />
              {errors.cvv && <span className="payment-field-error">{errors.cvv}</span>}
            </div>
          </div>

          <p className="payment-secure">
            <Lock size={14} /> <ShieldCheck size={14} /> Chaque compte : 1er paiement = numéro libre (16 chiffres), puis ce numéro seul
          </p>
          {errors.submit && (
            <p className="auth-error" style={{ marginBottom: 12 }}>{errors.submit}</p>
          )}

          <button type="submit" className="pay-btn" disabled={processing || loadingCard}>
            {processing ? (
              <>
                <Loader2 size={20} className="payment-spin" /> Traitement en cours...
              </>
            ) : (
              `Payer ${total.toFixed(2)} €`
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
