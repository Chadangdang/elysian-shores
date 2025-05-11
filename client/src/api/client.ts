import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL
  || 'http://localhost:8001';      // fallback for local dev

const client = axios.create({
  baseURL: API_URL,
  withCredentials: true,            // if you ever need cookies
});

client.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default client;