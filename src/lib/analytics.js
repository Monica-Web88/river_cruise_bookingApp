/**
 * Tiny, provider-agnostic analytics shim.
 * Pushes to `window.dataLayer` (GTM / GA4 compatible) so a real provider can be dropped in
 * with no component changes. In development it also logs to the console.
 */
export function track(event, props = {}) {
  if (typeof window === 'undefined') return;
  try {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({ event, ...props });
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.debug('[analytics]', event, props);
    }
  } catch {
    /* analytics must never break the UI */
  }
}
