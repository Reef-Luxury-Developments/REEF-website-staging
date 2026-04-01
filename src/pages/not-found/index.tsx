import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocalizedPath } from "../../i18n/localePath";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/Navbar";

const NotFound = () => {
  const navigate = useNavigate();
  const { to: localizedTo } = useLocalizedPath();
  const { t } = useTranslation();

  return (
    <>
      <Navbar />
      <section className="relative w-full bg-white min-h-[calc(100vh-150px)] flex items-center justify-center">
        <div className="text-center px-8 pt-40">
          <h1 className="absolute inset-0 font-bodoni font-semibold uppercase text-[50vw] md:text-[40vw] text-lightgray/20">
            404
          </h1>
          <div className="relative z-10">
            <h2 className="font-bodoni font-medium uppercase text-3xl md:text-6xl mb-4 text-black">
              {t("common.pageNotFound", {
                defaultValue: "Page Not Found",
              })}
            </h2>
            <p className="font-general text-lg text-gray-600 mb-8">
              {t("common.pageNotFoundDesc", {
                defaultValue:
                  "The page you're looking for doesn't exist or has been moved.",
              })}
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => navigate(localizedTo("/"))}
                className="px-8 py-3 bg-[#40C2CC] text-white font-general rounded-full hover:bg-[#35A8B2] transition-colors z-10"
              >
                {t("common.backToHome", {
                  defaultValue: "Back to Home",
                })}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFound;
