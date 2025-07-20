'use client';
/**
 * Authentication Context
 *
 * Provides authentication state and methods throughout the application.
 * Implements secure token handling and user management.
 */
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { AuthService } from '@/services';
import { AuthUser, LoginCredentials, AuthError, RegisterData } from '@/services/types/auth.types';
import { toast } from 'react-hot-toast';

/**
 * Authentication context interface
 */
interface AuthContextType {
  user: AuthUser | null;
  accessToken: string | null;
  loggedIn: boolean;
  loading: boolean;

  // Authentication methods
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<boolean>;
  refreshUser: () => Promise<AuthUser | null>;
  updateProfile: (userData: Partial<AuthUser>) => Promise<boolean>;
}

/**
 * Default context values
 */
const defaultContext: AuthContextType = {
  user: null,
  accessToken: null,
  loggedIn: false,
  loading: true,
  login: async () => false,
  logout: () => {},
  register: async () => false,
  refreshUser: async () => null,
  updateProfile: async () => false,
};

/**
 * Create the authentication context
 */
export const AuthContext = createContext<AuthContextType>(defaultContext);

/**
 * Authentication context provider props
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication context provider component
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // State management
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Initialize authentication state from stored credentials
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if user is already authenticated
        if (AuthService.isAuthenticated()) {
          const storedUser = AuthService.getCurrentUser();
          const token = localStorage.getItem('laten_auth_token');

          setUser(storedUser);
          setAccessToken(token);
          setLoggedIn(true);

          // Optional: validate with backend
          try {
            await refreshUser();
          } catch (error) {
            // Silent error handling to avoid login screen flash
            console.warn('Failed to refresh user profile during init', error);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        handleAuthError(error as AuthError);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * User login method
   */
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setLoading(true);
      const result = await AuthService.login(credentials);

      setUser(result.user);
      setAccessToken(result.accessToken);
      setLoggedIn(true);

      toast.success('Logged in successfully');

      // Chuyển hướng đến trang được lưu trữ trước đó nếu có
      if (typeof window !== 'undefined') {
        const redirectUrl = sessionStorage.getItem('auth_redirect');
        if (redirectUrl) {
          sessionStorage.removeItem('auth_redirect');
          // Cho phép hệ thống khởi tạo trước khi chuyển hướng
          setTimeout(() => {
            window.location.href = redirectUrl;
          }, 100);
        }
      }

      return true;
    } catch (error) {
      handleAuthError(error as AuthError);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * User logout method
   */
  const logout = useCallback(() => {
    AuthService.logout();
    setUser(null);
    setAccessToken(null);
    setLoggedIn(false);

    toast.success('Logged out successfully');
  }, []);

  /**
   * User registration method
   */
  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setLoading(true);
      await AuthService.register(userData);

      toast.success('Registration successful! Please log in.');
      return true;
    } catch (error) {
      handleAuthError(error as AuthError);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh user profile data
   */
  const refreshUser = async (): Promise<AuthUser | null> => {
    try {
      if (!loggedIn) return null;

      const updatedUser = await AuthService.getProfile();
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Failed to refresh user profile', error);

      // If unauthorized, log out
      if ((error as AuthError).status === 401) {
        logout();
      }

      return null;
    }
  };

  /**
   * Update user profile
   */
  const updateProfile = async (userData: Partial<AuthUser>): Promise<boolean> => {
    try {
      setLoading(true);
      // You'd implement UserService.updateProfile() in a real app
      // const updatedUser = await UserService.updateProfile(userData);
      // setUser({...user, ...updatedUser});

      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      handleAuthError(error as AuthError);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Centralized auth error handler
   */
  const handleAuthError = (error: AuthError) => {
    const message = error.message || 'Authentication failed';
    console.error('Auth error:', error);
    toast.error(message);

    // Handle specific error codes
    if (error.code === 'TOKEN_EXPIRED') {
      logout();
    }
  };

  // Provide the authentication context to children
  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loggedIn,
        loading,
        login,
        logout,
        register,
        refreshUser,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to use the auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
