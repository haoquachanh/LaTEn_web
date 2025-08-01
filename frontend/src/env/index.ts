/**
 * Environment Configuration System
 *
 * This module provides a type-safe way to access environment-specific configurations
 * with proper defaults and fallbacks. It follows best practices for multi-environment
 * applications (development, staging, production).
 */

// Define the EnvironmentConfig interface directly here to avoid circular imports
export interface EnvironmentConfig {
  api: {
    baseUrl: string;
    version: string;
    timeout: number;
    withCredentials: boolean;
  };
  auth: {
    tokenExpiryTime: number;
    refreshBeforeExpiry: number;
    storageType: 'localStorage' | 'sessionStorage';
    storageKeys: {
      token: string;
      refreshToken: string;
      user: string;
    };
    sessionInactivityTimeout: number;
  };
  features: {
    enableComments: boolean;
    enableExaminations: boolean;
    enableUserProfiles: boolean;
    enableAnalytics: boolean;
    enableErrorReporting: boolean;
    enablePerformanceMonitoring: boolean;
  };
  analytics: {
    enabled: boolean;
    trackingId: string;
    options: {
      anonymizeIp: boolean;
      respectDoNotTrack: boolean;
    };
  };
  debug: {
    enabled: boolean;
    logLevel: 'error' | 'warn' | 'info' | 'debug' | 'trace';
    showApiErrors: boolean;
  };
  ui: {
    defaultTheme: string;
    animation: {
      enabled: boolean;
      reducedMotion: boolean;
    };
    toast: {
      defaultDuration: number;
      maxVisible: number;
    };
  };
}

import developmentConfig from './development';
import stagingConfig from './staging';
import productionConfig from './production';

// The detected environment
export const ENV = {
  current: process.env.NEXT_PUBLIC_APP_ENV || process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isStaging: process.env.NEXT_PUBLIC_APP_ENV === 'staging',
  isProduction: process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_APP_ENV !== 'staging',
  isTest: process.env.NODE_ENV === 'test',
  isServerSide: typeof window === 'undefined',
};

// Get the environment-specific configuration
function loadEnvironmentConfig(environment: string): EnvironmentConfig {
  switch (environment) {
    case 'development':
      return developmentConfig;
    case 'staging':
      return stagingConfig;
    case 'production':
      return productionConfig;
    default:
      return developmentConfig;
  }
}

// Export the full environment configuration
export const config = loadEnvironmentConfig(ENV.current);

// Combined configuration and environment info
export const env = {
  ...ENV,
  ...config,
};

// Helper functions for configuration
export function getConfigValue<T>(runtimeKey: string, envKey: string | null, defaultValue: T): T {
  // 1. Check runtime config first (highest precedence)
  if (typeof window !== 'undefined' && window.LATEN_CONFIG && runtimeKey in window.LATEN_CONFIG) {
    return window.LATEN_CONFIG[runtimeKey] as T;
  }

  // 2. Check environment variables
  if (envKey && typeof process !== 'undefined' && process.env && envKey in process.env) {
    const value = process.env[envKey];

    // Type conversion based on defaultValue type
    if (typeof defaultValue === 'boolean') {
      return (value === 'true') as unknown as T;
    }

    if (typeof defaultValue === 'number') {
      return (Number(value) || defaultValue) as unknown as T;
    }

    return value as unknown as T;
  }

  // 3. Fall back to default value
  return defaultValue;
}

// Helper for feature flags
export function getFeatureFlag(key: string, defaultValue: boolean = false): boolean {
  return getConfigValue<boolean>(`FEATURES.${key}`, `NEXT_PUBLIC_FEATURE_${key.toUpperCase()}`, defaultValue);
}

// Define runtime config type
export interface RuntimeConfig {
  [key: string]: any;
}

// Declare global runtime config type
declare global {
  interface Window {
    LATEN_CONFIG?: RuntimeConfig;
  }
}
