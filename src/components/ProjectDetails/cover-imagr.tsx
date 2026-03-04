import { useLanguage } from "../../i18n/LanguageProvider";

interface Props {
  index: number;
}
const CoverImage = ({ index }: Props) => {
  const { t } = useLanguage();
  return (
    <div className="w-full  h-screen bg-out bg-cover bg-center">
      {/* <img src='/assets/section-sunken 2_1.png' /> */}
      <div className="flex max-w-6xl max-sm:max-w-full mx-auto flex-col items-center max-sm:px-4 pt-24 max-sm:items-start">
        <h1 className="font-bodoni text-[#0A181A] text-3xl sm:text-6xl font-medium uppercase sm:text-center">
          {t("projectdetailsimage.header")}
        </h1>
        <p
          className={`text-lg sm:text-center mt-8 text-[#0A181A8F] max-sm:text-base  max-sm:me-0 me-16 font-sans`}
        >
          {t("projectdetailsimage.text")}
        </p>
      </div>
    </div>
  );
};
export default CoverImage;
