/**
 * Authentication Service Types
 */
export interface AuthUser {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  role: string;
  [key: string]: any;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  expiresIn?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}

export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface AuthError {
  message: string;
  code?: string;
  status?: number;
}
