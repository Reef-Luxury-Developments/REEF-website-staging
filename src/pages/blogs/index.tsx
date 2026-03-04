// Reusable Skeleton primitive
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded-xl bg-gray-200 ${className}`} />
);

// ==================== Blogs.jsx (with Skeletons) ====================
import React from "react";
import { useTheme } from "../../theme/ThemeProvider";
import Navbar from "../../components/Navbar";
import RegisterSection from "../../components/registerSection";
import LuxuryHeroSection from "./LuxuryHeroSection";
import Tab from "../../components/brand/tab";
import { useLanguage } from "../../i18n/LanguageProvider";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "../../axios";

export default function Blogs() {
  const theme = useTheme();
  const { t } = useLanguage();
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["media-details", id],
    queryFn: async () => {
      const res = await axios.get(`/Website/GetMediaDetails?MediaId=${id}`);
      return res.data;
    },
  });

  const formatISODate = (s?: string) => {
    if (!s) return "";
    const i = s.indexOf("T");
    return i > 0 ? s.slice(0, i) : s;
  };

  // Helper skeletons for the page
  const HeaderSkeleton = () => (
    <section className="mt-24 max-sm:mt-12">
      <div className="ps-14 pe-24 max-sm:px-4">
        <div className="flex flex-col max-sm:gap-4 md:flex-row md:justify-between md:items-start mb-6 md:mb-8">
          <div className="flex gap-24 max-sm:gap-8">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-10 w-2/3 max-sm:w-full" />
        </div>
      </div>
      <div className="w-full px-14 mt-16 max-sm:px-4">
        <Skeleton className="w-full h-[700px] max-sm:h-[570px]" />
      </div>
    </section>
  );

  const ArticleSkeleton = () => (
    <section className="bg-white flex flex-col gap-6 font-sans px-80 max-sm:px-4 mt-24 text-start">
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
    </section>
  );

  return (
    <>
      <Navbar />

      <div className="bg-white">
        {/* Loading state */}
        {isLoading && (
          <>
            <HeaderSkeleton />
            <ArticleSkeleton />
            <LuxuryHeroSection isLoading data={{}} />
            <RegisterSection source="blogs-page" />
            <Tab />
          </>
        )}

        {/* Error state */}
        {isError && !isLoading && (
          <div className="px-14 max-sm:px-4 mt-24">
            <div className="rounded-xl bg-red-50 text-red-700 p-4">
              {t("common.error")}
            </div>
          </div>
        )}

        {/* Loaded state */}
        {!isLoading && !isError && (
          <>
            {/* Featured Blog Post */}
            <section className="mt-24 max-sm:mt-12">
              <div>
                {/* Top Section - Text */}
                <div className="ps-14 pe-24 max-sm:px-4">
                  {/* Left Metadata */}
                  <div className="flex flex-col max-sm:gap-4 md:flex-row md:justify-between md:items-start mb-6 md:mb-8">
                    <div className="flex gap-24 max-sm:gap-8">
                      <div
                        className="text-sm font-medium text-[#0A181A8F] font-sans uppercase tracking-wider mb-1"
                        style={{ letterSpacing: "1.5px" }}
                      >
                        {data?.topic}
                      </div>
                      <div className="text-sm text-[#0A181A8F] font-sans">
                        {formatISODate(data?.publishDate)}
                      </div>
                    </div>

                    {/* Main Title - Right Aligned */}
                    <div className="text-start">
                      <h2 className="text-5xl leading-[48px] uppercase max-sm:text-[32px] max-sm:leading-[32px] font-bodoni max-sm:text-start font-medium text-[#0A181A]">
                        {data?.title}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Bottom Section - Image */}
                <div className="w-full px-14 mt-16 max-sm:px-4">
                  {data?.mediaFileUrl ? (
                    <img
                      src={data?.mediaFileUrl}
                      alt={data?.title ?? "Media"}
                      className="w-full h-[700px] object-cover max-sm:h-[570px] max-sm:object-cover"
                    />
                  ) : (
                    <Skeleton className="w-full h-[700px] max-sm:h-[570px]" />
                  )}
                </div>
              </div>
            </section>

            {/* Article Content Section */}
            <section className="bg-white flex flex-col gap-12 font-sans px-80 max-sm:px-4 mt-24 text-start">
              <div>
                {data?.contentBody ? (
                  <h2 className="text-3xl md:text-3xl font-semibold mb-3 md:mb-2 text-[#0A181A]">
                    {data?.contentBody}
                  </h2>
                ) : (
                  <>
                    <Skeleton className="h-8 w-2/3" />
                    <div className="mt-6 space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </>
                )}
              </div>
            </section>

            <LuxuryHeroSection data={data} isLoading={false} />
            <RegisterSection source="blogs-page" />
            <Tab />
          </>
        )}
      </div>
    </>
  );
}
