
import { HiArrowLongRight, HiArrowLongLeft } from "react-icons/hi2";

const PaginationArrows = ({
  current,
  images,
  prev,
  next,
  className,
}: any) => {
  return (
    <div
      className={`flex font-sans items-center justify-between py-4 ${className}`}
    >
      {/* Counter + Progress Line */}
      <div className="flex items-center gap-2 font-general font-medium  text-[#0A181A]  text-base">

        <span className="max-sm:hidden">
          {String(current + 1).padStart(2, "0")}
        </span>

        <div className="relative rounded h-[2.5px] w-56 max-sm:w-44 bg-gray-300 overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-black transition-all duration-500"
            style={{
              width: `${((current + 1) / images.length) * 100}%`,
            }}
          />
        </div>

        <span className="max-sm:hidden">
          {String(images.length).padStart(2, "0")}
        </span>
      </div>

      {/* Arrows */}
      <div className="flex gap-3">
        <button
          onClick={prev}
          disabled={current === 0}
          className={`w-8 h-12 flex items-center justify-center transition ${current === 0
            ? "text-gray-300 cursor-not-allowed"
            : "text-black hover:text-gray-700"
            }`}
        >
          <HiArrowLongLeft className="text-2xl rtl:rotate-180" />
        </button>
        <button
          onClick={next}
          disabled={current === images.length - 1}
          className={`w-8 h-12 flex items-center justify-center transition ${current === images.length - 1
            ? "text-gray-300 cursor-not-allowed"
            : "text-black hover:text-gray-700"
            }`}
        >
          <HiArrowLongRight className="text-2xl transform rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
};

export default PaginationArrows;
