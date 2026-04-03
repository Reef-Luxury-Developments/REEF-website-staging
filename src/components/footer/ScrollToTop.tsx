import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

function scrollWindowToTop() {
  // Skip CSS `scroll-behavior: smooth` on body so route changes don't animate
  // from the footer (races lazy-loaded pages and focus scroll-into-view).
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof window === "undefined" || !("scrollRestoration" in window.history)) {
      return;
    }
    window.history.scrollRestoration = "manual";
  }, []);

  useLayoutEffect(() => {
    scrollWindowToTop();
    // Focus often stays on the clicked footer link; browsers may scroll it into
    // view on the next frame — run again after paint to keep the top visible.
    const id = window.requestAnimationFrame(() => {
      scrollWindowToTop();
    });
    return () => window.cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
