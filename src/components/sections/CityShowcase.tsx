"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

/* ── Card data ── */
const CITY_CARDS = [
  {
    city: "Hyderabad",
    image: "https://backend.pavaniinfra.com/uploads/Pavani_Felicity_ea55966d27.jpg",
  },
  {
    city: "Bangalore",
    image: "https://backend.pavaniinfra.com/uploads/MIRABILIA_ddb7ad0906.jpg",
  },
  {
    city: "Chennai",
    image: "https://backend.pavaniinfra.com/uploads/Pavani_Northstar_97a57a504e.jpg",
  },
  {
    city: "Vijayawada",
    image: "https://backend.pavaniinfra.com/uploads/Pavani_Solitaire_aaa5e8c629.jpg",
  },
  {
    city: "Nellore",
    image: "https://backend.pavaniinfra.com/uploads/Pavani_Vista_f5574ad651.png",
  },
];

/* Alternating high-low stagger: even=up, odd=down */
const Y_OFFSETS_LG = [0, 72, 0, 72, 0];
const Y_OFFSETS_MD = [0, 52, 0, 52, 0];

/* ═══════════════════════════════════════════════
   MAP PIN — inline SVG
   ═══════════════════════════════════════════════ */
function MapPin({ className }: { className?: string }) {
  return (
    <svg
      className={`w-4 h-5 md:w-5 md:h-6 lg:w-6 lg:h-8 ${className ?? ""}`}
      viewBox="0 0 28 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="14" cy="34" rx="5" ry="2" fill="rgba(0,0,0,0.15)" />
      <path
        d="M14 0C6.268 0 0 6.268 0 14c0 9.8 12.348 20.625 12.876 21.09a1.5 1.5 0 0 0 2.248 0C15.652 34.625 28 23.8 28 14 28 6.268 21.732 0 14 0Z"
        fill="#950921"
      />
      <circle cx="14" cy="13" r="5.5" fill="white" />
      <circle cx="14" cy="13" r="3" fill="#950921" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   MOBILE LAYOUT — static vertical card list
   ═══════════════════════════════════════════════ */
function MobileLayout() {
  return (
    <section className="relative bg-[#FAFAFA] py-16 px-4">
      {/* Background map — fills entire section */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="relative w-full h-full opacity-[0.4]">
          <Image src="/images/india-topographic-map.png" alt="" fill className="object-cover object-center" sizes="100vw" />
        </div>
      </div>

      {/* Title */}
      <div className="relative z-10 mb-8 px-1">
        <h2
          className="text-3xl font-bold text-[#0e1a26] tracking-tight leading-[1.1] uppercase"
          style={{ fontFamily: "var(--font-display-custom)" }}
        >
          Multiple Cities,<br />One Unified Vision
        </h2>
        <p
          className="text-[#0e1a26]/60 text-sm max-w-xs leading-relaxed mt-3"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Pavani Infra has shaped skylines and changed lives across India.
        </p>
      </div>

      {/* Cards — 2-column staggered layout: left column up, right column down */}
      <div className="relative z-10 flex gap-3.5">
        {/* Left column — cards 0, 2, 4 (high) */}
        <div className="flex-1 flex flex-col gap-3.5">
          {CITY_CARDS.filter((_, i) => i % 2 === 0).map((card, idx) => (
            <div key={`mobile-left-${idx}`}>
              <div className="bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(149,9,33,0.06)]">
                <div className="relative w-full aspect-3/4 overflow-hidden">
                  <Image
                    src={card.image}
                    alt={`Pavani Infra project in ${card.city}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 45vw"
                  />
                </div>
                <div className="py-2 px-2 text-center border-t border-[#e0e0e0]/20">
                  <span
                    className="text-sm font-semibold text-[#0e1a26] tracking-wider"
                    style={{ fontFamily: "var(--font-display-custom)" }}
                  >
                    {card.city}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right column — cards 1, 3 (low, offset down) */}
        <div className="flex-1 flex flex-col gap-3.5 mt-14">
          {CITY_CARDS.filter((_, i) => i % 2 === 1).map((card, idx) => (
            <div key={`mobile-right-${idx}`}>
              <div className="bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(149,9,33,0.06)]">
                <div className="relative w-full aspect-3/4 overflow-hidden">
                  <Image
                    src={card.image}
                    alt={`Pavani Infra project in ${card.city}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 45vw"
                  />
                </div>
                <div className="py-2 px-2 text-center border-t border-[#e0e0e0]/20">
                  <span
                    className="text-sm font-semibold text-[#0e1a26] tracking-wider"
                    style={{ fontFamily: "var(--font-display-custom)" }}
                  >
                    {card.city}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   DESKTOP / TABLET LAYOUT — alternating high-low stagger
   Even cards (0,2,4) sit high, odd cards (1,3) sit low.
   ═══════════════════════════════════════════════ */
function DesktopLayout() {
  const [isLg, setIsLg] = useState(false);

  useEffect(() => {
    const check = () => setIsLg(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const yOffsets = isLg ? Y_OFFSETS_LG : Y_OFFSETS_MD;

  return (
    <section className="relative bg-[#FAFAFA] py-16 md:py-24">
      {/* Background map — fills entire section top to bottom */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="relative w-full h-full opacity-[0.4]">
          <Image src="/images/india-topographic-map.png" alt="" fill className="object-cover object-center" sizes="100vw" priority />
        </div>
      </div>

      {/* Top spacing to balance with bottom offset spacer */}
      <div className="h-4 md:h-6 lg:h-8" />

      {/* Title + Subtitle */}
      <div className="relative z-10 px-4 md:px-8 lg:px-12 flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-12">
        <div>
          <h2
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#0e1a26] tracking-tight leading-[1.08] uppercase"
            style={{ fontFamily: "var(--font-display-custom)" }}
          >
            Multiple Cities,<br />One Unified Vision
          </h2>
        </div>
        <p
          className="text-[#0e1a26]/60 text-sm md:text-[15px] max-w-sm leading-relaxed"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Pavani Infra has shaped skylines and changed lives across India. These
          numbers tell our story of commitment and excellence.
        </p>
      </div>

      {/* Cards — alternating high/low stagger */}
      <div className="relative z-10 mt-16 md:mt-20 lg:mt-24 px-4 md:px-8 lg:px-12">
        <div className="flex items-start gap-4 md:gap-5 lg:gap-6">
          {CITY_CARDS.map((card, i) => (
            <div
              key={`city-card-${i}`}
              className="relative flex-1 min-w-0"
              style={{
                transform: `translateY(${yOffsets[i]}px)`,
              }}
            >
              {/* Map pin */}
              <div className="flex justify-center -mb-0.5 z-10 pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
                <MapPin />
              </div>

              <div className="bg-white rounded-xl shadow-[0_4px_24px_rgba(149,9,33,0.08)] hover:shadow-[0_8px_32px_rgba(149,9,33,0.14)] transition-shadow duration-500 cursor-pointer group overflow-hidden">
                <div className="relative w-full aspect-3/4 overflow-hidden">
                  <Image
                    src={card.image}
                    alt={`Pavani Infra project in ${card.city}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 20vw, 18vw"
                  />
                </div>
                <div className="py-2 md:py-2.5 lg:py-3 px-1.5 text-center border-t border-[#e0e0e0]/20">
                  <span
                    className="text-xs md:text-sm lg:text-base font-semibold text-[#0e1a26] tracking-wider leading-none"
                    style={{ fontFamily: "var(--font-display-custom)" }}
                  >
                    {card.city}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Extra spacing to account for translateY on dropped cards */}
      <div className="h-14 md:h-20 lg:h-24" />
    </section>
  );
}

/* ═══════════════════════════════════════════════
   MAIN — switches layout at 768px
   ═══════════════════════════════════════════════ */
export default function CityShowcase() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  const checkMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    checkMobile();
    setMounted(true);
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [checkMobile]);

  if (!mounted) return <section className="relative min-h-screen bg-cream" />;

  return isMobile ? <MobileLayout /> : <DesktopLayout />;
}
