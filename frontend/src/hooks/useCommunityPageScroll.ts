'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const useCommunityPageScroll = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  // Lưu vị trí cuộn khi rời khỏi trang - sử dụng useCallback
  const saveScrollPosition = useCallback(() => {
    if (pathname.includes('/community')) {
      const position = window.scrollY;
      sessionStorage.setItem('communityScrollPosition', position.toString());
    }
  }, [pathname]);

  // Khôi phục vị trí cuộn khi quay lại trang - sử dụng useCallback
  const restoreScrollPosition = useCallback(() => {
    const savedPosition = sessionStorage.getItem('communityScrollPosition');
    if (savedPosition) {
      window.scrollTo(0, parseInt(savedPosition, 10));
    }
  }, []);

  useEffect(() => {
    if (pathname.includes('/community')) {
      // Khôi phục vị trí cuộn khi component được mount
      restoreScrollPosition();

      // Lưu vị trí cuộn khi người dùng rời khỏi trang
      window.addEventListener('beforeunload', saveScrollPosition);

      return () => {
        window.removeEventListener('beforeunload', saveScrollPosition);
        // Lưu vị trí cuộn khi unmount
        saveScrollPosition();
      };
    }
  }, [pathname, restoreScrollPosition, saveScrollPosition]);

  return {
    saveScrollPosition,
    restoreScrollPosition,
  };
};

export default useCommunityPageScroll;
