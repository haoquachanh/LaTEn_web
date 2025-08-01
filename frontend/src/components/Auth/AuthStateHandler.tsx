'use client';

/**
 * AuthStateHandler Component
 *
 * Quản lý và kiểm tra trạng thái xác thực khi ứng dụng khởi động
 * và đồng bộ giữa các thành phần của ứng dụng.
 */
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';

const protectedPaths = ['/profile', '/dashboard', '/my-courses', '/my-exams', '/settings'];

const examinationPaths = ['/examination', '/[locale]/examination'];

export default function AuthStateHandler() {
  const { loading, loggedIn, refreshUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (loggedIn) {
      const shouldRefresh = !sessionStorage.getItem('user_refreshed');

      if (shouldRefresh) {
        sessionStorage.setItem('user_refreshed', 'true');
        refreshUser().catch((err) => {
          console.error('Failed to refresh user data:', err);
        });

        setTimeout(
          () => {
            sessionStorage.removeItem('user_refreshed');
          },
          30 * 60 * 1000,
        );
      }
    }
  }, []);

  useEffect(() => {
    if (loading) return;

    const isProtectedPath = protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));

    const isExaminationPath = examinationPaths.some((path) => pathname === path || pathname.includes('/examination/'));

    if (loggedIn && pathname.startsWith('/auth')) {
      router.replace('/');
      return;
    }

    if (!loggedIn && isProtectedPath && !isExaminationPath) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('auth_redirect', pathname);
      }
      router.replace('/auth/login');
      return;
    }
  }, [pathname, loading, loggedIn, router]);

  return null;
}
