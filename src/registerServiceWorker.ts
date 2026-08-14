export function registerServiceWorker(): void {
  if (!('serviceWorker' in navigator) || import.meta.env.DEV) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(error => {
      // Offline support is best-effort and must not prevent the workspace booting.
      console.warn('Service worker registration failed:', error);
    });
  });
}
