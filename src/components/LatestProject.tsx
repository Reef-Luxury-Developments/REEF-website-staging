import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "../theme/ThemeProvider";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "../axios";
import RegisterInterestModalDemo from "../pages/RegisterInterestModalDemo";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { HiArrowLongLeft, HiArrowLongRight } from "react-icons/hi2";
import { sortProjectsByName } from "../utils/projectSorting";

const defaultImages = [
  "/assets/Project-Image.png",
  "/assets/slider.jpg",
  "/assets/Card.png",
  "/assets/stideo.jpg",
  "/assets/slider.jpg",
  "/assets/02.jpg",
];

export default function LatestProject() {
  const theme = useTheme();
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  type HomeProject = {
    id: string;
    projectName: string;
    handoverDate: string;
    area: string;
    coverImageUrl: string;
  };

  const { data: projects, isLoading } = useQuery({
    queryKey: ["home-page-projects"],
    queryFn: async () => {
      const res = await axios.get("/Website/GetHomePage");
      return res.data as HomeProject[];
    },
  });

  // Sort projects by number in project name (ascending), keep items without numbers in original order
  const sortedProjects = useMemo(() => {
    const arr: HomeProject[] = Array.isArray(projects) ? projects : [];
    return sortProjectsByName(arr, (item) => item.projectName || "");
  }, [projects]);

  const images = (sortedProjects && sortedProjects.length > 0)
    ? sortedProjects.map((p) => p.coverImageUrl)
    : defaultImages;

  const formatHandoverQuarter = (iso?: string) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return "";
      const month = d.getUTCMonth() + 1;
      const year = d.getUTCFullYear();
      const quarter = Math.ceil(month / 3);
      return `Q${quarter} ${year}`;
    } catch {
      return "";
    }
  };

  // === Mobile detection ===
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const set = () => setIsMobile(window.innerWidth < 640);
    set();
    window.addEventListener("resize", set, { passive: true });
    return () => window.removeEventListener("resize", set);
  }, []);

  // === Desktop-only states/logic ===
  const [scrollY, setScrollY] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [prevImageIndex, setPrevImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const totalImages = images.length;
  const triggerZoom =
    typeof window !== "undefined" ? window.innerHeight / 1.2 : 50;
  // console.log(triggerZoom)

  useEffect(() => {
    if (isMobile) return; // لا سكrol على الموبايل
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrolled = window.innerHeight - rect.top;
      setScrollY(Math.max(0, scrolled));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  const zoomProgress = isMobile ? 1 : scrollY >= triggerZoom ? 1 : 0;
  const scale = isMobile ? 1 : 1 + zoomProgress * 0.8;
  const showImages = true;

  // Disable wheel-based image navigation per request

  const goPrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentImageIndex((prev) => Math.max(0, prev - 1));
  };

  const goNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentImageIndex((prev) => Math.min(Math.max(totalImages - 1, 0), prev + 1));
  };

  const isFirst = currentImageIndex <= 0;
  const isLast = currentImageIndex >= Math.max(totalImages - 1, 0);

  // === Mobile layout (no sticky/absolute) ===
  if (isMobile) {
    return (
      <section className="flex flex-col mt-12">

        {/* Header row: title + button */}
        <div className="flex justify-between px-4">

          <h2
            className="uppercase font-bodoni text-[clamp(3rem,6vw,6rem)] text-[#0A181A] text-center leading-[1.2]"
          >{t("latestproject.text")}
          </h2>

          {/* <Link
            to="/project-all"
            className="font-sans font-medium bg-white border border-[#0A181A33] rounded-full px-6 py-3 text-[#0A181A] text-md text-nowrap h-fit"
          >
            {t("about.exploreAll")}
          </Link> */}
        </div>
        <div className="flex flex-col gap-12 w-full my-12">
          {/* Project Card /00*/}
          <div className="w-full"
            onClick={() => {
              const id = sortedProjects?.[0]?.id;
              if (id) navigate(`/project-details/${id}`);
            }}
          >
            {/* Project Image */}
            <div className="mx-auto w-full h-auto">
              <img
                src={images[0]}
                alt="Project Image"
                className="w-autos h-auto object-cover"
              />
            </div>

            {/*  Project Content */}
            <div className="px-4 py-6">
              <h3
                className="uppercase text-4xl mb-4"
                style={{
                  color: "#0A181A",
                  fontFamily: "Bodoni Moda",
                  fontWeight: 500,
                }}
              >
                {sortedProjects?.[0]?.projectName || t("ProjectDetails.Reef")}
              </h3>

              <div className="flex gap-10 font-sans mt-1">
                <div className="flex flex-col gap-1">
                  <p className="uppercase text-[#0A181A80] text-xs ">{t("projects.card.handover")}</p>
                  <p className="font-medium text-[#0A181A] text-lg">{formatHandoverQuarter(sortedProjects?.[0]?.handoverDate) || t("latestproject.date")}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="uppercase text-[#0A181A80] text-xs ">{t("ProjectDetails.Location")}</p>
                  <p className="font-medium text-[#0A181A] text-lg">{sortedProjects?.[0]?.area || t("distination.alfurjan")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Project Card /01*/}
          <div className="w-full"
            onClick={() => {
              const id = sortedProjects?.[1]?.id;
              if (id) navigate(`/project-details/${id}`);
            }}
          >
            {/* Project Image */}
            <div className="mx-auto w-full h-auto">
              <img
                src={images[1]}
                alt="Project Image"
                className="w-autos h-auto object-cover"
              />
            </div>

            {/*  Project Content */}
            <div className="px-4 py-6">
              <h3
                className="uppercase text-4xl mb-4"
                style={{
                  color: "#0A181A",
                  fontFamily: "Bodoni Moda",
                  fontWeight: 500,
                }}
              >
                {sortedProjects?.[1]?.projectName || t("ProjectDetails.Reef")}
              </h3>

              <div className="flex gap-10 font-sans mt-1">
                <div className="flex flex-col gap-1">
                  <p className="uppercase text-[#0A181A80] text-xs ">{t("projects.card.handover")}</p>
                  <p className="font-medium text-[#0A181A] text-lg">{formatHandoverQuarter(sortedProjects?.[1]?.handoverDate) || t("latestproject.date")}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="uppercase text-[#0A181A80] text-xs ">{t("ProjectDetails.Location")}</p>
                  <p className="font-medium text-[#0A181A] text-lg">{sortedProjects?.[1]?.area || t("distination.alfurjan")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Project Card /02*/}
          <div className="w-full"
            onClick={() => {
              const id = sortedProjects?.[2]?.id;
              if (id) navigate(`/project-details/${id}`);
            }}
          >
            {/* Project Image */}
            <div className="mx-auto w-full h-auto">
              <img
                src={images[2]}
                alt="Project Image"
                className="w-autos h-auto object-cover"
              />
            </div>

            {/*  Project Content */}
            <div className="px-4 py-6">
              <h3
                className="uppercase text-4xl mb-4"
                style={{
                  color: "#0A181A",
                  fontFamily: "Bodoni Moda",
                  fontWeight: 500,
                }}
              >
                {sortedProjects?.[2]?.projectName || t("ProjectDetails.Reef")}
              </h3>

              <div className="flex gap-10 font-sans mt-1">
                <div className="flex flex-col gap-1">
                  <p className="uppercase text-[#0A181A80] text-xs ">{t("projects.card.handover")}</p>
                  <p className="font-medium text-[#0A181A] text-lg">{formatHandoverQuarter(sortedProjects?.[2]?.handoverDate) || t("latestproject.date")}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="uppercase text-[#0A181A80] text-xs ">{t("ProjectDetails.Location")}</p>
                  <p className="font-medium text-[#0A181A] text-lg">{sortedProjects?.[2]?.area || t("distination.alfurjan")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // === Desktop / tablet original experience ===
  return (
    <div
      ref={sectionRef}
      className="flex flex-col justify-between w-full h-screen bg-center"
      style={{
        backgroundSize: "cover",
        backgroundImage: `
    linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.6) 0%,
      rgba(0, 0, 0, 0.2) 30%,
      rgba(0, 0, 0, 0.2) 70%,
      rgba(0, 0, 0, 0.6) 100%
    ),
    url(${images[currentImageIndex]})
  `,
      }}
      role="button"
      tabIndex={0}
      onClick={() => {
        const id = sortedProjects?.[currentImageIndex]?.id;
        if (id) navigate(`/project-details/${id}`);
      }}
    >

      {/* Top Info Row */}
      <div className="flex justify-between items-center p-16">
        <div className="flex gap-16">

          <h3 className="text-4xl font-bodoni text-white">
            {(sortedProjects && sortedProjects[currentImageIndex]?.projectName) || t("ProjectDetails.Reef")}
          </h3>
          <div className="flex gap-10 font-sans mt-1">
            <div className="flex flex-col gap-1">
              <p className="uppercase text-white/60 text-xs ">{t("latestproject.Handover")}</p>
              <p className="text-white text-lg">{(sortedProjects && formatHandoverQuarter(sortedProjects[currentImageIndex]?.handoverDate)) || "Sep 2026"}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="uppercase text-white/60 text-xs ">{t("ProjectDetails.Location")}</p>
              <p className="text-white text-lg">{(sortedProjects && sortedProjects[currentImageIndex]?.area) || "Al Furjan"}</p>
            </div>
          </div>
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <RegisterInterestModalDemo />
        </div>
      </div>

      {/* Bottom Progress + Explore */}
      <div className="flex justify-between items-center p-16 text-white font-sans ">

        <div className="flex items-center gap-4">
          <span>{`0${currentImageIndex + 1}`}</span>
          <span className="h-[2px] w-[15rem] bg-white/40 rounded-full">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{
                width: `${((currentImageIndex + 1) / totalImages) * 100
                  }%`,
              }}
            />
          </span>
          <span>{`0${totalImages}`}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            aria-label="Previous project"
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            disabled={isFirst}
            className={`text-3xl rounded-full transform rtl:rotate-180 text-white flex items-center justify-center ${isFirst ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            <HiArrowLongLeft />
          </button>
          <button
            aria-label="Next project"
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            disabled={isLast}
            className={`text-3xl  transform rtl:rotate-180 rounded-full text-white flex items-center justify-center ${isLast ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            <HiArrowLongRight />
          </button>
        </div>
      </div>
    </div>
  );
}
function usetranslation(): { t: any } {
  throw new Error("Function not implemented.");
}
