"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

/* ── Card data ── */
const CITY_CARDS = [
  {
    city: "Bengaluru",
    image: "https://backend.pavaniinfra.com/uploads/MIRABILIA_ddb7ad0906.jpg",
    stackOffsetX: -20,
    stackOffsetY: -10,
    stackRotation: -10,
  },
  {
    city: "Hyderabad",
    image: "https://backend.pavaniinfra.com/uploads/Pavani_Felicity_ea55966d27.jpg",
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
    city: "Hyderabad",
    image: "https://backend.pavaniinfra.com/uploads/Pavani_Solitaire_aaa5e8c629.jpg",
    stackOffsetX: 9,
    stackOffsetY: 5,
    stackRotation: -6,
  },
  {
    city: "Hyderabad",
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

/* Sequential chain: 1→2→3→4→5 */
const ROUTE_SEGMENTS = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
];

/* Curved SVG path between two points */
function buildCurvedPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): string {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const curvature = 0.15;
  const cpX = midX - dy * curvature;
  const cpY = midY + dx * curvature;
  return `M ${x1} ${y1} Q ${cpX} ${cpY} ${x2} ${y2}`;
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
    <section ref={sectionRef} className="relative overflow-hidden bg-cream py-14 px-5">
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
          className="absolute left-5.5 top-3 bottom-3 w-0.5 bg-linear-to-b from-[#C0392B] via-[#E74C3C] to-[#C0392B]"
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
                <div className="w-3 h-3 rounded-full bg-[#C0392B] relative z-10" />
                <div className="absolute w-6 h-6 rounded-full border border-[#C0392B]/30 city-dot-ring" />
              </div>
              <div className="flex-1 flex items-center gap-3 bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(13,26,38,0.08)] p-2">
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
   Positions computed dynamically: first card at
   left edge, last card at right edge, rest evenly
   distributed. Y follows a zigzag pattern.
   ═══════════════════════════════════════════════ */
function DesktopLayout() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const pathsRef = useRef<(SVGPathElement | null)[]>([]);
  const dotsRef = useRef<(SVGCircleElement | null)[]>([]);
  const ringsRef = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    if (!section || !container || cards.length === 0) return;

    const rect = container.getBoundingClientRect();
    const style = getComputedStyle(container);
    const padL = parseFloat(style.paddingLeft) || 0;
    const padR = parseFloat(style.paddingRight) || 0;
    const cardW = cards[0].offsetWidth;
    const cardH = cards[0].offsetHeight;
    const count = CITY_CARDS.length;

    /* Usable width = container minus its own padding */
    const usableW = rect.width - padL - padR;

    const cx = rect.width / 2 - cardW / 2;
    const cy = rect.height / 2 - cardH / 2;

    /*
     * Compute spread positions:
     * - X: first card starts at padL, last card ends at (rect.width - padR)
     *   Gap = (usableW - count*cardW) / (count-1)
     * - Y: zigzag pattern using Y_PATTERN percentages
     */
    const totalGap = usableW - count * cardW;
    const gap = totalGap / (count - 1);

    const spreadPos = CITY_CARDS.map((_card, i) => {
      const x = padL + i * (cardW + gap);
      const ySpace = rect.height - cardH;
      const y = Y_PATTERN[i] * ySpace;
      return { x, y };
    });

    /* Center points for lines (center of each card) */
    const centerPoints = spreadPos.map((pos) => ({
      cx: pos.x + cardW / 2,
      cy: pos.y + cardH / 2,
    }));

    const paths = pathsRef.current.filter(Boolean) as SVGPathElement[];
    const dots = dotsRef.current.filter(Boolean) as SVGCircleElement[];
    const rings = ringsRef.current.filter(Boolean) as SVGCircleElement[];

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

      dots.forEach((dot, i) => {
        gsap.set(dot, {
          attr: { cx: centerPoints[i].cx, cy: centerPoints[i].cy },
          scale: 0, opacity: 0, transformOrigin: "center center",
        });
      });
      rings.forEach((ring, i) => {
        gsap.set(ring, {
          attr: { cx: centerPoints[i].cx, cy: centerPoints[i].cy },
          opacity: 0,
        });
      });

      const pathLengths: number[] = [];
      paths.forEach((path, i) => {
        const from = centerPoints[ROUTE_SEGMENTS[i][0]];
        const to = centerPoints[ROUTE_SEGMENTS[i][1]];
        path.setAttribute("d", buildCurvedPath(from.cx, from.cy, to.cx, to.cy));
        const length = path.getTotalLength();
        pathLengths.push(length);
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, opacity: 0 });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
          toggleActions: "play none none none",
        },
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

      /* Phase 3 — dots */
      tl.addLabel("dotsStart", "stacked+=1.0");
      dots.forEach((dot, i) => {
        tl.to(dot, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)" }, `dotsStart+=${i * 0.08}`);
      });

      /* Phase 4 — curved paths draw 1→2→3→4→5, then become dotted */
      tl.addLabel("pathsStart", "dotsStart+=0.2");
      paths.forEach((path, i) => {
        tl.to(path, {
          strokeDashoffset: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power2.inOut",
          onComplete: () => {
            // Swap to dotted pattern after draw completes
            gsap.set(path, { strokeDasharray: "6 5", strokeDashoffset: 0 });
          },
        }, `pathsStart+=${i * 0.25}`);
      });

      /* Phase 5 — pulse rings */
      tl.addLabel("ringsStart", "pathsStart+=0.4");
      rings.forEach((ring, i) => {
        tl.to(ring, { opacity: 0.4, duration: 0.5, ease: "power2.out" }, `ringsStart+=${i * 0.08}`);
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden bg-cream py-16 md:py-24">
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

      {/* Cards container — full width, no max-w so cards reach edges */}
      <div
        ref={containerRef}
        className="relative w-full max-w-7xl mx-auto h-[55vh] md:h-[58vh] lg:h-[68vh] mt-16 md:mt-20 px-6 md:px-12 lg:px-20"
      >
        {/* SVG lines & dots */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          {ROUTE_SEGMENTS.map((_seg, i) => (
            <path
              key={`route-${i}`}
              ref={(el: SVGPathElement | null) => { pathsRef.current[i] = el; }}
              d="" fill="none" stroke="#C0392B" strokeWidth="1.5" opacity="0"
            />
          ))}

          {CITY_CARDS.map((_card, i) => (
            <g key={`node-${i}`}>
              <circle
                ref={(el: SVGCircleElement | null) => { ringsRef.current[i] = el; }}
                cx={0} cy={0} r="10" fill="none" stroke="#C0392B" strokeWidth="1" opacity="0" className="city-dot-ring"
              />
              <circle
                ref={(el: SVGCircleElement | null) => { dotsRef.current[i] = el; }}
                cx={0} cy={0} r="5" fill="#C0392B" opacity="0"
              />
            </g>
          ))}
        </svg>

        {/* Cards — larger sizes for visual impact */}
        {CITY_CARDS.map((card, i) => (
          <div
            key={`city-card-${i}`}
            ref={(el: HTMLDivElement | null) => { cardsRef.current[i] = el; }}
            className="absolute top-0 left-0 will-change-transform"
            style={{ zIndex: CITY_CARDS.length - i + 1 }}
          >
            <div className="w-36 md:w-40 lg:w-52 bg-white rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(13,26,38,0.1)] hover:shadow-[0_8px_32px_rgba(13,26,38,0.16)] transition-shadow duration-500 cursor-pointer group">
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <Image
                  src={card.image}
                  alt={`Pavani Infra project in ${card.city}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 160px, 208px"
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
   MAIN — switches layout at 640px
   ═══════════════════════════════════════════════ */
export default function CityShowcase() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  const checkMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 640);
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
