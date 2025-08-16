'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Hook to disable scrolling on examination pages only
 * This adds a class to the body when on examination pages and removes it otherwise
 */
export default function useExaminationPageScroll() {
  const pathname = usePathname();

  useEffect(() => {
    // Check if the current page is an examination page
    const isExaminationPage = pathname?.includes('/examination');

    if (isExaminationPage) {
      // Disable scrolling on examination pages
      document.body.classList.add('overflow-hidden');
    } else {
      // Enable scrolling on other pages
      document.body.classList.remove('overflow-hidden');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [pathname]);
}
