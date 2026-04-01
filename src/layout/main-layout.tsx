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
          <img
            className="w-[20rem] md:w-1/4"
            src="/assets/Logo_Intero.gif"
            alt=""
            onLoad={() => setTimeout(finishIntro, 3200)}
          />
        </div>
      ) : null}
    </div>
  );
}
