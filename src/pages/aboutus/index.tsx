import React from "react";
import Navbar from "../../components/Navbar";
import RegisterSection from "../../components/registerSection";
import { useLanguage } from "../../i18n/LanguageProvider";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "../../axios";
import Tab from "../../components/brand/tab";

export default function AboutUs() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { data: aboutData, isLoading: aboutLoading } = useQuery({
    queryKey: ["about-us", "journal"],
    queryFn: async () => {
      const res = await axios.get("/Website/GetAboutUs");
      return res.data;
    },
  });

  const items: any[] = Array.isArray(aboutData) ? aboutData : [];
  const formatISODate = (s?: string) => {
    if (!s) return "";
    const i = s.indexOf("T");
    return i > 0 ? s.slice(0, i) : s;
  };
  return (
    <>
      {/* Hero section */}
      <section className="flex flex-col w-full md:h-full">
        <Navbar />
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 max-sm:flex-col justify-end w-full">
          <div className="flex flex-col py-16 md:ps-8 md:py-8 h-full justify-end justify-between">
            <div className="justify-end pt-20 w-full hidden md:flex">
              <p className="font-general text-md text-[#0A181A]/55 w-80">
                {t("about.Toptext")}
              </p>
            </div>
            <div className="sm:p-4">
              <h1 className="uppercase font-bodoni font-medium text-center text-[clamp(2.5rem,9vw,9rem)] leading-[1] text-[#0A181A] md:whitespace-pre-line md:text-start">
                {t("about.OurStory")}
              </h1>
              <p className="md:hidden font-general text-md text-center text-[#0A181A]/55 p-4">
                {t("about.Toptext")}
              </p>
            </div>
          </div>
          <img
            src={`https://${import.meta.env.VITE_BUCKET_NAME}.s3.${import.meta.env.VITE_BUCKET_REGION}.amazonaws.com/image/website/about_us.png`}
            alt="About REEF"
          />
        </div>
      </section>

      {/* About Description Section */}
      <section className="flex flex-col gap-4 w-full mx-auto py-16 px-4 md:w-5/6 md:flex-row md:justify-between md:py-32 md:px-0">
        <div className="flex-1 ">
          <h1 className="font-general text-[#0A181A] text-3xl font-medium whitespace-pre-line">
            {t("about.RightimagetextH1")}
          </h1>
        </div>

        <div className="w-full md:w-2/3">
          <p className="font-general text-lg text-[#0A181A]/55 whitespace-pre-line">
            {t("about.RightimagetextP1")}
          </p>
        </div>
      </section>

      {/* Founder Section */}
      <section className="flex flex-col items-center gap-8 px-4 py-12 w-full mx-auto md:w-3/5  md:px-0 md:py-24">
        <img
          src={`https://${import.meta.env.VITE_BUCKET_NAME}.s3.${import.meta.env.VITE_BUCKET_REGION}.amazonaws.com/image/website/founder_profile_image.jpg`}
          alt="Samer Al Nasser Ambar"
          className="w-[250px] h-[250px] md:w-[300px] md:h-[400px] object-cover rounded-full"
        />

        <blockquote className="font-bodoni text-[#0A181A] text-[clamp(2.5rem,3vw,3rem)] leading-[1.1] text-center">
          {t("about.blockquote")}
        </blockquote>

        <div className="flex items-center justify-center gap-2 text-md font-general text-[#40c2cc] italic">
          <span> {t("about.ceo")}</span>
          <span className="h-px w-16 bg-[#40c2cc] md:w-24"></span>
          <span> {t("about.name")}</span>
        </div>
      </section>

      {/* Mission & Vesion */}
      <section className="flex flex-col w-full gap-12 md:w-5/6 mx-auto px-4 py-12 md:px-0 md:py-24 md:gap-16">
        {/* Header with Title and Button */}
        <div className="flex flex-col md:flex-row gap-8 md:items-center">
          <div className="flex-1">
            <h2 className="uppercase font-bodoni text-[clamp(3rem,5vw,5rem)] text-[#0A181A] leading-[1] text-start w-full">
              {t("about.MissionVisionTitle")}
            </h2>
          </div>
          <div className="hidden md:block">
            <button
              className="bg-[#40C2CC] text-white hover:bg-[#30AEB8] hover:border-[#30AEB8] rounded-full px-4 py-2 font-medium text-md font-general h-fit text-nowrap"
              onClick={() => {
                navigate("/conatct-us");
              }}
            >
              {t("about.ContactUs")}
            </button>
          </div>
        </div>

        {/* Content Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Mission */}
          <div>
            <h3 className="text-sm uppercase font-general text-[#40C2CC] tracking-wider mb-2">
              {t("about.mission")}
            </h3>

            <p className="font-general text-lg text-[#0A181A]/55 pt-6 border-t border-[#0A181A]/15">
              {t("about.MissionVisionText")}
            </p>
          </div>

          {/* Vision */}
          <div>
            <h3 className="text-sm uppercase font-general text-[#40C2CC] tracking-wider mb-2">
              {t("about.vision")}
            </h3>

            <p className="font-general text-lg text-[#0A181A]/55 pt-6 border-t border-[#0A181A]/15">
              {t("about.visionText")}
            </p>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="flex flex-col w-full gap-12 md:w-5/6 mx-auto px-4 py-12 md:px-0 md:py-24 md:gap-16">
        {/* Header with Title and Button */}
        <div className="flex flex-col md:flex-row gap-8 md:items-center">
          <div className="flex-1">
            <h2 className="uppercase font-bodoni text-[clamp(3rem,5vw,5rem)] text-[#0A181A] leading-[1] text-start w-full">
              {t("about.PRIORITYPILLARS")}
            </h2>
          </div>
          <div className="hidden md:block">
            <button
              className="bg-[#40C2CC] text-white hover:bg-[#30AEB8] hover:border-[#30AEB8] rounded-full px-4 py-2 font-medium text-md font-general h-fit text-nowrap"
              onClick={() => {
                navigate("/conatct-us");
              }}
            >
              {t("about.ContactUs")}
            </button>
          </div>
        </div>

        {/* Pillars List */}
        <div>
          {[
            {
              number: t("about.PillarsList[0].number"),
              title: t("about.PillarsList[0].title"),
              description: t("about.PillarsList[0].description"),
            },
            {
              number: t("about.PillarsList[1].number"),
              title: t("about.PillarsList[1].title"),
              description: t("about.PillarsList[1].description"),
            },
            {
              number: t("about.PillarsList[2].number"),
              title: t("about.PillarsList[2].title"),
              description: t("about.PillarsList[2].description"),
            },
            {
              number: t("about.PillarsList[3].number"),
              title: t("about.PillarsList[3].title"),
              description: t("about.PillarsList[3].description"),
            },
          ].map((pillar, index) => (
            <div
              key={index}
              className={` flex flex-col md:flex-row items-start justify-start pb-8 mb-8 border-b border-[#0A181A]/15 ${
                pillar.number === "04" && "border-none"
              }`}
            >
              {/* Left Content / Number + Title */}
              <div className="flex flex-1 items-center gap-4 md:gap-12 mb-2 ">
                <span className="text-lg font-general text-[#40C2CC] font-medium">
                  {pillar.number}
                </span>
                <h3 className="text-lg font-general font-medium">
                  {pillar.title}
                </h3>
              </div>

              {/* Content */}
              <div className="flex-1 pe-4">
                <p className="font-general text-lg text-[#0A181A]/55">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <RegisterSection />
      <Tab />
    </>
  );
}
