"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

/* ── Card data matching the Figma layout ── */
const CITY_CARDS = [
  {
    city: "Bengaluru",
    image: "https://backend.pavaniinfra.com/uploads/MIRABILIA_ddb7ad0906.jpg",
    spreadX: 7,
    spreadY: 42,
    rotation: -5,
    stackOffsetX: -20,
    stackOffsetY: -10,
    stackRotation: -10,
  },
  {
    city: "Hyderabad",
    image: "https://backend.pavaniinfra.com/uploads/Pavani_Felicity_ea55966d27.jpg",
    spreadX: 28,
    spreadY: 6,
    rotation: 3,
    stackOffsetX: -7,
    stackOffsetY: -5,
    stackRotation: 4,
  },
  {
    city: "Chennai",
    image: "https://backend.pavaniinfra.com/uploads/Pavani_Northstar_97a57a504e.jpg",
    spreadX: 35,
    spreadY: 58,
    rotation: -2,
    stackOffsetX: 0,
    stackOffsetY: 0,
    stackRotation: 0,
  },
  {
    city: "Hyderabad",
    image: "https://backend.pavaniinfra.com/uploads/Pavani_Solitaire_aaa5e8c629.jpg",
    spreadX: 55,
    spreadY: 30,
    rotation: 4,
    stackOffsetX: 9,
    stackOffsetY: 5,
    stackRotation: -6,
  },
  {
    city: "Hyderabad",
    image: "https://backend.pavaniinfra.com/uploads/Pavani_Vista_f5574ad651.png",
    spreadX: 72,
    spreadY: 4,
    rotation: -3,
    stackOffsetX: 17,
    stackOffsetY: -7,
    stackRotation: 8,
  },
];

/* ── Simplified India map outline (background decoration) ── */
function IndiaMapOutline() {
  return (
    <svg
      viewBox="0 0 400 520"
      className="w-auto h-full max-h-[88%]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main outline */}
      <path
        d="M195 8C200 4 210 6 218 10L228 8C235 12 245 15 255 12L268 18C275 16 285 20 295 28L308 24C315 30 322 30 330 40L340 48C346 54 350 50 358 60L365 55C368 62 372 75 368 85L358 95C355 105 358 118 362 128L365 142C360 152 352 160 348 170L350 188C354 200 356 215 350 228L342 242C345 258 350 268 344 282L334 298C324 312 314 328 304 345L292 362C284 375 276 390 270 406L260 425C254 438 248 452 244 465L246 478C250 486 254 494 250 504L240 510C232 506 224 498 218 488L210 472C202 455 194 438 186 422L174 402C167 385 160 368 152 352L142 335C134 318 127 302 122 285L114 268C108 252 100 238 94 225L88 208C84 195 82 180 84 168L88 155C82 142 76 130 80 118L88 105C84 92 82 78 90 65L104 55C114 48 124 40 137 34L152 28C162 22 170 18 178 14Z"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.5"
      />
      {/* Subtle internal region lines */}
      <path
        d="M185 130C210 135 240 132 270 140"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.25"
        strokeDasharray="4 6"
      />
      <path
        d="M160 200C195 195 230 200 265 210"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.25"
        strokeDasharray="4 6"
      />
      <path
        d="M145 280C180 275 215 280 250 295"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.25"
        strokeDasharray="4 6"
      />
      <path
        d="M270 80C262 110 260 145 268 175"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.2"
        strokeDasharray="3 5"
      />
      {/* City dot markers */}
      <circle cx="215" cy="260" r="3" fill="currentColor" opacity="0.15" />
      <circle cx="180" cy="340" r="3" fill="currentColor" opacity="0.15" />
      <circle cx="250" cy="350" r="3" fill="currentColor" opacity="0.15" />
      <circle cx="260" cy="280" r="3" fill="currentColor" opacity="0.15" />
    </svg>
  );
}

