import React, { useState, useRef, useEffect, useMemo } from "react";
import InlineMap, { landmarkItem } from "./InlineMap";
import axios from "../../axios";
import { useLanguage } from "../../i18n/LanguageProvider";

interface CommunityMapProps {
  lat: number;
  lng: number;
  landmarks: landmarkItem[];
  communityName?: string;
  className?: string;
}

const CommunityMap: React.FC<CommunityMapProps> = ({
  lat,
  lng,
  landmarks,
  communityName,
  className,
}) => {
  const { t } = useLanguage();
  const [selectedLandmark, setSelectedLandmark] = useState<string | null>(null);
  const [failedIcons, setFailedIcons] = useState<Set<string>>(new Set());
  const [svgContent, setSvgContent] = useState<{ [key: string]: string }>({});
  const [loadingSvgs, setLoadingSvgs] = useState<Set<string>>(new Set());
  const landmarkRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const iconRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const lastIconContent = useRef<{ [key: string]: string }>({});

  // Fetch SVG content for each landmark icon
  useEffect(() => {
    const fetchSvgs = async () => {
      for (const landmark of landmarks) {
        // Skip if no iconType or URL
        if (!landmark.iconType?.url) {
          continue;
        }

        // Skip if we already have the SVG content
        if (svgContent[landmark.id]) {
          continue;
        }

        // Skip if this icon already failed
        if (failedIcons.has(landmark.id)) {
          continue;
        }

        // Skip if already loading
        if (loadingSvgs.has(landmark.id)) {
          continue;
        }

        const iconUrl = landmark.iconType.url;

        setLoadingSvgs((prev) => new Set(prev).add(landmark.id));

        try {
          // Fetch SVG directly using native fetch (like reading HTML from a page)
          const response = await fetch(iconUrl, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
          });
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          const svgText = await response.text();
          
          // Verify it's actually SVG content
          const trimmedSvg = svgText.trim();
          if (trimmedSvg.startsWith("<svg") || trimmedSvg.startsWith("<?xml")) {
            setSvgContent((prev) => ({ ...prev, [landmark.id]: svgText }));
          } else {
            throw new Error("Response is not an SVG");
          }
        } catch (error: any) {
          console.error(`Failed to fetch icon for landmark ${landmark.name}:`, error.message || error);
          setFailedIcons((prev) => new Set(prev).add(landmark.id));
        } finally {
          setLoadingSvgs((prev) => {
            const next = new Set(prev);
            next.delete(landmark.id);
            return next;
          });
        }
      }
    };

    if (landmarks.length > 0) {
      fetchSvgs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [landmarks]);

  // Scroll to selected landmark in sidebar when it becomes active
  useEffect(() => {
    if (selectedLandmark && landmarkRefs.current[selectedLandmark]) {
      landmarkRefs.current[selectedLandmark]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
  }, [selectedLandmark]);

  // Handle marker click - toggle selection
  const handleMarkerClick = (landmarkId: string) => {
    setSelectedLandmark((prev) => (prev === landmarkId ? null : landmarkId));
  };

  // Helper function to get icon content
  const getIconContent = (landmark: landmarkItem, isActive: boolean) => {
    const iconUrl = landmark.iconType?.url || null;
    const hasSvgContent = svgContent[landmark.id];
    const isLoading = loadingSvgs.has(landmark.id);
    const hasFailed = failedIcons.has(landmark.id);
    
    // Priority 1: If we have SVG content, show it with color based on active status
    if (hasSvgContent) {
      // Modify SVG to use currentColor for stroke so it inherits text color
      let modifiedSvg = hasSvgContent;
      // Replace stroke colors with currentColor so it inherits from parent
      modifiedSvg = modifiedSvg.replace(/stroke="[^"]*"/g, 'stroke="currentColor"');
      modifiedSvg = modifiedSvg.replace(/stroke='[^']*'/g, "stroke='currentColor'");
      // Ensure SVG has proper classes for sizing
      modifiedSvg = modifiedSvg.replace(/<svg([^>]*)>/, '<svg$1 class="w-full h-full" style="stroke: currentColor;">');
      return modifiedSvg;
    }
    // Priority 2: If no iconUrl or fetch failed, show fallback
    if (!iconUrl || hasFailed) {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 70 70" fill="none" class="w-full h-full"><path d="M47.5 43.91C57.8276 45.648 65 49.4732 65 53.9126C65 59.9877 51.5685 64.9126 35 64.9126C18.4315 64.9126 5 59.9877 5 53.9126C5 49.4732 12.1724 45.648 22.5 43.91M51 21.1302C51 30.0869 35 50.9126 35 50.9126C35 50.9126 19 30.0869 19 21.1302C19 12.1735 26.1634 4.9126 35 4.9126C43.8366 4.9126 51 12.1735 51 21.1302ZM43 21.0001C43 25.4184 39.4183 29.0001 35 29.0001C30.5817 29.0001 27 25.4184 27 21.0001C27 16.5818 30.5817 13.0001 35 13.0001C39.4183 13.0001 43 16.5818 43 21.0001Z" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    }
    // Priority 3: If loading, show loading state
    if (isLoading) {
      return '<div class="w-full h-full bg-gray-200 animate-pulse rounded"></div>';
    }
    // Priority 4: Default to loading state while waiting for fetch to start
    return '<div class="w-full h-full bg-gray-200 animate-pulse rounded"></div>';
  };

  // Update icon DOM with SVG content and apply color based on active status
  useEffect(() => {
    landmarks.forEach((landmark) => {
      const iconElement = iconRefs.current[landmark.id];
      if (!iconElement) return;

      const isActive = selectedLandmark === landmark.id;
      const newContent = getIconContent(landmark, isActive);
      const lastContent = lastIconContent.current[landmark.id];

      // Always update if content changed or if we don't have last content
      // Also update if SVG content changed (even if the modified SVG string is the same)
      const hasSvgContent = svgContent[landmark.id];
      const hadSvgContent = lastContent && lastContent.includes('<svg');
      const svgContentChanged = hasSvgContent && (!hadSvgContent || !lastContent.includes(hasSvgContent.substring(0, 50)));

      if (!lastContent || lastContent !== newContent || svgContentChanged) {
        iconElement.innerHTML = newContent;
        lastIconContent.current[landmark.id] = newContent;
      }
    });
  }, [landmarks, svgContent, loadingSvgs, failedIcons, selectedLandmark]);

  return (
    <div
      className={`flex flex-col md:flex-row gap-6 md:gap-4 items-stretch px-0 md:px-8`}
    >
      {/* Sidebar with Landmarks - LEFT */}
      <div className="relative w-full md:w-[27%] shrink-0 bg-white flex flex-col self-stretch">
        {/* Sidebar Header */}
        <p
          // className="self-stretch justify-start text-[#40C2CC] text-sm font-medium font-general uppercase leading-5 pb-3 border-b border-[#dadddd]"

          className="font-general text-[clamp(1.25rem,1.85vw,1.75rem)] leading-[1.2] text-black relative pb-5 md:pb-8 px-8 md:px-0"
        >
          {t("communityDetails.landmarksListTitle")}
        </p>

        {/* Landmarks List */}
        <div className="hide-scrollbar md:pb-24 flex md:flex-col gap-1 md:gap-0 items-start grow md:shrink-0 md:basis-0 self-stretch min-h-0 overflow-auto px-8 md:px-0">
          {landmarks.map((landmark) => {
            const isActive = selectedLandmark === landmark.id;

            return (
              <button
                key={landmark.id}
                ref={(el) => (landmarkRefs.current[landmark.id] = el)}
                onClick={() =>
                  setSelectedLandmark(
                    selectedLandmark === landmark.id ? null : landmark.id
                  )
                }
                className={`md:w-full flex gap-1 md:gap-4 items-center px-2 pe-3 md:px-3 py-2 md:py-4 border rounded-full md:rounded-none border-[#dadddd] md:border-t-0 md:border-l-0 md:border-r-0 md:border-b  transition-all duration-300 ${
                  isActive
                    ? "bg-[#40C2CC] text-white border-transparent"
                    : "bg-white hover:bg-gray-50 text-black"
                }`}
              >
                {/* Icon - Inline SVG with color control */}
                <div 
                  ref={(el) => {
                    iconRefs.current[landmark.id] = el;
                    // Set initial content when element is created
                    if (el && !lastIconContent.current[landmark.id]) {
                      const initialContent = getIconContent(landmark, isActive);
                      el.innerHTML = initialContent;
                      lastIconContent.current[landmark.id] = initialContent;
                    }
                  }}
                  className={`w-6 md:w-8 aspect-square flex-shrink-0 transition-colors [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain [&>svg>path]:stroke-current [&>svg>rect]:fill-none ${
                    isActive ? "text-white" : "text-black"
                  }`}
                />

                {/* Landmark Info */}
                <div className="text-left flex flex-col gap-0.5">
                  <h3
                    className={`font-general text-[clamp(0.75rem,1.05vw,1rem)] leading-[1] md:leading-[1.5] text-nowrap md:text-wrap ${
                      isActive ? "text-white" : "text-black"
                    }`}
                  >
                    {landmark.name}
                  </h3>
                  <div
                    className={`flex items-center gap-2 font-general leading-[1] -mt-0.5 ${
                      isActive ? "text-[#dbeafe]" : "text-[#62748e]"
                    }`}
                  >
                    <svg
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 12 12"
                      aria-hidden="true"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.5 8.5H10.5C10.8 8.5 11 8.3 11 8V6.5C11 6.05 10.65 5.65 10.25 5.55C9.35 5.3 8 5 8 5C8 5 7.35 4.3 6.9 3.85C6.65 3.65 6.35 3.5 6 3.5H2.5C2.2 3.5 1.95 3.7 1.8 3.95L1.1 5.4C1.03379 5.59311 1 5.79585 1 6V8C1 8.3 1.2 8.5 1.5 8.5H2.5M9.5 8.5C9.5 9.05228 9.05228 9.5 8.5 9.5C7.94772 9.5 7.5 9.05228 7.5 8.5M9.5 8.5C9.5 7.94772 9.05228 7.5 8.5 7.5C7.94772 7.5 7.5 7.94772 7.5 8.5M2.5 8.5C2.5 9.05228 2.94772 9.5 3.5 9.5C4.05228 9.5 4.5 9.05228 4.5 8.5M2.5 8.5C2.5 7.94772 2.94772 7.5 3.5 7.5C4.05228 7.5 4.5 7.94772 4.5 8.5M4.5 8.5H7.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <span
                      className={`text-[clamp(0.625rem,0.97vw,0.75rem)] font-medium `}
                    >
                      {landmark.time}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Gradient fade at bottom */}
        <div className="hidden md:block absolute bottom-0 right-0 md:left-0 w-6 md:w-full h-24 bg-gradient-to-r md:bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
      </div>

      {/* Map Section - RIGHT */}
      <div className="relative w-full md:flex-1 order-2 shrink-0 flex h-[28rem] md:h-[40.5rem] overflow-hidden">
        <InlineMap
          lat={lat}
          lng={lng}
          landmarks={landmarks}
          activeId={selectedLandmark}
          communityName={communityName}
          onMarkerClick={handleMarkerClick}
        />
      </div>
    </div>
  );
};

export default CommunityMap;
