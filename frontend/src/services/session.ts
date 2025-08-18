import api from '@/services/api';

// Session interface
export interface Session {
  user: {
    id: number;
    email: string;
    fullname: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

// Get current session from localStorage
export const getSession = async (): Promise<Session | null> => {
  if (typeof window === 'undefined') {
    return null; // SSR case
  }

  try {
    const sessionStr = localStorage.getItem('laten_session');
    if (!sessionStr) return null;

    const session = JSON.parse(sessionStr) as Session;

    // Check if session has expired
    if (session.expiresAt && session.expiresAt < Date.now()) {
      // Try to refresh the token
      try {
        const response = await api.post('/auth/refresh', {
          refreshToken: session.refreshToken,
        });

        const newSession = {
          ...session,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken || session.refreshToken,
          expiresAt: Date.now() + (response.data.expiresIn || 3600) * 1000,
        };

        localStorage.setItem('laten_session', JSON.stringify(newSession));
        return newSession;
      } catch (error) {
        // If refresh failed, clear the session
        localStorage.removeItem('laten_session');
        return null;
      }
    }

    return session;
  } catch (error) {
    console.error('Error retrieving session:', error);
    return null;
  }
};

// Save session to localStorage
export const setSession = (session: Session): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('laten_session', JSON.stringify(session));
};

// Clear session from localStorage
export const clearSession = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('laten_session');
};

// Check if user is logged in
export const isLoggedIn = async (): Promise<boolean> => {
  const session = await getSession();
  return !!session;
};

// Check if user has specific role
export const hasRole = async (role: string): Promise<boolean> => {
  const session = await getSession();
  return !!session && session.user.role === role;
};
