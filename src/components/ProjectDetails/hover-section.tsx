import { useTheme } from "../../theme/ThemeProvider";
import { useLanguage } from "../../i18n/LanguageProvider";
interface props {
  index: number;
  data: any;
}
const HoverSection = ({ index, data }: props) => {
  const { t } = useLanguage();
  const theme = useTheme();
  const isScrolle = window.screenY > 100;

  return (
    <>
      <div
        className="w-full md:h-screen flex flex-col gap-8 md:justify-between py-24 px-4 md:px-12"
        style={{ background: theme.colors.primary }}
      >
        {/* LEFT SIDE - HEADING */}
        <div className="uppercase font-bodoni text-[clamp(3rem,5vw,5rem)] text-white leading-[1] text-center md:text-start w-full md:w-3/5">
          <h1 className="max-sm:!text-4xl">{data?.slogin}</h1>
        </div>
        <div className="flex justify-end">
          <p className="text-lg text-center font-general md:text-start text-white/80 w-full md:w-1/4">
            {data?.description}
          </p>
        </div>
      </div>
    </>
  );
};

export default HoverSection;
