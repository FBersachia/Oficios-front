import axios from 'axios';
import { errorLogger } from '@/utils/errorLogger';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Log request errors
    errorLogger.logError({
      message: `Request Error: ${error.message}`,
      stack: error.stack,
      source: 'api',
      level: 'medium',
      additionalInfo: {
        type: 'request_error',
        config: error.config,
      },
    });
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log API errors with detailed information
    const endpoint = error.config?.url;
    errorLogger.logApiError(error, endpoint);

    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Handle network errors
    if (!error.response && error.code === 'NETWORK_ERROR') {
      errorLogger.logNetworkError(error);
    }

    return Promise.reject(error);
  }
);

export default api;