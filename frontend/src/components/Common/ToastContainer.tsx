'use client';

import { useEffect, useState } from 'react';
import { ToastType } from '@/contexts/ToastContext';
import Toast from '@/components/Common/Toast';

interface ToastContainerProps {
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  toasts: Array<{
    id: string;
    message: string;
    type: ToastType;
    duration: number;
  }>;
  onClose: (id: string) => void;
}

export default function ToastContainer({ position, toasts, onClose }: ToastContainerProps) {
  const [mounted, setMounted] = useState(false);

  // Only show on client-side to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Return null on server-side and first render on client
  }

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
      default:
        return 'bottom-4 right-4';
    }
  };

  return (
    <div className={`fixed ${getPositionClasses()} z-50 flex flex-col items-end gap-2 max-w-md`}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => onClose(toast.id)}
        />
      ))}
    </div>
  );
}
