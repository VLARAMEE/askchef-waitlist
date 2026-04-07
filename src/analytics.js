const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

export const analyticsEnabled = Boolean(measurementId);

export function trackEvent(eventName, params = {}) {
  // GA4 is optional in local/dev builds, so this safely no-ops if unset.
  if (!analyticsEnabled || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", eventName, params);
}
