import { ReactNode } from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'loading-sm',
    md: 'loading-md',
    lg: 'loading-lg',
  };

  return <span className={`loading loading-spinner ${sizeClasses[size]} ${className}`}></span>;
}

interface LoadingOverlayProps {
  isLoading: boolean;
  children: ReactNode;
  message?: string;
}

export function LoadingOverlay({ isLoading, children, message = 'Loading...' }: LoadingOverlayProps) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-base-100/70 flex items-center justify-center z-50 rounded-lg">
          <div className="flex flex-col items-center gap-4">
            <LoadingSpinner size="lg" />
            <span className="text-sm opacity-70">{message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

interface ButtonWithLoadingProps {
  isLoading: boolean;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function ButtonWithLoading({
  isLoading,
  children,
  className = '',
  onClick,
  disabled,
  type = 'button',
}: ButtonWithLoadingProps) {
  return (
    <button
      type={type}
      className={`btn ${className} ${isLoading ? 'loading' : ''}`}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? <LoadingSpinner size="sm" /> : children}
    </button>
  );
}
