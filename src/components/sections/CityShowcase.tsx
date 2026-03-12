"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

/* ── Card data ── */
const CITY_CARDS = [
  {
    city: "Hyderabad",
    image: "https://backend.pavaniinfra.com/uploads/Pavani_Felicity_ea55966d27.jpg",
    stackOffsetX: -20,
    stackOffsetY: -10,
    stackRotation: -10,
  },
  {
    city: "Bangalore",
    image: "https://backend.pavaniinfra.com/uploads/MIRABILIA_ddb7ad0906.jpg",
    stackOffsetX: -7,
    stackOffsetY: -5,
    stackRotation: 4,
  },
  {
    city: "Chennai",
    image: "https://backend.pavaniinfra.com/uploads/Pavani_Northstar_97a57a504e.jpg",
    stackOffsetX: 0,
    stackOffsetY: 0,
    stackRotation: 0,
  },
  {
    city: "Vijayawada",
    image: "https://backend.pavaniinfra.com/uploads/Pavani_Solitaire_aaa5e8c629.jpg",
    stackOffsetX: 9,
    stackOffsetY: 5,
    stackRotation: -6,
  },
  {
    city: "Nellore",
    image: "https://backend.pavaniinfra.com/uploads/Pavani_Vista_f5574ad651.png",
    stackOffsetX: 17,
    stackOffsetY: -7,
    stackRotation: 8,
  },
];

/*
 * Y-offsets for zigzag: down, up, down, up, down
 * Values are % of (containerHeight - cardHeight)
 */
const Y_PATTERN = [0.45, 0.0, 0.55, 0.05, 0.4];
const ROTATIONS = [-4, 3, -2, 4, -3];

/* ═══════════════════════════════════════════════
   MAP PIN — inline SVG, drops onto each card
   ═══════════════════════════════════════════════ */
