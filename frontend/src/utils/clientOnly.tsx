'use client';

import { useEffect, useState, ReactNode } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component that only renders its children on the client-side
 * This helps avoid hydration errors when client and server rendering differ
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

/**
 * Higher-order component that wraps a component to make it client-side only
 */
export function withClientOnly<P extends object>(Component: React.ComponentType<P>) {
  return function ClientSideComponent(props: P) {
    return (
      <ClientOnly>
        <Component {...props} />
      </ClientOnly>
    );
  };
}

export default ClientOnly;
