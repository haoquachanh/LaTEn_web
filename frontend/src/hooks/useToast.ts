'use client';

/**
 * Toast Hook
 *
 * Re-export of the ToastContext's useToast hook for backward compatibility
 * and to maintain a consistent API across the application.
 */

// Re-export the useToast hook from the Toast context
import { useToast } from '../contexts/ToastContext';

// Export named function
export { useToast };

// No default export - to fix lint errors

export default useToast;
