"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "@/lib/constants";
import { MapPin, Maximize2, ArrowRight, BookOpen } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ══════════════════════════════════════════════════════════════ */

const DecoOrnament = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 120 12" fill="none" className={className}>
    <line x1="0" y1="6" x2="45" y2="6" stroke="rgba(223,192,99,0.3)" strokeWidth="0.5" />
    <polygon points="52,1 60,6 52,11" fill="rgba(223,192,99,0.25)" />
    <polygon points="68,1 60,6 68,11" fill="rgba(223,192,99,0.25)" />
    <line x1="75" y1="6" x2="120" y2="6" stroke="rgba(223,192,99,0.3)" strokeWidth="0.5" />
  </svg>
);

const DecoCoverPattern = () => (
  <svg viewBox="0 0 200 200" fill="none" className="w-28 h-28 lg:w-36 lg:h-36">
    <rect x="50" y="50" width="100" height="100" stroke="rgba(223,192,99,0.4)" strokeWidth="0.5" transform="rotate(45 100 100)" />
    <rect x="65" y="65" width="70" height="70" stroke="rgba(223,192,99,0.25)" strokeWidth="0.5" transform="rotate(45 100 100)" />
    <rect x="80" y="80" width="40" height="40" stroke="rgba(223,192,99,0.15)" strokeWidth="0.5" transform="rotate(45 100 100)" />
    <line x1="100" y1="15" x2="100" y2="185" stroke="rgba(223,192,99,0.1)" strokeWidth="0.5" />
    <line x1="15" y1="100" x2="185" y2="100" stroke="rgba(223,192,99,0.1)" strokeWidth="0.5" />
    <circle cx="100" cy="100" r="55" stroke="rgba(223,192,99,0.08)" strokeWidth="0.5" />
    <circle cx="100" cy="100" r="35" stroke="rgba(223,192,99,0.06)" strokeWidth="0.5" />
  </svg>
);

