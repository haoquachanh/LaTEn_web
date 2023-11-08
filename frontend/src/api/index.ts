import axios from 'axios';
import type { AxiosInstance } from 'axios';
import console from 'console';

const BASE_URL_API="http://localhost:3001/api/"
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL_API,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export default api;