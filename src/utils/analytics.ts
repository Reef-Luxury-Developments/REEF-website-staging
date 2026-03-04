// src/utils/analytics.ts

// 1. Extend the Window interface to recognize dataLayer
declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}

// 2. Generic Event Tracker
export const trackEvent = (
  eventName: string,
  params: Record<string, any> = {}
) => {
  if (typeof window !== "undefined" && window.dataLayer) {
    const eventData = {
      event: eventName,
      ...params,
    };
    window.dataLayer.push(eventData);

    // Debug logging (remove in production if needed)
    if (import.meta.env.DEV) {
      console.log("📊 GTM Event pushed:", eventData);
    }
  } else {
    console.warn("GTM dataLayer not found");
  }
};

// 3. Page View Tracker (Specific for SPA transitions)
export const trackPageView = (url: string) => {
  trackEvent("page_view", {
    page_path: url,
  });
};
