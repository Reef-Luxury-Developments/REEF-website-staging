import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { SupportedLanguage } from "./LanguageProvider";

/** True when the URL is under the Arabic locale prefix. */
export function pathIndicatesArabic(pathname: string): boolean {
  return pathname === "/ar" || pathname.startsWith("/ar/");
}

export function localeFromPathname(pathname: string): SupportedLanguage {
  return pathIndicatesArabic(pathname) ? "ar" : "en";
}

/** Map a locale-agnostic path (e.g. `/aboutus`, `/`) to the correct URL for the current route locale. */
export function toLocalizedPath(currentPathname: string, path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (!pathIndicatesArabic(currentPathname)) return normalized;
  if (normalized === "/") return "/ar";
  return `/ar${normalized}`;
}

/** Same logical page, other locale (for the language toggle). */
export function toggleLocalePath(pathname: string): string {
  if (pathname === "/ar" || pathname.startsWith("/ar/")) {
    if (pathname === "/ar") return "/";
    return pathname.slice("/ar".length) || "/";
  }
  if (pathname === "/") return "/ar";
  return `/ar${pathname}`;
}

export function useLocalizedPath() {
  const { pathname } = useLocation();
  return useMemo(
    () => ({
      pathname,
      to: (path: string) => toLocalizedPath(pathname, path),
      isArabicRoute: pathIndicatesArabic(pathname),
    }),
    [pathname],
  );
}
