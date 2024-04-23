// File: utils/api.ts
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 4000,
});

export const getApi = async (url: string, token?: string | null) => {
  const response = await instance.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
