import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useTheme } from "../../theme/ThemeProvider";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageProvider";

type Position = "left" | "right" | "bottom";

interface ImageData {
  src: string;
  position: Position;
  title: any;
  paddingbottom: string;
}

const Destination: React.FC = () => {
  const theme = useTheme();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isScroll, setIsScroll] = useState(false);
  const [active, setActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "100px" });

  // === responsive check ===
  useEffect(() => {
    const check = () =>
      setIsMobile(typeof window !== "undefined" && window.innerWidth < 640);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  // === desktop only: scroll + intersection ===
  useEffect(() => {
    if (isMobile) return;
    const onScroll = () => setIsScroll(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) return;
    const observer = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && setActive(true),
      { threshold: 0.4 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [isMobile]);

  const images: ImageData[] = [
    {
      src: "/assets/left.png",
      position: "left",
      title: t("distination.DLRC"),
      paddingbottom: "62px",
    },
    {
      src: "/assets/right.png",
      position: "right",
      title: t("distination.alfurjan"),
      paddingbottom: "62px",
    },
    {
      src: "/assets/bottom.jpg",
      position: "bottom",
      title: t("distination.DUBAIISLAND"),
      paddingbottom: "62px",
    },
    {
      src: "/assets/BG.png",
      position: "bottom",
      title: t("distination.IMPZ"),
      paddingbottom: "62px",
    },
  ];

  // =========================
  // MOBILE LAYOUT (slider)
  // =========================
  if (isMobile) {
    return (
      <section className="w-full my-8">
        <div className="flex flex-col items-center justify-center gap-10 mb-12">
          {/* Vertical divider (decorative) */}
          {/* <span
            className={`w-px h-40 max-sm:h-16 bg-black/20 origin-top transition-transform duration-4000 ease-out ${isInView ? "scale-y-100" : "scale-y-0"
              }`}
          ></span> */}

          {/* Title */}
          <h2 className="uppercase text-[#0A181A] font-bodoni text-center text-[clamp(3rem,6vw,6rem)]">
            {t("distination.text")}
          </h2>
        </div>

        {/* Vertical Scrool  */}
        <div
          className="flex gap-4 px-4 justify-start overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
          aria-label="Destinations Slider"
        >
          {images.map((img) => (
            <div
              key={img.src}
              className="relative flex-shrink-0 w-[75%] overflow-hidden"
            >
              <img
                src={img.src}
                alt={img.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-8 w-full">
                <h3
                  className="font-bodoni text-3xl text-center uppercase "
                  style={{ color: theme.colors.onPrimary }}
                >
                  {img.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // =========================
  // DESKTOP/TABLET (original)
  // =========================
  return (
    <section className="flex flex-col gap-24 items-center md:w-full md:px-8 lg:w-3/4 mx-auto md:py-24 transition-all duration-700">
      {/* Header Content */}
      <div className="flex flex-col gap-8 items-center">
        {/* vertical line */}
        <span
          className={`w-px h-16 md:h-40 bg-[#0A181A]/20 transition-transform duration-4000 ease-out ${
            isScroll ? "scale-y-100" : "scale-y-0"
          }`}
        ></span>

        {/* Title */}
        <h2 className="uppercase text-[#0A181A] font-bodoni text-center text-[clamp(3rem,6vw,6rem)]">
          {t("distination.text")}
        </h2>
      </div>

      {/* Communities list */}
      <div className="flex w-full md:gap-4 lg:gap-8">
        {/* Start Shapes */}
        <div
          ref={ref}
          className="relative flex overflow-hidden justify-center items-end mt-20 w-1/3 h-[42rem] group"
        >
          <p className="text-white font-bodoni text-5xl text-center w-full p-12 z-[3] opacity-0 translate-y-[4rem] group-hover:translate-y-[0rem] group-hover:opacity-100 transition-all duration-500 ease-in-out">
            {images[0].title}
          </p>

          {/* Blur */}
          <div className="absolute w-full h-full inset-0 bg-black/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[2]" />

          {/* Image */}
          <img
            src={images[0].src}
            alt={images[0].title}
            className={`absolute object-cover w-full object-center transition-all duration-1000 ease-in-out delay-[400ms]
              ${isInView ? "h-full opacity-100" : "h-1 opacity-0"}`}
          />
        </div>

        {/* Middle Shapes */}
        <div className="flex flex-col md:gap-4 lg:gap-8 w-1/3">
          {/* First Shape */}
          <div
            ref={ref}
            className="relative flex overflow-hidden justify-center items-end w-full h-[42rem] group"
          >
            <p className="text-white font-bodoni text-5xl text-center w-full p-12 z-[3] opacity-0 translate-y-[4rem] group-hover:translate-y-[0rem] group-hover:opacity-100 transition-all duration-500 ease-in-out">
              {images[1].title}
            </p>

            {/* Blur */}
            <div className="absolute w-full h-full inset-0 bg-black/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[2]" />

            {/* Image */}
            <img
              src={images[1].src}
              alt={images[1].title}
              className={`absolute object-cover w-full object-center transition-all duration-1000 ease-in-out
              ${isInView ? "h-full opacity-100" : "h-1 opacity-0"}`}
            />
          </div>
          {/* Second Shape */}
          <div
            ref={ref}
            className="relative flex overflow-hidden justify-center items-end w-full h-[42rem] group"
          >
            <p className="text-white font-bodoni text-5xl text-center w-full p-12 z-[3] opacity-0 translate-y-[4rem] group-hover:translate-y-[0rem] group-hover:opacity-100 transition-all duration-500 ease-in-out">
              {images[2].title}
            </p>

            {/* Blur */}
            <div className="absolute w-full h-full inset-0 bg-black/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[2]" />

            {/* Image */}
            <img
              src={images[2].src}
              alt={images[2].title}
              className={`absolute object-cover w-full object-center transition-all duration-1000 ease-in-out delay-[800ms]
              ${isInView ? "h-full opacity-100" : "h-1 opacity-0"}`}
            />
          </div>
        </div>

        {/* End Shapes */}
        <div
          ref={ref}
          className="relative flex overflow-hidden justify-center items-end mt-20 w-1/3 h-[42rem] group"
        >
          <p className="text-white font-bodoni text-5xl text-center w-full p-12 z-[3] opacity-0 translate-y-[4rem] group-hover:translate-y-[0rem] group-hover:opacity-100 transition-all duration-500 ease-in-out">
            {images[3].title}
          </p>

          {/* Blur */}
          <div className="absolute w-full h-full inset-0 bg-black/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[2]" />

          {/* Image */}
          <img
            src={images[3].src}
            alt={images[3].title}
            className={`absolute object-cover w-full object-center transition-all duration-1000 ease-in-out delay-[400ms]
              ${isInView ? "h-full opacity-100" : "h-1 opacity-0"}`}
          />
        </div>
      </div>
    </section>
  );
};

export default Destination;
