"use client";

import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "../../../src/theme/ThemeProvider";
import HoverSection from "../../components/ProjectDetails/hover-section";
import RegisterSection from "../../components/registerSection";
import Tab from "../../components/brand/tab";
import AmenitiesSlider from "../../components/AmenitiesSlider/silder";
import Map from "../../components/MapSection/map";
import StideoPinned from "../../components/stideo/StideoPinned";
import LobbySlider from "../../components/loop-slider/LobbySlider";
import LatestSlider from "../../components/loop-slider/LatestSlider";
import Navbar from "../../components/Navbar";
import { motion } from "framer-motion";
import CoverImage from "../../components/ProjectDetails/cover-imagr";
import { useLanguage } from "../../i18n/LanguageProvider";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "../../axios";
import { trackEvent } from "../../utils/analytics";
import CubeIcon from "../../components/CubeIcon";

// ------------------ Skeleton primitive ------------------
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded-xl bg-gray-200 ${className}`} />
);

const formatHandoverQuarter = (s?: string) => {
  if (!s) return "";
  try {
    const d = new Date(s);
    if (isNaN(d.getTime())) return "";
    const month = d.getUTCMonth() + 1;
    const year = d.getUTCFullYear();
    const quarter = Math.ceil(month / 3);
    return `Q${quarter} ${year}`;
  } catch {
    return "";
  }
};

export default function ProjectDetails() {
  const { t } = useLanguage();
  const theme = useTheme();
  const { id } = useParams();
  const [scrollY, setScrollY] = useState(0);
  const { language, setLanguage } = useLanguage();
  const [vrButtonHover, setVrButtonHover] = useState(false);
  const vrButtonClickedRef = useRef(false);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const enabled = typeof id === "string" && id.trim() !== "";
  const { data, isLoading, isError } = useQuery({
    queryKey: ["project-details", id],
    queryFn: async () => {
      const res = await axios.get(`/Website/GetProjectDetails?ProjectId=${id}`);
      return res.data;
    },
    enabled,
  });
  useEffect(() => {
    if (data) {
      trackEvent("project_page_view", {
        project_id: id,
        project_name: data?.name,
      });
    }
  }, [data]);

  // Track gallery view on first user interaction only
  const galleryInteractedRef = useRef(false);
  const handleGalleryInteraction = () => {
    if (!galleryInteractedRef.current && data && id) {
      galleryInteractedRef.current = true; // Mark as interacted
      trackEvent("gallery_view", {
        project_id: id,
        project_name: data?.name,
      });
    }
  };
  const mapInteractedRef = useRef(false);
  const handleMapClick = () => {
    if (!mapInteractedRef.current && data && id) {
      mapInteractedRef.current = true; // Mark as interacted
      trackEvent("map_click", {
        project_id: id,
        project_name: data?.name,
      });
    }
  };

  // Track amenities view on first user interaction only
  const amenitiesInteractedRef = useRef(false);
  const handleAmenitiesInteraction = () => {
    if (!amenitiesInteractedRef.current && data && id) {
      amenitiesInteractedRef.current = true; // Mark as interacted
      trackEvent("amenities_view", {
        project_id: id,
        project_name: data?.name,
      });
    }
  };
  // console.log(data)
  const headingStyle = {
    fontFamily: "Bodoni Moda, serif",
    fontWeight: 500,
    fontSize: "26px",
    lineHeight: "32px",
    letterSpacing: "0px",
    color: theme.colors.suface,
  } as React.CSSProperties;

  // ------------------ Skeleton sections ------------------
  const HeaderSkeleton = () => (
    <section className="bg-white sm:pt-12 ">
      <div className="w-full">
        {/* Mobile centered title */}
        <div className="flex-1 max-sm:flex hidden flex-col justify-center items-center">
          <Skeleton className="h-14 w-2/3 mb-4" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-4 max-sm:text-center justify-center mx-auto max-sm:grid-cols-2 text-sm uppercase gap-4 mb-12 px-[7rem] max-sm:px-8">
          {[0, 1, 2, 3].map((i) => (
            <div className="mx-auto w-full max-w-[220px]" key={i}>
              <Skeleton className="h-3 w-16 mb-2" />
              <Skeleton className="h-6 w-24" />
            </div>
          ))}
        </div>

        {/* Main content: left text + right image */}
        <div className="relative flex items-start justify-between ps-12 pt-0">
          <div className="flex-1 max-sm:hidden">
            <div className="pt-32 ms-44 max-w-sm space-y-3 mb-8">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-20 w-3/4 ms-20" />
          </div>

          <div className="flex-1 relative">
            <Skeleton className="w-full h-[600px] ms-[20px]" />
          </div>
        </div>
      </div>
    </section>
  );

  const FullWidthBlockSkeleton = ({ height = 360 }) => (
    <div className={`w-full`}>
      <Skeleton className={`w-full h-[${height}px]`} />
    </div>
  );

  const bedroomsLabel = React.useMemo(() => {
    if (!Array.isArray(data?.congregations)) return "";

    // استخرج القيم كأرقام وتخلّص من القيم غير الصالحة
    const counts = data.congregations
      .map((d: any) => Number(d?.countOfRoom))
      .filter((n: number) => Number.isFinite(n));

    // إزالة التكرارات
    const uniqueCounts = Array.from(new Set(counts));

    // ترتيب اختياري (تصاعدي)
    // uniqueCounts.sort((a, b) => a - b);

    // تحويل 0 -> Studio، والباقي يبقى رقم
    const joined = uniqueCounts
      .map((n) => (n === 0 ? t("projectsPage.roomOptions.studio") : String(n)))
      .join("-");

    // إضافة BHK في النهاية إذا في أي قيمة
    return joined || "";
  }, [data?.congregations]);

  // ------------------ Render ------------------
  if (isLoading) {
    return (
      <>
        <Navbar />
        <HeaderSkeleton />
        <FullWidthBlockSkeleton />
        <FullWidthBlockSkeleton height={500} />
        <FullWidthBlockSkeleton />
        <RegisterSection
          source="project-details-page"
          project_name={undefined}
        />
        <Tab />
      </>
    );
  }
  if (isError) {
    return (
      <>
        <Navbar />
        <div className="w-full h-screen flex items-center justify-center text-2xl font-bodoni">
          Could not load project
        </div>
        <RegisterSection
          source="project-details-page"
          project_name={undefined}
        />
        <Tab />
      </>
    );
  }
  return (
    <>
      <section className="flex flex-col w-full md:h-full">
        <Navbar />

        {/* Details */}
        <div className="hidden md:grid gap-y-8 grid-cols-4 px-4 py-12 w-5/6 mx-auto">
          {/* Location */}
          <div className="flex flex-wrap flex-col gap-2 mx-auto text-center md:text-start">
            <p className="font-general text-sm text-[#0A181A]/55">
              {t("ProjectDetails.Location")}
            </p>
            <h2 className="font-bodoni uppercase text-lg md:text-3xl">
              {data?.area}
            </h2>
          </div>

          {/* Handoverdate date */}
          <div className="flex flex-wrap flex-col gap-2 mx-auto text-center md:text-start">
            <p className="font-general text-sm text-[#0A181A]/55">
              {t("ProjectDetails.year")}
            </p>
            <h2 className="font-bodoni uppercase text-lg md:text-3xl">
              {formatHandoverQuarter(data?.handoverDate)}
            </h2>
          </div>

          {/* Bedrooms */}
          <div className="flex flex-wrap flex-col gap-2 mx-auto text-center md:text-start">
            <p className="font-general text-sm text-[#0A181A]/55">
              {t("ProjectDetails.Bedrooms")}
            </p>
            <h2 className="font-bodoni uppercase text-lg md:text-3xl">
              {bedroomsLabel}
              {bedroomsLabel && (
                <span
                  className="text-[#0A181A]/55 text-xs font-general mx-2"
                  dir="ltr"
                >
                  {t("ProjectDetails.BHK")}
                </span>
              )}
            </h2>
          </div>

          {/* No. Residences */}
          <div className="flex flex-wrap flex-col gap-2 mx-auto text-center md:text-start">
            <p className="font-general text-sm text-[#0A181A]/55">
              {t("ProjectDetails.NoResidences")}
            </p>
            <h2 className="font-bodoni uppercase text-lg md:text-3xl">
              {data?.totalUnits}
              <span className="text-[#0A181A]/55 text-xs font-general ms-2">
                {t("ProjectDetails.Unit")}
              </span>
            </h2>
          </div>
        </div>

        {/* Main Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full">
          <div className="flex flex-col py-16 md:ps-8 md:py-8 h-full justify-end justify-between">
            <div className="justify-end pt-20 w-full hidden md:flex">
              <p className="font-general text-md text-[#0A181A]/55 w-80">
                {data?.shortDescription}
              </p>
            </div>
            <div className="sm:p-4">
              <h1 className="uppercase font-bodoni font-medium text-center text-[clamp(2.5rem,9vw,9rem)] leading-[1] text-[#0A181A] md:whitespace-pre-line md:text-start">
                {data?.name}
              </h1>
              <p className="md:hidden font-general text-md text-center text-[#0A181A]/55 p-4">
                {data?.shortDescription}
              </p>
            </div>
          </div>

          {/* Details om Mobile */}
          <div className="grid md:hidden gap-y-8 grid-cols-2 w-full px-4 pb-4">
            {/* Location */}
            <div className="flex flex-wrap flex-col gap-2 mx-auto text-center md:text-start">
              <p className="font-general text-sm text-[#0A181A]/55">
                {t("ProjectDetails.Location")}
              </p>
              <h2 className="font-bodoni uppercase text-lg md:text-3xl">
                {data?.area}
              </h2>
            </div>

            {/* Handoverdate date */}
            <div className="flex flex-wrap flex-col gap-2 mx-auto text-center md:text-start">
              <p className="font-general text-sm text-[#0A181A]/55">
                {t("ProjectDetails.year")}
              </p>
              <h2 className="font-bodoni uppercase text-lg md:text-3xl">
                {formatHandoverQuarter(data?.handoverDate)}
              </h2>
            </div>

            {/* Bedrooms */}
            <div className="flex flex-wrap flex-col gap-2 mx-auto text-center md:text-start">
              <p className="font-general text-sm text-[#0A181A]/55">
                {t("ProjectDetails.Location")}
              </p>
              <h2>
                {bedroomsLabel && (
                  <>
                    <span className="font-bodoni uppercase text-lg md:text-3xl">
                      {bedroomsLabel}
                    </span>
                    <span className="text-[#0A181A]/55 text-xs font-general ms-2">
                      Bedroom
                    </span>
                  </>
                )}
              </h2>
            </div>

            {/* No. Residences */}
            <div className="flex flex-wrap flex-col gap-2 mx-auto text-center md:text-start">
              <p className="font-general text-sm text-[#0A181A]/55">
                {t("ProjectDetails.NoResidences")}
              </p>
              <h2 className="font-bodoni uppercase text-lg md:text-3xl">
                {data?.totalUnits}
                <span className="text-[#0A181A]/55 text-xs font-general ms-2">
                  {t("ProjectDetails.Unit")}
                </span>
              </h2>
            </div>
          </div>

          {/* Image */}
          <div className="flex relative">
            {/* VR Button */}
            {data?.linkVr && (
              <>
                <div
                  onClick={() => {
                    if (!vrButtonClickedRef.current && data?.linkVr) {
                      vrButtonClickedRef.current = true;
                      trackEvent("vr_button_click", {
                        project_name: data?.name,
                      });
                    }
                    window.open(data?.linkVr ? data?.linkVr : "#", "_blank");
                  }}
                  onMouseEnter={() => {
                    setVrButtonHover(true);
                  }}
                  onMouseLeave={() => {
                    setVrButtonHover(false);
                  }}
                  className={`group absolute top-[100%] left-1/2 md:left-0 translate-x-[-50%] translate-y-[-50%] bg-[#40C2CC]/30 rounded-full flex items-center justify-center size-[7.5rem] aspect-square ring-2 ring-white/10 shadow-[0_8px_0px_0_rgba(0,0,0,0)] hover:shadow-[0_21px_25px_0_#19A8B2] hover:ring-white/50  ${
                    vrButtonHover
                      ? "cursor-pointer backdrop-blur-[10px]"
                      : "backdrop-blur-[4px]"
                  } transition-all duration-500 ease-out `}
                >
                  <div
                    className={`absolute inset-0 flex items-center justify-center ${
                      vrButtonHover ? "opacity-0" : "opacity-100"
                    } transition-all duration-500 ease-out delay-500 group-hover:delay-0  `}
                  >
                    <CubeIcon
                      size={50}
                      interactive={true}
                      color="#ffffff"
                      accentColor="#ffffff"
                    />
                  </div>
                  <div
                    className={`${
                      vrButtonHover ? "w-full" : "w-0"
                    } transition-all duration-500 ease-out delay-0 group-hover:delay-150  overflow-hidden text-center`}
                  >
                    <span className="text-white text-sm font-general whitespace-nowrap">
                      Open VR
                    </span>
                  </div>
                </div>
              </>
            )}
            <img
              className={`h-auto w-full object-contain object-bottom ${
                language === "ar" ? "scale-x-[-1]" : ""
              }`}
              src={data?.imageUrl}
              alt={String(t("ProjectDetails.Reef"))}
            />
          </div>
        </div>
      </section>
      <section>
        <HoverSection index={1} data={data} />
        <AmenitiesSlider
          data={data?.amenities}
          isLoading={isLoading}
          amenitiesDescription={data.amenitiesDescription}
          onClick={handleAmenitiesInteraction}
        />
        <div onClick={() => handleMapClick()}>
          <Map data={data} />
        </div>
        <StideoPinned
          data={data?.congregations}
          isLoading={isLoading}
          onClick={handleGalleryInteraction}
        />
        <LobbySlider data={data?.galleryUrls} isLoading={isLoading} />
        <LatestSlider data={data} isLoading={isLoading} />
        <RegisterSection
          source="project-details-page"
          project_name={data?.name}
        />
        <Tab />
      </section>
    </>
  );
}
