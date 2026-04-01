import React from "react";
import { Link } from "react-router-dom";
import { useLocalizedPath } from "../i18n/localePath";

const HeaderOfSection = ({ title, subTitle, btnTitle, endContent, className, btnLink, endContentClassName }: any) => {
  const { to: localizedTo } = useLocalizedPath();
  const resolvedBtnLink = btnLink ? localizedTo(btnLink) : undefined;

  return (

    <section className="flex flex-col gap-4 items-center w-full px-4 mb-12 mx-auto md:px-0 md:flex-row md:justify-between md:w-5/6">

      {/* Left Section */}
      <div className="flex flex-col justify-start gap-4 md:gap-8 w-full md:pe-16">
        {/* Overtitle */}
        <div className="flex items-center gap-4">
          <div className="w-[4rem] md:w-[7rem] h-[1px] bg-[rgba(10,24,26,0.2)]" />
          <p
            className="uppercase font-general text-md text-start text-[#0A181A]/55 w-full"
          >
            {subTitle}
          </p>
        </div>
        {/* Headline */}
        <h1
          className="uppercase font-bodoni text-[clamp(2.5rem,5vw,5rem)] text-[rgb(10,24,26,1)] leading-[1] text-start w-full"
        >
          {title}
        </h1>
      </div>

      {/* Start Content */}
      <div className="flex flex-col gap-4 justify-start w-full md:w-1/2">
        {endContent && (
          <p className="font-general text-md text-[#0A181A]/55">
            {endContent}
          </p>
        )}
        {btnTitle && resolvedBtnLink && (
          <Link
            to={resolvedBtnLink}
            className="text-base text-nowrap max-sm:hidden bg-[#40C2CC] rounded-[50px] font-sans text-white px-6 py-3 text-center flex justify-center mt-10"
          >
            {btnTitle}
          </Link>
        )}
      </div>

    </section>
  );
};

export default HeaderOfSection;
