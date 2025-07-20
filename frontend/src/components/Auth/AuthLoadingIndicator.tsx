'use client';

/**
 * Component hiển thị indikator khi đang loading trạng thái đăng nhập
 */
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthLoadingIndicator() {
  const { loading } = useAuth();

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-base-300">
      <div className="h-full bg-primary animate-pulse w-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      </div>
    </div>
  );
}

// Animation keyframes can be defined in globals.css:
// @keyframes shimmer {
//   0% { transform: translateX(-100%); }
//   100% { transform: translateX(100%); }
// }
