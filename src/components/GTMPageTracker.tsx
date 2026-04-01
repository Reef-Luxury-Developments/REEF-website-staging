import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView, trackEvent } from "../utils/analytics";

const MILESTONES = [50, 75, 90] as const;

const GTMPageTracker = () => {
  const location = useLocation();
  const milestonesRef = useRef<Record<(typeof MILESTONES)[number], boolean>>({
    50: false,
    75: false,
    90: false,
  });

  useEffect(() => {
    trackPageView(location.pathname + location.search);
    milestonesRef.current = { 50: false, 75: false, 90: false };
  }, [location]);

  useEffect(() => {
    let rafId = 0;
    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const scrollTop = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;

        if (docHeight <= 0) return;

        const scrollPercent = (scrollTop / docHeight) * 100;
        const m = milestonesRef.current;

        for (const milestone of MILESTONES) {
          if (scrollPercent >= milestone && !m[milestone]) {
            trackEvent("scroll", { percent_scrolled: milestone });
            m[milestone] = true;
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return null;
};

export default GTMPageTracker;
