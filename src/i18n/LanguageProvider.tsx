// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";
// import en from "./locales/en.json";
// import ar from "./locales/ar.json";

// export type SupportedLanguage = "en" | "ar";

// type Translations = Record<string, any>; // allow nested objects

// const bundles: Record<SupportedLanguage, Translations> = {
//   en,
//   ar,
// };

// interface LanguageContextValue {
//   language: SupportedLanguage;
//   dir: "ltr" | "rtl";
//   setLanguage: (lang: SupportedLanguage) => void;
//   t: (key: string) => string | string[];
// }

// const LanguageContext = createContext<LanguageContextValue | undefined>(
//   undefined
// );

// // ✅ helper to get nested values
// const getNestedValue = (obj: any, path: string): any => {
//   return path
//     .replace(/\[(\d+)\]/g, ".$1") // turn blogs.sections[0].title → blogs.sections.0.title
//     .split(".")
//     .reduce(
//       (acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined),
//       obj
//     );
// };

// export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [language, setLanguage] = useState<SupportedLanguage>(() => {
//     const saved =
//       typeof window !== "undefined"
//         ? (localStorage.getItem("lang") as SupportedLanguage | null)
//         : null;
//     return saved === "ar" || saved === "en" ? saved : "en";
//   });

//   const dir = language === "ar" ? "rtl" : "ltr";

//   useEffect(() => {
//     if (typeof document !== "undefined") {
//       document.documentElement.setAttribute("dir", dir);
//       document.documentElement.setAttribute("lang", language);
//     }
//     if (typeof window !== "undefined") {
//       localStorage.setItem("lang", language);
//     }
//   }, [language, dir]);

//   const t = useMemo(() => {
//     const dict = bundles[language] ?? bundles.en;
//     return (key: string) => {
//       const value = getNestedValue(dict, key);
//       if (Array.isArray(value)) {
//         return value.join(" "); // join multiple strings
//       }
//       if (typeof value === "object") {
//         return JSON.stringify(value); // fallback for objects
//       }
//       return value !== undefined ? value : key;
//     };
//   }, [language]);

//   // ✅ FIX: define value before using it
//   const value = useMemo(
//     () => ({ language, dir, setLanguage, t }),
//     [language, dir, t]
//   );

//   return (
//     <LanguageContext.Provider value={value}>
//       {children}
//     </LanguageContext.Provider>
//   );
// };

// export const useLanguage = (): LanguageContextValue => {
//   const ctx = useContext(LanguageContext);
//   if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
//   return ctx;
// };


import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import en from "./locales/en.json";
import ar from "./locales/ar.json";

export type SupportedLanguage = "en" | "ar";
type Translations = Record<string, any>;

const bundles: Record<SupportedLanguage, Translations> = { en, ar };

type TOptions = {
  returnObjects?: boolean;
  defaultValue?: any;
};

interface LanguageContextValue {
  language: SupportedLanguage;
  dir: "ltr" | "rtl";
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, opts?: TOptions) => any;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const getNestedValue = (obj: any, path: string): any => {
  return path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    if (
      typeof window !== "undefined" &&
      window.location.pathname.startsWith("/ar")
    )
      return "ar";
    const saved =
      typeof window !== "undefined"
        ? (localStorage.getItem("lang") as SupportedLanguage | null)
        : null;
    return saved === "ar" || saved === "en" ? saved : "en";
  });

  const dir = language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("dir", dir);
      document.documentElement.setAttribute("lang", language);
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", language);
    }
  }, [language, dir]);

  const t = useMemo(() => {
    const dict = bundles[language] ?? bundles.en;
    return (key: string, opts: TOptions = {}) => {
      const value = getNestedValue(dict, key);
      if (value === undefined) return opts.defaultValue !== undefined ? opts.defaultValue : key;

      if (opts.returnObjects) {
        return value;
      }

      if (Array.isArray(value)) return value.join(" ");
      if (typeof value === "object") {
        return opts.defaultValue !== undefined ? opts.defaultValue : key;
      }
      return value;
    };
  }, [language]);

  const value = useMemo(() => ({ language, dir, setLanguage, t }), [language, dir, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};

export const useTArray = <T = any>(tFn: LanguageContextValue["t"], key: string): T[] => {
  const val = tFn(key, { returnObjects: true, defaultValue: [] });
  return Array.isArray(val) ? (val as T[]) : [];
};

export const useTObject = <T = any>(tFn: LanguageContextValue["t"], key: string): T => {
  const val = tFn(key, { returnObjects: true, defaultValue: {} });
  return typeof val === "object" && !Array.isArray(val) ? (val as T) : ({} as T);
};

export const RichText: React.FC<{ html: string; className?: string }> = ({ html, className }) => (
  <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
);