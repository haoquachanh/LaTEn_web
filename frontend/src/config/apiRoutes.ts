/**
 * API Routes Configuration
 *
 * This file defines the API endpoints used throughout the application.
 * Centralizing routes makes it easier to maintain and update them.
 */

/**
 * Base API URL
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * API Routes
 */
export const API_ROUTES = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // Users
  USERS: {
    BASE: '/users',
    ME: '/users/me',
    BY_ID: (id: string | number) => `/users/${id}`,
    PROFILE: (id: string | number) => `/users/${id}/profile`,
  },

  // Examinations
  EXAMINATION: {
    BASE: '/examinations',
    BY_ID: (id: string | number) => `/examinations/${id}`,
    START: '/examinations/:id/start',
    SUBMIT: '/examinations/:id/submit',
    RESULTS: '/examinations/results',
    RESULT_BY_ID: (id: string | number) => `/examinations/results/${id}`,
    QUESTIONS: '/examinations/:id/questions',
  },

  // Comments
  COMMENTS: {
    BASE: '/comments',
    BY_ID: (id: string | number) => `/comments/${id}`,
    REPLIES: (id: string | number) => `/comments/${id}/replies`,
  },

  // Health check
  HEALTH: '/health',
};

export default API_ROUTES;
