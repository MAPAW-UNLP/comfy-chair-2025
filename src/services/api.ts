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
});

export default axiosInstance;
