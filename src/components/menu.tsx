import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageProvider";
import { FaXRay } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { GoArrowUpRight } from "react-icons/go";

const MENU_ITEMS = [
  { labelKey: "menu.home", href: "/" },
  { labelKey: "menu.projects", href: "/project-all" },
// { labelKey: "menu.media_center", href: "/media-center" },

  { labelKey: "menu.ourStory", href: "/aboutus" },
  { labelKey: "menu.contact", href: "/conatct-us" },
  { labelKey: "menu.faq", href: "/faq" },
];

export default function FullscreenMenuOverlay({
  open,
  onClose,
  isArabic,
}: {
  open: boolean;
  onClose: () => void;
  isArabic: boolean;
}) {
  const { t } = useLanguage();
  // Prevent background scroll when menu is open
  useEffect(() => {
    if (open) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  // Close with Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const list = useMemo(() => MENU_ITEMS, []);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Main menu"
          dir={isArabic ? "rtl" : "ltr"}
          className="fixed inset-0 z-[999]"
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        >
          {/* Backdrop color layer */}
          <div className="absolute w-[97%] mt-[45px] max-sm:mt-0 inset-0 rounded-b-[24px] h-[90%] mx-8 max-sm:mx-2 top-[95px] bg-[#40C2CC]" />

          {/* Content */}
          <div className="relative h-full mt-4 w-full flex flex-col">
            <div className="grid grid-cols-3  mt-[45px]  absolute  z-[9999] w-[97%] start-0 h-20 mx-8  max-sm:hidden ms-8">
              <div className="bg-[#40C2CC]  relative rounded-tl-[24px] rtl:rounded-tr-[24px] rtl:rounded-tl-none w-full  h-full flex-1 " >
                <IoCloseSharp onClick={onClose} className="absolute top-5 full  cursor-pointer start-5  text-white text-3xl"  />
              </div>
              <div className="flex justify-between w-full">
              <img src="/assets/menu_shap_02.svg" className="ms-[-1px] h-full transform rtl:scale-x-[-1]" /> 
              <img src="/assets/menu_shap_01.svg" className=" me-[-2px] h-full transform rtl:scale-x-[-1]" />
           

              </div>
              {/* <img onClick={onClose} src="/assets/Start.png" className="w-full " /> */}
              {/* */}
              <div className="bg-[#40C2CC] rounded-tr-[24px] rtl:rounded-tl-[24px] mt-[-0.2px] rtl:rounded-tr-none   w-full h-full flex-1" />
            </div>
           

              <div className="hidden absolute z-[9999999] start-0 top-0 h-20 max-sm:flex  ms-2">
              <img onClick={onClose} src="/assets/Start2.png" className="w-full " />
              <img src="/assets/Subtract2.png" className="w-full  transform rtl:scale-x-[-1]" />

            </div> 
          


            {/* Centered menu */}
            <nav
              aria-label={isArabic ? "القائمة الرئيسية" : "Main"}
              className="flex-1 relative  flex max-sm:justify-start max-sm:items-start max-sm:px-8 max-sm:pt-20  items-center max-sm:text-start justify-center text-center select-none"
            >
              <ul className="space-y-8  pb-44 pt-64 max-sm:pt-1 max-sm:pb-1">
                {list.map((item) => (
                  <li key={item.labelKey}>
                    <NavLink
                      to={item.href}
                      onClick={onClose}
                      className="inline-block  transition-all duration-500 ease-in-out hover:text-[#FFFFFF8F] font-bodoni  max-sm:text-4xl max-sm:tracking-[0px] font-medium tracking-[-4px] text-7xl   text-white"                    >
                      {String(t(item.labelKey))}
                    </NavLink>
                  </li>
                ))}
              </ul>

              {/* Mobile-only callout under menu */}
              <div className="hidden  border-t border-white/50 p max-sm:block absolute bottom-[4rem] w-full ">
                <div className="rounded-xl py-6 text-white">
                  <h3 className="font-bodoni text-5xl uppercase leading-none mb-4 tracking-[-1px]">
                    {t("register.title")}
                  </h3>
                  <NavLink
                    to="/conatct-us"
                    onClick={onClose}
                    className="inline-flex mt-4 items-center gap-3 bg-white border border-white rounded-full ps-4 pe-4 py-2"
                  >
                    <span className="font-sans font-semibold text-[#40C2CC]">
                      {t("about.Get_in_touch")}
                    </span>
                    <span className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "#40C2CC" }}>
                      <GoArrowUpRight className="text-white text-xl" />
                    </span>
                  </NavLink>
                </div>
              </div>
            </nav>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
/*
How to use:
1) Ensure Tailwind is set up in your project.
2) Drop this file anywhere (e.g., src/CenteredMenu.tsx) and render <CenteredMenu />.
3) Optional: to match the exact font from your mock, add a Bodoni-like font in your Tailwind theme or via @import and keep `font-serif`.
*/
