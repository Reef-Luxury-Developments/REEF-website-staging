import React, { useState, useRef } from "react";
import gsap from "gsap";
import { useLanguage } from "../i18n/LanguageProvider";

interface ReadMoreProps {
  text: string;
  lineHeight?: number; // em value, default 1.6
  collapsedLines?: number; // default 4
  className?: string; // styles for the text paragraph
  truncationLength?: number;
}

const ReadMore: React.FC<ReadMoreProps> = ({
  text,
  lineHeight = 1.6,
  collapsedLines = 4,
  className = "",
  truncationLength = 300,
}) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  // Calculate the collapsed height in em
  const calculatedHeight = `${lineHeight * collapsedLines}em`;

  const handleReadMoreClick = () => {
    if (descriptionRef.current) {
      // Toggle state
      const nextState = !isExpanded;
      setIsExpanded(nextState);

      if (!nextState) {
        // Collapsing
        gsap.to(descriptionRef.current, {
          height: calculatedHeight,
          duration: 0.4,
          ease: "power2.inOut",
        });
      } else {
        // Expanding
        gsap.to(descriptionRef.current, {
          height: "auto",
          duration: 0.4,
          ease: "power2.inOut",
        });
      }
    }
  };

  const shouldShowButton = text && text.length > truncationLength;

  return (
    <div className="flex flex-col mditems-center w-full">
      <p
        ref={descriptionRef}
        className={`overflow-hidden ${className}`}
        // Set base height. We don't toggle this with React state to avoid conflicts with GSAP animation.
        style={{ height: calculatedHeight }}
      >
        {text}
      </p>

      {shouldShowButton && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleReadMoreClick}
            className="w-40 flex justify-center gap-2 px-0 py-[9px] border-t border-[#dadddd] border-b-0 border-l-0 border-r-0 border-solid group hover:border-[#40C2CC] transition-colors duration-300 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            <span className="font-general font-semibold uppercase text-[14px] leading-[1.16] text-black group-hover:text-[#40C2CC] transition-colors duration-300">
              {isExpanded ? t("common.readLess") : t("common.readMore")}
            </span>
            {/* <div className="h-[10.425px] w-[9.849px]">
              <img
                src="/assets/ArrowUpRight.svg"
                alt=""
                className="w-full h-full"
              />
            </div> */}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReadMore;
