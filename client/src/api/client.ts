// client/src/api/client.ts

import axios from 'axios';

//
// 1️⃣ Pick up the env var (set this in Vercel/Netlify):
//      REACT_APP_API_URL=https://elysian-shores-api.onrender.com
//
const API_URL =
  process.env.REACT_APP_API_URL?.replace(/\/$/, '')   // strip trailing slash
  || 'http://localhost:8001';                         // local fallback

const client = axios.create({
  baseURL: API_URL,
  // if you ever need cookies:
  withCredentials: true,
});

//
// 2️⃣ Always attach your Bearer token:
//
client.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
