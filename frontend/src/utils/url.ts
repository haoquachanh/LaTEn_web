/**
 * URL utility functions for handling API endpoints
 */

/**
 * Builds a proper API URL by combining baseUrl with the endpoint path
 * @param baseUrl The base URL of the API
 * @param path The endpoint path to append
 * @returns The complete API URL
 */
export function buildApiUrl(baseUrl: string | undefined, path: string): string {
  if (!baseUrl) {
    return path;
  }

  // Remove trailing slash from baseUrl if present
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

  // Remove leading slash from path if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  return `${cleanBaseUrl}/${cleanPath}`;
}

/**
 * Ensures that a URL is valid, falling back to a default URL if not
 * @param url The URL to validate
 * @param fallbackUrl The fallback URL to use if the provided URL is invalid
 * @returns A valid URL
 */
export function ensureValidUrl(url: string, fallbackUrl: string): string {
  if (!url || !isValidUrl(url)) {
    console.warn(`Invalid URL: ${url}, falling back to ${fallbackUrl}`);
    return fallbackUrl;
  }
  return url;
}

/**
 * Checks if a string is a valid URL
 * @param url The URL string to validate
 * @returns Boolean indicating if the URL is valid
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}
