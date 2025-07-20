/**
 * Application Configuration
 *
 * This is the main configuration entry point for the application.
 * It exports the environment-specific configuration based on the current environment.
 */

import { env, config } from '../env';

export { env, config };

// Default export for backward compatibility
export default config;
