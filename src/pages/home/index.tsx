import React from "react";
import HeroSection from "../../components/HeroSection";
import Frame from "../../components/Frame";
import Container from "../../components/container";
import LatestProject from "../../components/LatestProject";
import Destination from "../../components/Destination";
import RegisterSection from "../../components/registerSection";
import ImageBlock from "../../components/ImageBlock";
import Brand from "../../components/brand/brand";
import Navbar from "../../components/Navbar";

export default function Home() {
  return (
    <>
      <HeroSection />
      <div className="z-0 max-sm:h-full  ">
        <Container />
        <LatestProject />
        <Destination />
        <RegisterSection source="home-page" />
        <ImageBlock />
        <Brand />
      </div>
    </>
  );
}
