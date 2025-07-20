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

// Các đường dẫn YÊU CẦU xác thực - chỉ những trang này mới cần đăng nhập
// Hiện tại là danh sách trống, sẽ được bổ sung sau khi có các trang cần xác thực
const protectedPaths = ['/profile', '/dashboard', '/my-courses', '/my-exams', '/settings'];

// Các đường dẫn examination KHÔNG nên bị ảnh hưởng bởi logic xác thực
const examinationPaths = ['/examination', '/[locale]/examination'];

export default function AuthStateHandler() {
  const { loading, loggedIn, refreshUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Kiểm tra trạng thái đăng nhập mỗi khi component được mount
  useEffect(() => {
    // Không làm gì nếu vẫn đang tải
    if (loading) return;

    // Kiểm tra và làm mới dữ liệu người dùng nếu đã đăng nhập
    if (loggedIn) {
      refreshUser().catch((err) => {
        console.error('Failed to refresh user data:', err);
      });
    }
  }, [loading, loggedIn, refreshUser]);

  // Điều hướng dựa trên trạng thái xác thực
  useEffect(() => {
    // Không điều hướng nếu vẫn đang tải
    if (loading) return;

    // Kiểm tra xem đường dẫn hiện tại có thuộc vào danh sách cần xác thực không
    const isProtectedPath = protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));

    // Kiểm tra xem đường dẫn hiện tại có phải là trang examination không
    const isExaminationPath = examinationPaths.some((path) => pathname === path || pathname.includes('/examination/'));

    // Nếu đã đăng nhập nhưng đang ở trang đăng nhập/đăng ký, chuyển hướng đến trang chủ
    if (loggedIn && pathname.startsWith('/auth')) {
      router.replace('/');
      return;
    }

    // Nếu chưa đăng nhập và đang truy cập trang được bảo vệ (không phải trang examination), chuyển hướng đến trang đăng nhập
    if (!loggedIn && isProtectedPath && !isExaminationPath) {
      // Lưu lại URL hiện tại để sau khi đăng nhập có thể chuyển hướng về
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('auth_redirect', pathname);
      }
      router.replace('/auth/login');
      return;
    }
  }, [pathname, loading, loggedIn, router]);

  // Không render gì, chỉ xử lý logic
  return null;
}
