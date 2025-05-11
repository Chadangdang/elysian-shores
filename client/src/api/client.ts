// client/src/api/client.ts
import axios from 'axios';

const isDev = process.env.NODE_ENV === 'development';

// In dev, point at your local FastAPI
// In prod, an empty string means "use relative URLs" (same host/origin over HTTPS)
const baseURL = isDev
  ? 'http://localhost:8001'
  : '';

const client = axios.create({
  baseURL,
  withCredentials: false,
});

client.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;