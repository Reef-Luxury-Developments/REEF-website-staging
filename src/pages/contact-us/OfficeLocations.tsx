import React from "react";
import { MdArrowOutward } from "react-icons/md";
import { GoArrowDownLeft } from "react-icons/go";
import { useLanguage } from "../../i18n/LanguageProvider";
import { trackEvent } from "../../utils/analytics";
/**
 * OfficeLocations – "VISIT OUR OFFICE" section
 *
 * Props:
 * - title: string (default: translated "VISIT OUR OFFICE")
 * - items: Array<{ id?: string|number; label?: string; address: string; mapHref?: string; }>
 *
 * Example:
 * <OfficeLocations />
 */
export default function OfficeLocations({
  items,
}: {
  items?: { id?: string | number; address: string; mapHref?: string }[];
}) {
  const { t } = useLanguage();
  const sectionTitle = t("contact.visitOffice");
  const computedItems =
    items && items.length
      ? items
      : [
          {
            id: "01",
            address: String(t("contact.officeLocations.address2")),
            mapHref: "https://maps.app.goo.gl/1Zu4EFcGMGhbksi1A",
          },
          {
            id: "02",
            address: String(t("contact.officeLocations.address1")),
            mapHref: "https://maps.app.goo.gl/ZoKjSiwmPxkWMm33A?g_st=aw",
          },
        ];

  return (
    <section className="w-full py-12 px-8 md:w-5/6 md:mx-auto md:py-24 md:px-0">
      {/* Title */}

      <h1 className="w-full uppercase font-bodoni text-[clamp(3rem,5vw,5rem)] text-[rgb(10,24,26,1)] leading-[1] text-start">
        {sectionTitle}
      </h1>

      {/* Locations List */}
      <div className="grid grid-cols-1 pt-12 gap-12 lg:grid-cols-2 md:gap-4 py-6 md:pt-24">
        {computedItems.map((item, idx) => (
          <div key={item.id ?? idx} className="flex flex-col gap-4 md:flex-row">
            {/* Number */}
            <div className="text-md font-general font-medium text-[#40C2CC]">
              {String(item.id ?? idx + 1).padStart(2, "0")}
            </div>

            {/* Content */}
            <div className="flex flex-col justify-between gap-6">
              <h3 className="font-general text-[#0A181A] text-2xl font-medium">
                {item.address}
              </h3>

              {item.mapHref && (
                <a
                  onClick={() =>
                    trackEvent("address_click", {
                      clicked_location: item.address,
                    })
                  }
                  href={item.mapHref}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1"
                >
                  <span className="font-general text-nowrap text-lg font-medium text-[0A181A]/80 text-[#40C2CC] hover:underline">
                    {t("contact.viewOnMap")}
                  </span>
                  <MdArrowOutward className="text-xl  text-[#0A181A]/20 mt-[.25rem]" />
                </a>
              )}
            </div>
            {/* Link */}
          </div>
        ))}
      </div>
    </section>
  );
}
