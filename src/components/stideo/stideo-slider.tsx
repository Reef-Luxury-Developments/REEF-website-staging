// StideoSlider.tsx
import React, { useState } from "react";
import { useTheme } from "../../theme/ThemeProvider";
import PaginationArrows from "../PaginationArrows";
import { useLanguage } from "../../i18n/LanguageProvider";

type Props = {
  title: any;
  images?: string[];
  startArea?: number;
  endArea?: number;
  countOfRoom?: number;
  unitCount?: number;
  type?: number;
  typeTitle?: any;
  onClick?: () => void;
};

const StideoSlider: React.FC<Props> = ({
  title,
  images = ["/assets/stideo.jpg", "/assets/Card.png"],
  startArea,
  endArea,
  countOfRoom,
  unitCount,
  type,
  typeTitle,
  onClick,
}) => {
  const theme = useTheme();
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);

  const hasNext = current + 1 < images.length;
  const hasPrev = current - 1 >= 0;

  const next = () => {
    if (hasNext) {
      setCurrent((p) => p + 1);
      onClick?.(); // Track interaction
    }
  };

  const prev = () => {
    if (hasPrev) {
      setCurrent((p) => p - 1);
      onClick?.(); // Track interaction
    }
  };

  const handleImageClick = () => {
    onClick?.(); // Track interaction when user clicks on image
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col md:flex-row gap-4 md:gap-0">
        {/* Content Area */}
        <div className="flex md:flex-col w-full md:w-1/3 px-4 md:ps-12 justify-between md:items-start items-end whitespace-pre-line">
          {/* Title + Type */}
          <div className="flex flex-col gap-2">
            <span className="font-general text-sm md:text-md text-[#0A181A]/55 uppercase">
              {countOfRoom === 0 ? "" : typeTitle}
            </span>
            <h1 className="uppercase font-bodoni text-[clamp(2.5rem,4vw,4rem)] text-[#0A181A] leading-[1]">
              {" "}
              {title}
            </h1>
          </div>

          <div className="flex flex-col gap-2">
            {/* Label */}
            <span className="font-general text-sm md:text-md text-[#0A181A]/55">
              {t("stideo.UNITSIZE")}
            </span>

            {/* Size */}
            <div className="flex gap-2 items-baseline">
              <h2 className="uppercase font-bodoni text-[clamp(2.5rem,4vw,4rem)] text-[#0A181A] leading-[1]">
                {startArea && endArea
                  ? startArea === endArea
                    ? startArea
                    : `${startArea} - ${endArea}`
                  : t("stideo.number")}
              </h2>
              <span className="font-general text-sm text-[#0A181A]/55 h-auto">
                {t("stideo.SQFT")}
              </span>
            </div>
          </div>
        </div>

        {/* Image Area */}
        <div className="flex-1 md:w-2/3">
          <img
            src={images[current]}
            alt={`Studio ${current + 1}`}
            onClick={handleImageClick}
            className="inset-0 w-full h-full object-cover transition-transform duration-700 cursor-pointer"
          />
        </div>
      </div>

      {/* Slider Control */}
      <div className="flex w-full justify-end">
        <PaginationArrows
          current={current}
          images={images}
          next={next}
          prev={prev}
          className={"w-full md:w-2/3 px-4 md:pe-8 md:ps-0"}
        />
      </div>
    </div>
  );
};

export default StideoSlider;
