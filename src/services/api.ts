import axios from 'axios';

// Lee la URL base del .env
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  timeout: 10000, // evita requests colgados
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔧 (Opcional) Log para debug
axiosInstance.interceptors.request.use((config) => {
  console.log('[API]', config.method?.toUpperCase(), config.url);
  return config;
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Navigation callback for handling unauthorized access
let navigateToLogin: (() => void) | null = null;

export const setNavigateToLogin = (callback: () => void) => {
  navigateToLogin = callback;
};

// Add request interceptor to attach JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Use TanStack Router navigation if available
      if (navigateToLogin) {
        navigateToLogin();
      }
    }
    return Promise.reject(error);
  }
);
