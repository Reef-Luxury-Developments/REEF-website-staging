# Plan: Fix staging Lighthouse issues (PSI lab report)

**Context:** Desktop lab run on [PageSpeed for staging](https://pagespeed.web.dev/analysis/https-reef-website-staging-vercel-app/3gygpli0fk?form_factor=desktop) (via Playwright capture) showed **Performance ~41**, **CLS 0.448**, **TBT ~700 ms**, **~9 MB network**, plus the audits listed below. CrUX **“No Data”** on `*.vercel.app` is expected until there is enough traffic; this plan targets **lab** audits that also improve production.

---

## Priority A — CLS 0.448 (“Layout shift culprits”, “Image elements do not have explicit width and height”)

**Goal:** Reserve space for media and stop late layout jumps.

1. **Intro GIF** ([`src/layout/main-layout.tsx`](../src/layout/main-layout.tsx)): set explicit **`width` / `height`** (or fixed `aspect-ratio` + `min-height`) on the intro `<img>` so the overlay does not shift when the GIF decodes. Keep `alt` meaningful or `alt=""` if decorative.
2. **CDN / content images**: audit `<img>` usage (e.g. [`src/components/ImageBlock.tsx`](../src/components/ImageBlock.tsx), [`src/components/LatestProject.tsx`](../src/components/LatestProject.tsx), [`src/components/loop-slider/LobbySlider.tsx`](../src/components/loop-slider/LobbySlider.tsx), [`src/pages/aboutus/index.tsx`](../src/pages/aboutus/index.tsx), blog/project heroes). Add **`width` and `height`** (or `width`/`height` in CSS with **`aspect-ratio`** on a wrapper) matching real aspect ratios; keep `object-cover` where needed.
3. **Hero video** ([`src/components/HeroSection.tsx`](../src/components/HeroSection.tsx)): ensure the video container has **stable dimensions** (already full-bleed; verify no late-inserted siblings push layout). Consider reducing delayed **opacity/transform** on the LCP layer if it correlates with shifts in trace.
4. **Web fonts**: Google Fonts already use `display=swap`; if CLS is font-swap related, tighten **fallback `size-adjust`** / stack in CSS ([`src/index.css`](../src/index.css)) or subset/self-host fewer weights.

---

## Priority B — Image delivery (~1,653 KiB) and payload (~9,024 KiB)

**Goal:** Smaller bytes without ruining quality.

1. **CDN pipeline:** serve **WebP/AVIF** (with JPEG/PNG fallback if needed), responsive **`srcset` + `sizes`** for large marketing and project images; avoid shipping full-resolution images to mobile.
2. **Hero poster + video:** re-encode MP4 (lower bitrate, fast start); ensure poster matches first frame and is **compressed**.
3. **Static assets on Vite build:** confirm large images in `public/` are optimized or moved behind CDN with caching.

---

## Priority C — Cache lifetimes (~2,114 KiB lab estimate)

**Goal:** Repeat visits hit disk/edge cache.

1. **Vercel:** add/adjust [`vercel.json`](https://vercel.com/docs/concepts/projects/project-configuration) **`headers`** for `immutable` long-cache on `/assets/*` (hashed files) and sensible TTL for `index.html` (short or `no-cache` for HTML).
2. **Media CDN** (`VITE_BUCKET_CDN_URL`): set **`Cache-Control`** on objects (e.g. long max-age + immutable for versioned paths).
3. **Third-party** (fonts, maps tiles): only partially controllable; prefer self-hosted fonts if Google Fonts dominate cache warnings.

---

## Priority D — JavaScript: execution ~1.7 s, unused ~804 KiB, main-thread work ~2.4 s, TBT ~700 ms

**Goal:** Less parse/compile and fewer long tasks.

1. **Further code-splitting:** lazy-load heavy routes/sections not already split (Swiper, GSAP, Framer-heavy components, large modals). Prefer **dynamic `import()`** for below-fold or interaction-only features.
2. **`build.target` / browserslist:** in [`vite.config.ts`](../vite.config.ts), set a **modern** `build.target` (and project `browserslist`) to reduce **legacy polyfills** (addresses “Legacy JavaScript ~35 KiB”).
3. **Bundle analysis:** run `vite-bundle-visualizer` (or similar) once; trim or replace the largest dependencies where possible.
4. **Third parties:** keep GTM deferred ([`src/App.tsx`](../src/App.tsx)); audit GTM container tags for extra scripts on staging.

---

## Priority E — Render-blocking (~100 ms) and font display (~20 ms)

1. **`index.html`:** keep **`preconnect`** before stylesheets (already ordered). Optional: **self-host** Bodoni/Readex subsets to remove render-blocking Google CSS request.
2. **Subset fonts** to used weights/axes only (variable Bodoni is heavy if only a few styles are used).

---

## Priority F — Diagnostics polish

1. **Non-composited animations:** find elements Lighthouse flags; prefer **`transform`/`opacity`** only for animations.
2. **Accessibility (95 → higher):** fix **contrast** and **heading order** on flagged pages; add **`<track kind="captions">`** (can be empty or descriptive) for marketing `<video>` if required by audit, or document decorative exemption.
3. **Best practices:** reproduce **console errors** on staging, fix source; review **CSP/COOP** when security headers are in scope.

---

## Verification

1. Re-run **Playwright** script [`scripts/pagespeed-playwright.mjs`](../scripts/pagespeed-playwright.mjs) after deploy, or PSI manually for **mobile + desktop**.
2. Use **Chrome Performance** recording on first load and scroll to correlate **CLS** and **long tasks** with components.
3. Compare **production** domain separately (CrUX + lab).

---

## Suggested order of work

1. CLS: dimensions + intro GIF + above-the-fold images.  
2. Image formats / srcset on CDN and hero.  
3. Caching headers (Vercel + bucket).  
4. JS splitting + `build.target` + bundle review.  
5. Fonts and remaining audits.
