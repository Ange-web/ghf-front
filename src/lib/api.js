import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de Requête : Ajout du Token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Intercepteur de Réponse : Gestion des Erreurs Globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.response?.data?.message || 'Une erreur est survenue';
    
    // Gérer l'expiration de session (401)
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Optionnel : redirect vers login si on n'est pas déjà dessus
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/auth')) {
          // On évite de spammer les toasts si on est déjà redirigé
          toast.error("Session expirée. Veuillez vous reconnecter.");
        }
      }
    } else if (error.response?.status !== 404) {
      // Ne pas spammer pour les 404 si gérées localement, mais log les autres
      console.error(`API Error [${error.response?.status || 'NETWORK'}] ${error.config?.url}:`, message);
    }

    return Promise.reject(error);
  }
);

export default api;
