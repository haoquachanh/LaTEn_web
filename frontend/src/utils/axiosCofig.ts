// File: utils/api.ts
import axios, { AxiosError } from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001/api',
  timeout: 10000,
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export const getApi = async (url: string, token?: string | null) => {
  try {
    const headers: any = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await instance.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error('API GET Error:', error);
    throw error;
  }
};

export const postApi = async (url: string, data: any, token?: string | null) => {
  try {
    const headers: any = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await instance.post(url, data, { headers });
    return response.data;
  } catch (error) {
    console.error('API POST Error:', error);
    throw error;
  }
};

export const putApi = async (url: string, data: any, token?: string | null) => {
  try {
    const headers: any = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await instance.put(url, data, { headers });
    return response.data;
  } catch (error) {
    console.error('API PUT Error:', error);
    throw error;
  }
};

export const deleteApi = async (url: string, token?: string | null) => {
  try {
    const headers: any = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await instance.delete(url, { headers });
    return response.data;
  } catch (error) {
    console.error('API DELETE Error:', error);
    throw error;
  }
};

export default instance;
