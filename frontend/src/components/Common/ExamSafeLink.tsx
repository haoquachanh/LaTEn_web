'use client';

import Link, { LinkProps } from 'next/link';
import React, { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// Extend Next.js Link props
interface ExamSafeLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
}

/**
 * A wrapper around Next.js Link that checks if an exam is in progress before navigating
 */
const ExamSafeLink: React.FC<ExamSafeLinkProps> = ({ href, children, className, ...props }) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Check if there's an exam in progress
    const isExamInProgress =
      typeof window !== 'undefined' &&
      ((window as any).__EXAM_IN_PROGRESS === true ||
        sessionStorage.getItem('exam-type') ||
        sessionStorage.getItem('exam-content'));

    if (isExamInProgress) {
      // Prevent default link navigation
      e.preventDefault();

      // Ask for confirmation
      const confirm = window.confirm(
        'You have an exam in progress. Your progress will be lost if you navigate away. Are you sure?',
      );

      if (confirm) {
        // Clean up exam data
        sessionStorage.removeItem('exam-type');
        sessionStorage.removeItem('exam-content');
        sessionStorage.removeItem('exam-questions');
        sessionStorage.removeItem('exam-time');

        // Navigate to the new page
        router.push(href.toString());
      }
    }
    // If no exam in progress, let the normal link navigation proceed
  };

  return (
    <Link href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </Link>
  );
};

export default ExamSafeLink;
