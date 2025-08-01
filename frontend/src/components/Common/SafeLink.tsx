'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MouseEvent, PropsWithChildren } from 'react';

interface SafeLinkProps {
  href: string;
  className?: string;
  checkBeforeNavigate?: () => boolean;
  onConfirm?: () => void;
  confirmationMessage?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * A wrapper around Next.js Link component that will check if navigation should be allowed
 * Useful for confirming navigation away from forms or exams
 */
export default function SafeLink({
  href,
  className,
  checkBeforeNavigate,
  onConfirm,
  confirmationMessage = 'Are you sure you want to leave this page? Any unsaved changes will be lost.',
  onClick,
  children,
}: PropsWithChildren<SafeLinkProps>) {
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // First run the provided onClick handler if any
    if (onClick) {
      onClick(e);
    }

    // If we should check before navigating and the check fails, prevent navigation
    if (checkBeforeNavigate && !checkBeforeNavigate()) {
      e.preventDefault();

      // Show confirmation dialog
      const confirmed = window.confirm(confirmationMessage);
      if (confirmed) {
        // Run onConfirm handler if provided
        if (onConfirm) {
          onConfirm();
        }

        // Navigate programmatically
        router.push(href);
      }
      return;
    }
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
