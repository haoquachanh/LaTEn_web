'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useExamContext } from '@/contexts/ExamContext';

interface ConfirmNavigationProps {
  when: boolean;
  message?: string;
}

/**
 * A component that intercepts navigation events and shows a custom confirmation dialog
 * when navigation is attempted during an exam or other critical process.
 * 
 * This component:
 * 1. Adds a window.beforeunload event listener to catch browser tab closes, refreshes, etc.
 * 2. Intercepts anchor tag clicks to show a custom confirmation dialog instead of browser's default
 * 3. Patches history.pushState and replaceState to catch programmatic navigation
 * 
 * Usage:
 * <ConfirmNavigation when={examInProgress} message="Custom message" />
 * 
 * To exclude certain links from confirmation:
 * <a href="/some-path" data-no-confirm>This won't trigger confirmation</a>
 */
const ConfirmNavigation: React.FC<ConfirmNavigationProps> = ({
  when,
  message = 'You have an exam in progress. Are you sure you want to leave? Your progress may be lost.',
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [showDialog, setShowDialog] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  
  // This is used to track if we're handling a navigation event
  const [isNavigating, setIsNavigating] = useState(false);
  
  // Store the current pathname to compare with target path
  const [lastPathname, setLastPathname] = useState(pathname);
  
  useEffect(() => {
    // Update last pathname when it changes
    if (pathname !== lastPathname) {
      setLastPathname(pathname);
    }
  }, [pathname, lastPathname]);

  // Handle beforeunload event (browser tab close, refresh, etc.)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!when) return;
      
      // Standard way to show a confirmation dialog
      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    if (when) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [when, message]);

  // Intercept Next.js navigation with anchor clicks
  useEffect(() => {
    if (!when) return;

    const interceptClicks = (e: MouseEvent) => {
      // Only intercept clicks on anchor tags
      const target = e.target as Element;
      const anchor = target.closest('a');
      
      if (!anchor) return;
      
      const href = anchor.getAttribute('href');
      if (!href) return;
      
      // Skip internal hash navigation or same page navigation
      if (href.startsWith('#') || href === pathname) return;
      
      // Skip if href has "data-no-confirm" attribute
      if (anchor.hasAttribute('data-no-confirm')) return;
      
      // Check if navigation should be blocked
      if (when) {
        e.preventDefault();
        setPendingPath(href);
        setShowDialog(true);
      }
    };

    // Add click listener to document
    document.addEventListener('click', interceptClicks, true);

    return () => {
      document.removeEventListener('click', interceptClicks, true);
    };
  }, [when, pathname]);
  
  // Handle navigation events from Next.js router
  useEffect(() => {
    if (!when) return;
    
    // For Next.js App Router, we need to patch the original pushState and replaceState
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    // Override pushState to intercept programmatic navigation
    history.pushState = function(state, title, url) {
      if (url && typeof url === 'string' && url !== location.pathname && when) {
        // Show the dialog
        setPendingPath(url);
        setShowDialog(true);
        return;
      }
      
      return originalPushState.apply(this, [state, title, url]);
    };
    
    // Override replaceState to intercept programmatic navigation
    history.replaceState = function(state, title, url) {
      if (url && typeof url === 'string' && url !== location.pathname && when) {
        // Show the dialog
        setPendingPath(url);
        setShowDialog(true);
        return;
      }
      
      return originalReplaceState.apply(this, [state, title, url]);
    };
    
    return () => {
      // Restore original methods
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [when, pathname]);

  // Handle confirm navigation
  const handleConfirmNavigation = useCallback(() => {
    setIsNavigating(true);
    setShowDialog(false);
    
    // If we have a pending path, navigate to it
    if (pendingPath) {
      router.push(pendingPath);
    }
  }, [pendingPath, router]);

  // Handle cancel navigation
  const handleCancelNavigation = useCallback(() => {
    setShowDialog(false);
    setPendingPath(null);
  }, []);

  return (
    <>
      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-base-100 p-6 rounded-box shadow-lg max-w-md w-full">
            <h3 className="font-bold text-lg mb-2">Leave Exam?</h3>
            <p className="py-2">{message}</p>
            <div className="flex justify-end gap-2 mt-4">
              <button className="btn btn-outline" onClick={handleCancelNavigation}>
                Stay on Exam
              </button>
              <button className="btn btn-error" onClick={handleConfirmNavigation}>
                Leave Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmNavigation;