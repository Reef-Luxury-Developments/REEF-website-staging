import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../i18n/LanguageProvider";

export default function TopBar() {
  const { t, language } = useLanguage();

  const isArabic = (language || "").toLowerCase().startsWith("ar");

  const wishlistUrl = isArabic
    ? "https://wishlist.reefdevelopments.ae/ar/"
    : "https://wishlist.reefdevelopments.ae/";

  return (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 60,
        damping: 20,
        duration: 1.2
      }}
    >
      <div className="w-full font-sans">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={wishlistUrl}
          className="w-full bg-[#40C2CC] text-white block"
        >
          <div className="flex flex-col md:flex-row items-center text-center justify-center mx-auto px-4 py-3 md:gap-2">
            <span className="text-md">{t("topbar.message")}</span>
            <span className="h-px w-12 bg-white hidden md:block"></span>
            <span className="text-md italic tracking-wide font-mediium">{t("topbar.cta")}</span>
          </div>
        </a>
      </div>
    </motion.div>
  );
}


