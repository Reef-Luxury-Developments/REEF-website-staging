import { useLanguage } from "../../i18n/LanguageProvider";
import Tab from "./tab";
const Brand = () => {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center bg-[#40C2CC]">
      <div className="flex w-full px-4 py-12 md:w-5/6 md:py-24">
        <h2 className="text-[3rem] md:text-[6rem] text-white text-center leading-[1] uppercase w-full font-bodoni">
          {t("brand.line1")}
          <br />
          <span className="italic">{t("brand.line2")}</span>
        </h2>
      </div>
      <Tab />
    </div>
  );
};

export default Brand;
