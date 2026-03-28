import React, { useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import { FiMinus } from "react-icons/fi";
import { GoPlus } from "react-icons/go";
import { IoIosSearch } from "react-icons/io";
import RegisterSection from "../../components/registerSection";
import { useLanguage } from "../../i18n/LanguageProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "../../axios";
import { Link } from "react-router-dom";
import Tab from "../../components/brand/tab";

export default function FaqComponent() {
  // Initialize translation hook
  const { t } = useLanguage();

  // State to manage which FAQ is open
  const [openIndex, setOpenIndex] = useState(-1);
  const [activeGroupIndex, setActiveGroupIndex] = useState(0); // default to first group

  // Fetch FAQs
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      const res = await axios.get("/Website/GetFAQs");
      return res.data;
    },
  });

  // Normalize data
  const groups = Array.isArray(data) ? data : [];

  // Index for General Inquiry group
  const generalInquiryIndex = useMemo(() => {
    try {
      return groups.findIndex(
        (g: any) =>
          String(g?.groupName || "").toLowerCase() === "general inquiry"
      );
    } catch {
      return -1;
    }
  }, [groups]);

  const showSkeleton =
    (isLoading || isFetching) && activeGroupIndex === generalInquiryIndex;

  // Build list based on selected group
  const visibleFaqs = useMemo(() => {
    try {
      if (activeGroupIndex === -1) {
        // Flatten all group FAQs
        return groups.flatMap((g: any) =>
          (g?.faq || []).map((item: any) => ({
            title: Array.isArray(item?.questions)
              ? item.questions[0]
              : item?.questions || "",
            content: item?.answer || "",
          }))
        );
      }
      const group = groups[activeGroupIndex];
      if (!group) return [];
      return (group.faq || []).map((item: any) => ({
        title: Array.isArray(item?.questions)
          ? item.questions[0]
          : item?.questions || "",
        content: item?.answer || "",
      }));
    } catch {
      return [];
    }
  }, [groups, activeGroupIndex]);

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col gap-4 text-center my-[4rem] px-[1rem] md:gap-8 md:mb-[6rem] md:mt-[8rem]">
        <h1 className="font-bodoni font-medium text-[clamp(2.5rem,6vw,6rem)] leading-[1.05] text-[rgb(10,24,26,1)] uppercase whitespace-pre-line">
          {t("faq.Q")}
        </h1>
        <p className="font-general px-2 text-[#0A181A8F]/55 text-lg">
          {t("faq.Qtitle")}
          <Link
            to="/conatct-us"
            className="font-general text-lg text-[#40C2CC] font-medium hover:underline hover:text-[#30AEB8]"
          >
            {t("faqSection.contact")}
          </Link>
        </p>
      </section>

      {/* FAQ Category Tabs */}
      <div
        className="flex gap-1 px-4 mb-12 w-full mx-auto md:w-5/6
        rounded-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        onWheel={(e) => {
          if (window.innerWidth <= 640) {
            e.currentTarget.scrollLeft += e.deltaY;
          }
        }}
      >
        {!isLoading &&
          !isError &&
          groups.map((g: any, i: number) => (
            <span
              key={g?.groupId || i}
              onClick={() => {
                setActiveGroupIndex(i);
                setOpenIndex(-1);
              }}
              className={`"gap-1 items-center border rounded-full px-3 py-2 text-sm font-general h-fit text-nowrap
                        ${
                          activeGroupIndex === i
                            ? "border-[#40C2CC] bg-[#40C2CC] text-white hover:bg-[#30AEB8] hover:border-[#30AEB8]"
                            : "border-[#0A181A]/10 text-[#0A181A]/80 hover:bg-[#0A181A]/5"
                        }`}
            >
              {g?.groupName || `Group ${i + 1}`}
            </span>
          ))}
      </div>

      {/* FAQ List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-8 px-4 pb-4 w-full mx-auto md:w-5/6 md:py-6">
        {!isError &&
          visibleFaqs.map((faq: any, idx: number) => (
            <div
              key={idx}
              onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
            >
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
                  {openIndex === idx ? <FiMinus /> : <GoPlus />}
                </div>
              </div>
              {openIndex === idx && faq.content && (
                <p className="font-general text-[#0A181A]/55 text-md pt-4 pe-8 md:text-lg md:pt-4 md:pe-12">
                  {faq.content}
                </p>
              )}
            </div>
          ))}

        <>
          {/* {showSkeleton && (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="py-6 font-sans">
                <div className="flex justify-between items-center">
                  <div className="h-7 w-2/3 bg-[#0A181A0D]/10 rounded animate-pulse" />
                  <div className="h-8 w-8 bg-[#0A181A0D]/10 rounded-full animate-pulse" />
                </div>
                <div className="mt-4 h-4 w-full bg-[#0A181A0D]/10 rounded animate-pulse" />
                <div className="mt-2 h-4 w-11/12 bg-[#0A181A0D]/10 rounded animate-pulse" />
              </div>
            ))}
          </>
        )}
        {isError && (
          <div className="py-6 text-[#0A181A]/60">Failed to load FAQs.</div>
        )} */}
        </>
        {!isError && !isLoading && visibleFaqs.length === 0 && (
          <div className="py-6 text-[#0A181A]/60">
            {t("faq.noResults") || "No FAQs available."}
          </div>
        )}
      </div>

      <RegisterSection source="faq-page" />
      <Tab />
    </div>
  );
}
