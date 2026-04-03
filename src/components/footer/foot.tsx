import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import StatCard from "./card";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageProvider";
import { useLocalizedPath } from "../../i18n/localePath";
import { useQuery } from "@tanstack/react-query";
import axios from "../../axios";
import { GoArrowUpRight } from "react-icons/go";
import { trackEvent } from "../../utils/analytics";

interface SocialLinkProps {
  name: string;
  icon: string;
  href: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

interface ChannelPartner {
  title: string;
  url: string;
}

function SocialLink({
  name,
  icon,
  href,
  onMouseEnter,
  onMouseLeave,
}: SocialLinkProps) {
  const [hover, setHover] = useState(false);

  // Extract platform name from URL for tracking
  const getPlatformName = (url: string): string => {
    if (url.includes("facebook")) return "facebook";
    if (url.includes("instagram")) return "instagram";
    if (url.includes("tiktok")) return "tiktok";
    if (url.includes("linkedin")) return "linkedin";
    if (url.includes("x.com") || url.includes("twitter")) return "x_twitter";
    if (url.includes("snapchat")) return "snapchat";
    if (url.includes("youtube")) return "youtube";
    return "unknown";
  };

  const handleClick = () => {
    trackEvent("social_link_click", {
      platform: getPlatformName(href),
      social_link: href,
      social_link_name: name,
    });
  };

  return (
    <li
      onMouseEnter={() => {
        setHover(true);
        onMouseEnter();
      }}
      onMouseLeave={() => {
        setHover(false);
        onMouseLeave();
      }}
      className="font-general text-nowrap text-xl font-medium text-black/80"
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={`group flex items-center gap-1 hover:!text-[#40C2CC] transition-all duration-300 ${
          hover ? "text-[#40C2CC]" : "text-[#0A181A]"
        }`}
      >
        {name}
        <GoArrowUpRight className="transition-transform text-[#0A181A8F] duration-1000 group-hover:text-[#40C2CC] motion-reduce:transform-none" />
        {/* <img
          src="/assets/ArrowUpRight.svg"
          alt="arrow"
          className="transition-transform duration-1000 group-hover:mb-4 motion-reduce:transform-none"
        /> */}
      </a>
    </li>
  );
}

const Foot = () => {
  const { t } = useLanguage();
  const { to: localizedTo } = useLocalizedPath();
  const [isHovered, setIsHovered] = useState(false);

  const links = [
    { title: t("foot.Home"), link: localizedTo("/") },
    { title: t("foot.Project"), link: localizedTo("/project-all") },

    { title: t("foot.Communities"), link: localizedTo("/communities") },
    { title: t("foot.About"), link: localizedTo("/aboutus") },
    // { title: t("foot.News"), link: localizedTo("/media-center") },
    { title: t("foot.Contact"), link: localizedTo("/conatct-us") },
    { title: t("foot.FAQ"), link: localizedTo("/faq") },
    {
      title: t("foot.ChannelPartner"),
      link: "https://reefchannelpartners.com/channelpartner.html",
    },
  ];

  const { data: projectSelect, isLoading: isLoadingProjects } = useQuery({
    queryKey: ["project-select"],
    queryFn: async () => {
      const res = await axios.get("/Project/GetProjectSelect");
      return res.data as Array<{ id: string; name: string }>;
    },
  });
  const navigate = useNavigate();
  const projects = Array.isArray(projectSelect) ? projectSelect : [];
  const social = [
    {
      label: String(t("foot.socialLinks.facebook")),
      url: "https://www.facebook.com/reefdevelopmentsdubai/",
    },
    {
      label: String(t("foot.socialLinks.instagram")),
      url: "https://www.instagram.com/reef.developments/",
    },
    {
      label: String(t("foot.socialLinks.tiktok")),
      url: "https://www.tiktok.com/@reef.developments",
    },
    {
      label: String(t("foot.socialLinks.linkedin")),
      url: "https://www.linkedin.com/company/reef-luxury-developments/posts/?feedView=all",
    },
    {
      label: String(t("foot.socialLinks.x")),
      url: "https://x.com/Reefdevelopment",
    },
    {
      label: String(t("foot.socialLinks.snapchat")),
      url: "https://www.snapchat.com/@reefdevelopment?invite_id=9GhGZ3wU&locale=en_AE&share_id=hISDBlF_QMaMxZlj8aeGMA&xp_id=1&sid=aedcd3d912bb444c9789bd6bf76e05e4",
    },
    {
      label: String(t("foot.socialLinks.youtube")),
      url: "https://www.youtube.com/@ReefLuxuryDevelopments",
    },
  ];

  return (
    <section
      id="site-footer"
      className="w-full px-8 md:w-5/6 md:mx-auto md:px-0"
    >
      {/* Newslatter Section */}
      <>
        {/* <div className="w-[32.2%] max-sm:w-full flex flex-col gap-8">
          <h2 className="text-[1.8rem] max-sm:text-xl leading-[120%] font-medium font-general text-[rgba(10,24,26,0.8)]">
            {t("foot.leftsectiontext")}
          </h2>

          <div className="flex flex-col gap-6">
            <div className="border-b-2 flex justify-between items-center">
              <input
                type="email"
                placeholder="Your Email Here"
                className="w-full h-12 text-[1rem] font-general font-normal leading-[1.25rem] placeholder-[rgba(10,24,26,0.38)] text-[rgba(10,24,26,0.9)] bg-transparent focus:outline-none"
              />
              <button
                type="submit"
                className="ms-2 hover:text-[#40C2CC] transition-transform hover:translate-x-1"
              >
                <FaArrowRight className="h-3 w-2.5 text-gray-500 hover:text-[#40C2CC] transition" />
              </button>
            </div>

            <p className="text-xs text-[rgba(10,24,26,0.56)] leading-[150%] font-general">
              {t("foot.imagetext")}
              <a
                href="#"
                className="font-medium mx-1 underline text-black hover:text-[#40C2CC] transition"
              >
                {t("foot.privacy")}
              </a>
              {t("foot.privacytext")}
            </p>
          </div>
        </div> */}
      </>
      <div className="flex flex-col w-full pt-12 pb-8 md:flex-row md:justify-between md:pt-24 md:pb-16">
        {/* Left Section */}
        <div className="mb-12 hidden md:block">
          <img
            className="w-auto h-[8rem] object-contain fill-[#40C2CC] cursor-pointer"
            src="/assets/Reef_Full_Logo.svg"
            alt="Reef Logo"
            onClick={() => {
              navigate(localizedTo("/"));
            }}
          />
        </div>

        {/* Right Section */}
        <div className="grid grid-cols-1 justify-end w-full md:flex md:gap-8 md:w-2/3">
          {/* Navigation */}
          <div className="flex flex-col gap-4 mb-8 w-1/2 md:w-1/3">
            <span className="font-general text-sm font-medium text-black/40">
              {t("foot.Navigation")}
            </span>
            <ul className="space-y-2 md:space-y-1">
              {links.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.link}
                    className="nav-animate-link font-general text-xl font-medium text-black/80"
                  >
                    {item.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Projects */}
          <div className="flex flex-col gap-4 mb-8 w-1/2 md:w-1/5">
            <span className="font-general text-sm font-medium text-black/40">
              {t("foot.Projects")}
            </span>

            {isLoadingProjects ? (
              <ul className="space-y-2 animate-pulse">
                {Array.from({ length: 6 }).map((_, i) => (
                  <li key={i}>
                    <div className="h-5 w-48 bg-gray-200 rounded" />
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-2 md:space-y-1">
                {projects.map((item, index) => (
                  <li key={item.id || index}>
                    <span
                      className="nav-animate-link font-general text-nowrap text-xl font-medium text-black/80 cursor-pointer"
                      onClick={() => {
                        navigate(localizedTo(`/project-details/${item.id}`));
                        trackEvent("project_click", {
                          project_name: item.name || "",
                          project_id: item.id || "",
                        });
                      }}
                    >
                      {item.name}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Social */}
          <div className="flex flex-col gap-4 mb-8 w-1/2 md:w-1/5">
            <span className="font-general text-sm font-medium text-black/40">
              {t("foot.Social")}
            </span>

            <ul className="flex flex-col gap-1">
              {social.map((item, index) => (
                <SocialLink
                  key={index}
                  name={item.label}
                  href={item.url}
                  icon={isHovered ? "/assets/3.png" : "/assets/01.png"}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* <div className="flex w-full py-4 justify-center">
        <span className="font-general text-sm text-black/40 text-center">{t("foot.bottom.copyright")}</span>
      </div> */}

      {/* Cards */}
      <>
        {/* <div className="w-[59rem] h-[17.5rem] max-sm:ps-4 max-sm:mb-4 max-sm:h-full max-sm:gap-16 max-sm:mt-16 flex max-sm:flex-col max-sm:w-full flex-row gap-[1rem] ps-[9rem] mt-[10rem]">
        <StatCard
          number={90}
          image="/assets/shape-to-export.svg"
          // image="/assets/grid-area-01.svg"
          label={String(t("foot.statCard.channelPartner.label"))}
          bgColor="#00C5CF"
          textColor="#FFFFFF"
          arrowIcon="/assets/arrow-icon.png"
          hoverText={String(t("foot.statCard.channelPartner.hover1"))}
          hoverText2={String(t("foot.statCard.channelPartner.hover2"))}
          hoverArrowIcon="/assets/arrow-icon.png"
        />
        <StatCard
          number={150}
          image="/assets/grid-area-01.svg"
          label={String(t("foot.statCard.employee.label"))}
          bgColor="#FFFFFF"
          textColor="#2B3B3B"
          arrowIcon="/assets/01.png"
          hoverText={String(t("foot.statCard.employee.hover1"))}
          hoverText2={String(t("foot.statCard.employee.hover2"))}
          hoverArrowIcon="/assets/01.png"
        />
      </div> */}

        {/* <div className="flex-column w-full py-4 justify-center text-center md:justify-between md:flex">
          <span className="font-general text-sm text-black/40 text-center">{t("foot.bottom.copyright")}</span>
          <div className="space-x-4 mt-2 md:mt-0">
            {[t("foot.bottom.privacyPolicy"), t("foot.bottom.terms")].map(
              (item, i) => (
                <a
                  key={i}
                  href=""
                  className="font-general text-sm text-black/40 text-center hover:text-[#00C5CF] hover:underline"
                >
                  {String(item)}
                </a>
              )
            )}
          </div>
        </div> */}

        <div className="flex-column w-full py-4 justify-center text-center md:justify-between md:flex">
          <span className="font-general text-sm text-black/40 text-center">
            {`© ${new Date().getFullYear()} ${t("foot.bottom.copyright")}`}
          </span>
          <div className="space-x-4 mt-2 md:mt-0">
            <Link
              to={localizedTo("/privacy-policy")}
              className="font-general text-sm text-black/40 text-center hover:text-[#00C5CF] hover:underline"
            >
              {t("foot.bottom.privacyPolicy")}
            </Link>
            <Link
              to={localizedTo("/terms-and-conditions")}
              className="font-general text-sm text-black/40 text-center hover:text-[#00C5CF] hover:underline"
            >
              {t("foot.bottom.terms")}
            </Link>
          </div>
        </div>
      </>

      <style>{`
        .nav-animate-link {
          position: relative;
          transition: all 300ms ease;
        }
        .nav-animate-link:hover {
          transform: translateX(0.5rem);
          color: #40C2CC;
          padding-inline-start: 1.75rem;
        }
        .nav-animate-link::before {
          content: "";
          position: absolute;
          inset-inline-start: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 1rem;
          height: 2px;
          background: #40C2CC;
          opacity: 0;
          transition: all 300ms ease;
        }
        .nav-animate-link:hover::before {
          opacity: 1;
          width: 1.5rem;
        }
      `}</style>
    </section>
  );
};

export default Foot;
