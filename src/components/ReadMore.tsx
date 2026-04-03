import React, { useState, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { useLanguage } from "../i18n/LanguageProvider";

interface ReadMoreProps {
  text: string;
  lineHeight?: number; // em value, default 1.6
  collapsedLines?: number; // default 4
  className?: string; // styles for the text paragraph
}

const ReadMore: React.FC<ReadMoreProps> = ({
  text,
  lineHeight = 1.6,
  collapsedLines = 4,
  className = "",
}) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  /** null = not measured yet; avoid showing full long text before first measure */
  const [hasOverflow, setHasOverflow] = useState<boolean | null>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  const calculatedHeight = `${lineHeight * collapsedLines}em`;

  useLayoutEffect(() => {
    const el = descriptionRef.current;
    if (!el) return;

    const measure = () => {
      const node = descriptionRef.current;
      if (!node || !text) {
        setHasOverflow(false);
        setIsExpanded(false);
        return;
      }

      const prevHeight = node.style.height;
      node.style.height = calculatedHeight;
      const exceeds = node.scrollHeight - node.clientHeight > 1;
      node.style.height = prevHeight;

      if (!exceeds) {
        gsap.killTweensOf(node);
        setIsExpanded(false);
      }
      setHasOverflow(exceeds);
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text, calculatedHeight]);

  const handleReadMoreClick = () => {
    if (descriptionRef.current) {
      const nextState = !isExpanded;
      setIsExpanded(nextState);

      if (!nextState) {
        gsap.to(descriptionRef.current, {
          height: calculatedHeight,
          duration: 0.4,
          ease: "power2.inOut",
        });
      } else {
        gsap.to(descriptionRef.current, {
          height: "auto",
          duration: 0.4,
          ease: "power2.inOut",
        });
      }
    }
  };

  const paragraphStyle: React.CSSProperties = (() => {
    if (!text) return {};
    if (hasOverflow === null) return { height: calculatedHeight };
    if (!hasOverflow) return {};
    return { height: isExpanded ? "auto" : calculatedHeight };
  })();

  const shouldShowButton = Boolean(text && hasOverflow);

  return (
    <div className="flex flex-col mditems-center w-full">
      <p
        ref={descriptionRef}
        className={`overflow-hidden ${className}`}
        style={paragraphStyle}
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
