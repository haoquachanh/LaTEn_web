import axios from 'axios';
import type { AxiosInstance } from 'axios';
import console from 'console';

const BASE_URL_API="http://localhost:3001/api/"
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL_API,
});

export default api;
