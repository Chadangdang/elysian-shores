import axios from 'axios';

const HOST = process.env.REACT_APP_API_URL || window.location.hostname;

const client = axios.create({
  baseURL: `http://${HOST}:8001`,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
