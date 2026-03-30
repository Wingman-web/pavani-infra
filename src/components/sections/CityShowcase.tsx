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

/* Zigzag Y offsets in px — down, up, down, up, down */
const Y_OFFSETS_LG = [80, -20, 100, -10, 70];
const Y_OFFSETS_MD = [50, -10, 60, -5, 45];
const ROTATIONS = [-4, 3, -2, 4, -3];

/* ═══════════════════════════════════════════════
   MAP PIN — inline SVG
   ═══════════════════════════════════════════════ */
function MapPin({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="32"
      height="42"
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
    <section className="relative bg-[#FAFAFA] py-16 px-5">
      {/* Background map */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="relative w-full h-full opacity-[0.8]">
          <Image src="/images/india-topographic-map.png" alt="" fill className="object-contain object-center" sizes="100vw" />
        </div>
      </div>

      {/* Title */}
      <div className="relative z-10 mb-10">
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

      {/* Cards */}
      <div className="relative z-10">
        <div
          className="absolute left-5.5 top-3 bottom-3 w-0.5 bg-linear-to-b from-red via-red-light to-red"
          style={{ zIndex: 0 }}
        />
        <div className="flex flex-col gap-5">
          {CITY_CARDS.map((card, i) => (
            <div
              key={`mobile-card-${i}`}
              className="relative flex items-center gap-4"
              style={{ zIndex: 1 }}
            >
              <div className="relative shrink-0 w-11 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-red relative z-10" />
                <div className="absolute w-6 h-6 rounded-full border border-red/30 city-dot-ring" />
              </div>
              <div className="flex-1 flex items-center gap-4 bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(149,9,33,0.06)] p-2.5">
                <div className="relative w-28 h-22 shrink-0 rounded-lg overflow-hidden">
                  <Image src={card.image} alt={`Pavani Infra project in ${card.city}`} fill className="object-cover" sizes="112px" />
                </div>
                <span
                  className="text-base font-semibold text-[#0e1a26] tracking-wider"
                  style={{ fontFamily: "var(--font-display-custom)" }}
                >
                  {card.city}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   DESKTOP / TABLET LAYOUT — static zigzag layout
   Uses flex row with translateY for zigzag.
   Cards stay in normal flow — no clipping.
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
    <section className="relative bg-[#FAFAFA] pt-16 pb-8 md:pt-20 md:pb-12">
      {/* Background map — contained so it doesn't bleed */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="relative w-full h-full max-w-5xl mx-auto opacity-[0.8]">
          <Image src="/images/india-topographic-map.png" alt="" fill className="object-contain object-center" sizes="1000px" priority />
        </div>
      </div>

      {/* Title + Subtitle */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-12">
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

      {/* Cards — flex row, zigzag via translateY */}
      <div className="relative z-10 max-w-7xl mx-auto mt-16 md:mt-20 px-6 md:px-12 lg:px-20">
        <div className="flex justify-between items-start gap-3 md:gap-4 lg:gap-6">
          {CITY_CARDS.map((card, i) => (
            <div
              key={`city-card-${i}`}
              className="relative flex-1 min-w-0"
              style={{
                transform: `translateY(${yOffsets[i]}px) rotate(${ROTATIONS[i]}deg)`,
                zIndex: CITY_CARDS.length - i + 1,
              }}
            >
              {/* Map pin */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-10 pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
                <MapPin />
              </div>

              <div className="bg-white rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(149,9,33,0.08)] hover:shadow-[0_8px_32px_rgba(149,9,33,0.12)] transition-shadow duration-500 cursor-pointer group">
                <div className="relative w-full aspect-4/3 overflow-hidden">
                  <Image
                    src={card.image}
                    alt={`Pavani Infra project in ${card.city}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 20vw, (max-width: 1024px) 18vw, 15vw"
                  />
                </div>
                <div className="py-1 px-1 text-center border-t border-[#e0e0e0]/20">
                  <span
                    className="text-[10px] md:text-xs lg:text-sm font-semibold text-[#0e1a26] tracking-wider leading-none"
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

      {/* Bottom spacing to account for zigzag offset */}
      <div className="h-16 md:h-20 lg:h-24" />
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
