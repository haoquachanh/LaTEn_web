'use client';

import { ReactNode } from 'react';
import { ExaminationDashboardProvider } from '@/contexts/ExaminationDashboardContext';

export default function ExaminationLayout({ children }: { children: ReactNode }) {
  return <ExaminationDashboardProvider>{children}</ExaminationDashboardProvider>;
}
