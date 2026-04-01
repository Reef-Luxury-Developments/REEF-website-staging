import React, { lazy, Suspense } from "react";
import HeroSection from "../../components/HeroSection";
import Container from "../../components/container";

const LatestProject = lazy(() => import("../../components/LatestProject"));
const ProjectsSlider = lazy(() => import("../../components/projectsSlider"));
const RegisterSection = lazy(() => import("../../components/registerSection"));
const ImageBlock = lazy(() => import("../../components/ImageBlock"));
const Brand = lazy(() => import("../../components/brand/brand"));

function SectionFallback() {
  return <div className="min-h-24 w-full" aria-hidden />;
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <div className="z-0 max-sm:h-full  ">
        <Container />
        <Suspense fallback={<SectionFallback />}>
          <LatestProject />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <ProjectsSlider />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <RegisterSection source="home-page" />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <ImageBlock />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Brand />
        </Suspense>
      </div>
    </>
  );
}
