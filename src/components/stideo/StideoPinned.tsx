import React from "react";
import StideoSlider from "./stideo-slider";
import { useLanguage } from "../../i18n/LanguageProvider";

type UnitItem = {
  type?: number;
  startArea?: number;
  endArea?: number;
  images?: string[];
  countOfRoom?: number;
  unitCount?: number;
};

const StideoPinned: React.FC<{
  data?: UnitItem[];
  isLoading?: boolean;
  onClick?: () => void;
}> = ({ data, isLoading, onClick }) => {
  const { t } = useLanguage();
  const items: UnitItem[] = Array.isArray(data) ? data : [];

  const computeTitle = (rooms?: number) => {
    if (rooms === 0) return t("stideo.Studio");
    if (rooms === 1) return t("BHK.oneBedroom");
    if (rooms === 2) return t("BHK.twoRooms");
    if (rooms === 3) return `3 ${t("BHK.BHK")}`;
    if (rooms === 4) return `4 ${t("BHK.BHK")}`;
    if (rooms === 5) return `5 ${t("BHK.BHK")}`;
    if (rooms === 6) return `6 ${t("BHK.BHK")}`;
    if (rooms === 7) return `7 ${t("BHK.BHK")}`;
    if (rooms === 8) return `8 ${t("BHK.BHK")}`;
    if (rooms === 9) return `9 ${t("BHK.BHK")}`;
    if (rooms === 10) return `10 ${t("BHK.BHK")}`;
    if (typeof rooms === "number" && rooms > 1)
      return `${rooms} ${t("studio.Studio")}`;
    return t("stideo.Studio");
  };

  const typeTitle = (type?: number) => {
    if (type === 0) return t("projectsPage.filters.apartment");
    if (type === 1) return t("projectsPage.filters.villa");
    if (type === 2) return t("projectsPage.filters.townhouse");
    if (type === 3) return t("projectsPage.filters.duplex");
    if (type === 4) return t("projectsPage.filters.penthouse");

    if (typeof type === "number" && type > 1)
      return `${type} ${t("projectsPage.filters.apartment")}`;
    return t("projectsPage.filters.apartment");
  };

  if (isLoading) {
    const skeletonCount = Math.max(1, items.length || 2);
    return (
      <div className="relative flex flex-col gap-8 mb-16 mt-24">
        {Array.from({ length: skeletonCount }).map((_, idx) => (
          <div
            key={idx}
            className="flex max-sm:flex-col h-[90vh] items-stretch bg-white relative animate-pulse"
          >
            {/* Left skeleton */}
            <div className="w-1/3 max-sm:w-full ps-12 max-sm:px-3 max-sm:mb-6 flex sm:flex-col justify-between sm:h-full">
              <div className="w-2/3 h-10 bg-gray-200 rounded" />
              <div className="w-1/2 h-8 bg-gray-200 rounded mt-4" />
            </div>
            {/* Right skeleton */}
            <div className="w-2/3 max-sm:w-full h-full flex flex-col">
              <div className="relative w-full flex-1">
                <div className="absolute inset-0 w-full h-full bg-gray-200" />
              </div>
              <div className="w-full h-16 bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 py-12 md:py-24">
      {items.map((item, idx) => (
        <StideoSlider
          key={idx}
          title={computeTitle(item.countOfRoom)}
          images={item.images}
          startArea={item.startArea}
          endArea={item.endArea}
          countOfRoom={item.countOfRoom}
          unitCount={item.unitCount}
          type={item.type}
          typeTitle={typeTitle(item.type)}
          onClick={onClick}
        />
      ))}
    </div>
  );
};

export default StideoPinned;
