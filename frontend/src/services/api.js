import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api'
});

// Agrega el token automáticamente a cada petición
api.interceptors.request.use(config => {
  const token = localStorage.getItem('ligred_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
