import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../../i18n/LanguageProvider";

/**
 * LuxuryHeroSection
 *
 * Props:
 *  - imageSrc: string (left image)
 *  - titleLines: string[] (each item renders on its own line on the right)
 *  - className?: string (optional extra classes)
 */

export default function LuxuryHeroSection({
  imageSrc = "/assets/blogs2.jpg",
  titleLines,
  className = "",
  data,
  isLoading,
}: {
  imageSrc?: string;
  titleLines?: string[];
  className?: string;
  data: any;
  isLoading?: boolean;
}) {
  const { t } = useLanguage(); // Translation hook

  // Use provided titleLines, or default to translated key
  // Split by \n to handle multi-line translations (useful for Arabic)
  const lines = (titleLines ?? [t("Luxuryhero.text")]).flatMap((line: any) =>
    line.split("\n")
  );

  if (isLoading) {
    return (
      <section className={`w-full max-sm:hidden bg-white py-6 sm:py-10 ${className}`}>
        <div>
          <div className="grid grid-cols-1 overflow-hidden sm:grid-cols-12">
            {/* Left skeleton image */}
            <div className="relative col-span-12 h-[260px] sm:col-span-5 sm:h-[420px] lg:h-[540px]">
              <div className="absolute inset-0 h-full w-full bg-gray-200 animate-pulse rounded" />
            </div>
            {/* Right skeleton panel */}
            <div className="col-span-12 flex items-center bg-gray-200/70 py-10 sm:col-span-7 lg:px-12">
              <div className="w-full px-28">
                <div className="h-8 w-5/6 bg-gray-300 animate-pulse rounded mb-3" />
                <div className="h-8 w-2/3 bg-gray-300 animate-pulse rounded mb-3" />
                <div className="h-8 w-1/2 bg-gray-300 animate-pulse rounded" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`w-full max-sm:hidden bg-white py-6 sm:py-10 ${className}`}
    >
      <div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="grid grid-cols-1 overflow-hidden sm:grid-cols-12"
        >
          {/* Left: Image */}
          <div className="relative col-span-12 h-[260px] sm:col-span-5 sm:h-[420px] lg:h-[540px]">
            <img
              src={data?.ctaImageUrl || imageSrc}
              alt="Luxury interior"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <img
              src="/assets/brand-shape-reflected.svg"
              alt="Luxury interior"
              className="absolute w-fit bottom-0 end-0 transform rtl:scale-x-[-1]"
              loading="lazy"
            />
          </div>

          {/* Right: Teal panel with headline */}
          <div className="col-span-12 flex items-center bg-[#35C6CF] py-10 sm:col-span-7 lg:px-12">
            <a href={data?.ctaUrl} className="block text-7xl font-bodoni font-medium uppercase px-28 leading-[72px] text-white">
              {data?.ctaTitle ?? lines.join(" ")}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
