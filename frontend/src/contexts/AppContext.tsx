/**
 * App Context Provider
 *
 * Main application context provider that wraps other contexts
 * and provides configuration for the entire application.
 */
import { ReactNode } from 'react';
import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from './AuthContext';
import { ExaminationProvider } from './ExaminationContext';
import { ToastProvider } from './ToastContext';
import { RuntimeConfig } from '@/components/Common/RuntimeConfig';

type Props = {
  children: ReactNode;
};

export default function AppProvider({ children }: Props) {
  // Get configuration values from environment or defaults
  const serverUrl =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (typeof window !== 'undefined' && process.env.NODE_ENV === 'development' ? 'http://localhost:3001/api' : '/api');

  // Feature flags based on environment
  const features = {
    enableComments: process.env.NEXT_PUBLIC_ENABLE_COMMENTS !== 'false',
    enableExaminations: process.env.NEXT_PUBLIC_ENABLE_EXAMS !== 'false',
  };

  // Analytics configuration
  const analyticsEnabled = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== 'false';
  const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_ID || '';

  return (
    <>
      {/* Runtime configuration - enterprise approach without .env files */}
      <RuntimeConfig
        serverUrl={serverUrl}
        apiTimeout={30000}
        apiVersion="v1"
        features={features}
        analyticsEnabled={analyticsEnabled}
        analyticsId={analyticsId}
      />

      <ToastProvider position="bottom-right" maxToasts={5}>
        <ThemeProvider>
          <AuthProvider>
            <ExaminationProvider>{children}</ExaminationProvider>
          </AuthProvider>
        </ThemeProvider>
      </ToastProvider>
    </>
  );
}
