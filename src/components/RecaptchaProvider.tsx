import type { ReactNode } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { useLanguage } from "../i18n/LanguageProvider";

export default function RecaptchaProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  const reCaptchaKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "";

  return (
    <GoogleReCaptchaProvider reCaptchaKey={reCaptchaKey} language={language}>
      {children}
    </GoogleReCaptchaProvider>
  );
}
