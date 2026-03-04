import React, { useEffect, useState } from "react";
import { useTheme } from "../../theme/ThemeProvider";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import HeaderOfSection from "../HeaderOfSection";
import PaginationArrows from "../PaginationArrows";
import { useLanguage } from "../../i18n/LanguageProvider";

const defaultImages = [
  "/assets/Card With Media.png",
  "/assets/Card.png",
  "/assets/02.jpg",
  "/assets/Card With Media.png",
  "/assets/Card.png",
  "/assets/02.jpg",
  "/assets/Card With Media.png",
  "/assets/Card.png",
  "/assets/02.jpg",
];

const defaultTitles = [
  "BAJA SHELF",
  "INFENITY SWIMMING POOL",
  "FARM",
  "BAJA SHELF",
  "INFENITY SWIMMING POOL",
  "FARM",
  "BAJA SHELF",
  "INFENITY SWIMMING POOL",
  "FARM",
];

export default function AmenitiesSlider({
  data,
  isLoading,
  amenitiesDescription,
  onClick,
}: any) {
  const theme = useTheme();
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const amenities = Array.isArray(data) && data.length ? data : [];

  const items = amenities.length
    ? amenities.map((a: any) => ({
        imageUrl: a?.imageUrl,
        title: a?.name,
      }))
    : defaultImages.map((url, i) => ({
        imageUrl: url,
        title: defaultTitles[i] || `AMENITY ${i + 1}`,
      }));

  const visibleCount = 2.5;
  const totalVisible = Math.max(1, Math.ceil(items.length - visibleCount + 1));
  const slideWidth = 548 + 16;

  const next = () => {
    setCurrent((prev) => Math.min(prev + 1, totalVisible - 1));
    onClick?.();
  };
  const prev = () => {
    setCurrent((prev) => Math.max(prev - 1, 0));
    onClick?.();
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => setHoveredIndex(null);

  useEffect(() => {
    let animationFrame: number;

    const animate = () => {
      setTooltipPos((prev) => {
        const dx = mousePos.x - prev.x;
        const dy = mousePos.y - prev.y;
        return {
          x: prev.x + dx * 0.2,
          y: prev.y + dy * 0.2,
        };
      });
      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [mousePos]);

  if (isLoading) {
    const skeletonCount = 6;
    return (
      <section className="w-full ps-32 max-sm:ps-6 py-1 mt-32 max-sm:mt-0">
        <div className="max-w-screen-xl0">
          <HeaderOfSection
            title={t("slider.choice")}
            subTitle={t("slider.Amenities")}
            className="pe-8 max-sm:pe-1 mb-12"
            endContent={<p className="ms-6 max-sm:ms-0">{t("slider.text")}</p>}
          />
          <div className="relative overflow-hidden max-sm:mt-12">
            <div className="flex animate-pulse">
              {Array.from({ length: skeletonCount }).map((_, index) => (
                <div
                  key={index}
                  className="relative me-4 min-w-[548px] h-[380px] max-sm:h-[240px] max-sm:min-w-[350px]"
                >
                  <div className="w-full h-full bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12 md:py-24">
      <HeaderOfSection
        title={t("slider.choice")}
        subTitle={t("slider.Amenities")}
        endContent={
          <>
            <p>{amenitiesDescription}</p>
          </>
        }
      />

      {/* Carousel */}
      <div className="w-full md:w-5/6 mx-auto px-4 md:px-0">
        <div
          className="flex w-full gap-4 justify-start snap-x snap-mandatory [&::-webkit-scrollbar]:hidden transition-transform duration-500 ease-in-out"
          dir="ltr"
          style={{
            transform: `translateX(-${current * slideWidth}px)`,
          }}
        >
          {items.map((it: any, index: number) => (
            <div
              className="flex-shrink-0 w-3/4 md:w-2/5"
              key={index}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="relative group h-full overflow-hidden">
                <p className="text-[#0A181A8F]/55 font-general text-sm mb-2 block md:hidden">
                  {items[index]?.title}
                </p>

                <img
                  src={it.imageUrl}
                  alt={`Amenity ${index + 1}`}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-[1.15]"
                />

                {/* Blurred overlay */}
                <div className="hidden md:block absolute inset-0 bg-black/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Center title */}
                <div className="hidden md:flex absolute inset-0 items-center justify-center overflow-hidden uppercase">
                  <p
                    className={`text-white font-bodoni text-5xl text-center transform transition-all duration-700 ${
                      hoveredIndex === index
                        ? "translate-y-0 opacity-100"
                        : "translate-y-20 opacity-0"
                    }`}
                  >
                    {items[index]?.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <PaginationArrows
            current={current}
            images={items}
            next={next}
            prev={prev}
            totalVisible={totalVisible}
          />
        )}
      </div>
    </section>
  );
}
