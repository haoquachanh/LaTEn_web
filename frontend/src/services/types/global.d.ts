/**
 * Global window interfaces for authentication
 */
declare global {
  interface Window {
    __tokenExpiryTimer?: ReturnType<typeof setTimeout>;
  }
}
