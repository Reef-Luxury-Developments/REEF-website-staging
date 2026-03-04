import { useRef } from "react";
import { useInView } from "framer-motion";
import { useTheme } from "../theme/ThemeProvider";
import { useLanguage } from "../i18n/LanguageProvider";

export default function Container() {

  const { t } = useLanguage();
  const theme = useTheme();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });


  return (
    <section
      ref={ref}
      className="flex flex-col items-center justify-center gap-8 px-8 py-12 md:py-24 mx-auto md:w-3/4 lg:w-1/2"
    >
      {/* Text */}
      <p
        className={`font-general text-[#0A181A]/80 text-center text-md max-sm:text-base transition-all duration-1500 ease-in-out ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
      >
        {t("Container.Text")}
      </p>

      {/* Vertical divider (decorative) */}
      <div
        aria-hidden="true"
        className={`w-px h-40 max-sm:h-16 bg-black/20 origin-top transition-transform duration-4000 ease-out ${isInView ? "scale-y-100" : "scale-y-0"
          }`}
      />
    </section>
  );
}
