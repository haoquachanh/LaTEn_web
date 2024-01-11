// src/services/authService.ts
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await axios.post(`${BASE_URL}/login`, { email, password });
    return response.data;
  },
  refreshToken: async (refreshToken: string) => {
    const response = await axios.post(`${BASE_URL}/refresh-token`, { refreshToken });
    return response.data;
  },
};
