import { useEffect } from "react";
import { ThemeProvider } from "./theme/ThemeProvider";
import MainLayout from "./layout/main-layout";
import AppRouter from "../route/AppRouter";
import { LanguageProvider } from "./i18n/LanguageProvider";
import ScrollToTop from "./components/footer/ScrollToTop";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { setQueryClient } from "./axios";
import TagManager from "react-gtm-module";

const tagManagerArgs = {
  gtmId: "GTM-KRFNJHQX",
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
setQueryClient(queryClient);

function initGtmWhenIdle() {
  if (typeof window === "undefined") return;
  if (document.querySelector('script[src*="googletagmanager.com/gtm.js"]')) {
    return;
  }
  TagManager.initialize(tagManagerArgs);
}

export default function App() {
  useEffect(() => {
    const run = () => initGtmWhenIdle();
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(run, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    window.addEventListener("load", run, { once: true });
    return () => window.removeEventListener("load", run);
  }, []);

  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  if (!recaptchaSiteKey) {
    console.warn("recaptcha is not set");
  }

  return (
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
  );
}
