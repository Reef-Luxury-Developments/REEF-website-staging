import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// If you already have these in your project, keep them as-is
import RegisterInterestModalDemo from "../pages/RegisterInterestModalDemo";
import { useTheme } from "../theme/ThemeProvider";
import { useLanguage } from "../i18n/LanguageProvider";
import FullscreenMenuOverlay from "./menu";
import { useNavigate } from "react-router-dom";
import { FiGlobe } from "react-icons/fi";
import { GoArrowUpRight } from "react-icons/go";
import TopBar from "./TopBar";
import { useQueryClient } from "@tanstack/react-query";
import axios from "../axios";
import { trackEvent } from "../utils/analytics";

export default function Navbar({ isWhite }: { isWhite?: boolean }) {
  const theme = useTheme();
  const { t } = useLanguage();
  const { language, setLanguage } = useLanguage();

  const [menuOpen, setMenuOpen] = useState(false);
  const isArabic = language === "ar";
  const queryClient = useQueryClient();
  const toggleLanguage = () => {
    const newLang = isArabic ? "en" : "ar";
    localStorage.setItem("lang", newLang);
    setLanguage(newLang);
    (axios.defaults.headers as any)["accept-language"] = newLang;

    // أعد جلب كل الكويريز الفعّالة عشان تجيب نصوص/داتا اللغة الجديدة
    queryClient.invalidateQueries({ predicate: () => true });
    queryClient.refetchQueries({ type: "active" });
  };
  const navigate = useNavigate();
  return (
    <header className="relative z-[999999999999]">
      {/* <TopBar /> */}
      {/* Top navigation bar */}
      <nav className="sticky grid grid-cols-3 px-1 md:px-[1rem] py-[1rem] w-full">
        {/* Menu - Left */}
        <div className="flex w-full h-full items-center">
          <button
            onClick={() => {
              setMenuOpen(true);
              trackEvent("menu_open", { menu_name: "Navbar menu" });
            }}
            className="rounded-full capitalize flex items-center justify-center max-sm:justify-start focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 "
            aria-label={isArabic ? "فتح القائمة" : "Open menu"}
            style={{
              background: "transparent",
            }}
          >
            <label
              className="font-sans px-4 py-3 rounded-full hover:bg-[#0A181A]/5 cursor-pointer "
              style={{
                fontWeight: 500,
                fontSize: "1rem",
                lineHeight: "1.5rem",
                color: isWhite ? "white" : theme?.colors?.suface ?? "#222",
              }}
            >
              {t("Navbar.menu")}
            </label>
          </button>
        </div>

        {/* Logo - Center */}
        <div className="flex justify-center items-center cursor-pointer">
          <div
            onClick={() => {
              navigate("/");
            }}
          >
            {isWhite ? (
              <img
                className="h-10 md:h-12 object-contain"
                src="/assets/Reef_Logo_White.svg"
                alt="Reef Logo"
              />
            ) : (
              <img
                className="h-10 md:h-12 object-contain"
                src="/assets/Reef_Logo.svg"
                alt="Reef Logo"
              />
            )}
          </div>
        </div>

        {/* Buttons - Right */}
        <div className="flex justify-end items-center gap-[1vw] w-full h-full ">
          {/* Language Toggle - globe + short code */}
          <button
            onClick={toggleLanguage}
            className="inline-flex  items-center gap-1 px-4 py-3 rounded-full hover:bg-[#0A181A]/5 transition-colors"
            aria-label={isArabic ? "تبديل اللغة" : "Toggle language"}
            style={{
              color: isWhite ? "white" : theme?.colors?.suface ?? "#0A181A",
            }}
          >
            {/* <FiGlobe className="text-current"
              style={{
                fontWeight: 500,
                fontSize: "1.25rem",
                color: isWhite ? "white" : (theme?.colors?.suface ?? "#222"),
              }} /> */}
            <label
              className="font-sans me-1"
              style={{
                fontWeight: 500,
                fontSize: "1rem",
                lineHeight: "1.5rem",
                color: isWhite ? "white" : theme?.colors?.suface ?? "#222",
              }}
            >
              {language === "ar" ? "En" : "العربية"}
            </label>
          </button>

          <RegisterInterestModalDemo trigger={true} isWhite={isWhite} />
        </div>
      </nav>

      {/* Fullscreen slide-down menu */}
      <FullscreenMenuOverlay
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        isArabic={isArabic}
      />
    </header>
  );
}
