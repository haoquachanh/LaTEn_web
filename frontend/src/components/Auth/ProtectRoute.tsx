import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const jwtToken = localStorage.getItem('access_token');

    if (!jwtToken) {
      router.push('/login');
    }
  }, [router]);

  return <>{children}</>;
}
