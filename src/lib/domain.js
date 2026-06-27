/**
 * Domain detection — tells the app whether to render SOFN or MatcHvac.
 * In demo/preview mode (no VITE_API_URL), defaults to SOFN.
 * In live mode, only shows SOFN on sofn.io domain.
 */

export function isSofnDomain() {
  if (typeof window === 'undefined') return false
  const host = window.location.hostname

  // Live mode: respect the actual domain
  if (import.meta.env.VITE_API_URL) {
    return host === 'sofn.io' || host.endsWith('.sofn.io')
  }

  // Demo/preview mode: show SOFN by default
  return true
}