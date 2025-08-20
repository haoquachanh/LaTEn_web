'use client';

import { useEffect } from 'react';
import useCommunityPageScroll from '@/hooks/useCommunityPageScroll';

// Component to control scroll behavior for community page
export default function CommunityPageScrollControl() {
  // Use the custom hook to disable scrolling
  useCommunityPageScroll();

  // This component doesn't render anything - it's just for the effect
  return null;
}
