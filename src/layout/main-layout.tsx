// MainLayout.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Foot from "../components/footer/foot";

type MainLayoutProps = {
  children: React.ReactNode;
  /** مسار التوجيه بعد الفيديو (اختياري) */
  redirectTo?: string; // مثال: "/home"
  /** خلي المقدمة تشتغل مرة واحدة بكل جلسة (اختياري) */
  playOncePerSession?: boolean;
};

export default function MainLayout({
  children,
  redirectTo,
  playOncePerSession = false,
}: MainLayoutProps) {
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(() => {
    if (playOncePerSession && typeof window !== "undefined") {
      return sessionStorage.getItem("introPlayed") !== "true";
    }
    return true;
  });

  // منع سكرول أثناء عرض المقدمة
  useEffect(() => {
    if (showIntro) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showIntro]);

  const finishIntro = () => {
    if (playOncePerSession) {
      try {
        sessionStorage.setItem("introPlayed", "true");
      } catch {}
    }
    setShowIntro(false);
    if (redirectTo) navigate(redirectTo);
  };

  return (
    <div className="relative min-h-screen w-full max-sm:overflow-x-hidden">
      {children}
      <Foot />

      {showIntro ? (
        <div className="fixed w-screen h-screen inset-0 z-[9999] flex items-center justify-center bg-[#40C2CC]">
          <div className="flex aspect-square w-[20rem] max-w-[85vw] shrink-0 items-center justify-center min-h-[min(20rem,85vw)] md:min-h-0 md:w-1/4">
            <img
              width={512}
              height={512}
              className="block h-full w-full max-h-full max-w-full object-contain"
              src="/assets/Logo_Intero.gif"
              alt=""
              decoding="async"
              fetchPriority="high"
              loading="eager"
              onLoad={() => setTimeout(finishIntro, 3200)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
