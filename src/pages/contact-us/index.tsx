import React from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import ContactCards from "./ContactCards";
import OfficeLocations from "./OfficeLocations";
import RegisterSection from "../../components/registerSection";
import Tab from "../../components/brand/tab";
import { useLanguage } from "../../i18n/LanguageProvider";

/**
 * ContactHeroSimple – hero section under an existing header
 *
 * Shows ONLY the background image and the big title at the bottom-left.
 * No subtitle, language chip, or CTA (since your header already has them).
 *
 * Props:
 * - bgImage: string – background image URL
 * - title: string – big heading (default: translated "CONTACT US")
 * - className: string – optional extra classes (e.g., different height)
 */
export default function ContactHeroSimple({
  bgImage = "/assets/contactus.jpg",
  className = "",
}) {
  const { t } = useLanguage();
  const headerTitle = t("contact.title");

  return (
    <>
      {/**/}
      <section
        className="flex flex-col justify-between w-full h-[400px] md:h-[600px] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.8), transparent, rgba(0,0,0,0.8)),
            url(${bgImage})`,
        }}
      >
        <Navbar isWhite={true} />

        {/* Title */}
        <div className="flex justify-center md:justify-start px-8 py-8 md:px-0 md:mx-auto md:w-5/6">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="uppercase font-bodoni text-[clamp(2.5rem,6vw,6rem)] leading-[1.05] text-white"
          >
            {headerTitle}
          </motion.h1>
        </div>
      </section>

      <ContactCards />
      <OfficeLocations />
      <RegisterSection source="contact-us-page" />
      <Tab />
    </>
  );
}

/**
 * Usage:
 * <ContactHeroSimple bgImage="/images/reef-hero.jpg" title="CONTACT US" />
 */
