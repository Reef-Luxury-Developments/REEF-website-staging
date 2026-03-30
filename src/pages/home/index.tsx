import React from "react";
import HeroSection from "../../components/HeroSection";
import Container from "../../components/container";
import LatestProject from "../../components/LatestProject";
import RegisterSection from "../../components/registerSection";
import ImageBlock from "../../components/ImageBlock";
import Brand from "../../components/brand/brand";
import ProjectsSlider from "../../components/projectsSlider";

export default function Home() {
  return (
    <>
      <HeroSection />
      <div className="z-0 max-sm:h-full  ">
        <Container />
        <LatestProject />
        {/* <Destination /> */}
        <ProjectsSlider />
        <RegisterSection source="home-page" />
        <ImageBlock />
        <Brand />
      </div>
    </>
  );
}
