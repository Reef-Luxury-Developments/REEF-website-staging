import { ThemeProvider } from "./theme/ThemeProvider";
import MainLayout from "./layout/main-layout";
import AppRouter from "../route/AppRouter";
import "leaflet/dist/leaflet.css";
import { LanguageProvider } from "./i18n/LanguageProvider";
import ScrollToTop from "./components/footer/ScrollToTop";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { setQueryClient } from "./axios";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import TagManager from "react-gtm-module";

const tagManagerArgs = {
  // my gtm
  // gtmId: "GTM-5Q557C9D",

  // live gtm
  gtmId: "GTM-KRFNJHQX",
};

// Initialize GTM once, outside component
if (typeof window !== "undefined") {
  const gtmScript = document.querySelector(
    'script[src*="googletagmanager.com/gtm.js"]'
  );
  if (!gtmScript) {
    TagManager.initialize(tagManagerArgs);
  }
}

const queryClient = new QueryClient();
setQueryClient(queryClient);

// Get initial language from localStorage for reCAPTCHA
const getInitialLanguage = (): string => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("lang");
    return saved === "ar" || saved === "en" ? saved : "en";
  }
  return "en";
};

export default function App() {
  // useEffect(() => {
  //   TagManager.initialize(tagManagerArgs);
  // }, []);
  // useEffect(() => {
  //   ReactGA.initialize("G-E65CENR468");
  //   ReactGA.send({
  //     hitType: "pageview",
  //     page: window.location.pathname,
  //     title: "test test",
  //   });
  // }, []);

  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  if (!recaptchaSiteKey) {
    console.warn("recaptcha is not set");
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={recaptchaSiteKey || ""}
      language={getInitialLanguage()}
    >
      <LanguageProvider>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <div className="min-h-screen bg-white text-gray-900 font-serif">
              <MainLayout>
                <ToastContainer />
                <ScrollToTop />
                <AppRouter />
              </MainLayout>
            </div>
          </QueryClientProvider>
        </ThemeProvider>
      </LanguageProvider>
    </GoogleReCaptchaProvider>
  );
}
