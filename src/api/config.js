export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:3000',
  headers: {
    Accept: 'text/csv, application/csv, */*',
    'Content-Type': 'application/json',
  },
};

export const createApiUrl = (endpoint) => `${API_CONFIG.baseURL}${endpoint}`;
