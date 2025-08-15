'use client';

import { useEffect } from 'react';
import useExaminationPageScroll from '@/hooks/useExaminationPageScroll';

// Component to control scroll behavior for examination page
export default function ExamPageScrollControl() {
  // Use the custom hook to disable scrolling
  useExaminationPageScroll();

  // This component doesn't render anything - it's just for the effect
  return null;
}
