import React, { useMemo } from "react";
import { useTheme } from "../../theme/ThemeProvider";
import Navbar from "../../components/Navbar";
import { MdArrowOutward } from "react-icons/md";
import RegisterSection from "../../components/registerSection";
import { CiCalendar } from "react-icons/ci";
import { useLanguage } from "../../i18n/LanguageProvider";
import { useLocalizedPath } from "../../i18n/localePath";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "../../axios";
import { Link, useNavigate } from "react-router-dom";

export default function MediaCenter() {
  const theme = useTheme();
  const { t } = useLanguage();
  const { to: localizedTo } = useLocalizedPath();
  const navigateArticle = useNavigate();
  const PAGE_SIZE = 6;
  const {
    data,
    isLoading,
    isError,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["media"],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axios.get("/Website/GetMedia", {
        params: { PageNumber: pageParam, PageSize: 6 },
      });
      return res.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const len = Array.isArray(lastPage?.data) ? lastPage.data.length : 0;
      return len === PAGE_SIZE ? allPages.length + 1 : undefined;
    },
  });

  const items: any[] = useMemo(() => {
    const pages = Array.isArray(data?.pages) ? data?.pages : [];
    const arr = pages.flatMap((p: any) =>
      Array.isArray(p?.data) ? p.data : []
    );
    return arr;
  }, [data]);

  const formatDate = (d?: string) => {
    if (!d) return "";
    try {
      const date = new Date(d);
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    } catch {
      return d;
    }
  };

  const renderSkeletonGrid = (count = 6) => (
    <section className="bg-white px-48 pt-8 max-sm:px-4">
      <div className="mx-auto">
        <div className="grid grid-cols-2 max-sm:grid-cols-1 max-sm:gap-4 gap-8">
          {Array.from({ length: count }).map((_, idx) => (
            <div key={idx} className="group">
              <div className="mb-4 overflow-hidden">
                <div className="w-full h-[400px] bg-[#0A181A0D]/10 rounded animate-pulse" />
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="h-3 w-16 bg-[#0A181A0D]/10 rounded animate-pulse" />
                <div className=" bg-[#0A181A8F]/20 mx-2 h-[1px] w-full flex-1"></div>
                <span className="h-3 w-20 bg-[#0A181A0D]/10 rounded animate-pulse" />
              </div>
              <div className="h-6 w-3/4 bg-[#0A181A0D]/10 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
  const renderArticles = () => (
    <section className="bg-white px-48 pt-8 max-sm:px-4">
      <div className=" mx-auto">
        <div className="grid grid-cols-2 max-sm:grid-cols-1 max-sm:gap-4 gap-8">
          {items.map((item, idx) => (
            <div
              onClick={() => {
                navigateArticle(localizedTo(`/media-center/${item.id}`));
              }}
              key={item.id || idx}
              className="group cursor-pointer"
            >
              <div className="mb-4 overflow-hidden">
                <img
                  src={item?.coverImageUrl}
                  alt={String(item?.title || "")}
                  className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* {!item?.coverImageId && (
                  <div className="w-full h-[400px] bg-gradient-to-br from-blue-100 to-cyan-100" />
                )} */}
              </div>
              <div className="flex justify-between items-center mb-4">
                <span
                  className="text-xs text-[#0A181A8F]/50 uppercase"
                  style={{
                    fontFamily: theme.fonts.body,
                    letterSpacing: "0.1em",
                    fontWeight: "500",
                  }}
                >
                  {item?.type === 0 ? "News" : "Blogs"}
                </span>
                <div className=" bg-[#0A181A8F]/20 mx-2 h-[1px] w-full uppercase flex-1"></div>
                <span
                  className="text-xs gap-1 flex items-center text-[#0A181A8F]/50 uppercase"
                  style={{
                    fontFamily: theme.fonts.body,
                    letterSpacing: "0.05em",
                  }}
                >
                  <CiCalendar className="text-xl" />
                  {formatDate(item?.publishDate)}
                </span>
              </div>
              <h3
                className="text-3xl text-[#0A181A] font-medium "
                style={{
                  fontFamily: theme.fonts.body,
                  lineHeight: "36px",
                }}
              >
                {String(item?.title || "")}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const heroItem = items[0];

  return (
    <>
      <Navbar />
      {/* Hero Section */}
      <div className="min-h-screen max-sm:min-h-full bg-white mt-12">
        <div className="relative w-full">
          <div className="bg-white mt-44 max-sm:mt-16 max-sm:mb-8 mb-32 flex items-center max-sm:justify-start justify-center z-10">
            <div className="text-center max-sm:text-start px-8 max-sm:px-4">
              <h1
                className="text-8xl max-sm:!tracking-[1px] leading-[96px] max-sm:leading-[48px] max-sm:text-5xl font-bodoni"
                style={{
                  color: "#0A181A",
                  letterSpacing: "-4px",
                  fontWeight: "500",
                  textTransform: "uppercase",
                }}
              >
                {t("media.title")}
              </h1>
            </div>
          </div>
          <div className="w-full h-full relative overflow-hidden px-8 max-sm:px-4">
            {isLoading || isFetching ? (
              <div className="w-full h-[480px] max-sm:h-[220px] bg-[#0A181A0D]/10 rounded animate-pulse" />
            ) : (
              <img
                src={heroItem?.coverImageUrl || "/assets/media.png"}
                alt={String(heroItem?.title || "Modern Cityscape")}
                className="w-full  object-contain h-[700px] max-sm:h-[400px] group-hover:scale-105 transition-transform duration-300"
              />
            )}
          </div>
        </div>
      </div>

      {/* Main Featured Article */}
      <section className="bg-white mt-12 max-sm:mt-4 py-8">
        <div className="px-48 max-sm:px-4 flex flex-col md:flex-row gap-8 max-sm:gap-4">
          <div className="flex-1 font-sans text-sm text-[#0A181A61]/50 uppercase tracking-wider space-x-6">
            <span> {heroItem?.tobic}</span>
            <span> {formatDate(heroItem?.publishDate)}</span>
          </div>
          <div className="flex-[2]">
            <h2
              style={{
                color: "#0A181A",
                fontFamily: "Bodoni Moda, serif",
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
              className="text-5xl !font-medium tracking-[2px] max-sm:tracking-[1px] max-sm:text-[36px] leading-[48px] max-sm:leading-[36px] "
            >
              {heroItem?.title}
            </h2>
            {/* <p className="text-[#0A181A8F]/50 text-lg font-sans mt-4">
              {t("media.Article2")}
            </p> */}
            <Link
              to={localizedTo(`/media-center/${heroItem?.id}`)}
              className="inline-flex hover:text-[#40C2CC] transition duration-300 font-sans items-center mt-6 text-base font-medium text-[#0A181ACC]/90"
            >
              {t("media.read")}
              <MdArrowOutward className="w-5 h-5 mt-1 opacity-40 transform transition-transform duration-300 group-hover:-translate-y-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      {isLoading && renderSkeletonGrid(6)}
      {!isLoading && renderArticles()}
      {hasNextPage ? (
        <div className="flex items-center font-sans px-48 pt-32 max-sm:px-2">
          <span className="bg-[#0A181A33]/20 flex-1 h-[1px]"></span>
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="text-[#0A181A] max-sm:mx-2 border border-[#0A181A]/20 rounded-[50px] px-6 py-3 mx-8 disabled:opacity-50"
          >
            {t("media.load")}
          </button>
          <span className="bg-[#0A181A33]/20 flex-1 h-[1px]"></span>
        </div>
      ) : (
        <div className="text-[#0A181A]/60 mx-8">{/* no more */}</div>
      )}

      <RegisterSection source="media-center-page" />
    </>
  );
}
