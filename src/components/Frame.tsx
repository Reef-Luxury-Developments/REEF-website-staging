import { useEffect, useRef, useState } from "react";

interface props {
  index: number;
}

export default function Frame({ index }: props) {
  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // useEffect(() => {
  //   const handleMouseMove = (e: MouseEvent) => {
  //     if (!hovered || !containerRef.current) return;

  //     const bounds = containerRef.current.getBoundingClientRect();
  //     const x = e.clientX - bounds.left;
  //     const y = e.clientY - bounds.top;

  //     setPosition({ x, y });
  //   };

  //   if (hovered) {
  //     document.addEventListener("mousemove", handleMouseMove);
  //   } else {
  //     document.removeEventListener("mousemove", handleMouseMove);
  //   }

  //   return () => document.removeEventListener("mousemove", handleMouseMove);
  // }, [hovered]);

  return (

    <div
      ref={containerRef}
      className="relative h-screen max-sm:h-[30rem] overflow-hidden"
    >
      {/* Background video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/assets/home-hero-video.webm"
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={() => setVideoLoaded(true)} // when video is ready
      />
      {/* Image placeholder */}
      {!videoLoaded && (
        <img
          src="/assets/public/assets/home-hero-placeholder.webp"
          alt="REEF Hero Placeholder"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      )}
    </div>
  );
}
