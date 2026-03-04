import React, { useMemo } from "react";
import HeaderOfSection from "../HeaderOfSection";
import { useLanguage } from "../../i18n/LanguageProvider";
import { Link, useNavigate } from "react-router-dom";

const LatestSlider = ({ data, isLoading }: { data: any; isLoading?: boolean }) => {
  const { t } = useLanguage();

  const items = useMemo(() => {
    if (!data || typeof data !== "object") return [] as any[];
    const r1 = (data as any).relatedProject1;
    const r2 = (data as any).relatedProject2;
    const base = [r1, r2].filter((v: any) => v && v.coverImageUrl);
    return base.map((v: any) => ({
      id: v.projectId || v.id,
      name: v.name,
      cover: v.coverImageUrl,
    }));
  }, [data]);

  const showSkeleton = isLoading;
  const visibleItems = items; // show only those that exist (r1/r2)

  // Hide entire component if there are no related projects and not loading
  if (!showSkeleton && visibleItems.length === 0) {
    return null;
  }
const navigate = useNavigate()
  return (
    <section className="w-full bg-white py-16">
      {/* Header */}

      <HeaderOfSection
        title={<>{t("latestslider.header")}</>}
        subTitle=" our projects"
        className="px-32 max-sm:px-4 mb-12"
        btnTitle={t("about.exploreAll")}
        btnLink="/project-all"
      />
      {/* Two static cards side-by-side */}
      <div className="grid grid-cols-2 max-sm:grid-cols-2 gap-2 px-32 max-sm:px-4">
        {showSkeleton
          ? [0, 1].map((i) => (
              <div key={i} className="w-full h-[500px] overflow-hidden">
                <div className="w-full h-full bg-[#0A181A0D]/10 animate-pulse rounded" />
              </div>
            ))
          : visibleItems.map((item, idx) => (
              <div onClick={()=>{
                navigate(`/project-details/${item.id}`)
              }} key={item.id || idx} className="w-full h-[500px] overflow-hidden">
                <img
                  src={item.cover}
                  alt={item.name || `Project ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
      </div>
      <Link

        to="/project-all"
        className="text-lg  hidden max-sm:flex bg-[#40C2CC] rounded-[50px] font-sans text-white px-6 py-3 text-center w-fit mx-auto justify-center mt-10"
      >
        {t("about.exploreAll")}
      </Link>
    </section>
  );
};

export default LatestSlider;
