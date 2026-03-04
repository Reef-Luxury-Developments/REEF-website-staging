import { ReactNode } from "react";
import Navbar from "../../components/Navbar";
import Tab from "../../components/brand/tab";
import { useLanguage, useTArray, RichText } from "../../i18n/LanguageProvider";

type SectionProps = { title: string; children: ReactNode };
const Section = ({ title, children }: SectionProps) => (
  <section className="mt-6">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    {children}
  </section>
);

type ListProps = { items: ReactNode[] };
const List = ({ items }: ListProps) => (
  <ul className="list-disc list-outside pl-6 mb-4 space-y-1">
    {items.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
);

type SectionBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] };

type Section = { title: string; content: SectionBlock[] };

const TermsAndConditions = () => {
  const { t } = useLanguage();
    const effectiveLabel = t("privacy.effectiveLabel");
  const effectiveDate = t("privacy.effectiveDate");

  const pageTitle = t("terms.title", { defaultValue: "TERMS AND CONDITIONS" });
  const sections = useTArray<Section>(t, "terms.sections");

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="p-6 w-full mx-auto flex-1">
        <div className="h-full overflow-y-auto border border-gray-300 p-6 rounded-lg shadow-lg bg-white">
          <h1 className="text-2xl font-bold mb-6 text-center">
            {pageTitle}
          </h1>
   <p className="mb-4">
            <strong>{effectiveLabel}</strong> {effectiveDate}
          </p>
          {sections.map((section, sIdx) => (
            <Section key={`${sIdx}-${section.title}`} title={section.title}>
              {section.content.map((block, bIdx) => {
                if (block.type === "p") {
                  return (
                    <p key={bIdx} className="mb-4">
                      <RichText html={block.text} />
                    </p>
                  );
                }
                if (block.type === "ul") {
                  return (
                    <List
                      key={bIdx}
                      items={block.items.map((it, i) => (
                        <RichText key={i} html={it} />
                      ))}
                    />
                  );
                }
                return null;
              })}
            </Section>
          ))}
        </div>
      </main>
      <Tab />
    </div>
  );
};

export default TermsAndConditions;

