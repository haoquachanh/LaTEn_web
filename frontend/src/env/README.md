# LaTEn Frontend Environment Configuration

## Overview

This project uses a multi-environment configuration system that supports development, staging, and production environments. The configuration system follows best practices for environment-based configuration without relying heavily on .env files.

## Environment Structure

The configuration system is organized into the following components:

- `src/env/index.ts`: Main entry point for environment configuration (includes types and utility functions)
- `src/env/development.ts`: Development environment-specific configuration
- `src/env/staging.ts`: Staging environment-specific configuration
- `src/env/production.ts`: Production environment-specific configuration

## Configuration Sources

Configuration values are loaded from multiple sources with the following order of precedence:

1. Runtime `window.LATEN_CONFIG` object (highest precedence)
2. Environment variables (`process.env.NEXT_PUBLIC_*`)
3. Default values defined in environment-specific files

## Using Environment Configuration

Import the environment configuration in your components and services:

```typescript
import { env, config } from '../config';

// Access environment information
if (env.isDevelopment) {
  console.log('Running in development mode');
}

// Access configuration values
const apiUrl = config.api.baseUrl;
```

## Available Environment Commands

The following npm scripts are available for working with different environments:

### Development

```bash
# Run in development mode (default)
npm run dev

# Run in development mode with staging config
npm run dev:staging

# Run in development mode with production config
npm run dev:prod
```

### Building

```bash
# Build for development
npm run build

# Build for staging
npm run build:staging

# Build for production
npm run build:prod
```

### Running

```bash
# Start the application (default)
npm start

# Start with staging configuration
npm run start:staging

# Start with production configuration
npm run start:prod
```

## Feature Flags

The configuration system includes support for feature flags, which can be used to enable/disable features based on the environment. Feature flags can be set using environment variables with the `NEXT_PUBLIC_FEATURE_` prefix.

Example:

```typescript
// In your component
import { config } from '../config';

if (config.features.enableComments) {
  // Render comments section
}
```

## Best Practices

1. Always use the `env` and `config` objects from the configuration system instead of directly accessing `process.env`
2. Group related configuration values under appropriate namespaces
3. Provide sensible defaults for all configuration values
4. Use feature flags for enabling/disabling features in different environments
