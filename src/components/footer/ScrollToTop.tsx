import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

function scrollWindowToTop() {
  // Direct assignment bypasses CSS `scroll-behavior: smooth` on `body`.
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}

/** Focus often remains on the clicked footer `NavLink`; browsers scroll it into view after paint. */
function blurIfFocusInSiteFooter() {
  const el = document.activeElement;
  if (!(el instanceof HTMLElement)) return;
  const footer = document.getElementById("site-footer");
  if (footer?.contains(el)) {
    el.blur();
  }
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
    blurIfFocusInSiteFooter();
    scrollWindowToTop();
  }, [pathname]);

  useEffect(() => {
    let cancelled = false;
    const run = () => {
      if (cancelled) return;
      blurIfFocusInSiteFooter();
      scrollWindowToTop();
    };

    run();
    const raf = window.requestAnimationFrame(run);
    const t0 = window.setTimeout(run, 0);
    // Lazy route chunks often paint after the first frame; focus scroll can run late.
    const t1 = window.setTimeout(run, 120);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf);
      window.clearTimeout(t0);
      window.clearTimeout(t1);
    };
  }, [pathname]);

  return null;
}
