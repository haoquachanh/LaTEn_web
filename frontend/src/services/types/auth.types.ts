/**
 * Authentication Service Types
 */
export interface AuthUser {
  id: number;
  email: string;
  fullname: string;
  phone?: string;
  birth?: string;
  role: string;
  [key: string]: any;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullname?: string;
  phone?: string;
  birth?: string;
}

export interface TokenRefreshResponse {
  access_token: string;
  refresh_token?: string;
}

export interface AuthError {
  message: string;
  code?: string;
  status?: number;
}
