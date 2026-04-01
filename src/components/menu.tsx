import React, { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageProvider";
import { useLocalizedPath } from "../i18n/localePath";
import { IoCloseSharp } from "react-icons/io5";
import { GoArrowUpRight } from "react-icons/go";

const MENU_ITEMS = [
  { labelKey: "menu.home", path: "/" },
  { labelKey: "menu.projects", path: "/project-all" },
  // { labelKey: "menu.media_center", path: "/media-center" },
  // TODO: uncomment when communities are ready
  // { labelKey: "menu.communities", path: "/communities" },

  { labelKey: "menu.ourStory", path: "/aboutus" },
  { labelKey: "menu.contact", path: "/conatct-us" },
  { labelKey: "menu.faq", path: "/faq" },
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
  const { to: localizedTo } = useLocalizedPath();
  // Prevent background scroll when menu is open
  useEffect(() => {
    if (open) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
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

  // Set document and body backgrounds
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Set document background to teal (menu color)
    document.documentElement.style.backgroundColor = "#40C2CC";
    // Set body background to white
    document.body.style.backgroundColor = "white";

    return () => {
      // Reset on unmount if needed
      document.documentElement.style.backgroundColor = "";
      document.body.style.backgroundColor = "";
    };
  }, []);

  // Create menu container in documentElement for portal (outside transformed body)
  useEffect(() => {
    if (typeof window === "undefined") return;

    let menuContainer = document.getElementById("menu-portal-container");
    if (!menuContainer) {
      menuContainer = document.createElement("div");
      menuContainer.id = "menu-portal-container";
      menuContainer.style.position = "fixed";
      menuContainer.style.top = "0";
      menuContainer.style.left = "0";
      menuContainer.style.width = "100%";
      menuContainer.style.height = "100%";
      menuContainer.style.zIndex = "9998";
      menuContainer.style.pointerEvents = "none"; // Allow clicks to pass through to overlay
      document.documentElement.appendChild(menuContainer);
    }

    // Update pointer events based on menu state (keep none so overlay is clickable)
    // menuContainer.style.pointerEvents = open ? "auto" : "none";

    return () => {
      // Don't remove on unmount, keep it for future use
    };
  }, [open]);

  // Shift website content when menu opens
  useEffect(() => {
    if (open) {
      const updateTransform = () => {
        const menuWidth = window.innerWidth <= 640 ? window.innerWidth : 280;
        const transformValue = isArabic
          ? `translateX(-${menuWidth}px)`
          : `translateX(${menuWidth}px)`;
        // Transform body to reveal html background
        document.documentElement.style.overflowX = "hidden";
        document.body.style.transform = transformValue;
        document.body.style.transition = "transform 0.4s ease-out";

        // Also transform the backdrop overlay to shift with body
        const overlay = document.querySelector(
          "[data-menu-overlay]",
        ) as HTMLElement;
        if (overlay) {
          // overlay.style.transform = transformValue;
          overlay.style.transition = "transform 0.4s ease-out";
        }
      };
      updateTransform();
      window.addEventListener("resize", updateTransform);
      return () => {
        window.removeEventListener("resize", updateTransform);
        // Don't reset transform here - let the else block handle closing animation
      };
    } else {
      // Wait for menu fade-out animation (0.4s) before resetting body transform
      setTimeout(() => {
        const menuWidth = window.innerWidth <= 640 ? window.innerWidth : 280;
        document.body.style.transform = "";
        document.body.style.transition = "transform 0.4s ease-out";
        const overlay = document.querySelector(
          "[data-menu-overlay]",
        ) as HTMLElement;
        if (overlay) {
          overlay.style.transform = "";
          overlay.style.transition = "transform 0.4s ease-out";
        }
        // Reset overflow after animation completes
        setTimeout(() => {
          document.documentElement.style.overflowX = "";
        }, 400);
      }, 250); // Wait for menu fade-out
    }
  }, [open, isArabic]);

  // Render overlay directly in body (same stacking context as menu button)
  const overlayContent = (
    <AnimatePresence>
      {open ? (
        <motion.div
          data-menu-overlay
          className="fixed inset-0 z-[9999999] backdrop-blur-[3px]"
          style={{
            pointerEvents: "auto",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            maskImage: isArabic
              ? "linear-gradient(to left, black 5%, transparent 20%)"
              : "linear-gradient(to right, black 10%, transparent 50%)",
            WebkitMaskImage: isArabic
              ? "linear-gradient(to left, black 5%, transparent 20%)"
              : "linear-gradient(to right, black 10%, transparent 50%)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        />
      ) : null}
    </AnimatePresence>
  );

  const menuContent = (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
            dir={isArabic ? "rtl" : "ltr"}
            className="fixed inset-y-0 start-0 z-[999]"
            style={{ pointerEvents: "auto" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            key="menu-container"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Menu area - html background shows through here */}

            {/* Content */}
            <div className="relative h-full w-[280px] max-sm:w-full flex flex-col">
              {/* Close button */}
              <div className="absolute top-6 start-4 z-[9999] max-sm:start-4">
                <IoCloseSharp
                  onClick={onClose}
                  className="cursor-pointer text-white text-3xl hover:opacity-80 transition-opacity"
                />
              </div>

              {/* Menu items */}
              <nav
                aria-label={isArabic ? "القائمة الرئيسية" : "Main"}
                className="flex-1 relative flex flex-col justify-start items-start px-5 pt-20 pb-5 text-start select-none overflow-y-auto "
              >
                <motion.ul
                  key={`menu-list-${open}`}
                  className="space-y-2.5 w-full"
                >
                  {list.map((item, index) => (
                    <motion.li
                      key={item.labelKey}
                      className=""
                      initial={{
                        opacity: 0,
                        x: -20,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        duration: 0.3,
                        ease: "easeOut",
                        delay: index * 0.1, // Each item starts 0.2s after previous (overlaps since duration is 0.3s)
                      }}
                    >
                      <NavLink
                        to={localizedTo(item.path)}
                        onClick={onClose}
                        className="inline-block transition-all duration-300 ease-in-out hover:text-[#FFFFFF8F] font-bodoni text-3xl md:text-3xl font-medium text-white uppercase"
                      >
                        {String(t(item.labelKey))}
                      </NavLink>
                    </motion.li>
                  ))}
                </motion.ul>

                {/* Mobile-only callout under menu */}
                <div className="mt-auto pt-8 max-sm:block w-full">
                  <div className=" text-white">
                    {/* <h3 className="font-bodoni text-xl md:text-3xl uppercase leading-none mb-2 tracking-tight">
                    {t("register.title")}
                  </h3> */}
                    <motion.div
                      initial={{
                        opacity: 0,
                        x: -20,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        duration: 0.3,
                        ease: "easeOut",
                        delay: list.length * 0.1,
                      }}
                    >
                      <NavLink
                        to={localizedTo("/conatct-us")}
                        onClick={onClose}
                        className="inline-flex mt-4 items-center gap-3 bg-white border border-white rounded-full ps-4 pe-4 py-2 hover:bg-white/90 transition-colors"
                      >
                        <span className="font-sans font-semibold text-[#40C2CC]">
                          {t("about.Get_in_touch")}
                        </span>
                        <span
                          className="w-9 h-9 rounded-full flex items-center justify-center"
                          style={{ background: "#40C2CC" }}
                        >
                          <GoArrowUpRight className="text-white text-xl" />
                        </span>
                      </NavLink>
                    </motion.div>
                  </div>
                </div>
              </nav>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );

  // Render overlay directly in body (same stacking context as menu button)
  // Render menu content via portal to container outside transformed context
  if (typeof window === "undefined") return null;
  const menuContainer = document.getElementById("menu-portal-container");

  return (
    <>
      {createPortal(overlayContent, document.body)}
      {menuContainer && createPortal(menuContent, menuContainer)}
    </>
  );
}
/*
How to use:
1) Ensure Tailwind is set up in your project.
2) Drop this file anywhere (e.g., src/CenteredMenu.tsx) and render <CenteredMenu />.
3) Optional: to match the exact font from your mock, add a Bodoni-like font in your Tailwind theme or via @import and keep `font-serif`.
*/
