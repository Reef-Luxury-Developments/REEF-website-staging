"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "../../axios";
import { useLanguage } from "../../i18n/LanguageProvider";
import Navbar from "../../components/Navbar";
import RegisterSection from "../../components/registerSection";
import Tab from "../../components/brand/tab";
import ProjectCard from "../../components/ProjectCard";
import { trackEvent } from "../../utils/analytics";
import ReadMore from "../../components/ReadMore";
import CommunityMap from "../../components/MapSection/CommunityMap";
import { motion, useScroll, useTransform } from "framer-motion";
import { landmarkItem } from "../../components/MapSection/InlineMap";

/**
 * API Response Structure for Community Details
 */
interface CoverImageUrl {
  url: string;
  id: string;
  name: string;
}

interface ProjectId {
  id: string;
  name: string;
}

interface CommunityDetailsApiResponse {
  id: string;
  name: string;
  shortName: string;
  area: string;
  slug: string;
  subtitle: string;
  description: string;
  coverImageUrl: CoverImageUrl | null;
  latitude: number;
  longitude: number;
  locationSectionTitle: string;
  locationDescription: string;
  uniquenessSectionTitle: string;
  ctaTitle: string;
  ctaDescription: string;
  features: Array<{
    title: string;
    description: string;
  }>;
  landmarks: landmarkItem[];
  projectIds: ProjectId[];
}

/**
 * Community Details Page
 *
 * Fetches community details from API endpoint: GET /Website/GetCommunityDetails?CommunityId={id}
 */

// Format handover quarter
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

// Helper function to convert escaped newlines to actual newlines
const convertEscapedNewlines = (text: string | null | undefined): string => {
  if (!text) return "";
  return String(text)
    .replace(/\\n/g, "\n")
    .replace(/\\r\\n/g, "\n")
    .replace(/\\r/g, "\n");
};

// Hero Image with Parallax Component - defined outside to avoid hook order issues
interface HeroImageWithParallaxProps {
  coverImageUrl: string | null;
  heroImageRef: React.RefObject<HTMLDivElement>;
  t: (key: string, options?: { defaultValue: string }) => string;
}

