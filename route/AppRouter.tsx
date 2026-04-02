import React, { lazy, Suspense, useLayoutEffect } from "react";
import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import GTMPageTracker from "../src/components/GTMPageTracker";
import { useLanguage } from "../src/i18n/LanguageProvider";
import { localeFromPathname } from "../src/i18n/localePath";
import axios from "../src/axios";
import { useQueryClient } from "@tanstack/react-query";
import CommunityDetails from "../src/pages/community-details";

const Home = lazy(() => import("../src/pages/home"));
const ProjectDetails = lazy(() => import("../src/pages/project-details"));
const AboutUs = lazy(() => import("../src/pages/aboutus"));
const ConatctUs = lazy(() => import("../src/pages/contact-us"));
const ProjectDetailsAll = lazy(
  () => import("../src/pages/project-details-all"),
);
const MediaCenter = lazy(() => import("../src/pages/media-center"));
const Faq = lazy(() => import("../src/pages/faq"));
const Blogs = lazy(() => import("../src/pages/blogs"));
const ChannelPartne = lazy(() => import("../src/pages/channel-partner"));
const PrivacyPolicy = lazy(() => import("../src/pages/privacy-policy"));
const TermsAndConditions = lazy(() => import("../src/pages/terms-conditions"));
const NotFound = lazy(() => import("../src/pages/not-found"));
const Communities = lazy(() => import("../src/pages/communities"));

function RouteFallback() {
  return <div className="min-h-[30vh] w-full" aria-hidden />;
}

/** Syncs language, API headers, and queries from the URL before descendants paint. */
function RouteLocaleGate() {
  const { pathname } = useLocation();
  const { setLanguage } = useLanguage();
  const queryClient = useQueryClient();
  const locale = localeFromPathname(pathname);

  useLayoutEffect(() => {
    setLanguage(locale);
    (axios.defaults.headers as any)["accept-language"] = locale;
    localStorage.setItem("lang", locale);
  }, [locale, setLanguage]);

  useLayoutEffect(() => {
    queryClient.invalidateQueries({ predicate: () => true });
    queryClient.refetchQueries({ type: "active" });
  }, [locale, queryClient]);

  return <Outlet />;
}

const AppRouter = () => {
  return (
    <>
      <GTMPageTracker />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<RouteLocaleGate />}>
            <Route path="/" element={<Home />} />
            <Route path="/project-details/:id" element={<ProjectDetails />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/communities" element={<Communities />} />
            <Route path="/communities/:slug" element={<CommunityDetails />} />
            <Route path="/conatct-us" element={<ConatctUs />} />
            <Route path="/media-center" element={<MediaCenter />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/media-center/:id" element={<Blogs />} />
            <Route path="/project-all" element={<ProjectDetailsAll />} />
            <Route path="/channel-partner" element={<ChannelPartne />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route
              path="/terms-and-conditions"
              element={<TermsAndConditions />}
            />
          </Route>

          <Route path="/ar" element={<RouteLocaleGate />}>
            <Route index element={<Home />} />
            <Route path="project-details/:id" element={<ProjectDetails />} />
            <Route path="aboutus" element={<AboutUs />} />
            <Route path="communities" element={<Communities />} />
            <Route path="communities/:slug" element={<CommunityDetails />} />
            <Route path="conatct-us" element={<ConatctUs />} />
            <Route path="media-center" element={<MediaCenter />} />
            <Route path="faq" element={<Faq />} />
            <Route path="media-center/:id" element={<Blogs />} />
            <Route path="project-all" element={<ProjectDetailsAll />} />
            <Route path="channel-partner" element={<ChannelPartne />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route
              path="terms-and-conditions"
              element={<TermsAndConditions />}
            />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default AppRouter;
