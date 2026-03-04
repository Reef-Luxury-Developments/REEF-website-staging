import React from "react";
import { FiPhone } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { BsSuitcaseLg } from "react-icons/bs";
import { PiUsersThreeBold } from "react-icons/pi";
import { useLanguage } from "../../i18n/LanguageProvider";
import { trackEvent } from "../../utils/analytics";

/**
 * ContactCards – standalone section for 4 contact options
 * Usage:
 *   <ContactCards />
 *   // or pass custom items via the `items` prop
 */

const handleCardClick = (id: string) => {
  switch (id) {
    case "callUs":
      trackEvent("call_button_click");
      break;
    case "chatWithUs":
      trackEvent("whatsapp_click");
      break;
    case "joinUs":
      trackEvent("join_us_email_click");
      break;
    case "becomePartner":
      trackEvent("partner_email_click");
      break;
    default:
      break;
  }
};
export default function ContactCards({ items }: any) {
  const { t } = useLanguage();

  const defaultItems = [
    {
      id: "callUs",
      icon: <FiPhone className="w-6 h-6" />,
      title: t("contact.cards.callUs"),
      desc: t("contact.cards.callDesc"),
      link: {
        label: "+971 80037333",
        href: "tel:+97180037333",
        dir: "ltr",
      },
    },
    {
      id: "chatWithUs",
      icon: <FaWhatsapp className="w-6 h-6" />,
      title: t("contact.cards.chatWithUs"),
      desc: t("contact.cards.chatDesc"),
      link: {
        label: t("contact.cards.startChat"),
        href: "https://wa.me/97180037333",
        dir: "",
      },
    },
    {
      id: "joinUs",
      icon: <BsSuitcaseLg className="w-6 h-6" />,
      title: t("contact.cards.joinUs"),
      desc: t("contact.cards.joinDesc"),
      link: {
        label: "careers@reefdevelopments.ae",
        href: "mailto:careers@reefdevelopments.ae",
        dir: "ltr",
      },
    },
    {
      id: "becomePartner",
      icon: <PiUsersThreeBold className="w-6 h-6" />,
      title: t("contact.cards.becomePartner"),
      desc: t("contact.cards.partnerDesc"),
      link: {
        label: "channelpartners@reefdevelopments.ae",
        href: "mailto:channelpartners@reefdevelopments.ae",
        dir: "ltr",
      },
    },
  ];

  const data = items?.length ? items : defaultItems;

  const getHref = (href?: string): string => {
    if (!href) return "#";
    if (
      href.startsWith("http") ||
      href.startsWith("tel:") ||
      href.startsWith("mailto:")
    )
      return href;
    if (href.includes("@")) return `mailto:${href}`;
    if (/^\+?\d/.test(href)) return `tel:${href}`;
    return href;
  };

  const isExternal = (href: string): boolean => href.startsWith("http");

  return (
    <section className="grid grid-cols-1 gap-4 w-full py-12 px-4 lg:grid-cols-4 md:grid-cols-2 md:px-0  md:py-24 md:w-5/6 md:mx-auto">
      {data.map((item: any, idx: number) => {
        const href = getHref(item.link?.href);
        return (
          <a
            key={idx}
            onClick={() => handleCardClick(item.id)}
            href={href}
            target={isExternal(href) ? "_blank" : undefined}
            rel={isExternal(href) ? "noopener noreferrer" : undefined}
            className="w-full px-6 py-6 rounded-2xl border border-[#0A181A]/15 transition-all ease-in-out duration-300 hover:bg-[#40C2CC] hover:border-[#40C2CC] group"
          >
            <div className="text-[#40C2CC] group-hover:text-white">
              {item.icon}
            </div>

            <h3 className="text-xl font-general font-medium text-[#0A181A] mt-4 group-hover:text-white ">
              {item.title}
            </h3>

            <p className="text-md font-general text-[#0A181A]/55 group-hover:text-white/80">
              {item.desc}
            </p>
            <div className="flex flex-col mt-4 items-start">
              {item.link?.label && (
                <span
                  className="text-md font-general text-[#40C2CC] group-hover:text-white group-hover:italic "
                  dir={item.link.dir}
                >
                  {item.link.label}
                </span>
              )}
            </div>
          </a>
        );
      })}
    </section>
  );
}
