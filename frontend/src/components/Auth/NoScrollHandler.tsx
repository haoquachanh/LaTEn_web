'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Component that handles disabling scrollbars for the entire page
 * Used on auth pages to ensure no scrollbars are displayed
 */
export default function NoScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    // Check if on auth page
    const isAuthPage = pathname?.includes('/login') || pathname?.includes('/register') || false;

    if (isAuthPage) {
      // Add overflow-hidden class to html and body
      document.documentElement.classList.add('overflow-hidden');
      document.body.classList.add('overflow-hidden');
    }

    // Cleanup when component unmounts or pathname changes
    return () => {
      document.documentElement.classList.remove('overflow-hidden');
      document.body.classList.remove('overflow-hidden');
    };
  }, [pathname]);

  return null;
}
