"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "@/lib/constants";
import { MapPin, Maximize2, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ══════════════════════════════════════════════════════════════ */

const DecoCoverPattern = () => (
  <svg viewBox="0 0 200 200" fill="none" className="w-28 h-28 lg:w-36 lg:h-36">
    <rect x="50" y="50" width="100" height="100" stroke="rgba(223, 192, 99,0.4)" strokeWidth="0.5" transform="rotate(45 100 100)" />
    <rect x="65" y="65" width="70" height="70" stroke="rgba(223, 192, 99,0.25)" strokeWidth="0.5" transform="rotate(45 100 100)" />
    <rect x="80" y="80" width="40" height="40" stroke="rgba(223, 192, 99,0.15)" strokeWidth="0.5" transform="rotate(45 100 100)" />
    <line x1="100" y1="15" x2="100" y2="185" stroke="rgba(223, 192, 99,0.1)" strokeWidth="0.5" />
    <line x1="15" y1="100" x2="185" y2="100" stroke="rgba(223, 192, 99,0.1)" strokeWidth="0.5" />
    <circle cx="100" cy="100" r="55" stroke="rgba(223, 192, 99,0.08)" strokeWidth="0.5" />
    <circle cx="100" cy="100" r="35" stroke="rgba(223, 192, 99,0.06)" strokeWidth="0.5" />
  </svg>
);

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════ */

export default function FeaturedProjects() {
  const sectionRef = useRef<HTMLElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const desktopHeaderRef = useRef<HTMLDivElement>(null);
  const desktopDotsRef = useRef<HTMLDivElement>(null);

  // -1 = cover visible (closed book), 0..total-1 = that project page is visible
  const [currentPage, setCurrentPage] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const total = PROJECTS.length;

  /* ═══════════════════════════════════════════════════
     ENTRANCE ANIMATION — plays once on scroll into view
     ═══════════════════════════════════════════════════ */
  useEffect(() => {
    const section = sectionRef.current;
    const book = bookRef.current;
    if (!section || !book) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const ctx = gsap.context(() => {
        // Book entrance animation
        gsap.fromTo(
          book,
          { scale: 0.65, opacity: 0, rotateX: 12 },
          {
            scale: 1,
            opacity: 1,
            rotateX: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              once: true,
            },
            onComplete: () => setHasEntered(true),
          }
        );

        // Desktop header animations
        const dHeader = desktopHeaderRef.current;
        if (dHeader) {
          const titleEl = dHeader.querySelector(".fp-dk-title");
          const subEl = dHeader.querySelector(".fp-dk-sub");
          if (titleEl) {
            gsap.fromTo(
              titleEl,
              { opacity: 0, y: 30 },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: { trigger: section, start: "top 75%", once: true },
              }
            );
          }
          if (subEl) {
            gsap.fromTo(
              subEl,
              { opacity: 0 },
              {
                opacity: 1,
                duration: 0.8,
                delay: 0.3,
                ease: "power2.out",
                scrollTrigger: { trigger: section, start: "top 75%", once: true },
              }
            );
          }
        }

        // Nav buttons entrance
        gsap.fromTo(
          ".fp-nav-buttons",
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.5,
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 75%", once: true },
          }
        );
      }, section);

      return () => ctx.revert();
    });

    // Mobile animations
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

    return () => mm.revert();
  }, [total]);

  /* ═══════════════════════════════════════════════════
     BUTTON-DRIVEN PAGE FLIP ANIMATIONS
     ═══════════════════════════════════════════════════ */

  const flipNext = useCallback(() => {
    if (isAnimating || currentPage >= total - 1) return;
    setIsAnimating(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentPage((prev) => prev + 1);
        setIsAnimating(false);
      },
    });

    if (currentPage === -1) {
      // Flip the cover open
      tl.to(".fp-cover", {
        rotateY: -180,
        duration: 0.8,
        ease: "power2.inOut",
      }, 0);

      // Cover z-index swap at midpoint
      tl.set(".fp-cover", { zIndex: total + 10 }, 0.4);

      // Shadow on first page
      tl.fromTo(
        ".fp-page-0 .pg-shadow",
        { opacity: 0, x: "80%" },
        { opacity: 0.7, x: "0%", duration: 0.4, ease: "power2.in" },
        0
      );
      tl.to(
        ".fp-page-0 .pg-shadow",
        { opacity: 0, x: "-50%", duration: 0.4, ease: "power2.out" },
        0.4
      );

      // Spine appears
      tl.fromTo(
        ".fp-spine",
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power2.out" },
        0.35
      );

      // Dots appear
      const dDots = desktopDotsRef.current;
      if (dDots) {
        tl.fromTo(dDots, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" }, 0.45);
      }

      // Page 0 content entrance
      tl.fromTo(
        ".fp-page-0 .pg-detail",
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, stagger: 0.02, duration: 0.4, ease: "power3.out" },
        0.5
      );
    } else {
      // Flip the current project page
      const pageEl = `.fp-page-${currentPage}`;
      const nextIdx = currentPage + 1;
      const nextShadow = `.fp-page-${nextIdx} .pg-shadow`;

      tl.to(pageEl, {
        rotateY: -180,
        duration: 0.8,
        ease: "power2.inOut",
      }, 0);

      tl.set(pageEl, { zIndex: total + 11 + currentPage }, 0.4);

      // Shadow on next page
      if (nextIdx < total) {
        tl.fromTo(
          nextShadow,
          { opacity: 0, x: "80%" },
          { opacity: 0.6, x: "0%", duration: 0.4, ease: "power2.in" },
          0
        );
        tl.to(
          nextShadow,
          { opacity: 0, x: "-50%", duration: 0.4, ease: "power2.out" },
          0.4
        );
      }

      // Next page content entrance
      tl.fromTo(
        `.fp-page-${nextIdx} .pg-detail`,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, stagger: 0.02, duration: 0.4, ease: "power3.out" },
        0.5
      );
    }
  }, [currentPage, isAnimating, total]);

  const flipPrev = useCallback(() => {
    if (isAnimating || currentPage < 0) return;
    setIsAnimating(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentPage((prev) => prev - 1);
        setIsAnimating(false);
      },
    });

    if (currentPage === 0) {
      // Flip the cover back closed
      tl.to(".fp-cover", {
        rotateY: 0,
        duration: 0.8,
        ease: "power2.inOut",
      }, 0);

      tl.set(".fp-cover", { zIndex: total + 1 }, 0.4);

      // Hide spine
      tl.to(".fp-spine", { opacity: 0, duration: 0.3, ease: "power2.in" }, 0);

      // Hide dots
      const dDots = desktopDotsRef.current;
      if (dDots) {
        tl.to(dDots, { opacity: 0, duration: 0.3, ease: "power2.in" }, 0);
      }
    } else {
      // Flip the previous page back
      const prevIdx = currentPage - 1;
      const pageEl = `.fp-page-${prevIdx}`;

      tl.to(pageEl, {
        rotateY: 0,
        duration: 0.8,
        ease: "power2.inOut",
      }, 0);

      tl.set(pageEl, { zIndex: total - prevIdx }, 0.4);

      // Shadow on current page (the one being revealed again)
      tl.fromTo(
        `.fp-page-${currentPage} .pg-shadow`,
        { opacity: 0, x: "-50%" },
        { opacity: 0.6, x: "0%", duration: 0.4, ease: "power2.in" },
        0
      );
      tl.to(
        `.fp-page-${currentPage} .pg-shadow`,
        { opacity: 0, x: "80%", duration: 0.4, ease: "power2.out" },
        0.4
      );

      // Re-animate current page content
      tl.fromTo(
        `.fp-page-${prevIdx} .pg-detail`,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, stagger: 0.02, duration: 0.4, ease: "power3.out" },
        0.5
      );
    }
  }, [currentPage, isAnimating, total]);

  /* ─── Render helpers ─── */

  const renderPageFront = (project: (typeof PROJECTS)[number], idx: number, total: number) => (
    <div
      className="absolute inset-0 overflow-hidden rounded-r-sm paper-texture"
      style={{
        backfaceVisibility: "hidden",
        background: "linear-gradient(150deg, #0E1924 0%, #101F2D 50%, #0A1620 100%)",
      }}
    >
      <div className="absolute top-0 left-0 bottom-0 w-12 bg-gradient-to-r from-[#0A1620]/60 to-transparent pointer-events-none z-10" />

      {/* Page number — top right */}
      <div className="absolute top-6 right-8 lg:top-8 lg:right-10 z-10 flex items-baseline gap-1 select-none pointer-events-none">
        <span
          className="pg-detail text-gold/60 text-2xl lg:text-3xl font-bold tabular-nums"
          style={{ fontFamily: "var(--font-display-custom)" }}
        >
          {String(idx + 1).padStart(2, "0")}
        </span>
        <span
          className="pg-detail text-white/15 text-xs"
          style={{ fontFamily: "var(--font-mono-custom)" }}
        >
          / {String(total).padStart(2, "0")}
        </span>
      </div>

      <div className="absolute inset-0 p-8 lg:p-12 xl:p-14 flex flex-col justify-center z-5">
        <span
          className="pg-detail inline-block text-gold/50 text-xs lg:text-sm tracking-[0.3em] uppercase mb-5 border border-gold/15 px-3 py-1 rounded-full w-fit"
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

        <div className="pg-detail flex items-center gap-2.5 text-white/50 text-[15px] mb-2.5">
          <MapPin size={14} className="text-gold/50 shrink-0" />
          <span>{project.location}</span>
        </div>

        <div className="pg-detail flex items-center gap-2.5 text-white/50 text-[15px] mb-8">
          <Maximize2 size={14} className="text-gold/50 shrink-0" />
          <span>{project.area}</span>
        </div>

        <a
          href={`/project/${project.slug}`}
          className="pg-detail inline-flex items-center gap-3 group w-fit"
        >
          <span
            className="text-gold text-[15px] tracking-wider uppercase border-b border-gold/25 group-hover:border-gold pb-1 transition-colors duration-300"
            style={{ fontFamily: "var(--font-mono-custom)" }}
          >
            Explore Project
          </span>
          <div className="w-10 h-10 rounded-full border border-gold/25 flex items-center justify-center group-hover:bg-gold/10 group-hover:border-gold/50 group-hover:shadow-[0_0_25px_rgba(223, 192, 99,0.2)] transition-all duration-300">
            <ArrowRight
              size={15}
              className="text-gold group-hover:translate-x-0.5 transition-transform duration-300"
            />
          </div>
        </a>
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
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A1620]/25 via-transparent to-[#0A1620]/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1620]/60 via-transparent to-[#0A1620]/25" />
      <div className="absolute inset-0 bg-gold/[0.02]" />

      <div className="absolute bottom-4 left-5 right-5 flex items-center gap-2">
        <div className="w-8 h-[1px] bg-gold/30" />
        <span
          className="text-white/30 text-[11px] tracking-[0.2em] uppercase"
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

      <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-[#0A1620]/50 to-transparent pointer-events-none" />
    </div>
  );

  // Active project index for the diamond indicators (matches the visible page)
  const activeProject = currentPage;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: "#EBDEC9",
      }}
    >

      {/* ─── Desktop section header ─── */}
      <div ref={desktopHeaderRef} className="hidden md:block text-center pt-4 lg:pt-5 pb-1 z-30 relative">
        <span
          className="fp-dk-sub text-gold-contrast text-xs md:text-sm tracking-[0.35em] uppercase block mb-1"
          style={{ fontFamily: "var(--font-mono-custom)" }}
        >
          Portfolio
        </span>
        <h2
          className="fp-dk-title text-xl md:text-3xl font-bold text-navy tracking-tight"
          style={{ fontFamily: "var(--font-display-custom)" }}
        >
          Featured <span className="text-gold">Projects</span>
        </h2>
      </div>


      {/* ─── Desktop Progress diamonds ─── */}
      <div ref={desktopDotsRef} className="hidden md:flex absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-30 flex-col gap-3 opacity-0">
        {PROJECTS.map((_, i) => (
          <div key={i} className="relative flex items-center justify-center">
            <div
              className={`w-2 h-2 rotate-45 border transition-all duration-500 ${
                i === Math.max(0, activeProject)
                  ? "border-gold bg-gold/30 scale-125 shadow-[0_0_12px_rgba(223, 192, 99,0.3)]"
                  : "border-navy/20"
              }`}
            />
            {i === Math.max(0, activeProject) && (
              <div className="absolute w-4 h-4 rotate-45 border border-gold/20 animate-[gold-pulse_2s_ease-in-out_infinite]" />
            )}
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════
          DESKTOP — 3D Brochure Book with button-driven page flips
         ══════════════════════════════════════════════════════ */}
      <div className="hidden md:flex items-center justify-center py-2 lg:py-3">
        <div
          style={{ perspective: "1800px", perspectiveOrigin: "50% 45%" }}
          className="w-full mx-auto px-4 lg:px-6 flex items-center justify-center"
        >
          <div
            ref={bookRef}
            className="relative mx-auto opacity-0"
            style={{
              width: "min(92vw, 1200px)",
              height: "clamp(480px, 72vh, 780px)",
              transformStyle: "preserve-3d",
            }}
          >
            {/* ── SPINE (gold line at center) ── */}
            <div
              className="fp-spine absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[3px] pointer-events-none opacity-0"
              style={{
                zIndex: 200,
                background:
                  "linear-gradient(to bottom, transparent 3%, rgba(223, 192, 99,0.35) 15%, rgba(223, 192, 99,0.35) 85%, transparent 97%)",
                boxShadow:
                  "0 0 20px rgba(223, 192, 99,0.15), 0 0 50px rgba(223, 192, 99,0.05)",
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
                    background: `rgba(223, 192, 99,${0.04 - i * 0.004})`,
                  }}
                />
              ))}
            </div>

            {/* ── LEFT BASE PANEL (visible behind flipped pages) ── */}
            <div
              className="absolute top-0 left-0 w-1/2 h-full overflow-hidden rounded-l-sm"
              style={{ zIndex: 1, background: "#0A1620" }}
            >
              <div className="absolute inset-0 bg-gold/[0.01]" />
              <div className="absolute top-0 right-0 bottom-0 w-14 bg-gradient-to-l from-[#0A1620]/60 to-transparent pointer-events-none" />
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
                  background: "linear-gradient(145deg, #0E1924 0%, #101F2D 40%, #0A1620 100%)",
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

                  <div className="w-20 h-px bg-gold/30 mb-4" />

                  <p
                    className="text-white/20 text-xs tracking-[0.25em] uppercase mb-4"
                    style={{ fontFamily: "var(--font-mono-custom)" }}
                  >
                    Pavani Infra
                  </p>

                  <div className="w-[1px] h-10 lg:h-16 bg-gradient-to-t from-transparent via-gold/40 to-gold/10 mt-5" />
                </div>

                <div className="absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-r from-[#0A1620]/60 to-transparent pointer-events-none" />
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
                  {renderPageFront(project, i, total)}
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

      {/* ─── Minimal Navigation ─── */}
      <div className="fp-nav-buttons hidden md:flex items-center justify-center gap-5 pb-3 lg:pb-4 opacity-0 relative z-30">
        {/* Prev arrow */}
        <button
          onClick={flipPrev}
          disabled={isAnimating || currentPage < 0}
          className={`group flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-400 ${
            currentPage < 0
              ? "border-navy/15 text-navy/20 cursor-not-allowed"
              : "border-gold/25 text-gold/50 hover:border-gold/50 hover:text-gold hover:bg-gold/5 cursor-pointer"
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft
            size={16}
            className={`transition-transform duration-300 ${currentPage >= 0 ? "group-hover:-translate-x-0.5" : ""}`}
          />
        </button>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {PROJECTS.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                i === currentPage
                  ? "bg-gold scale-125"
                  : i < currentPage
                    ? "bg-gold/30"
                    : "bg-navy/20"
              }`}
            />
          ))}
        </div>

        {/* Next arrow */}
        <button
          onClick={flipNext}
          disabled={isAnimating || currentPage >= total - 1}
          className={`group flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-400 ${
            currentPage >= total - 1
              ? "border-navy/15 text-navy/20 cursor-not-allowed"
              : "border-gold/25 text-gold/50 hover:border-gold/50 hover:text-gold hover:bg-gold/5 cursor-pointer"
          }`}
          aria-label="Next page"
        >
          <ChevronRight
            size={16}
            className={`transition-transform duration-300 ${currentPage < total - 1 ? "group-hover:translate-x-0.5" : ""}`}
          />
        </button>
      </div>

      {/* ─── View All — subtle text link ─── */}
      <div className="hidden md:flex justify-center pb-4 lg:pb-5 relative z-30">
        <a
          href="/project"
          className="inline-flex items-center gap-2 text-gold-contrast/50 text-xs tracking-[0.2em] uppercase hover:text-gold-contrast transition-colors duration-400 group"
          style={{ fontFamily: "var(--font-mono-custom)" }}
        >
          View All Projects
          <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform duration-300" />
        </a>
      </div>

      {/* ══════════════════════════════════════════════════════
          MOBILE — Elegant Card Stack
         ══════════════════════════════════════════════════════ */}
      <div className="md:hidden px-5 pt-24 pb-14">
        <div className="text-center mb-10">
          <span
            className="fp-mob-sub text-gold-contrast text-xs tracking-[0.35em] uppercase block mb-2"
            style={{ fontFamily: "var(--font-mono-custom)" }}
          >
            Portfolio
          </span>
          <h2
            className="fp-mob-title text-2xl font-bold text-navy tracking-tight"
            style={{ fontFamily: "var(--font-display-custom)" }}
          >
            Featured <span className="text-gold">Projects</span>
          </h2>
          <div className="w-20 h-px bg-gold/40 mx-auto mt-3" />
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1620]/80 via-[#0A1620]/30 to-transparent" />
                  <div className="absolute inset-0 bg-gold/[0.02]" />
                  <div className="absolute top-3 right-3">
                    <span
                      className="text-gold/50 text-[11px] tracking-[0.2em] uppercase border border-gold/15 px-2.5 py-1 rounded-full bg-[#0A1620]/40 backdrop-blur-sm"
                      style={{ fontFamily: "var(--font-mono-custom)" }}
                    >
                      {project.type}
                    </span>
                  </div>
                </div>
                <div className="p-5" style={{ background: "rgba(10,22,32,0.92)" }}>
                  <h3
                    className="text-xl font-bold text-white tracking-tight mb-2"
                    style={{ fontFamily: "var(--font-display-custom)" }}
                  >
                    {project.name}
                  </h3>
                  <div className="w-10 h-[1px] bg-gold/30 mb-3" />
                  <div className="flex items-center gap-4 text-white/40 text-[13px]">
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
            className="inline-flex items-center gap-2 text-gold-contrast text-sm tracking-[0.2em] uppercase hover:text-navy transition-colors duration-300"
            style={{ fontFamily: "var(--font-mono-custom)" }}
          >
            View All Projects <ArrowRight size={12} />
          </a>
        </div>
      </div>
    </section>
  );
}
