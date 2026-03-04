import React, { useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import { IoChevronDown, IoMapOutline, IoSearch } from "react-icons/io5";
import { PiBed, PiHouseThin } from "react-icons/pi";
import { LuGrid2X2 } from "react-icons/lu";
import { CiLocationOn } from "react-icons/ci";
import { GoPlus } from "react-icons/go";
import { FiMinus } from "react-icons/fi";
import RegisterSection from "../../components/registerSection";
import LatestSlider from "../../components/loop-slider/LatestSlider";
import Tab from "../../components/brand/tab";
import { useLanguage } from "../../i18n/LanguageProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "../../axios";
import { Link, useNavigate } from "react-router-dom";
import { MdApartment } from "react-icons/md";
import { trackEvent } from "../../utils/analytics";

// Helper to format handover date to Qx YYYY
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

const Index = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const [selectedType, setSelectedType] = useState<number | undefined>(
    undefined
  );
  const unitTypes = [
    { name: "Apartment", value: 0 },
    { name: "Villa", value: 1 },
    { name: "Townhouse", value: 2 },
  ];
  const [selectedRoom, setSelectedRoom] = useState<number | undefined>(
    undefined
  );
  const roomOptions = [
    { name: "Studio", value: 1 },
    { name: "OneRoom", value: 2 },
    { name: "TwoRooms", value: 3 },
    { name: "ThreeRooms", value: 4 },
    { name: "FourRooms", value: 5 },
  ];
  const [selectedSort, setSelectedSort] = useState<number | undefined>(
    undefined
  );
  const sortOptions = [
    { name: "Nearest Handover", value: 0 },
    { name: "Farthest Handover", value: 1 },
    { name: "Newest", value: 2 },
    { name: "Oldest", value: 3 },
  ];
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useLanguage();

  const getUnitTypeLabel = (value: number) => {
    if (value === 0) return t("projectsPage.filters.apartment");
    if (value === 1) return t("projectsPage.filters.villa");
    return t("projectsPage.filters.townhouse");
  };

  const getRoomLabel = (value?: number) => {
    switch (value) {
      case 1:
        return t("projectsPage.roomOptions.studio");
      case 2:
        return t("projectsPage.roomOptions.oneRoom");
      case 3:
        return t("projectsPage.roomOptions.twoRooms");
      case 4:
        return t("projectsPage.roomOptions.threeRooms");
      case 5:
        return t("projectsPage.roomOptions.fourRooms");
      default:
        return t("ProjectDetails.Bedrooms");
    }
  };

  const getSortLabel = (value?: number) => {
    switch (value) {
      case 0:
        return t("projectsPage.sort.farthestHandover");
      case 1:
        return t("projectsPage.sort.nearestHandover");
      case 2:
        return t("projectsPage.sort.newest");
      case 3:
        return t("projectsPage.sort.oldest");
      default:
        return t("projectsPage.relevance");
    }
  };

  // جلب قائمة المشاريع من API
  const { data: projectsRes, isLoading: projectsLoading } = useQuery({
    queryKey: [
      "website-projects",
      selectedType,
      selectedRoom,
      selectedSort,
      searchQuery,
    ],
    queryFn: async () => {
      const params: any = {};
      if (selectedType !== undefined) params.type = selectedType;
      if (selectedRoom !== undefined) {
        params.CountOfRoom = selectedRoom;
      }
      if (selectedSort !== undefined) params.SortBy = selectedSort;
      if (searchQuery.trim()) params.Query = searchQuery.trim();
      const res = await axios.get("/Website/GetWebsiteProjects", { params });
      return res.data;
    },
  });

  const projects = useMemo(() => {
    const arr: any[] = Array.isArray(projectsRes) ? projectsRes : [];
    return arr.map((item) => ({
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

  // جلب FAQs الخاصة بالمشاريع من API الجديد
  const {
    data: faqRes,
    isLoading: faqsLoading,
    isFetching: faqsFetching,
    isError: faqsError,
  } = useQuery({
    queryKey: ["project-faqs"],
    queryFn: async () => {
      const res = await axios.get("/Website/GetProjectFAQ");
      return res.data;
    },
  });

  const faqsData: any[] = Array.isArray(faqRes) ? faqRes : [];
  const faqs = useMemo(
    () =>
      faqsData.map((item: any) => ({
        title: Array.isArray(item?.questions)
          ? item.questions[0]
          : item?.questions || "",
        content: item?.answer || "",
      })),
    [faqsData]
  );

  return (
    <>
      <Navbar />

      {/* Hero Section / Title + Description */}
      <section className="flex flex-col gap-4 text-center my-[4rem] px-[1rem] md:gap-8 md:mb-[6rem] md:mt-[8rem]">
        <h1
          className={`"uppercase font-bodoni text-[clamp(2.5rem,6vw,6rem)] leading-[1.05] text-[rgb(10,24,26,1)]"
              }`}
          style={{ fontWeight: 500, hangingPunctuation: "first" }}
        >
          {t("projectsPage.title1")} <br /> {t("projectsPage.title2")}
        </h1>

        <p className="font-general px-2 text-[#0A181A8F]/55 text-lg">
          {t("projectsPage.description")}
        </p>
      </section>

      {/* Tool Bar */}
      <section className="flex flex-col gap-3 px-4 pb-4 w-full md:flex-row md:px-8 md:py-6">
        {/* Search */}
        <div className="relative font-general">
          <input
            type="text"
            placeholder={String(t("projectsPage.searchPlaceholder"))}
            className="px-4 ps-7 py-2 rounded-full border border-[#0A181A]/10 text-sm placeholder:text-[#0A181A]/40  focus:outline-none focus:ring-2 focus:ring-[#40C2CC40] focus:border-[#40C2CC] w-full"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            onBlur={() =>
              trackEvent("search_performed", { search_term: searchQuery })
            }
          />
          <IoSearch className="absolute top-3 start-2 text-[#0A181A]/20" />
        </div>

        {/* Sorting + Filtering */}
        <div className="flex justify-between w-full gap-3 rounded-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden">
          {/* Filter */}
          <div className="flex gap-1">
            {/* Projects Types */}
            <div className="flex gap-1">
              {[
                { name: "Apartment", value: 0 },
                { name: "Villa", value: 1 },
                { name: "Townhouse", value: 2 },
              ].map((ut) => {
                const isActive = selectedType === ut.value;
                return (
                  <button
                    key={ut.value}
                    onClick={() => {
                      setSelectedType(isActive ? undefined : ut.value);
                      trackEvent("fliter_performed", {
                        filter_value: getUnitTypeLabel(ut.value),
                      });
                    }}
                    className={`"gap-1 items-center border rounded-full px-3 py-2 text-sm font-general h-fit text-nowrap
                        ${
                          isActive
                            ? "border-[#40C2CC] bg-[#40C2CC] text-white hover:bg-[#30AEB8] hover:border-[#30AEB8]"
                            : "border-[#0A181A]/10 text-[#0A181A]/80 hover:bg-[#0A181A]/5"
                        }`}
                  >
                    {getUnitTypeLabel(ut.value)}
                  </button>
                );
              })}
            </div>

            {/* Bedrooms */}
            <div className="relative flex items-center gap-2 border border-[#0A181A]/10 rounded-full px-3 py-2  h-fit w-fit text-nowrap text-sm  font-general">
              <span className="text-[#0A181A]/80">
                {getRoomLabel(selectedRoom)}
              </span>
              <IoChevronDown className="text-[#0A181A]/30" />

              <select
                className="absolute inset-0 opacity-0 cursor-pointer"
                value={selectedRoom !== undefined ? String(selectedRoom) : ""}
                onChange={(e) => {
                  const v = e.target.value;
                  setSelectedRoom(v === "" ? undefined : Number(v));
                }}
              >
                <option value="">{t("common.all")}</option>
                {roomOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {getRoomLabel(opt.value)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2 text-sm font-general text-nowrap">
            {/* Label */}
            <span className="text-[#0A181A]/50">
              {t("projectsPage.sortBy")}
            </span>

            {/* Select */}
            <div className="relative flex items-center gap-2 py-2 h-fit w-fit">
              <span className="text-[#0A181A]/80">
                {getSortLabel(selectedSort)}
              </span>
              <IoChevronDown className="text-[#0A181A]/30" />

              <select
                className="absolute inset-0 opacity-0 cursor-pointer"
                value={selectedSort !== undefined ? String(selectedSort) : ""}
                onChange={(e) => {
                  const v = e.target.value;
                  setSelectedSort(v === "" ? undefined : Number(v));
                }}
              >
                <option value="">{t("common.all")}</option>
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {getSortLabel(opt.value)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <>
        {/* <div className="flex gap-2 text-lg px-2 py-1 items-center border text-[#0A181A8F]/50 border-[#0A181A33]/20 rounded-[50px]">
            <div className="bg-[#0A181A0A]/5 p-2 rounded-full">
              <LuGrid2X2 />
            </div>
            <span className="bg-[#0A181A33]/20 w-[1px] h-5"></span>
            <div className="p-1">
              <IoMapOutline />
            </div>
          </div> */}

        {/* <div className="max-sm:ms-[20px] w-fit gap-2 max-sm:flex text-lg px-2 py-1 items-center border text-[#0A181A8F]/50 border-[#0A181A3]/20 rounded-[50px]">
            <div className="bg-[#0A181A0A]/5 p-2 rounded-full">
              <LuGrid2X2 />
            </div>
            <span className="bg-[#0A181A33]/20 w-[1px] h-5"></span>
            <div className="p-1">
              <IoMapOutline />
            </div>
          </div> */}
      </>

      {/* Projects Cards Wrapper */}
      <section className="grid grid-cols-1 gap-4 px-4 mb-24 md:mb-64 md:grid-cols-2 lg:grid-cols-3 md:px-8">
        {!projectsLoading &&
          projects.map((project, idx) => (
            <ProjectCard key={idx} project={project} />
          ))}

        <>
          {/* {projectsLoading && (
          <>
            {Array.from({ length: 6 }).map((_, i) => (

              <div key={i} className="bg-white relative overflow-hidden">
                <div className="w-full h-[340px] bg-[#0A181A0D]/10 animate-pulse rounded" />
                <div className="py-4 space-y-2 font-sans">
                  
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
          </>
        )} */}
        </>
      </section>

      <>
        {/* زر تحميل المزيد */}
        {/* <div className="flex items-center font-sans px-8 max-sm:px-2">
        <span className="bg-[#0A181A33]/20 flex-1 h-[1px]"></span>
        <button className="text-[#0A181A] max-sm:mx-2 border border-[#0A181A]/20 rounded-[50px] px-6 py-3 mx-8">
          {t("projectsPage.loadMore")}
        </button>
        <span className="bg-[#0A181A33]/20 flex-1 h-[1px]"></span>
      </div> */}
      </>

      {/* General FAQs */}
      <div className="flex flex-col gap-12 items-start w-full px-4 mx-auto my-24 md:my-32 md:flex-row md:justify-between md:w-5/6">
        {/* Left Section */}
        <div className="flex flex-col  gap-4 md:gap-8 justify-start w-full md:pe-16">
          <h2 className="uppercase font-bodoni  text-[clamp(3rem,5vw,5rem)] text-[rgb(10,24,26,1)] leading-[1] text-start w-full">
            {t("faqSection.heading")}
          </h2>

          <p className="font-general text-md md:text-lg text-start text-black/55 w-full pe-4">
            {t("faqSection.subheading")}
          </p>
          <div className="flex w-full justify-start">
            <Link
              to="/conatct-us"
              className="font-general text-lg text-[#40C2CC] font-medium hover:underline hover:text-[#30AEB8]"
            >
              {t("faqSection.contact")}
            </Link>
          </div>
        </div>

        {/* List Of FAQs */}
        <div className="flex flex-col justify-center w-full gap-8">
          {!faqsError &&
            faqs.map((faq, index) => (
              <div
                key={index}
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              >
                {/* Header */}
                <div className="flex justify-between md:items-center md:items-center cursor-pointer gap-8">
                  <h3
                    className="
                  font-general text-[#0A181A] text-2xl font-medium
                  transition-all duration-800 hover:text-[#40C2CC] hover:translate-x-3
                "
                  >
                    {faq.title}
                  </h3>
                  <div className="text-2xl text-[#0A181A]/30 mt-2 md:mt-0">
                    {openIndex === index ? <FiMinus /> : <GoPlus />}
                  </div>
                </div>

                {openIndex === index && faq.content && (
                  <p className="font-general text-[#0A181A]/55 text-md pt-4 pe-8 md:text-lg md:pt-4 md:pe-12">
                    {faq.content}
                  </p>
                )}
              </div>
            ))}
          {!faqsError &&
            !(faqsLoading || faqsFetching) &&
            faqs.length === 0 && (
              <div className="py-6 text-[#0A181A]/60">No FAQs available.</div>
            )}

          <>
            {/* {(projectsLoading) && (
            <>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="py-6 font-sans">
                  <div className="flex justify-between items-center gap-4">
                    <div className="h-7 w-2/3 bg-[#0A181A0D]/10 rounded animate-pulse" />
                    <div className="h-8 w-8 bg-[#0A181A0D]/10 rounded-full animate-pulse" />
                  </div>
                  <div className="mt-4 h-4 w-full bg-[#0A181A0D]/10 rounded animate-pulse" />
                  <div className="mt-2 h-4 w-11/12 bg-[#0A181A0D]/10 rounded animate-pulse" />
                </div>
              ))}
            </>
          )} */}
          </>
        </div>
      </div>

      <Tab />
      <RegisterSection source="all-projects-page" />
    </>
  );
};

export default Index;

// -------- ProjectCard --------
const ProjectCard = ({ project }: any) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  // console.log(project)

  return (
    <div
      className="cursor-pointer group"
      onClick={() => {
        navigate(`/project-details/${project.id}`);
        trackEvent("project_click", {
          project_name: project.name,
          project_id: project.id,
        });
      }}
    >
      {/* Image Section */}
      <div className="relative overflow-hidden">
        {/* Image */}
        <img
          src={project.image}
          alt={project.name}
          className="w-full object-cover"
        />
        {/* Hover Overlay */}
        <div
          className="
          flex justify-center items-center
          absolute bottom-0 left-0 w-full h-full 
          bg-[#40C2CC]
          group-hover:translate-y-0
          translate-y-full
          transition-transform duration-1000 ease-in-out z-10"
        >
          <span className="text-white font-bodoni uppercase text-[clamp(2rem,2vw,3rem)]">
            {t("projects.viewProject")}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col gap-2 py-4">
        {/* Handover Date */}
        <div className="flex items-center gap-4 font-general text-sm text-[#0A181A]/50 uppercase">
          <span>{t("projects.card.handover")}</span>
          <span className="bg-[#0A181A]/15 h-[1px] flex-1"></span>
          <span>{project.handover}</span>
        </div>

        {/* Project Name */}
        <h3 className="font-bodoni uppercase text-[clamp(2rem,2vw,3rem)] text-[#0A181A]">
          {project.name}
        </h3>

        {/* Details */}
        <div className="flex flex-col gap-1 font-general tex-sm">
          {/* Location */}
          <div className="flex gap-2 items-start md:items-center">
            <CiLocationOn className="text-[#0A181A]/50 mt-1 md:mt-0" />
            <span className="text-[#0A181A]/55">{project.location}</span>
          </div>

          {/* Configration */}
          <div className="flex gap-2 items-start md:items-center">
            <PiBed className="fill-[#0A181A]/30 mt-1 md:mt-0" />
            <div className="flex gap-0 md:gap-1 text-[#0A181A]/55 flex-wrap">
              {Array.isArray(project.congregationContent) &&
              project.congregationContent.length > 0
                ? project.congregationContent.map(
                    (text: string, i: number, arr: string[]) => (
                      <div key={i}>
                        {text}
                        {i % 2 === 0 && i !== arr.length - 1 ? "," : ""}
                      </div>
                    )
                  )
                : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
