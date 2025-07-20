/**
 * Global Type Definitions
 *
 * This file contains globally available TypeScript definitions.
 */

// Global window object extensions
declare global {
  interface Window {
    // Runtime config object
    LATEN_CONFIG?: Record<string, any>;
  }
}

export {};
