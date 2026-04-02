import React, { useState } from "react";
import PaginationArrows from "../PaginationArrows";

const DEFAULT_IMAGES = ["/assets/slider.jpg", "/assets/silder2.jpg"];

const LobbySlider = ({ data, isLoading }: any) => {
  const [current, setCurrent] = useState(0);

  const images: string[] = Array.isArray(data) && data.length > 0
    ? data
    : DEFAULT_IMAGES;

  const hasNext = current + 1 < images.length;
  const hasPrev = current - 1 >= 0;

  const next = () => setCurrent((prev) => (hasNext ? prev + 1 : 0));
  const prev = () =>
    setCurrent((prev) => (hasPrev ? prev - 1 : images.length - 1));

  const getIndex = (i: number) => (i + images.length) % images.length;

  if (isLoading) {
    return (
      <div className="flex h-screen min-h-0 w-full flex-col bg-white animate-pulse">
        <div className="relative min-h-0 w-full flex-1 overflow-hidden">
          <div className="absolute inset-0 flex items-stretch">
            <div className="relative w-3/5 max-sm:w-full h-full overflow-hidden ring-1 ring-gray-200">
              <div className="absolute inset-0 w-full h-full bg-gray-200" />
            </div>
            <div className="relative w-2/5 max-sm:hidden h-full overflow-hidden ring-1 ring-gray-200">
              <div className="absolute inset-0 w-full h-full bg-gray-200" />
            </div>
          </div>
        </div>
        <div className="h-40 border-t border-black/10 flex items-start px-4 max-sm:px-2 pb-[env(safe-area-inset-bottom)]">
          <div className="w-full mx-32 max-sm:mx-0 h-10 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (

    <section className="flex h-screen min-h-0 w-full flex-col">

      {/* Image Slider — flex-1 reserves viewport space before images decode */}
      <div className="flex min-h-0 flex-1 items-stretch">
        <div className="relative h-full min-h-0 w-3/5 max-sm:w-full overflow-hidden">
          <img
            key={images[current]}
            src={images[current]}
            alt={`Main ${current}`}
            width={1920}
            height={1080}
            draggable={false}
            decoding="async"
            className="h-full w-full object-cover object-center transition-transform duration-700 will-change-transform"
          />
        </div>

        <div className="relative hidden h-full min-h-0 w-2/5 overflow-hidden opacity-30 max-sm:hidden">
          <img
            key={images[getIndex(current + 1)]}
            src={images[getIndex(current + 1)]}
            alt="Side preview"
            width={1920}
            height={1080}
            draggable={false}
            loading="lazy"
            decoding="async"
            className="h-full w-full scale-[1.05] object-cover object-center transition-transform duration-700 will-change-transform"
          />

        </div>
      </div>

      {/* Slider Control */}
      <div className="w-full md:w-5/6 mx-auto px-4 md:px-0">
        <PaginationArrows
          current={current}
          images={images}
          next={next}
          prev={prev}
        />
      </div>
    </section>
  );
};

export default LobbySlider;
