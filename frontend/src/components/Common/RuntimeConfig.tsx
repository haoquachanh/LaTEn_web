'use client';

/**
 * Runtime Configuration Component
 *
 * Enterprise-grade component for injecting runtime configuration into the browser.
 * This avoids the need for .env files by allowing values to be set at deploy time
 * from platform environment variables.
 */
import Script from 'next/script';
import { useEffect, useMemo } from 'react';

interface RuntimeConfigProps {
  // API configuration
  serverUrl?: string;
  apiTimeout?: number;
  apiVersion?: string;

  // Feature flags
  features?: Record<string, boolean>;

  // Analytics
  analyticsEnabled?: boolean;
  analyticsId?: string;

  // Additional custom configuration
  additionalConfig?: Record<string, any>;
}

// Define the window interface extension
interface LaTeNConfig {
  SERVER_URL: string;
  API_TIMEOUT: number;
  API_VERSION: string;
  FEATURES: Record<string, boolean>;
  ANALYTICS: {
    ENABLED: boolean;
    ID: string;
  };
  [key: string]: any;
}

// Internal type used for this component only
// The global declaration is in app.config.ts

/**
 * RuntimeConfig component injects configuration into the window object
 * allowing environment variables to be accessed by client-side code
 * without needing to be embedded at build time.
 *
 * This approach provides runtime configuration from platform environment
 * variables (Vercel, GitHub Actions, etc.) without using .env files.
 */
export function RuntimeConfig({
  serverUrl,
  apiTimeout,
  apiVersion,
  features,
  analyticsEnabled,
  analyticsId,
  additionalConfig,
}: RuntimeConfigProps) {
  // Create the configuration object using useMemo to avoid unnecessary re-renders
  const config = useMemo(
    () => ({
      SERVER_URL: serverUrl || '/api',
      API_TIMEOUT: apiTimeout || 30000,
      API_VERSION: apiVersion || 'v1',
      FEATURES: features || {},
      ANALYTICS: {
        ENABLED: analyticsEnabled !== undefined ? analyticsEnabled : true,
        ID: analyticsId || '',
      },
      ...additionalConfig,
    }),
    [serverUrl, apiTimeout, apiVersion, features, analyticsEnabled, analyticsId, additionalConfig],
  );

  // Stringify the configuration for injection
  const configScript = useMemo(
    () => `
    window.LATEN_CONFIG = ${JSON.stringify(config, null, process.env.NODE_ENV === 'development' ? 2 : 0)};
    console.info('Runtime configuration loaded:', window.LATEN_CONFIG);
  `,
    [config],
  );

  // Log configuration in development mode
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.group('Runtime Configuration');
      console.table(config);
      console.groupEnd();
    }
  }, [config]);

  return <Script id="runtime-config" dangerouslySetInnerHTML={{ __html: configScript }} strategy="afterInteractive" />;
}
