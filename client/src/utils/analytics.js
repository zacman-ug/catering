export function trackEvent(name, detail = {}) {
  if (!name || typeof name !== 'string') return;
  const payload = { name, detail, at: new Date().toISOString() };
  window.dispatchEvent(new CustomEvent('chef-godwin-analytics', { detail: payload }));
  if (import.meta.env.DEV) {
    console.debug('[analytics]', payload);
  }
}
