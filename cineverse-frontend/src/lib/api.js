const API_BASE = import.meta.env.DEV ? '' : 'http://localhost:8081';

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('cv_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const getToken = () => getStoredUser()?.token ?? null;

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = { ...options.headers };
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] ?? 'application/json';
  }
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message = typeof data === 'object' && data?.message
      ? data.message
      : typeof data === 'string' && data ? data
      : res.status === 401 ? 'Email ou mot de passe incorrect'
      : res.status === 403 ? 'Accès refusé — reconnectez-vous'
      : 'Une erreur est survenue';
    throw new Error(message);
  }
  return data;
}

export const api = {
  getMovies: () => apiFetch('/api/movies'),
  getMovie: (id) => apiFetch(`/api/movies/${id}`),
  getSessionsByMovie: (movieId) => apiFetch(`/api/sessions/movie/${movieId}`),
  getSession: (id) => apiFetch(`/api/sessions/${id}`),
  getOccupiedSeats: (sessionId) => apiFetch(`/api/sessions/${sessionId}/occupied-seats`),
  getSeatsByRoom: (roomId) => apiFetch(`/api/seats/room/${roomId}`),
  getCinemas: () => apiFetch('/api/cinemas'),
  signin: (body) => apiFetch('/api/auth/signin', { method: 'POST', body: JSON.stringify(body) }),
  signup: (body) => apiFetch('/api/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
  createReservation: (body) => apiFetch('/api/reservations', { method: 'POST', body: JSON.stringify(body) }),
  getMyReservations: () => apiFetch('/api/reservations/me'),
  getSavedCard: () => apiFetch('/api/payment/card'),
};

export const posterBackdrop = (url) => url?.replace('/w500/', '/original/') ?? '';

export const trailerEmbed = (url) => {
  if (!url) return '';
  if (url.includes('embed/')) return url.includes('?') ? url : `${url}?autoplay=1`;
  const id = url.match(/(?:v=|\/)([\w-]{11})/)?.[1];
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : url;
};
