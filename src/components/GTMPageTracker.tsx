import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView, trackEvent } from "../utils/analytics";

const GTMPageTracker = () => {
  const location = useLocation();
  const [milestones, setMilestones] = useState<{ [key: number]: boolean }>({
    50: false,
    75: false,
    90: false,
  });

  // 1. Track Page Views
  useEffect(() => {
    trackPageView(location.pathname + location.search);

    // Reset scroll milestones when the page changes
    setMilestones({ 50: false, 75: false, 90: false });
  }, [location]);

  // 2. Track Scroll Depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      // Safety check for short pages
      if (docHeight <= 0) return;

      const scrollPercent = (scrollTop / docHeight) * 100;

      ([50, 75, 90] as const).forEach((milestone) => {
        if (scrollPercent >= milestone && !milestones[milestone]) {
          // Fire event to GTM
          trackEvent("scroll", { percent_scrolled: milestone });
          // Mark as fired so it doesn't fire again on this page
          setMilestones((prev) => ({ ...prev, [milestone]: true }));
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [milestones]);

  return null;
};

export default GTMPageTracker;
