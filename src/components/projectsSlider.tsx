import React, { useEffect, useState, useMemo } from "react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { useQuery } from "@tanstack/react-query";
import axios from "../axios";
import ProjectCard from "./ProjectCard";
import { useLanguage } from "../i18n/LanguageProvider";
import { sortProjectsByName } from "../utils/projectSorting";

const SlideNextButton = () => {
  const swiper = useSwiper();

  return (
    <button
      onClick={() => swiper.slideNext()}
      aria-label="Next project"
      className="text-3xl  transform rtl:rotate-180 rounded-full text-black flex items-center justify-center "
    >
      <svg
        stroke="currentColor"
        fill="currentColor"
        stroke-width="0"
        viewBox="0 0 24 24"
        aria-hidden="true"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M16.72 7.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 1 1-1.06-1.06l2.47-2.47H3a.75.75 0 0 1 0-1.5h16.19l-2.47-2.47a.75.75 0 0 1 0-1.06Z"
          clip-rule="evenodd"
        ></path>
      </svg>
    </button>
  );
};

// Custom Previous Button Component using useSwiper hook
const SlidePrevButton = () => {
  const swiper = useSwiper();

  return (
    <button
      onClick={() => swiper.slidePrev()}
      aria-label="Previous project"
      className="text-3xl  transform rtl:rotate-180 rounded-full text-black flex items-center justify-center "
    >
      <svg
        stroke="currentColor"
        fill="currentColor"
        stroke-width="0"
        viewBox="0 0 24 24"
        aria-hidden="true"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M7.28 7.72a.75.75 0 0 1 0 1.06l-2.47 2.47H21a.75.75 0 0 1 0 1.5H4.81l2.47 2.47a.75.75 0 1 1-1.06 1.06l-3.75-3.75a.75.75 0 0 1 0-1.06l3.75-3.75a.75.75 0 0 1 1.06 0Z"
          clip-rule="evenodd"
        ></path>
      </svg>
    </button>
  );
};

// Custom Progress Indicator Component using useSwiper hook
const SlideIndicator = ({
  totalSlides,
  className,
}: {
  totalSlides: number;
  className?: string;
}) => {
  const swiper = useSwiper();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Update index when slide changes
    const updateIndex = () => {
      setCurrentIndex(swiper.realIndex);
    };

    // Set initial index
    updateIndex();

    // Listen to slide change events
    swiper.on("slideChange", updateIndex);

    // Cleanup
    return () => {
      swiper.off("slideChange", updateIndex);
    };
  }, [swiper]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="min-w-[20px] text-[16px]">
        {String(currentIndex + 1).padStart(2, "0")}
      </span>
      <div className="w-full bg-[#dadddd] h-0.5 relative overflow-hidden">
        <div
          className="h-full bg-black transition-all duration-300"
          style={{
            width: `${((currentIndex + 1) / totalSlides) * 100}%`,
          }}
        ></div>
      </div>
      <span className="min-w-[20px] text-[16px]">
        {String(totalSlides).padStart(2, "0")}
      </span>
    </div>
  );
};

// Helper function to format handover date to quarter
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

const ProjectsSlider = () => {
  const { t, dir } = useLanguage();

  const { data: projectsRes, isLoading: projectsLoading } = useQuery({
    queryKey: ["website-projects"],
    queryFn: async () => {
      const res = await axios.get("/Website/GetWebsiteProjects");
      return res.data;
    },
  });

  // Transform API data to match ProjectCard props
  const projects = useMemo(() => {
    const arr: any[] = Array.isArray(projectsRes) ? projectsRes : [];

    // Sort projects by name first
    const sortedItems = sortProjectsByName(arr, (item) => item.name || "");

    // Then transform to match ProjectCard props
    return sortedItems.map((item) => ({
      image: item.coverImageUrl,
      id: item.id,
      name: item.name,
      countOfRooms: item.countOfRooms,
      congregationContent: item.congregationContent,
      location: item.area,
      type:
        Array.isArray(item.countOfRooms) && item.countOfRooms.length
          ? `${item.countOfRooms.join(", ")} Bedrooms`
          : "",
      handover: formatHandoverQuarter(item.handoverDate),
    }));
  }, [projectsRes]);

  // Show loading skeleton
  if (projectsLoading) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-full">
              <div className="w-full h-[340px] bg-[#0A181A0D]/10 animate-pulse rounded" />
              <div className="py-4 space-y-2">
                <div className="flex items-center mb-4 gap-2">
                  <span className="h-4 w-20 bg-[#0A181A0D]/10 animate-pulse rounded" />
                  <span className="flex-1 h-[1px] bg-[#0A181A33]/20" />
                  <span className="h-4 w-24 bg-[#0A181A0D]/10 animate-pulse rounded" />
                </div>
                <div className="h-6 w-3/4 bg-[#0A181A0D]/10 animate-pulse rounded" />
                <div className="h-4 w-1/2 bg-[#0A181A0D]/10 animate-pulse rounded" />
                <div className="h-4 w-2/3 bg-[#0A181A0D]/10 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show message if no projects
  if (!projects || projects.length === 0) {
    return (
      <div className="w-full text-center py-12">
        <p className="text-gray-500 font-general">No projects available</p>
      </div>
    );
  }

  return (
    <section className="relative w-full pb-6 pt-12 md:pb-12  md:pt-24 bg-white overflow-hidden">
      <div className="px-8 w-full md:w-11/12 mx-auto">
        <div className="flex flex-col md:flex-row gap-8 mb-12 md:mb-16">
          <div className="md:w-2/3">
            <h2 className="font-bodoni font-medium text-[clamp(2rem,5vw,5rem)] leading-[1.16] text-black uppercase">
              {t("home.projectsSlider.title", {
                defaultValue: "Our Projects",
              })}
            </h2>
          </div>
        </div>
        <Swiper
          key={dir}
          dir={dir}
          slidesPerView={3.2}
          spaceBetween={20}
          grabCursor={true}
          loop={projects.length > 3}
          autoplay={{
            delay: 5000,
            pauseOnMouseEnter: true,
            disableOnInteraction: false,
            reverseDirection: dir === "rtl",
          }}
          breakpoints={{
            320: {
              slidesPerView: 1.2,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 2.2,
              spaceBetween: 15,
            },
            // 1024: {
            //   slidesPerView: 3.2,
            //   spaceBetween: 20,
            // },
            1400: {
              slidesPerView: 3.2,
              spaceBetween: 20,
            },
          }}
          modules={[Pagination, Autoplay]}
          className="w-full overflow-visible"
        >
          {projects.map((project) => (
            <SwiperSlide key={project.id}>
              <ProjectCard project={project} />
            </SwiperSlide>
          ))}

          {/* Custom Progress Indicator and Navigation Buttons */}
          <div className="flex justify-between items-center mt-4">
            <SlideIndicator
              className="w-full md:w-[20rem] font-general"
              totalSlides={projects.length}
            />
            <div className="hidden lg:flex items-center gap-2">
              <SlidePrevButton />
              <SlideNextButton />
            </div>
          </div>
        </Swiper>
      </div>
    </section>
  );
};

export default ProjectsSlider;
