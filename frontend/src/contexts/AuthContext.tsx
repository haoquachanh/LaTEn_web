'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  access_token: string | undefined | null;
  loggedIn: boolean;
  login: (token?: string) => void;
  logout: () => void;
}
// const token = localStorage.getItem("access_token");
export const AuthContext = createContext<AuthContextType>({
  access_token: undefined,
  loggedIn: false,
  login: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [access_token, setAccessToken] = useState<string | null>(null);
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setLoggedIn(true);
    }
    setAccessToken(token);
  }, []);

  const login = (token?: string) => {
    setLoggedIn(true);
    if (token) {
      setAccessToken(token);
      localStorage.setItem('access_token', token);
    }
  };

  const logout = () => {
    setLoggedIn(false);
    setAccessToken(null);
    localStorage.removeItem('access_token');
  };

  return <AuthContext.Provider value={{ access_token, loggedIn, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
