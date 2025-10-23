'use client';
import { ReactNode, useContext, useEffect, useState } from 'react';
import NavBar from '../Navbar/NavBar';
import { ThemeContext } from '@/contexts/ThemeContext';
import AuthStateHandler from '../Auth/AuthStateHandler';
import AuthLoadingIndicator from '../Auth/AuthLoadingIndicator';
import NavigationMiddleware from '../Common/NavigationMiddleware';
import { usePathname } from 'next/navigation';

type Props = {
  children: ReactNode;
};

export default function AppLayout({ children }: Props) {
  const { theme } = useContext(ThemeContext);
  const pathname = usePathname();
  const [isAuthPage, setIsAuthPage] = useState(false);

  useEffect(() => {
    setIsAuthPage(pathname?.includes('/login') || pathname?.includes('/register') || false);
  }, [pathname]);

  return (
    <div className={`bg-base-100 w-full min-h-screen ${isAuthPage ? 'overflow-hidden' : ''}`} data-theme={theme}>
      {/* Global auth state handler */}
      <AuthStateHandler />

      {/* Display indicator when checking login status */}
      <AuthLoadingIndicator />

      {/* Navigation middleware for handling route changes */}
      <NavigationMiddleware />

      {/* Only show NavBar when not on auth pages */}
      {!isAuthPage && <NavBar />}

      <main className={`w-full ${isAuthPage ? 'h-screen overflow-hidden' : ''}`}>{children}</main>
    </div>
  );
}
