import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import RegisterSection from "../../components/registerSection";
import Tab from "../../components/brand/tab";
import { useLanguage } from "../../i18n/LanguageProvider";
import { useNavigate } from "react-router-dom";
import { trackEvent } from "../../utils/analytics";
import { useQuery } from "@tanstack/react-query";
import axios from "../../axios";

/**
 * API Response Structure for Communities
 */
interface CommunityApiResponse {
  pageNumber: number;
  totalPages: number;
  totalDataCount: number;
  data: CommunityApiItem[];
}

interface CommunityApiItem {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  subtitle: string;
  area: string;
  coverImageUrl: string | null;
  projectsCount: number;
}

/**
 * Communities Page
 *
 * Displays all available communities in a grid layout
 * Matches the styling of the project-all page
 *
 * Fetches data from API endpoint: GET /Community/getAllCommunities
 */

const Communities = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Fetch communities from API
  const {
    data: communitiesData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["communities"],
    queryFn: async () => {
      const res = await axios.get<CommunityApiResponse>("/Community/getAllCommunities");
      return res.data;
    },
  });

  // Extract communities from paginated response
  const communities: CommunityApiItem[] = communitiesData?.data || [];

  // Track page view
  useEffect(() => {
    if (!isLoading && communities.length > 0) {
      trackEvent("communities_page_view");
    }
  }, [isLoading, communities.length]);

  const handleCommunityClick = (community: CommunityApiItem) => {
    trackEvent("community_card_click", {
      community_name: community.name,
    });
    navigate(`/communities/${community.slug}`);
  };

  return (
    <>
      <Navbar />

      {/* Hero Section / Title + Description */}
      <section className="flex flex-col gap-4 text-center my-[4rem] px-[1rem] md:gap-8 md:mb-[6rem] md:mt-[8rem]">
        <h1
          className="uppercase font-bodoni text-[clamp(2.5rem,6vw,6rem)] leading-[1.05] text-[rgb(10,24,26,1)]"
          style={{ fontWeight: 500, hangingPunctuation: "first" }}
        >
          {t("communities.title", { defaultValue: "Communities" })}
        </h1>

        <p className="font-general px-2 text-[#0A181A8F]/55 text-lg md:max-w-6xl md:mx-auto">
          {t("communities.description", {
            defaultValue: "Explore our communities",
          })}
        </p>
      </section>

      {/* Communities Cards Wrapper */}
      <section className="grid grid-cols-1 gap-4 px-4 mb-24 md:mb-64 md:grid-cols-2 lg:grid-cols-3 md:px-8">
        {isLoading
          ? // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white relative overflow-hidden">
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
            ))
          : isError
          ? // Error state
            <div className="col-span-full text-center py-12">
              <p className="text-[#0A181A]/60 text-lg">
                {t("communities.error", {
                  defaultValue: "Failed to load communities. Please try again later.",
                })}
              </p>
            </div>
          : communities.length === 0
          ? // No results
            <div className="col-span-full text-center py-12">
              <p className="text-[#0A181A]/60 text-lg">
                {t("communities.noResults", {
                  defaultValue: "No communities available.",
                })}
              </p>
            </div>
          : // Actual communities
            communities.map((community) => (
              <div
                key={community.id}
                onClick={() => handleCommunityClick(community)}
                className="cursor-pointer group"
              >
                {/* Image Section */}
                <div className="relative overflow-hidden">
                  {/* Image */}
                  {community.coverImageUrl ? (
                    <img
                      src={community.coverImageUrl}
                      alt={`REEF ${community.name}`}
                      className="w-full object-cover aspect-[4/3]"
                    />
                  ) : (
                    <div className="w-full aspect-[4/3] bg-[#0A181A0D]/10 flex items-center justify-center">
                      <span className="text-[#0A181A]/30 font-general text-sm uppercase">
                        {t("communities.noImage", { defaultValue: "No Image" })}
                      </span>
                    </div>
                  )}
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
                    <span className="text-white font-bodoni uppercase text-[clamp(1.5rem,2vw,3rem)]">
                      {t("communities.viewCommunity", {
                        defaultValue: "View Community",
                      })}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex flex-col gap-2 py-4">
                  {/* Area and Short Name */}
                  <div className="flex items-center gap-4 font-general text-sm text-[#0A181A]/50 uppercase">
                    <span>{community.shortName}</span>
                    <span className="bg-[#0A181A]/15 h-[1px] flex-1"></span>
                    <span>
                      {community.projectsCount}{" "}
                      {t("common.projects", { defaultValue: "Projects" })}
                    </span>
                  </div>

                  {/* Community Name */}
                  <h3 className="font-bodoni uppercase text-[clamp(1.5rem,1.917vw,10rem)] text-[#0A181A] leading-[1.2]">
                    {community.name}
                  </h3>

                  {/* Subtitle */}
                  <div className="flex flex-col gap-1 font-general text-sm">
                    <p className="text-[#0A181A]/55">{community.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
      </section>

      {/* General FAQs */}

      <Tab />
      <RegisterSection source="communities-page" />
    </>
  );
};

export default Communities;