function MapPin({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="28"
      height="36"
      viewBox="0 0 28 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Drop shadow */}
      <ellipse cx="14" cy="34" rx="5" ry="2" fill="rgba(0,0,0,0.15)" />
      {/* Pin body */}
      <path
        d="M14 0C6.268 0 0 6.268 0 14c0 9.8 12.348 20.625 12.876 21.09a1.5 1.5 0 0 0 2.248 0C15.652 34.625 28 23.8 28 14 28 6.268 21.732 0 14 0Z"
        fill="#97081E"
      />
      {/* Inner highlight */}
      <circle cx="14" cy="13" r="5.5" fill="white" />
      <circle cx="14" cy="13" r="3" fill="#97081E" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   MOBILE LAYOUT — vertical card list with line
   ═══════════════════════════════════════════════ */
function MobileLayout() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    if (!section || cards.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(titleRef.current, { opacity: 0, y: 40 });
      gsap.set(subtitleRef.current, { opacity: 0, y: 25 });
      gsap.set(lineRef.current, { scaleY: 0, transformOrigin: "top center" });
      gsap.set(cards, { opacity: 0, x: -30 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });

      tl.to(titleRef.current, {
        opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
      });
      tl.to(subtitleRef.current,
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.5"
      );
      tl.to(lineRef.current,
        { scaleY: 1, duration: 1.2, ease: "power2.inOut" },
        "-=0.3"
      );
      tl.to(cards,
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.15, ease: "power3.out" },
        "-=0.8"
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-cream pt-14 pb-6 px-5">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-full h-full opacity-[0.12]">
          <Image src="/images/india-topographic-map.png" alt="" fill className="object-contain object-center" sizes="100vw" />
        </div>
      </div>

      <div className="relative z-10 mb-10">
        <div ref={titleRef}>
          <h2
            className="text-2xl font-bold text-navy tracking-tight leading-[1.1] uppercase"
            style={{ fontFamily: "var(--font-display-custom)" }}
          >
            Multiple Cities,<br />One Unified Vision
          </h2>
        </div>
        <p ref={subtitleRef}
          className="text-navy/50 text-sm max-w-xs leading-relaxed mt-3"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Pavani Infra has shaped skylines and changed lives across India.
        </p>
      </div>

      <div className="relative z-10">
        <div
          ref={lineRef}
          className="absolute left-5.5 top-3 bottom-3 w-0.5 bg-linear-to-b from-[#97081E] via-[#B82D42] to-[#97081E]"
          style={{ zIndex: 0 }}
        />
        <div className="flex flex-col gap-6">
          {CITY_CARDS.map((card, i) => (
            <div
              key={`mobile-card-${i}`}
              ref={(el: HTMLDivElement | null) => { cardsRef.current[i] = el; }}
              className="relative flex items-center gap-4"
              style={{ zIndex: 1 }}
            >
              <div className="relative shrink-0 w-11 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-[#97081E] relative z-10" />
                <div className="absolute w-6 h-6 rounded-full border border-[#97081E]/30 city-dot-ring" />
              </div>
              <div className="flex-1 flex items-center gap-3 bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(45,15,19,0.08)] p-2">
                <div className="relative w-24 h-20 shrink-0 rounded-lg overflow-hidden">
                  <Image src={card.image} alt={`Pavani Infra project in ${card.city}`} fill className="object-cover" sizes="96px" />
                </div>
                <span className="text-sm font-semibold text-navy tracking-wider" style={{ fontFamily: "var(--font-display-custom)" }}>
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
   DESKTOP / TABLET LAYOUT — spread animation
   Cards spread from center stack to zigzag layout.
   After spreading, a map pin drops onto each card.
   ═══════════════════════════════════════════════ */
function DesktopLayout() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const pinsRef = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const hasAnimatedRef = useRef(false);

  const computeLayout = useCallback(() => {
    const container = containerRef.current;
    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    if (!container || cards.length === 0) return null;

    const rect = container.getBoundingClientRect();
    const style = getComputedStyle(container);
    const padL = parseFloat(style.paddingLeft) || 0;
    const padR = parseFloat(style.paddingRight) || 0;
    const cardW = cards[0].offsetWidth;
    const cardH = cards[0].offsetHeight;
    const count = CITY_CARDS.length;

    const usableW = rect.width - padL - padR;

    const cx = rect.width / 2 - cardW / 2;
    const cy = rect.height / 2 - cardH / 2;

    /* Compute gap — enforce minimum of 12px between cards */
    const totalGap = usableW - count * cardW;
    const rawGap = totalGap / (count - 1);
    const minGap = 12;
    const gap = Math.max(rawGap, minGap);

    /* If gap was clamped, center the cards within the usable space */
    const actualTotalWidth = count * cardW + (count - 1) * gap;
    const startOffset = padL + Math.max(0, (usableW - actualTotalWidth) / 2);

    const ySpace = Math.max(rect.height - cardH, 0);

    /* Dampen the zigzag when vertical space is tight — below 250px
       of ySpace, flatten the pattern toward center (0.5) */
    const dampFactor = Math.min(ySpace / 250, 1);

    const spreadPos = CITY_CARDS.map((_card, i) => {
      const x = startOffset + i * (cardW + gap);
      const dampedY = 0.5 + (Y_PATTERN[i] - 0.5) * dampFactor;
      const y = Math.max(0, Math.min(dampedY * ySpace, ySpace));
      return { x, y };
    });

    return { rect, cx, cy, cardW, cardH, spreadPos };
  }, []);

  /* Apply positions instantly (used on resize after initial animation) */
  const applyPositions = useCallback(() => {
    const layout = computeLayout();
    if (!layout) return;

    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    const { spreadPos } = layout;

    cards.forEach((card, i) => {
      gsap.set(card, {
        x: spreadPos[i].x,
        y: spreadPos[i].y,
        rotation: ROTATIONS[i],
      });
    });
  }, [computeLayout]);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    const pins = pinsRef.current.filter(Boolean) as HTMLDivElement[];
    if (!section || !container || cards.length === 0) return;

    const layout = computeLayout();
    if (!layout) return;

    const { cx, cy, spreadPos } = layout;

    const ctx = gsap.context(() => {
      gsap.set(titleRef.current, { opacity: 0, y: 50 });
      gsap.set(subtitleRef.current, { opacity: 0, y: 35 });

      gsap.set(cards, {
        x: (i: number) => cx + CITY_CARDS[i].stackOffsetX,
        y: cy + 400,
        rotation: (i: number) => CITY_CARDS[i].stackRotation,
        opacity: 0,
        scale: 0.88,
      });

      /* Hide pins: shifted up and invisible */
      gsap.set(pins, { opacity: 0, y: -30, scale: 0.5 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
          toggleActions: "play none none none",
        },
        onComplete: () => { hasAnimatedRef.current = true; },
      });

      /* Phase 1 — cards fly into stack */
      tl.to(cards, {
        y: (i: number) => cy + CITY_CARDS[i].stackOffsetY,
        opacity: 1, scale: 1, duration: 0.9, stagger: 0.08, ease: "power3.out",
      });

      tl.addLabel("stacked", "+=0.5");

      /* Phase 2 — cards spread edge-to-edge */
      tl.to(cards, {
        x: (i: number) => spreadPos[i].x,
        y: (i: number) => spreadPos[i].y,
        rotation: (i: number) => ROTATIONS[i],
        duration: 1.3, stagger: 0.07, ease: "power3.inOut",
      }, "stacked");

      tl.to(titleRef.current,
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
        "stacked+=0.15"
      );
      tl.to(subtitleRef.current,
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
        "stacked+=0.35"
      );

      /* Phase 3 — map pins drop onto cards */
      tl.addLabel("pinsStart", "stacked+=1.1");
      pins.forEach((pin, i) => {
        tl.to(pin, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "back.out(3)",
        }, `pinsStart+=${i * 0.12}`);
      });
    }, section);

    /* Debounced resize handler — recalculates positions after animation */
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (hasAnimatedRef.current) {
          applyPositions();
          ScrollTrigger.refresh();
        }
      }, 150);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      ctx.revert();
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, [computeLayout, applyPositions]);

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden bg-cream pt-16 pb-8 md:pt-24 md:pb-12">
      {/* Background map */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-full h-full max-w-5xl mx-auto opacity-[0.18]">
          <Image src="/images/india-topographic-map.png" alt="" fill className="object-contain object-center" sizes="1000px" priority />
        </div>
      </div>

      {/* Title + Subtitle */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-12">
        <div ref={titleRef}>
          <h2
            className="text-3xl md:text-4xl lg:text-[3.2rem] font-bold text-navy tracking-tight leading-[1.08] uppercase"
            style={{ fontFamily: "var(--font-display-custom)" }}
          >
            Multiple Cities,<br />One Unified Vision
          </h2>
        </div>
        <p ref={subtitleRef}
          className="text-navy/50 text-sm md:text-[15px] max-w-sm leading-relaxed"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Pavani Infra has shaped skylines and changed lives across India. These
          numbers tell our story of commitment and excellence.
        </p>
      </div>

      {/* Cards container */}
      <div
        ref={containerRef}
        className="relative w-full max-w-7xl mx-auto h-[60vh] md:h-[62vh] lg:h-[68vh] min-h-[400px] mt-16 md:mt-20 px-6 md:px-12 lg:px-20"
      >
        {/* Cards with map pins */}
        {CITY_CARDS.map((card, i) => (
          <div
            key={`city-card-${i}`}
            ref={(el: HTMLDivElement | null) => { cardsRef.current[i] = el; }}
            className="absolute top-0 left-0 will-change-transform"
            style={{ zIndex: CITY_CARDS.length - i + 1 }}
          >
            {/* Map pin — positioned above the card, centered */}
            <div
              ref={(el: HTMLDivElement | null) => { pinsRef.current[i] = el; }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
            >
              <MapPin />
            </div>

            <div className="w-32 md:w-36 lg:w-44 xl:w-52 bg-white rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(45,15,19,0.1)] hover:shadow-[0_8px_32px_rgba(45,15,19,0.16)] transition-shadow duration-500 cursor-pointer group">
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <Image
                  src={card.image}
                  alt={`Pavani Infra project in ${card.city}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 128px, (max-width: 1024px) 144px, (max-width: 1280px) 176px, 208px"
                />
              </div>
              <div className="py-2 lg:py-2.5 px-3 text-center border-t border-cream-dark/20">
                <span className="text-xs md:text-sm font-semibold text-navy tracking-wider" style={{ fontFamily: "var(--font-display-custom)" }}>
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
