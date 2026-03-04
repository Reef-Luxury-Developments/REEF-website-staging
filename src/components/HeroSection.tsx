import { useEffect, useRef, useState } from "react";
import { useTheme } from "../theme/ThemeProvider";
import { useLanguage } from "../i18n/LanguageProvider";
import Navbar from "../components/Navbar";



export default function HeroSection() {
  const theme = useTheme();
  const { t } = useLanguage();

  const [showLine, setShowLine] = useState(false);
  const [showRightText, setShowRightText] = useState(false);
  const [showLeftText, setShowLeftText] = useState(false);
  const [showFrame, setShowFrame] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        // Autoplay was prevented.
        console.error("Video autoplay was prevented:", error);
      });
    }
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setShowLine(true), 300);
    const t2 = setTimeout(() => setShowRightText(true), 300);
    const t3 = setTimeout(() => setShowLeftText(true), 300);
    const t4 = setTimeout(() => setShowFrame(true), 300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative flex flex-col justify-between h-[50rem] md:h-screen mb-24">

      <Navbar isWhite={true} />

      {/* Right: Divider + supporting text */}
      <div className="flex flex-col items-center justify-center gap-4 w-full px-16 md:px-0 md:w-1/4 mx-auto mb-16 z-[4]">

        {/* Supporting text */}
        <p
          className={`italic font-general text-white text-center text-lg transition-all duration-500 ease-out ${showRightText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
        >
          {t("heroSection.ReefText")}
        </p>

        {/* Divider */}
        <div className="hidden md:block md:mt-[0.75rem]">
          <div
            className={`h-16 w-px bg-gray-200/80 transition-all duration-500 ease-out ${showLine ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
          ></div>
        </div>
      </div>


      {/* Background video (slides up + fades in) */}
      <div
        className={`absolute h-full inset-0 transition-all duration-500 ease-out will-change-transform will-change-opacity ${showFrame ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          }`}
      >
        <video
          ref={videoRef}
          className="hidden md:block w-full h-full object-cover object-bottom"
          src="/assets/Home_Hero_Video.mp4"
          autoPlay
          loop
          muted
          playsInline
          poster="/assets/home-hero-placeholder.webp"
        />
        <video
          ref={videoRef}
          className="md:hidden w-full h-full object-cover object-bottom"
          src="/assets/Home_Hero_Video_Mobile.mp4"
          autoPlay
          loop
          muted
          playsInline
          poster="/assets/home-hero-placeholder.webp"
        />
      </div>
    </section>
  );
}
