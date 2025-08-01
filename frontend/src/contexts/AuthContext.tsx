'use client';
/**
 * Authentication Context
 *
 * Provides authentication state and methods throughout the application.
 * Implements secure token handling and user management.
 */
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Logout
  const logout = useCallback(() => {
    AuthService.logout();
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('access_token');

    // Trigger auth state sync after logout
    window.dispatchEvent(new Event('storage'));

    toast.success('Logged out successfully');
  }, []);

  // Centralized error handler
  const handleAuthError = useCallback(
    (error: AuthError) => {
      const message = error.message || 'Authentication failed';
      toast.error(message);
      if (error.code === 'TOKEN_EXPIRED') logout();
    },
    [logout],
  );

  // Sync state from localStorage
  const syncAuthState = useCallback(() => {
    const token = localStorage.getItem('access_token');
    const storedUser = AuthService.getCurrentUser();
    setUser(storedUser);
    setAccessToken(token);
    setLoading(false);
  }, []);

  useEffect(() => {
    syncAuthState();
    window.addEventListener('storage', syncAuthState);
    return () => {
      window.removeEventListener('storage', syncAuthState);
    };
  }, [syncAuthState]);

  // Login
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setLoading(true);
      try {
        const result = await AuthService.login(credentials);
        setUser(result.user);
        setAccessToken(result.access_token);
        localStorage.setItem('access_token', result.access_token);

        // Ensure auth state is fully synced after login
        syncAuthState();

        toast.success('Logged in successfully');
        console.log('Login successful:', result);
        return true;
      } catch (error) {
        console.log('Login Fail!');
        handleAuthError(error as AuthError);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [handleAuthError, syncAuthState],
  );

  // Register
  const register = useCallback(
    async (userData: RegisterData) => {
      setLoading(true);
      try {
        await AuthService.register(userData);
        toast.success('Registration successful! Please log in.');
        return true;
      } catch (error) {
        handleAuthError(error as AuthError);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [handleAuthError],
  );

  // Refresh user profile
  const refreshUser = useCallback(async () => {
    if (!user) return null;
    try {
      const updatedUser = await AuthService.getProfile();
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      handleAuthError(error as AuthError);
      return null;
    }
  }, [user, handleAuthError]);

  // Update profile
  const updateProfile = useCallback(
    async (userData: Partial<AuthUser>) => {
      setLoading(true);
      try {
        // TODO: call update profile API here
        toast.success('Profile updated successfully');
        return true;
      } catch (error) {
        handleAuthError(error as AuthError);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [handleAuthError],
  );

  // Use AuthService to determine login status consistently
  const loggedIn = AuthService.isAuthenticated();

  // Sync loggedIn state when user or accessToken changes
  useEffect(() => {
    // This ensures loggedIn state is always up-to-date
    setLoading((state) => {
      if (!state) return false; // Don't set loading true if it's already false
      return !AuthService.isAuthenticated();
    });
  }, [user, accessToken]);

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
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
