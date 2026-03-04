import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "../test";
import { useLanguage } from "../../i18n/LanguageProvider";

interface StatCardProps {
  number: number;
  label: string;
  image: string;
  hoverText: string;
  bgColor?: string;
  textColor?: string;
  arrowIcon?: string;
  hoverArrowIcon?: string;
  className?: string;
  hoverText2: string;
}

const StatCard: React.FC<StatCardProps> = ({
  number,
  label,
  image,
  hoverText,
  bgColor,
  textColor,
  arrowIcon,
  hoverArrowIcon,
  className = "",
  hoverText2,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useLanguage();

  return (
    <div
      className="relative flex flex-col items-start"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ✅ الصورة تغطي جزء من البطاقة */}
      <img
        src={image}
        alt={String(t("foot.card.altTopDecoration"))}
        className="absolute top-[-42px] left-[0px] w-[290px] h-[48px] z-20"
        style={{ borderTopLeftRadius: "24px" }}
      />

      <motion.div
        className={`relative w-[462px] h-[220px] overflow-hidden max-sm:w-[95%] ${className}`}
        style={{
          backgroundColor: bgColor,
          border: bgColor === "#FFFFFF" ? "1px solid #E5E7EB" : "none",
          borderBottomLeftRadius: "24px",
          borderBottomRightRadius: "24px",
          borderTopRightRadius: "24px",
        }}
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          {!isHovered ? (
            <motion.div
              key="default"
              className="absolute inset-0 flex justify-between items-end p-6 z-10"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-end gap-4">
                <div className="relative flex items-start">
                  <span
                    className="text-[90px] font-bodoni font-light leading-none"
                    style={{ color: textColor }}
                  >
                    <CountUp
                      from={0}
                      to={number}
                      separator="," 
                      direction="up"
                      duration={1}
                      className="count-up-text"
                      delay={0}
                    />
                  </span>
                  <span
                    className="text-[52px] font-light ms-1 leading-[36px]"
                    style={{ color: textColor }}
                  >
                    +
                  </span>
                </div>
                <div
                  className="text-[16px] font-general font-medium leading-snug tracking-wide"
                  style={{ color: textColor }}
                >
                  {label.split(" ").map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </div>
              </div>
              <div>
                {arrowIcon && (
                  <img
                    src={arrowIcon}
                    alt={String(t("foot.card.altArrowIcon"))}
                    width={74}
                    height={24}
                  />
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="hover"
              className="absolute inset-0 flex w-full flex-row p-4 justify-between items-end z-10"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.3 }}
            >
              <div className="leading-none">
                <p
                  className="text-[3rem]"
                  style={{ color: textColor, fontFamily: "sans-serif" }}
                >
                  {hoverText}
                </p>
                <p
                  className="text-[3rem]"
                  style={{ color: textColor, fontFamily: "sans-serif" }}
                >
                  {hoverText2}
                </p>
              </div>

              {hoverArrowIcon && (
                <img
                  src={hoverArrowIcon}
                  alt={String(t("foot.card.altHoverArrowIcon"))}
                  width={74}
                  height={24}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default StatCard;
