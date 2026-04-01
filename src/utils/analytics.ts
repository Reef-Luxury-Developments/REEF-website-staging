// src/utils/analytics.ts

// 1. Extend the Window interface to recognize dataLayer
declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}

function ensureDataLayer() {
  if (typeof window === "undefined") return false;
  window.dataLayer = window.dataLayer || [];
  return true;
}

// 2. Generic Event Tracker
export const trackEvent = (
  eventName: string,
  params: Record<string, any> = {},
) => {
  if (!ensureDataLayer()) return;
  const eventData = {
    event: eventName,
    ...params,
  };
  window.dataLayer.push(eventData);

  if (import.meta.env.DEV) {
    console.log("📊 GTM Event pushed:", eventData);
  }
};

// 3. Page View Tracker (Specific for SPA transitions)
export const trackPageView = (url: string) => {
  trackEvent("page_view", {
    page_path: url,
  });
};
