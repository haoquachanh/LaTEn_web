'use client';

/**
 * Toast Context
 *
 * A React context for managing toast notifications across the application.
 * This allows components to show toast messages without prop drilling.
 */
import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import Toast from '../components/Common/Toast';

// Toast types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

// Toast item interface
interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

// Toast context interface
interface ToastContextProps {
  showToast: (message: string, type?: ToastType, duration?: number) => string;
  hideToast: (id: string) => void;
  clearToasts: () => void;
}

// Create context with default values
const ToastContext = createContext<ToastContextProps>({
  showToast: () => '',
  hideToast: () => {},
  clearToasts: () => {},
});

/**
 * Toast provider props
 */
interface ToastProviderProps {
  children: ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxToasts?: number;
}

/**
 * Provider component for toast context
 */
export function ToastProvider({ children, position = 'bottom-right', maxToasts = 5 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  /**
   * Get position classes for toast container
   */
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

  /**
   * Show a toast notification
   */
  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration: number = 3000): string => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      setToasts((currentToasts) => {
        // Limit the number of toasts
        const updatedToasts = [...currentToasts];

        if (updatedToasts.length >= maxToasts) {
          updatedToasts.shift(); // Remove the oldest toast
        }

        return [...updatedToasts, { id, message, type, duration }];
      });

      return id;
    },
    [maxToasts],
  );

  /**
   * Hide a specific toast by ID
   */
  const hideToast = useCallback((id: string) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }, []);

  /**
   * Clear all toasts
   */
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  /**
   * Handle close for a specific toast
   */
  const handleClose = (id: string) => {
    hideToast(id);
  };

  // Add client-side only rendering to prevent hydration mismatch
  const [isMounted, setIsMounted] = useState(false);

  // Only run on client-side
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast, clearToasts }}>
      {children}

      {/* Toast container - only render on client */}
      {isMounted && (
        <div className={`fixed ${getPositionClasses()} z-50 flex flex-col items-end gap-2 max-w-md`}>
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => handleClose(toast.id)}
            />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

/**
 * Custom hook to use toast context
 */
export function useToast() {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}
