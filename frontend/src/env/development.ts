/**
 * Development Environment Configuration
 *
 * Settings specific to the development environment.
 * This configuration is used when running the app locally.
 */

import { getConfigValue, getFeatureFlag, type EnvironmentConfig } from './index';
const developmentConfig: EnvironmentConfig = {
  api: {
    baseUrl: getConfigValue<string>('SERVER_URL', 'NEXT_PUBLIC_SERVER_URL', 'http://localhost:3001/api'),
    version: getConfigValue<string>('API_VERSION', 'NEXT_PUBLIC_API_VERSION', 'v1'),
    timeout: getConfigValue<number>('API_TIMEOUT', 'NEXT_PUBLIC_API_TIMEOUT', 30000),
    withCredentials: getConfigValue<boolean>('API_WITH_CREDENTIALS', 'NEXT_PUBLIC_API_WITH_CREDENTIALS', true),
  },

  auth: {
    tokenExpiryTime: getConfigValue<number>(
      'AUTH_TOKEN_EXPIRY',
      'NEXT_PUBLIC_AUTH_TOKEN_EXPIRY',
      60 * 60 * 1000, // 1 hour
    ),
    refreshBeforeExpiry: getConfigValue<number>(
      'AUTH_REFRESH_BEFORE_EXPIRY',
      'NEXT_PUBLIC_AUTH_REFRESH_BEFORE_EXPIRY',
      5 * 60 * 1000, // 5 minutes
    ),
    storageType: getConfigValue<'localStorage' | 'sessionStorage'>(
      'AUTH_STORAGE_TYPE',
      'NEXT_PUBLIC_AUTH_STORAGE_TYPE',
      'localStorage',
    ),
    storageKeys: {
      token: 'laten_auth_token',
      refreshToken: 'laten_refresh_token',
      user: 'laten_user',
    },
    sessionInactivityTimeout: getConfigValue<number>(
      'SESSION_INACTIVITY_TIMEOUT',
      'NEXT_PUBLIC_SESSION_INACTIVITY_TIMEOUT',
      30 * 60 * 1000, // 30 minutes
    ),
  },

  features: {
    enableComments: getFeatureFlag('ENABLE_COMMENTS', true),
    enableDictionary: getFeatureFlag('ENABLE_DICTIONARY', true),
    enableExaminations: getFeatureFlag('ENABLE_EXAMINATIONS', true),
    enableUserProfiles: getFeatureFlag('ENABLE_USER_PROFILES', true),
    enableAnalytics: getFeatureFlag('ENABLE_ANALYTICS', false),
    enableErrorReporting: getFeatureFlag('ENABLE_ERROR_REPORTING', true),
    enablePerformanceMonitoring: getFeatureFlag('ENABLE_PERFORMANCE_MONITORING', false),
  },

  analytics: {
    enabled: getConfigValue<boolean>('ANALYTICS.ENABLED', 'NEXT_PUBLIC_ANALYTICS_ENABLED', false),
    trackingId: getConfigValue<string>('ANALYTICS.ID', 'NEXT_PUBLIC_ANALYTICS_ID', 'DEV-TRACKING-ID'),
    options: {
      anonymizeIp: true,
      respectDoNotTrack: true,
    },
  },

  debug: {
    enabled: getConfigValue<boolean>('DEBUG_ENABLED', 'NEXT_PUBLIC_DEBUG_ENABLED', true),
    logLevel: getConfigValue<'error' | 'warn' | 'info' | 'debug' | 'trace'>(
      'DEBUG_LOG_LEVEL',
      'NEXT_PUBLIC_DEBUG_LOG_LEVEL',
      'debug',
    ),
    showApiErrors: getConfigValue<boolean>('DEBUG_SHOW_API_ERRORS', 'NEXT_PUBLIC_DEBUG_SHOW_API_ERRORS', true),
  },

  ui: {
    defaultTheme: getConfigValue<string>('DEFAULT_THEME', 'NEXT_PUBLIC_DEFAULT_THEME', 'light'),
    animation: {
      enabled: getConfigValue<boolean>('UI_ANIMATIONS_ENABLED', 'NEXT_PUBLIC_UI_ANIMATIONS_ENABLED', true),
      reducedMotion: getConfigValue<boolean>('UI_REDUCED_MOTION', 'NEXT_PUBLIC_UI_REDUCED_MOTION', false),
    },
    toast: {
      defaultDuration: getConfigValue<number>('UI_TOAST_DURATION', 'NEXT_PUBLIC_UI_TOAST_DURATION', 3000),
      maxVisible: getConfigValue<number>('UI_MAX_TOASTS', 'NEXT_PUBLIC_UI_MAX_TOASTS', 3),
    },
  },
};

export default developmentConfig;
