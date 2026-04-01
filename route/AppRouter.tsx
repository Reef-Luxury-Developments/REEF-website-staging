import React from "react";
import { Routes, Route } from "react-router-dom";
import ProjectDetails from "../src/pages/project-details";
import Home from "../src/pages/home";
import AboutUs from "../src/pages/aboutus";
import ConatctUs from "../src/pages/contact-us";

import ProjectDetailsAll from "../src/pages/project-details-all";
import MediaCenter from "../src/pages/media-center";
import Faq from "../src/pages/faq";
import Blogs from "../src/pages/blogs";

import ChannelPartne from "../src/pages/channel-partner";
import PrivacyPolicy from "../src/pages/privacy-policy";
import TermsAndConditions from "../src/pages/terms-conditions";
import GTMPageTracker from "../src/components/GTMPageTracker";
import NotFound from "../src/pages/not-found";

const AppRouter = () => {
  return (
    <>
      <GTMPageTracker />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project-details/:id" element={<ProjectDetails />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/conatct-us" element={<ConatctUs />} />
        <Route path="/media-center" element={<MediaCenter />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/media-center/:id" element={<Blogs />} />
        {/* <Route path="/communities" element={<Communities />} /> */}
        {/* <Route path="/communities/:slug" element={<CommunityDetails />} /> */}

        <Route path="/project-all" element={<ProjectDetailsAll />} />
        <Route path="/channel-partner" element={<ChannelPartne />} />

        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default AppRouter;
