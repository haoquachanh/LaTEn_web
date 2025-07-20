const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// Detect environment
const appEnv = process.env.NEXT_PUBLIC_APP_ENV || process.env.NODE_ENV || 'development';
const isDev = process.env.NODE_ENV === 'development';
const isStaging = appEnv === 'staging';
const isProd = process.env.NODE_ENV === 'production' && appEnv === 'production';

// Environment-specific configurations
const envConfig = {
  development: {
    env: {
      NEXT_PUBLIC_APP_ENV: 'development',
    }
  },
  staging: {
    env: {
      NEXT_PUBLIC_APP_ENV: 'staging',
    }
  },
  production: {
    env: {
      NEXT_PUBLIC_APP_ENV: 'production',
    }
  }
};

// Get the current environment config
const currentEnvConfig = envConfig[appEnv] || envConfig.development;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment variables to be used on the client-side
  env: {
    ...currentEnvConfig.env,
  },
  
  // Enable standalone output for Docker deployment
  output: 'standalone',

  // Performance optimizations
  swcMinify: true,
  
  // Use SWC for compilation instead of Babel
  compiler: {
    // Enable SWC compiler
    styledComponents: false, // Set to true if you use styled-components
  },
  
  // Disable source maps in production for better performance
  productionBrowserSourceMaps: !isProd,

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: isProd ? 3600 : 60, // 1 hour in production, 1 minute in dev/staging
  },

  // Experimental features - only in development
  experimental: {
    optimizeCss: true,
    // Add more experimental features for development if needed
    ...(isDev ? {
      // Next.js 14.1.4 doesn't support boolean turbo flag
      turbo: {
        enabled: true
      }
    } : {}),
  },

  // Webpack bundle analyzer (only in analyze mode)
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Bundle analyzer plugin
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: isServer ? '../analyze/server.html' : './analyze/client.html',
        }),
      );
    }
    
    // Environment-specific webpack configurations
    if (isProd) {
      // Production-specific optimizations
      config.optimization = {
        ...config.optimization,
        minimize: true,
      };
    }
    
    return config;
  },
  
  // Add environment indicator to build info
  generateBuildId: async () => {
    return `build-${appEnv}-${Date.now()}`;
  },
};

module.exports = withNextIntl(nextConfig);
