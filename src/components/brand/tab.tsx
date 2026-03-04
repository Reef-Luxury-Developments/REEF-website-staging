const Tab = () => {

  const basePair = [
    { src: "/assets/brand-logo-slider-p1.svg", heightClass: "h-[1.5rem] md:h-[2.5rem]" },
    { src: "/assets/brand-logo-slider-p2.svg", heightClass: "h-[0.75rem] md:h-[0.75rem]" },
  ];
  const images = Array.from({ length: 10 }, () => basePair).flat();

  return (
    <div className="relative w-full h-auto py-4 md:py-8 overflow-hidden bg-[#40C2CC]">
      <div className="flex items-center gap-12 marquee-track">
        {[...images, ...images].map((img, i) => (
          <img
            key={i}
            src={img.src}
            alt=""
            className={`w-auto ${img.heightClass} object-contain flex-shrink-0`}
          />
        ))}
      </div>

      <style>{`
          .marquee-track {
            width: fit-content;
            display: flex;
            animation: marquee 20s linear infinite;
          }
  
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
  
          @keyframes border-flash {
            0%, 94% {
              border-top-color: rgba(255, 255, 255, 0.2);
            }
            95%, 99% {
              border-top-color: transparent;
            }
            100% {
              border-top-color: rgba(255, 255, 255, 0.2);
            }
          }
  
          .animate-border-flash {
            animation: border-flash 5s linear infinite;
          }
        `}</style>
    </div>
  );
};

export default Tab;