const GoldParticles = () => {
  const dots = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        w: 1.5 + (((i * 7 + 3) % 11) / 11) * 3,
        left: ((i * 17 + 5) % 100),
        top: 40 + ((i * 13 + 7) % 55),
        dur: 5 + ((i * 11 + 2) % 9),
        delay: ((i * 3 + 1) % 7),
        blur: i % 3 === 0,
      })),
    []
  );
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {dots.map((d) => (
        <div
          key={d.id}
          className="absolute rounded-full bg-gold/15"
          style={{
            width: d.w,
            height: d.w,
            left: `${d.left}%`,
            top: `${d.top}%`,
            animation: `float ${d.dur}s ease-in-out infinite`,
            animationDelay: `${d.delay}s`,
            filter: d.blur ? "blur(1px)" : "none",
          }}
        />
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════ */

export default function FeaturedProjects() {
  const sectionRef = useRef<HTMLElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const desktopHeaderRef = useRef<HTMLDivElement>(null);
  const desktopDotsRef = useRef<HTMLDivElement>(null);
  const desktopCounterRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState(-1);
  const total = PROJECTS.length;

  useEffect(() => {
    const section = sectionRef.current;
    const book = bookRef.current;
    if (!section || !book) return;

    // Small delay to ensure layout is settled after dynamic imports
    const setupTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);

    const mm = gsap.matchMedia();

    /* ═══════════════════════════════════════════════════
       DESKTOP — Full 3D Brochure with real page flips
       ═══════════════════════════════════════════════════ */
    mm.add("(min-width: 768px)", () => {
      const ctx = gsap.context(() => {
        const vh = window.innerHeight;
        const entranceScroll = vh * 0.6;
        const flipScroll = vh * 1.5;
        const holdScroll = vh * 0.5;
        const totalScroll = entranceScroll + total * flipScroll + holdScroll;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            pin: true,
            scrub: 0.6,
            start: "top top",
            end: `+=${totalScroll}`,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              const p = self.progress;
              const entP = entranceScroll / totalScroll;
              const fP = flipScroll / totalScroll;
              if (p < entP + fP * 0.6) {
                setActiveProject(-1);
              } else {
                const after = p - entP;
                setActiveProject(
                  Math.min(total - 1, Math.floor(after / fP))
                );
              }
            },
          },
        });

        const entP = entranceScroll / totalScroll;
        const fP = flipScroll / totalScroll;

        /* ── Phase 0: Book entrance ── */
        tl.fromTo(
          book,
          { scale: 0.65, opacity: 0, rotateX: 12 },
          { scale: 1, opacity: 1, rotateX: 0, duration: entP, ease: "power3.out" },
          0
        );

        // Desktop header animations — use refs to avoid matching mobile elements
        const dHeader = desktopHeaderRef.current;
        const dCounter = desktopCounterRef.current;
        const dDots = desktopDotsRef.current;

        if (dHeader) {
          const titleEl = dHeader.querySelector(".fp-dk-title");
          const subEl = dHeader.querySelector(".fp-dk-sub");
          if (titleEl) {
            tl.fromTo(titleEl, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: entP * 0.5, ease: "power3.out" }, 0);
          }
          if (subEl) {
            tl.fromTo(subEl, { opacity: 0 }, { opacity: 1, duration: entP * 0.5, ease: "power2.out" }, entP * 0.3);
          }
        }

        /* ── Phase 1: Cover flip ── */
        const coverStart = entP;
        tl.to(".fp-cover", {
          rotateY: -180,
          duration: fP * 0.75,
          ease: "power2.inOut",
        }, coverStart);

        tl.set(".fp-cover", { zIndex: total + 10 }, coverStart + fP * 0.375);

        tl.fromTo(
          ".fp-page-0 .pg-shadow",
          { opacity: 0, x: "80%" },
          { opacity: 0.7, x: "0%", duration: fP * 0.375, ease: "power2.in" },
          coverStart
        );
        tl.to(
          ".fp-page-0 .pg-shadow",
          { opacity: 0, x: "-50%", duration: fP * 0.375, ease: "power2.out" },
          coverStart + fP * 0.375
        );

        tl.fromTo(
          ".fp-spine",
          { opacity: 0 },
          { opacity: 1, duration: fP * 0.3, ease: "power2.out" },
          coverStart + fP * 0.4
        );

        // Counter & dots — use refs
        if (dCounter) {
          tl.fromTo(dCounter, { opacity: 0 }, { opacity: 1, duration: fP * 0.3, ease: "power2.out" }, coverStart + fP * 0.5);
        }
        if (dDots) {
          tl.fromTo(dDots, { opacity: 0 }, { opacity: 1, duration: fP * 0.3, ease: "power2.out" }, coverStart + fP * 0.5);
        }

        /* ── Phase 2: Page flips (page 0 → page N-2) ── */
        for (let i = 0; i < total - 1; i++) {
          const pageStart = entP + (i + 1) * fP;
          const pageEl = `.fp-page-${i}`;
          const nextShadow = `.fp-page-${i + 1} .pg-shadow`;

          tl.to(pageEl, {
            rotateY: -180,
            duration: fP * 0.75,
            ease: "power2.inOut",
          }, pageStart);

          tl.set(pageEl, { zIndex: total + 11 + i }, pageStart + fP * 0.375);

          if (i < total - 2) {
            tl.fromTo(
              nextShadow,
              { opacity: 0, x: "80%" },
              { opacity: 0.6, x: "0%", duration: fP * 0.375, ease: "power2.in" },
              pageStart
            );
            tl.to(
              nextShadow,
              { opacity: 0, x: "-50%", duration: fP * 0.375, ease: "power2.out" },
              pageStart + fP * 0.375
            );
          }
        }

        /* ── Phase 3: Last page content entrance ── */
        const lastStart = entP + total * fP;
        tl.fromTo(
          `.fp-page-${total - 1} .pg-detail`,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, stagger: 0.015, duration: fP * 0.25, ease: "power3.out" },
          lastStart - fP * 0.25
        );
      }, section);

      return () => ctx.revert();
    });

    /* ═══════════════════════════════════════════════════
       MOBILE — Card stack
       ═══════════════════════════════════════════════════ */
    mm.add("(max-width: 767px)", () => {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".fp-mob-title",
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 80%" },
          }
        );
        gsap.fromTo(
          ".mob-card",
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: ".mob-grid", start: "top 85%" },
          }
        );
      }, section);
      return () => ctx.revert();
    });

    return () => {
      clearTimeout(setupTimer);
      mm.revert();
    };
  }, [total]);

  /* ─── Render helpers ─── */

  const renderPageFront = (project: (typeof PROJECTS)[number], idx: number) => (
    <div
      className="absolute inset-0 overflow-hidden rounded-r-sm paper-texture"
      style={{
        backfaceVisibility: "hidden",
        background: "linear-gradient(150deg, #0d0d0d 0%, #090909 50%, #0b0b0b 100%)",
      }}
    >
      <div className="absolute top-0 left-0 bottom-0 w-12 bg-gradient-to-r from-black/60 to-transparent pointer-events-none z-10" />

      <div className="absolute top-4 left-4 lg:top-6 lg:left-6 w-8 lg:w-10 h-8 lg:h-10 border-t border-l border-gold/20" />
      <div className="absolute top-4 right-4 lg:top-6 lg:right-6 w-8 lg:w-10 h-8 lg:h-10 border-t border-r border-gold/20" />
      <div className="absolute bottom-4 left-4 lg:bottom-6 lg:left-6 w-8 lg:w-10 h-8 lg:h-10 border-b border-l border-gold/20" />
      <div className="absolute bottom-4 right-4 lg:bottom-6 lg:right-6 w-8 lg:w-10 h-8 lg:h-10 border-b border-r border-gold/20" />

      <div className="absolute inset-2.5 border border-gold/[0.05] rounded-sm pointer-events-none" />

      <div className="absolute inset-0 p-8 lg:p-12 xl:p-14 flex flex-col justify-center z-5">
        <span
          className="pg-detail inline-block text-gold/50 text-[10px] lg:text-xs tracking-[0.3em] uppercase mb-5 border border-gold/15 px-3 py-1 rounded-full w-fit"
          style={{ fontFamily: "var(--font-mono-custom)" }}
        >
          {project.type}
        </span>

        <h3
          className="pg-detail text-3xl lg:text-5xl xl:text-[3.5rem] font-bold text-white tracking-tight mb-5 leading-[0.95]"
          style={{ fontFamily: "var(--font-display-custom)" }}
        >
          {project.name}
        </h3>

        <div className="pg-detail w-16 lg:w-24 h-[1px] bg-gradient-to-r from-gold/60 to-transparent mb-6 origin-left" />

        <div className="pg-detail flex items-center gap-2.5 text-white/50 text-sm mb-2.5">
          <MapPin size={14} className="text-gold/50 shrink-0" />
          <span>{project.location}</span>
        </div>

        <div className="pg-detail flex items-center gap-2.5 text-white/50 text-sm mb-8">
          <Maximize2 size={14} className="text-gold/50 shrink-0" />
          <span>{project.area}</span>
        </div>

        <DecoOrnament className="pg-detail w-24 mb-8 opacity-40" />

        <a
          href={`/project/${project.slug}`}
          className="pg-detail inline-flex items-center gap-3 group w-fit"
        >
          <span
            className="text-gold text-sm tracking-wider uppercase border-b border-gold/25 group-hover:border-gold pb-1 transition-colors duration-300"
            style={{ fontFamily: "var(--font-mono-custom)" }}
          >
            Explore Project
          </span>
          <div className="w-10 h-10 rounded-full border border-gold/25 flex items-center justify-center group-hover:bg-gold/10 group-hover:border-gold/50 group-hover:shadow-[0_0_25px_rgba(223,192,99,0.2)] transition-all duration-300">
            <ArrowRight
              size={15}
              className="text-gold group-hover:translate-x-0.5 transition-transform duration-300"
            />
          </div>
        </a>
      </div>

      <div className="absolute bottom-6 right-8 select-none pointer-events-none">
        <span
          className="text-[80px] lg:text-[130px] font-bold leading-none"
          style={{
            fontFamily: "var(--font-display-custom)",
            color: "rgba(223, 192, 99, 0.025)",
          }}
        >
          {String(idx + 1).padStart(2, "0")}
        </span>
      </div>

      <div
        className="pg-shadow absolute inset-0 pointer-events-none z-20 opacity-0"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 40%, transparent 100%)",
        }}
      />
    </div>
  );

  const renderPageBack = (nextProject: (typeof PROJECTS)[number], num: number) => (
    <div
      className="absolute inset-0 overflow-hidden rounded-l-sm"
      style={{
        backfaceVisibility: "hidden",
        transform: "rotateY(180deg)",
      }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${nextProject.image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25" />
      <div className="absolute inset-0 bg-gold/[0.02]" />

      <div className="absolute top-5 left-6 select-none pointer-events-none">
        <span
          className="text-[100px] lg:text-[160px] font-bold leading-none"
          style={{
            fontFamily: "var(--font-display-custom)",
            color: "rgba(223, 192, 99, 0.06)",
          }}
        >
          {String(num).padStart(2, "0")}
        </span>
      </div>

      <div className="absolute bottom-4 left-5 right-5 flex items-center gap-2">
        <div className="w-8 h-[1px] bg-gold/30" />
        <span
          className="text-white/30 text-[9px] tracking-[0.2em] uppercase"
          style={{ fontFamily: "var(--font-mono-custom)" }}
        >
          {nextProject.type}
        </span>
      </div>

      <div className="absolute bottom-16 left-6 right-6">
        <h4
          className="text-2xl lg:text-4xl font-bold text-white/80 tracking-tight"
          style={{ fontFamily: "var(--font-display-custom)" }}
        >
          {nextProject.name}
        </h4>
      </div>

      <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-black/50 to-transparent pointer-events-none" />
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 40%, rgba(223,192,99,0.04) 0%, #050505 50%)",
      }}
    >
      <GoldParticles />

      {/* Ambient glow orb */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gold/[0.015] blur-[200px] rounded-full pointer-events-none" />

      {/* ─── Desktop section header (unique class names to avoid mobile collision) ─── */}
      <div ref={desktopHeaderRef} className="hidden md:block absolute top-4 md:top-7 left-0 right-0 z-30 text-center pointer-events-none">
        <span
          className="fp-dk-sub text-gold/50 text-[10px] md:text-xs tracking-[0.35em] uppercase block mb-1"
          style={{ fontFamily: "var(--font-mono-custom)" }}
        >
          Portfolio
        </span>
        <h2
          className="fp-dk-title text-xl md:text-3xl font-bold text-white tracking-tight"
          style={{ fontFamily: "var(--font-display-custom)" }}
        >
          Featured <span className="text-gold">Projects</span>
        </h2>
      </div>

      {/* ─── Desktop Counter ─── */}
      <div ref={desktopCounterRef} className="hidden md:flex absolute top-5 md:top-9 right-5 md:right-10 z-30 items-baseline gap-1.5 opacity-0">
        <span
          className="text-gold text-xl md:text-3xl font-bold tabular-nums"
          style={{ fontFamily: "var(--font-display-custom)" }}
        >
          {String(Math.max(0, activeProject) + 1).padStart(2, "0")}
        </span>
        <span
          className="text-white/20 text-[10px] md:text-xs"
          style={{ fontFamily: "var(--font-mono-custom)" }}
        >
          / {String(total).padStart(2, "0")}
        </span>
      </div>

      {/* ─── Desktop Progress diamonds ─── */}
      <div ref={desktopDotsRef} className="hidden md:flex absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-30 flex-col gap-3 opacity-0">
        {PROJECTS.map((_, i) => (
          <div key={i} className="relative flex items-center justify-center">
            <div
              className={`w-2 h-2 rotate-45 border transition-all duration-500 ${
                i === Math.max(0, activeProject)
                  ? "border-gold bg-gold/30 scale-125 shadow-[0_0_12px_rgba(223,192,99,0.3)]"
                  : "border-white/15"
              }`}
            />
            {i === Math.max(0, activeProject) && (
              <div className="absolute w-4 h-4 rotate-45 border border-gold/20 animate-[gold-pulse_2s_ease-in-out_infinite]" />
            )}
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════
          DESKTOP — 3D Brochure Book with real page flips
         ══════════════════════════════════════════════════════ */}
      <div className="hidden md:flex h-screen items-center justify-center pt-8">
        <div
          style={{ perspective: "1800px", perspectiveOrigin: "50% 45%" }}
          className="w-full max-w-[1500px] mx-auto px-4 lg:px-6"
        >
          <div
            ref={bookRef}
            className="relative mx-auto"
            style={{
              width: "100%",
              height: "80vh",
              maxHeight: "780px",
              transformStyle: "preserve-3d",
            }}
          >
            {/* ── SPINE (gold line at center) ── */}
            <div
              className="fp-spine absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[3px] pointer-events-none opacity-0"
              style={{
                zIndex: 200,
                background:
                  "linear-gradient(to bottom, transparent 3%, rgba(223,192,99,0.35) 15%, rgba(223,192,99,0.35) 85%, transparent 97%)",
                boxShadow:
                  "0 0 20px rgba(223,192,99,0.15), 0 0 50px rgba(223,192,99,0.05)",
              }}
            />

            {/* ── Page thickness edge (bottom) ── */}
            <div className="absolute bottom-0 left-[50%] right-0 h-[8px] pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute left-0 right-0 h-[1px]"
                  style={{
                    bottom: i,
                    background: `rgba(223,192,99,${0.04 - i * 0.004})`,
                  }}
                />
              ))}
            </div>

            {/* ── LEFT BASE PANEL (visible behind flipped pages) ── */}
            <div
              className="absolute top-0 left-0 w-1/2 h-full overflow-hidden rounded-l-sm"
              style={{ zIndex: 1, background: "#080808" }}
            >
              <div className="absolute inset-0 bg-gold/[0.01]" />
              <div className="absolute top-0 right-0 bottom-0 w-14 bg-gradient-to-l from-black/60 to-transparent pointer-events-none" />
            </div>

            {/* ── COVER ── */}
            <div
              className="fp-cover absolute top-0 left-[50%] w-1/2 h-full overflow-visible"
              style={{
                transformOrigin: "left center",
                transformStyle: "preserve-3d",
                zIndex: total + 1,
              }}
            >
              {/* Cover FRONT */}
              <div
                className="absolute inset-0 overflow-hidden rounded-r-sm"
                style={{
                  backfaceVisibility: "hidden",
                  background: "linear-gradient(145deg, #0f0f0f 0%, #090909 40%, #0c0c0c 100%)",
                }}
              >
                <div className="absolute inset-2 border border-gold/20 rounded-sm" />
                <div className="absolute inset-4 border border-gold/12 rounded-sm" />
                <div className="absolute inset-7 border border-gold/[0.06] rounded-sm" />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
                  <div className="w-[1px] h-10 lg:h-16 bg-gradient-to-b from-transparent via-gold/40 to-gold/10 mb-5" />

                  <DecoCoverPattern />

                  <h3
                    className="text-lg lg:text-2xl font-bold text-white/90 tracking-tight mt-5 mb-1"
                    style={{ fontFamily: "var(--font-display-custom)" }}
                  >
                    Featured
                  </h3>
                  <h3
                    className="text-2xl lg:text-4xl font-bold text-gold/80 tracking-tight mb-3"
                    style={{ fontFamily: "var(--font-display-custom)" }}
                  >
                    Projects
                  </h3>

                  <DecoOrnament className="w-28 mb-4 opacity-50" />

                  <p
                    className="text-white/20 text-[10px] tracking-[0.25em] uppercase mb-4"
                    style={{ fontFamily: "var(--font-mono-custom)" }}
                  >
                    Pavani Infra
                  </p>

                  <BookOpen size={18} className="text-gold/20 mb-4" />

                  <span
                    className="text-gold/30 text-[9px] tracking-[0.25em] uppercase"
                    style={{ fontFamily: "var(--font-mono-custom)" }}
                  >
                    Scroll to Open
                  </span>

                  <div className="w-[1px] h-10 lg:h-16 bg-gradient-to-t from-transparent via-gold/40 to-gold/10 mt-5" />
                </div>

                <div className="deco-corner deco-corner--tl top-5 left-5 lg:top-8 lg:left-8" />
                <div className="deco-corner deco-corner--tr top-5 right-5 lg:top-8 lg:right-8" />
                <div className="deco-corner deco-corner--bl bottom-5 left-5 lg:bottom-8 lg:left-8" />
                <div className="deco-corner deco-corner--br bottom-5 right-5 lg:bottom-8 lg:right-8" />

                <div className="absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />
              </div>

              {/* Cover BACK (shows first project image when cover opens) */}
              {renderPageBack(PROJECTS[0], 1)}
            </div>

            {/* ── PROJECT PAGES ── */}
            {PROJECTS.map((project, i) => {
              const isLast = i === total - 1;
              return (
                <div
                  key={project.slug}
                  className={`fp-page-${i} absolute top-0 left-[50%] w-1/2 h-full overflow-visible`}
                  style={{
                    transformOrigin: "left center",
                    transformStyle: "preserve-3d",
                    zIndex: total - i,
                  }}
                >
                  {renderPageFront(project, i)}
                  {!isLast && renderPageBack(PROJECTS[i + 1], i + 2)}
                </div>
              );
            })}

            {/* ── Book outer frame ── */}
            <div
              className="absolute inset-0 border border-gold/[0.06] rounded-sm pointer-events-none"
              style={{ zIndex: 201 }}
            />
          </div>
        </div>
      </div>

      {/* ─── Scroll hint ─── */}
      <div className="hidden md:flex absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex-col items-center gap-2 pointer-events-none">
        <span
          className="text-white/15 text-[9px] tracking-[0.3em] uppercase"
          style={{ fontFamily: "var(--font-mono-custom)" }}
        >
          {activeProject < 0 ? "Scroll to Open" : "Scroll to Browse"}
        </span>
        <div
          className="w-[1px] h-5 bg-gradient-to-b from-gold/30 to-transparent"
          style={{ animation: "scroll-hint 2s ease-in-out infinite" }}
        />
      </div>

      {/* ─── View all ─── */}
      <div className="hidden md:block absolute bottom-4 right-6 md:right-10 z-30">
        <a
          href="/project"
          className="inline-flex items-center gap-2 text-white/20 text-[10px] tracking-[0.2em] uppercase hover:text-gold/50 transition-colors duration-300"
          style={{ fontFamily: "var(--font-mono-custom)" }}
        >
          View All <ArrowRight size={10} />
        </a>
      </div>

      {/* ══════════════════════════════════════════════════════
          MOBILE — Elegant Card Stack
         ══════════════════════════════════════════════════════ */}
      <div className="md:hidden px-5 pt-24 pb-14">
        <div className="text-center mb-10">
          <span
            className="fp-mob-sub text-gold/50 text-[10px] tracking-[0.35em] uppercase block mb-2"
            style={{ fontFamily: "var(--font-mono-custom)" }}
          >
            Portfolio
          </span>
          <h2
            className="fp-mob-title text-2xl font-bold text-white tracking-tight"
            style={{ fontFamily: "var(--font-display-custom)" }}
          >
            Featured <span className="text-gold">Projects</span>
          </h2>
          <DecoOrnament className="w-24 mx-auto mt-3 opacity-50" />
        </div>

        <div className="mob-grid space-y-6">
          {PROJECTS.map((project, i) => (
            <a
              key={project.slug}
              href={`/project/${project.slug}`}
              className="mob-card block group"
            >
              <div className="relative overflow-hidden rounded-sm border border-gold/10">
                <div className="relative h-56 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${project.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute inset-0 bg-gold/[0.02]" />
                  <div className="absolute top-3 left-4">
                    <span
                      className="text-5xl font-bold"
                      style={{
                        fontFamily: "var(--font-display-custom)",
                        color: "rgba(223,192,99,0.08)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span
                      className="text-gold/50 text-[9px] tracking-[0.2em] uppercase border border-gold/15 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm"
                      style={{ fontFamily: "var(--font-mono-custom)" }}
                    >
                      {project.type}
                    </span>
                  </div>
                </div>
                <div className="p-5" style={{ background: "rgba(10,10,10,0.9)" }}>
                  <h3
                    className="text-xl font-bold text-white tracking-tight mb-2"
                    style={{ fontFamily: "var(--font-display-custom)" }}
                  >
                    {project.name}
                  </h3>
                  <div className="w-10 h-[1px] bg-gold/30 mb-3" />
                  <div className="flex items-center gap-4 text-white/40 text-xs">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={11} className="text-gold/40" />
                      {project.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Maximize2 size={11} className="text-gold/40" />
                      {project.area}
                    </span>
                  </div>
                </div>
                <div className="h-[1px] bg-gradient-to-r from-gold/20 via-gold/10 to-transparent" />
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="/project"
            className="inline-flex items-center gap-2 text-gold/60 text-xs tracking-[0.2em] uppercase hover:text-gold transition-colors duration-300"
            style={{ fontFamily: "var(--font-mono-custom)" }}
          >
            View All Projects <ArrowRight size={12} />
          </a>
        </div>
      </div>
    </section>
  );
}