export default function CityShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    if (!section || !container || cards.length === 0) return;

    const rect = container.getBoundingClientRect();
    const cardW = cards[0].offsetWidth;
    const cardH = cards[0].offsetHeight;

    // Center of container (for stacked position)
    const cx = rect.width / 2 - cardW / 2;
    const cy = rect.height / 2 - cardH / 2;

    // Spread positions (percentage → pixel)
    const spreadPos = CITY_CARDS.map((card) => ({
      x: (card.spreadX / 100) * rect.width - cardW / 2,
      y: (card.spreadY / 100) * rect.height - cardH / 2,
    }));

    const ctx = gsap.context(() => {
      /* ── Initial states ── */
      gsap.set(titleRef.current, { opacity: 0, y: 50 });
      gsap.set(subtitleRef.current, { opacity: 0, y: 35 });

      // Cards: centered, pushed 400px below, hidden
      gsap.set(cards, {
        x: (i: number) => cx + CITY_CARDS[i].stackOffsetX,
        y: cy + 400,
        rotation: (i: number) => CITY_CARDS[i].stackRotation,
        opacity: 0,
        scale: 0.88,
      });

      /* ── Build animation timeline ── */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
          toggleActions: "play none none none",
        },
      });

      // Phase 1 → Cards fly up into stacked pile (center)
      tl.to(cards, {
        y: (i: number) => cy + CITY_CARDS[i].stackOffsetY,
        opacity: 1,
        scale: 1,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
      });

      // Hold on stack for dramatic effect
      tl.addLabel("stacked", "+=0.5");

      // Phase 2 → Cards spread to geographic positions
      tl.to(
        cards,
        {
          x: (i: number) => spreadPos[i].x,
          y: (i: number) => spreadPos[i].y,
          rotation: (i: number) => CITY_CARDS[i].rotation,
          duration: 1.3,
          stagger: 0.07,
          ease: "power3.inOut",
        },
        "stacked"
      );

      // Title fades in during spread
      tl.to(
        titleRef.current,
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
        "stacked+=0.15"
      );

      // Subtitle follows
      tl.to(
        subtitleRef.current,
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
        "stacked+=0.35"
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-cream py-16 md:py-24"
    >
      {/* ── Faint India map background ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-navy/[0.06]">
        <IndiaMapOutline />
      </div>

      {/* ── Title + Subtitle ── */}
      <div className="relative z-10 px-6 md:px-12 lg:px-20 flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-12">
        <div ref={titleRef}>
          <h2
            className="text-3xl md:text-4xl lg:text-[3.2rem] font-bold text-navy tracking-tight leading-[1.08] uppercase"
            style={{ fontFamily: "var(--font-display-custom)" }}
          >
            Multiple Cities,
            <br />
            One Unified Vision
          </h2>
        </div>
        <p
          ref={subtitleRef}
          className="text-navy/50 text-sm md:text-[15px] max-w-sm leading-relaxed"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Pavani Infra has shaped skylines and changed lives across India. These
          numbers tell our story of commitment and excellence.
        </p>
      </div>

      {/* ── Cards container ── */}
      <div
        ref={containerRef}
        className="relative w-full h-[50vh] md:h-[60vh] lg:h-[68vh] mt-8"
      >
        {CITY_CARDS.map((card, i) => (
          <div
            key={`city-card-${i}`}
            ref={(el: HTMLDivElement | null) => {
              cardsRef.current[i] = el;
            }}
            className="absolute top-0 left-0 will-change-transform"
            style={{ zIndex: CITY_CARDS.length - i }}
          >
            <div className="w-36 md:w-44 lg:w-48 bg-white rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(13,26,38,0.1)] hover:shadow-[0_8px_32px_rgba(13,26,38,0.16)] transition-shadow duration-500 cursor-pointer group">
              {/* Card image */}
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <Image
                  src={card.image}
                  alt={`Pavani Infra project in ${card.city}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 144px, (max-width: 1024px) 176px, 192px"
                />
              </div>
              {/* City name label */}
              <div className="py-2.5 px-3 text-center border-t border-cream-dark/20">
                <span
                  className="text-xs md:text-sm font-semibold text-navy tracking-wider"
                  style={{ fontFamily: "var(--font-display-custom)" }}
                >
                  {card.city}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