const HeroImageWithParallax: React.FC<HeroImageWithParallaxProps> = ({
  coverImageUrl,
  heroImageRef,
  t,
}) => {
  const { scrollYProgress } = useScroll({
    target: heroImageRef,
    offset: ["start end", "center start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-30%", "0%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.4, 1]);

  if (coverImageUrl) {
    return (
      <motion.img
        src={coverImageUrl}
        alt=""
        className="absolute inset-0 w-full h-[44rem] object-cover"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        style={{ y: imageY, opacity: opacity }}
      />
    );
  }

  return (
    <div className="absolute inset-0 w-full h-[44rem] bg-[#0A181A0D]/10 flex items-center justify-center">
      <span className="text-[#0A181A]/30 font-general text-sm uppercase">
        {t("communityDetails.noImage", { defaultValue: "No Image Available" })}
      </span>
    </div>
  );
};

const CommunityDetails = () => {
  // Create ref for parent container (cards grid)
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  // Create ref for hero image parallax effect
  const heroImageRef = useRef<HTMLDivElement>(null);

  const { t, language } = useLanguage();
  const { slug } = useParams();
  const navigate = useNavigate();

  const enabled = typeof slug === "string" && slug.trim() !== "";

  // First, fetch all communities to find the ID for the given slug
  const { 
    data: communitiesData, 
    isLoading: isCommunitiesLoading,
    isError: isCommunitiesError 
  } = useQuery({
    queryKey: ["communities"],
    queryFn: async () => {
      const res = await axios.get("/Community/getAllCommunities");
      return res.data;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Find the community ID that matches the slug
  const communityId = useMemo(() => {
    if (!communitiesData?.data || !slug) return null;
    const communities = Array.isArray(communitiesData.data) 
      ? communitiesData.data 
      : [];
    const community = communities.find((c: any) => c.slug === slug);
    return community?.id || null;
  }, [communitiesData, slug]);

  // Check if slug was found in communities list
  const slugNotFound = useMemo(() => {
    if (isCommunitiesLoading || !communitiesData?.data) return false;
    const communities = Array.isArray(communitiesData.data) 
      ? communitiesData.data 
      : [];
    return !communities.find((c: any) => c.slug === slug);
  }, [communitiesData, slug, isCommunitiesLoading]);

  // Fetch community details from API using the ID
  const {
    data: communityDataRaw,
    isLoading: isCommunityLoading,
    isError: isCommunityError,
  } = useQuery({
    queryKey: ["community-details", communityId, language],
    queryFn: async () => {
      const res = await axios.get(
        `/Community/GetCommunityDetails?CommunityId=${communityId}`
      );
      // Handle both direct response and wrapped response
      const data = res.data?.data || res.data;
      return data as CommunityDetailsApiResponse;
    },
    enabled: enabled && !!communityId,
    retry: false, // Don't retry on 404
  });

  // Transform API response to handle coverImageUrl object
  const communityData = useMemo(() => {
    if (!communityDataRaw) return null;

    return {
      ...communityDataRaw,
      // Extract URL from coverImageUrl object
      // coverImageUrl structure: { url: string, id: string, name: string } | null
      coverImageUrl: communityDataRaw.coverImageUrl?.url || null,
      // Convert escaped newlines to actual newlines for all text fields
      name: convertEscapedNewlines(communityDataRaw.name),
      subtitle: convertEscapedNewlines(communityDataRaw.subtitle),
      description: convertEscapedNewlines(communityDataRaw.description),
      locationDescription: convertEscapedNewlines(communityDataRaw.locationDescription),
      locationSectionTitle: convertEscapedNewlines(communityDataRaw.locationSectionTitle),
      uniquenessSectionTitle: convertEscapedNewlines(communityDataRaw.uniquenessSectionTitle),
      ctaTitle: convertEscapedNewlines(communityDataRaw.ctaTitle),
      ctaDescription: convertEscapedNewlines(communityDataRaw.ctaDescription),
      // Transform features array to convert newlines in title and description
      features: communityDataRaw.features?.map((feature: any) => ({
        ...feature,
        title: convertEscapedNewlines(feature.title),
        description: convertEscapedNewlines(feature.description),
      })) || [],
      // Format landmarks time to include "mins" if not already present
      // Note: iconType is preserved as-is (object with url, id, name properties)
      landmarks: communityDataRaw.landmarks?.map((landmark) => ({
        ...landmark,
        time: landmark.time && !landmark.time.includes("mins")
          ? `${landmark.time} ${t("common.minutes")}`
          : landmark.time || "",
        // iconType is already in the correct format: { url: string, id: string, name: string } | null
      })) || [],
    };
  }, [communityDataRaw]);

  // Extract project IDs from the projectIds array (which contains objects with id and name)
  const projectIds = useMemo(() => {
    if (!communityData?.projectIds) return [];
    return communityData.projectIds.map((p) =>
      typeof p === "string" ? p : p.id
    );
  }, [communityData?.projectIds]);

  const { data: projectsRes, isLoading: projectsLoading } = useQuery({
    queryKey: ["website-projects", language],
    queryFn: async () => {
      const res = await axios.get("/Website/GetWebsiteProjects");
      return res.data;
    },
    enabled: enabled && !!communityData && projectIds.length > 0,
  });

  // Transform and filter projects data using useMemo
  const projects = useMemo(() => {
    const arr: any[] = Array.isArray(projectsRes) ? projectsRes : [];

    // Filter by project IDs only
    const filteredArr = arr.filter((item) => projectIds.includes(item.id));

    return filteredArr.map((item) => ({
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
  }, [projectsRes, projectIds]);

  // Track page view when data is loaded
  useEffect(() => {
    if (communityData) {
      trackEvent("community_page_view", {
        community_id: communityData.id,
        community_slug: slug,
        community_name: communityData.name,
        community_short_name: communityData.shortName,
      });
    }
  }, [slug, communityData]);

  // Redirect to 404 page if community not found or API error
  useEffect(() => {
    if (
      enabled &&
      !isCommunitiesLoading &&
      !isCommunityLoading &&
      (isCommunitiesError || 
       isCommunityError || 
       slugNotFound || 
       !communityData)
    ) {
      navigate("/404", { replace: true });
    }
  }, [
    enabled, 
    isCommunitiesLoading, 
    isCommunitiesError,
    isCommunityError, 
    isCommunityLoading, 
    slugNotFound,
    communityData, 
    navigate, 
    slug
  ]);

  // Show loading skeleton while communities list or community data is loading
  if (isCommunitiesLoading || isCommunityLoading) {
    return (
      <>
        <Navbar />
        <section className="relative w-full bg-white">
          <div className="flex flex-col gap-2 text-center my-16 px-8 md:gap-8 md:mb-[3rem] md:mt-[8rem]">
            <div className="h-20 w-3/4 mx-auto bg-gray-200 animate-pulse rounded" />
            <div className="h-6 w-1/2 mx-auto bg-gray-200 animate-pulse rounded" />
            <div className="max-w-5xl mx-auto mt-4 space-y-3">
              <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
              <div className="h-4 w-5/6 mx-auto bg-gray-200 animate-pulse rounded" />
              <div className="h-4 w-4/5 mx-auto bg-gray-200 animate-pulse rounded" />
            </div>
          </div>
          <div className="w-full h-[400px] md:h-[600px] bg-gray-200 animate-pulse" />
        </section>
      </>
    );
  }

  // Animation variants for framer-motion
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const ctaVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };


  return (
    <>
      <Navbar />

      {/* Hero Section - Title and Description ABOVE image */}
      <section className="relative w-full bg-white ">
        <div className="relative w-full bg-white">
          <div className="flex flex-col gap-2 text-center my-16 px-8 md:gap-8 md:mb-[3rem] md:mt-[8rem]">
            {/* Title */}
            <h1 className="uppercase font-bodoni text-[clamp(2.5rem,6vw,6rem)] leading-[1.05] text-[rgb(10,24,26,1)] ">
              {communityData?.name}
            </h1>

            {/* Subtitle */}
            <p className="font-general text-[#808080] text-[clamp(1rem,1.32vw,1.25rem)] ">
              {communityData?.subtitle}
            </p>

            {/* Description */}
            <div className="max-w-5xl mx-auto mt-4">
              <ReadMore
                text={communityData?.description || ""}
                lineHeight={1.6}
                collapsedLines={4}
                className="font-general text-[16px] leading-[1.6] text-[#808080] whitespace-pre-line"
              />
            </div>
          </div>
        </div>

        {/* Hero Image - BELOW text */}
        <div
          ref={heroImageRef}
          className="relative w-full h-[22rem] md:h-[35rem] overflow-hidden bg-black"
        >
          {communityData && (
            <HeroImageWithParallax
              coverImageUrl={communityData.coverImageUrl || null}
              heroImageRef={heroImageRef}
              t={t}
            />
          )}
          <div className="flex h-10 md:h-16 justify-start w-full absolute -bottom-px left-0 ">
            <div className="bg-white w-4/12 self-stretch"></div>
            <svg
              className={`h-full w-auto ${
                language === "ar" ? "scale-x-[-1]" : ""
              }`}
              width="267"
              height="73"
              viewBox="0 0 267 73"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M261.882 72.9313C263.303 72.9998 264.791 72.9998 266.263 72.9998L1.27699e-05 72.9998L0 0C27.4134 0.0513312 54.5702 5.54428 80.0158 15.6404L185.426 57.4107C209.827 67.0106 235.632 72.5035 261.882 72.9313Z"
                fill="white"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Prime Location & Connectivity Section */}
      <section className="relative w-full pb-6 pt-12 md:pb-12  md:pt-24 bg-white">
        <div className="w-full md:w-11/12 mx-auto">
          {/* Section Header - Title left, Description right */}
          <div className="flex px-8 flex-col md:flex-row gap-8 mb-12 md:mb-16">
            <div className="md:w-2/3">
              <h2 className="font-bodoni font-medium text-[clamp(2rem,5vw,5rem)] leading-[1.16] text-black uppercase">
                {communityData?.locationSectionTitle ||
                  t("communityDetails.locationTitle", {
                    defaultValue: "Prime Location & Connectivity",
                  })}
              </h2>
            </div>
            <div className="md:w-1/3">
              <p className="font-general text-[16px] leading-[1.5] text-[#808080]">
                {communityData?.locationDescription}
              </p>
            </div>
          </div>

          {/* Map and Sidebar Container */}
          <CommunityMap
            lat={communityData?.latitude as number}
            lng={communityData?.longitude as number}
            landmarks={communityData?.landmarks || []}
            communityName={communityData?.name}
          />
        </div>
      </section>

      {/* What Makes DLRC Unique Section with CTA - Merged */}
      <section
        className="relative w-full pt-12 md:pt-24 pb-0 "
        style={{
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(64, 194, 204, 1) 100%)",
        }}
      >
        <div className="w-full px-8 md:w-11/12 mx-auto relative z-10">
          {/* Title */}
          <h2 className="font-bodoni font-medium text-[clamp(2rem,5vw,5rem)] leading-[1.16] text-black uppercase mb-8 md:mb-32 max-w-[54rem]">
            {communityData?.uniquenessSectionTitle ||
              t("communityDetails.uniquenessTitle", {
                defaultValue: "What Makes This Community Unique?",
              })}
          </h2>

          {/* Feature Cards Container */}
          <div
            ref={cardsContainerRef}
            className="flex flex-col md:flex-row gap-4 mb-12 md:mb-48 items-start flex-wrap justify-center lg:justify-start"
          >
            {communityData?.features &&
              communityData.features.length > 0 &&
              communityData.features.map((feature: any, index: number) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={cardVariants}
                  transition={{
                    duration: 0.8,
                    ease: "easeOut",
                    delay: index * 0.2,
                  }}
                  className={`relative flex flex-col gap-2.5 md:gap-3 p-6 rounded-[2.5rem] md:rounded-3xl outline outline-1 outline-white/70 flex-1 shrink-0 self-stretch min-w-[300px] md:max-w-[50%] lg:min-w-[23%]  ${
                    index % 2 !== 0 ? "lg:!translate-y-20" : ""
                  } ${
                    communityData.features.length > 3
                      ? "lg:max-w-[calc(25%-12px)]"
                      : ""
                  }`}
                  style={{
                    background:
                      "linear-gradient(109deg, rgba(255, 255, 255, 0.09) 0%, rgba(255, 255, 255, 0.00) 70.71%, rgba(255, 255, 255, 0.09) 100%)",
                    boxShadow:
                      "8px 10px 25.5px -19px rgba(0, 0, 0, 0.18), -6px -10px 14.4px 0 rgba(255, 255, 255, 0.16) inset",
                  }}
                >
                  <h3 className="font-bodoni font-medium text-[clamp(1.4rem,1.85vw,1.75rem)] leading-[1.13] text-black relative z-10">
                    {feature.title}
                  </h3>
                  <div className="relative z-10">
                    <p className="font-general text-[16px] leading-[1.5] text-black/60">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={ctaVariants}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className=""
          >
            <h2 className="font-bodoni font-medium text-[clamp(2.2rem,6.87vw,6.5rem)] leading-[1.16] text-white uppercase mb-[1vw] whitespace-pre-line ">
              {communityData?.ctaTitle || "Find Your Dream Home"}
            </h2>
            <p className="font-general text-[clamp(1rem,1.32vw,1.25rem)] leading-normal text-white tracking-[0.6px] pb-5">
              {communityData?.ctaDescription || "A community defined by convenience, value, and long-term growth."}
            </p>
          </motion.div>
        </div>

        {/* Decorative curved shape at bottom */}
        <div className="flex h-10 md:h-16 justify-start w-full absolute bottom-0 left-0 translate-y-[calc(100%-0.5px)]">
          <div className="bg-[#40C2CC] w-5/12 md:w-7/12 self-stretch"></div>
          <svg
            className={`h-full w-auto ${
              language === "ar" ? "scale-x-[-1]" : ""
            }`}
            width="266"
            height="73"
            viewBox="0 0 266 73"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M261.624 0.0684509C263.043 -2.23387e-08 264.53 -2.24649e-08 266 -2.25898e-08L6.20464e-09 0L0 73C27.3864 72.9487 54.5163 67.4557 79.9368 57.3596L185.243 15.5891C209.62 5.98922 235.4 0.496254 261.624 0.0684509Z"
              fill="#40C2CC"
            />
          </svg>
        </div>
      </section>

      {/* Our Projects in Al DLRC Section */}
      <section className="w-full pt-24 pb-12 md:pt-32 md:pb-24">
        <div className="w-full px-8 md:w-11/12 mx-auto">
          <h2 className="font-bodoni font-semibold text-[clamp(2rem,4vw,4rem)] leading-[1.16] text-black uppercase mb-6 md:mb-12">
            {t("communityDetails.projectsTitle", {
              defaultValue: "Our Projects in",
            })}{" "}
            {communityData?.shortName}
          </h2>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {!projectsLoading &&
              projects.length > 0 &&
              projects.map((project, idx) => (
                <ProjectCard key={idx} project={project} />
              ))}
            {(projectsLoading || projects.length === 0) && (
              <div className="bg-white relative overflow-hidden">
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
            )}
          </div>
        </div>
      </section>

      {/* Register Section */}
      <RegisterSection
        source="community-details-page"
        project_name={communityData?.name}
      />

      {/* Tab Section */}
      <Tab />
    </>
  );
};

export default CommunityDetails;
