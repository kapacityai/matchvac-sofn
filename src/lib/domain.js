/**
 * Domain detection — tells the app whether to render SOFN or MatcHvac
 */

export function isSofnDomain() {
  if (typeof window === 'undefined') return false
  const host = window.location.hostname
  return host === 'sofn.io' || host.endsWith('.sofn.io')
}