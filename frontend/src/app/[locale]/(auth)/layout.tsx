'use client';

import { ReactNode, useContext, useEffect } from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';
import AuthStateHandler from '@/components/Auth/AuthStateHandler';
import NavBar from '@/components/Navbar/NavBar';

type Props = {
  children: ReactNode;
};

/**
 * Layout for authentication pages (login, register)
 * Displays NavBar and ensures no scrollbars
 */
export default function AuthLayout({ children }: Props) {
  const { theme } = useContext(ThemeContext);

  // Add CSS directly to ensure no scrolling
  useEffect(() => {
    // Add classes to html and body
    document.documentElement.classList.add('auth-page');
    document.body.classList.add('auth-page');

    // Hide scrollbars directly through CSS
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';

    // Cleanup when component unmounts
    return () => {
      document.documentElement.classList.remove('auth-page');
      document.body.classList.remove('auth-page');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, []);

  return (
    <div className="auth-layout bg-base-100" data-theme={theme}>
      {/* Global auth state handler */}
      <AuthStateHandler />

      {/* Display NavBar */}
      <NavBar />

      {/* Display content without scrollbars, height adjusted for navbar */}
      <main className="auth-content" style={{ height: 'calc(100% - 64px)' }}>
        {children}
      </main>
    </div>
  );
}
