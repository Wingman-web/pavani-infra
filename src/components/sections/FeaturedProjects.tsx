"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "@/lib/constants";
import { MapPin, Maximize2, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════ */

export default function FeaturedProjects() {
  const sectionRef = useRef<HTMLElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const desktopHeaderRef = useRef<HTMLDivElement>(null);

  const [currentPage, setCurrentPage] = useState(0);
  // Separate state for left panel image — updated at different times for next vs prev
  const [leftImage, setLeftImage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const total = PROJECTS.length;

  /* ═══════════════════════════════════════════════════
     ENTRANCE ANIMATION
     ═══════════════════════════════════════════════════ */
  useEffect(() => {
    const section = sectionRef.current;
    const book = bookRef.current;
    if (!section || !book) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const ctx = gsap.context(() => {
        // Hide book initially
        gsap.set(book, { opacity: 0, scale: 0.65, rotateX: 12 });

        gsap.to(
          book,
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
            onComplete: () => {
              setHasEntered(true);
              // Clear transforms so CSS takes over cleanly
              gsap.set(book, { clearProps: "transform,scale,rotateX" });
            },
          }
        );

        const dHeader = desktopHeaderRef.current;
        if (dHeader) {
          const titleEl = dHeader.querySelector(".fp-dk-title");
          const subEl = dHeader.querySelector(".fp-dk-sub");
          if (titleEl) {
            gsap.fromTo(
              titleEl,
              { opacity: 0, y: 30 },
              {
                opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
                scrollTrigger: { trigger: section, start: "top 75%", once: true },
              }
            );
          }
          if (subEl) {
            gsap.fromTo(
              subEl,
              { opacity: 0 },
              {
                opacity: 1, duration: 0.8, delay: 0.3, ease: "power2.out",
                scrollTrigger: { trigger: section, start: "top 75%", once: true },
              }
            );
          }
        }

        gsap.from(
          ".fp-side-nav",
          {
            opacity: 0, duration: 0.8, delay: 0.5, ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 75%", once: true },
            clearProps: "opacity",
          }
        );

        // First page content — animate in then clear inline styles
        gsap.from(
          ".fp-page-0 .pg-detail",
          {
            opacity: 0, y: 25, stagger: 0.03, duration: 0.5, ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 75%", once: true },
            delay: 0.6,
            clearProps: "transform,opacity",
          }
        );
      }, section);

      return () => ctx.revert();
    });

    mm.add("(max-width: 767px)", () => {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".fp-mob-title",
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 80%" },
          }
        );
        gsap.fromTo(
          ".mob-card",
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power3.out",
            scrollTrigger: { trigger: ".mob-grid", start: "top 85%" },
          }
        );
      }, section);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, [total]);

  /* ═══════════════════════════════════════════════════
     PAGE FLIP ANIMATIONS
     ═══════════════════════════════════════════════════ */

  const flipNext = useCallback(() => {
    if (isAnimating || currentPage >= total - 1) return;
    setIsAnimating(true);

    const nextIdx = currentPage + 1;

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentPage(nextIdx);
        setIsAnimating(false);
      },
    });

    const pageEl = `.fp-page-${currentPage}`;
    const nextShadow = `.fp-page-${nextIdx} .pg-shadow`;

    tl.to(pageEl, {
      rotateY: -180,
      duration: 0.8,
      ease: "power2.inOut",
    }, 0);

    tl.set(pageEl, { zIndex: total + 11 + currentPage }, 0.4);

    // Update left panel image at midpoint when the page is flipping over
    tl.call(() => { setLeftImage(nextIdx); }, [], 0.5);

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

    tl.fromTo(
      `.fp-page-${nextIdx} .pg-detail`,
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, stagger: 0.02, duration: 0.4, ease: "power3.out", clearProps: "transform,opacity" },
      0.5
    );
  }, [currentPage, isAnimating, total]);

  const flipPrev = useCallback(() => {
    if (isAnimating || currentPage <= 0) return;
    setIsAnimating(true);

    const prevIdx = currentPage - 1;

    // Update left panel image immediately when flipping back
    setLeftImage(prevIdx);

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentPage(prevIdx);
        setIsAnimating(false);
      },
    });

    const pageEl = `.fp-page-${prevIdx}`;

    tl.to(pageEl, {
      rotateY: 0,
      duration: 0.8,
      ease: "power2.inOut",
    }, 0);

    tl.set(pageEl, { zIndex: total - prevIdx }, 0.4);

    // Shadow sweep on the page being revealed
    tl.fromTo(
      `.fp-page-${prevIdx} .pg-shadow`,
      { opacity: 0.5, x: "-30%" },
      { opacity: 0, x: "80%", duration: 0.8, ease: "power2.out" },
      0
    );

    // Animate prev page content entrance
    tl.fromTo(
      `.fp-page-${prevIdx} .pg-detail`,
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, stagger: 0.02, duration: 0.4, ease: "power3.out", clearProps: "transform,opacity" },
      0.4
    );
  }, [currentPage, isAnimating, total]);

  /* ─── Render helpers ─── */

  const renderPageFront = (project: (typeof PROJECTS)[number], idx: number, total: number) => (
    <div
      className="absolute inset-0 overflow-hidden rounded-r-sm paper-texture"
      style={{
        backfaceVisibility: "hidden",
        background: "linear-gradient(150deg, #191613 0%, #231F1B 50%, #151210 100%)",
      }}
    >
      <div className="absolute top-0 left-0 bottom-0 w-12 bg-gradient-to-r from-surface-void/60 to-transparent pointer-events-none z-10" />

      {/* Page number — top right */}
      <div className="absolute top-6 right-6 lg:top-8 lg:right-10 z-10 flex items-baseline gap-1 select-none pointer-events-none">
        <span
          className="pg-detail text-gold/40 text-lg lg:text-2xl font-bold tabular-nums"
          style={{ fontFamily: "var(--font-display-custom)" }}
        >
          {String(idx + 1).padStart(2, "0")}
        </span>
        <span
          className="pg-detail text-white/12 text-[10px] lg:text-xs"
          style={{ fontFamily: "var(--font-mono-custom)" }}
        >
          / {String(total).padStart(2, "0")}
        </span>
      </div>

      <div className="absolute inset-0 p-8 lg:p-14 xl:p-16 flex flex-col justify-center" style={{ zIndex: 5 }}>
        <span
          className="pg-detail inline-block text-gold/60 text-[10px] lg:text-xs tracking-[0.3em] uppercase mb-4 lg:mb-5 border border-gold/20 px-3 py-1 rounded-full w-fit"
          style={{ fontFamily: "var(--font-mono-custom)" }}
        >
          {project.type}
        </span>

        <h3
          className="pg-detail text-[1.75rem] lg:text-[2.75rem] xl:text-[3.25rem] font-bold text-white tracking-tight mb-4 lg:mb-5 leading-[1]"
          style={{ fontFamily: "var(--font-display-custom)" }}
        >
          {project.name}
        </h3>

        <div className="pg-detail w-12 lg:w-20 h-[1px] bg-gradient-to-r from-gold/60 to-transparent mb-5 lg:mb-6 origin-left" />

        <div className="pg-detail flex items-center gap-2 text-white/45 text-sm lg:text-[15px] mb-2">
          <MapPin size={13} className="text-gold/50 shrink-0" />
          <span>{project.location}</span>
        </div>

        <div className="pg-detail flex items-center gap-2 text-white/45 text-sm lg:text-[15px] mb-8 lg:mb-10">
          <Maximize2 size={13} className="text-gold/50 shrink-0" />
          <span>{project.area}</span>
        </div>

        <a
          href={`/project/${project.slug}`}
          className="pg-detail inline-flex items-center gap-2.5 group w-fit px-5 py-2.5 rounded-full border border-gold/20 hover:border-gold/50 hover:bg-gold/6 transition-all duration-300"
        >
          <span
            className="text-gold text-xs lg:text-[13px] tracking-[0.15em] uppercase"
            style={{ fontFamily: "var(--font-mono-custom)" }}
          >
            Explore Project
          </span>
          <ArrowRight
            size={14}
            className="text-gold group-hover:translate-x-0.5 transition-transform duration-300"
          />
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

  const renderPageBack = (nextProject: (typeof PROJECTS)[number]) => (
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
      <div className="absolute inset-0 bg-gradient-to-r from-surface-void/25 via-transparent to-surface-void/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-surface-void/60 via-transparent to-surface-void/25" />
      <div className="absolute inset-0 bg-gold/2" />

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

      <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-surface-void/50 to-transparent pointer-events-none" />
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className="relative py-14 md:py-20 overflow-hidden"
      style={{ background: "#F1E4CF" }}
    >
      {/* ─── Desktop section header ─── */}
      <div ref={desktopHeaderRef} className="hidden md:block text-center pb-4 lg:pb-6 z-30 relative">
        <span
          className="fp-dk-sub text-gold-contrast text-[11px] md:text-xs tracking-[0.35em] uppercase block mb-2"
          style={{ fontFamily: "var(--font-mono-custom)" }}
        >
          Portfolio
        </span>
        <h2
          className="fp-dk-title text-2xl md:text-4xl lg:text-5xl font-bold text-navy tracking-tight"
          style={{ fontFamily: "var(--font-display-custom)" }}
        >
          Featured <span className="text-gold-contrast">Projects</span>
        </h2>
      </div>

      {/* ══════════════════════════════════════════════════════
          DESKTOP — 3D Brochure Book
         ══════════════════════════════════════════════════════ */}
      <div className="hidden md:flex items-center justify-center py-4 lg:py-6 relative">

        {/* Prev — left side */}
        <button
          onClick={flipPrev}
          disabled={isAnimating || currentPage <= 0}
          className={`fp-side-nav absolute left-3 lg:left-6 xl:left-10 top-1/2 -translate-y-1/2 z-40 flex items-center justify-center w-11 h-11 lg:w-12 lg:h-12 rounded-full border-2 transition-all duration-400 ${
            currentPage <= 0
              ? "border-navy/10 text-navy/15 cursor-not-allowed"
              : "border-gold-contrast/40 text-gold-contrast/60 hover:border-gold-contrast hover:text-gold-contrast hover:bg-gold-contrast/10 hover:shadow-[0_0_20px_rgba(139,109,42,0.15)] cursor-pointer"
          }`}
          aria-label="Previous project"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Next — right side */}
        <button
          onClick={flipNext}
          disabled={isAnimating || currentPage >= total - 1}
          className={`fp-side-nav absolute right-3 lg:right-6 xl:right-10 top-1/2 -translate-y-1/2 z-40 flex items-center justify-center w-11 h-11 lg:w-12 lg:h-12 rounded-full border-2 transition-all duration-400 ${
            currentPage >= total - 1
              ? "border-navy/10 text-navy/15 cursor-not-allowed"
              : "border-gold-contrast/40 text-gold-contrast/60 hover:border-gold-contrast hover:text-gold-contrast hover:bg-gold-contrast/10 hover:shadow-[0_0_20px_rgba(139,109,42,0.15)] cursor-pointer"
          }`}
          aria-label="Next project"
        >
          <ChevronRight size={18} />
        </button>

        <div
          style={{ perspective: "1800px", perspectiveOrigin: "50% 45%" }}
          className="w-full mx-auto px-16 lg:px-20 xl:px-24 flex items-center justify-center"
        >
          <div
            ref={bookRef}
            className="relative mx-auto"
            // opacity controlled by GSAP entrance animation
            style={{
              width: "min(88vw, 1100px)",
              height: "clamp(480px, 72vh, 780px)",
              transformStyle: "preserve-3d",
            }}
          >
            {/* ── SPINE ── */}
            <div
              className="fp-spine absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[3px] pointer-events-none"
              style={{
                zIndex: 200,
                background:
                  "linear-gradient(to bottom, transparent 3%, rgba(211, 185, 115,0.35) 15%, rgba(211, 185, 115,0.35) 85%, transparent 97%)",
                boxShadow:
                  "0 0 20px rgba(211, 185, 115,0.15), 0 0 50px rgba(211, 185, 115,0.05)",
              }}
            />

            {/* ── Page thickness edge ── */}
            <div className="absolute bottom-0 left-[50%] right-0 h-[8px] pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute left-0 right-0 h-[1px]"
                  style={{
                    bottom: i,
                    background: `rgba(211, 185, 115,${0.04 - i * 0.004})`,
                  }}
                />
              ))}
            </div>

            {/* ── LEFT PANEL — shows current project image ── */}
            <div
              className="absolute top-0 left-0 w-1/2 h-full overflow-hidden rounded-l-sm"
              style={{ zIndex: 1 }}
            >
              {PROJECTS.map((project, i) => (
                <div
                  key={`left-img-${i}`}
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{ opacity: i === leftImage ? 1 : 0 }}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${project.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-surface-void/30 via-transparent to-surface-void/60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-void/60 via-transparent to-surface-void/30" />

                  {/* Project name & type on left image */}
                  <div className="absolute bottom-4 left-5 right-5 flex items-center gap-2 z-10">
                    <div className="w-8 h-[1px] bg-gold/30" />
                    <span
                      className="text-white/30 text-[11px] tracking-[0.2em] uppercase"
                      style={{ fontFamily: "var(--font-mono-custom)" }}
                    >
                      {project.type}
                    </span>
                  </div>
                  <div className="absolute bottom-16 left-6 right-6 z-10">
                    <h4
                      className="text-2xl lg:text-4xl font-bold text-white/80 tracking-tight"
                      style={{ fontFamily: "var(--font-display-custom)" }}
                    >
                      {project.name}
                    </h4>
                  </div>
                </div>
              ))}
              <div className="absolute top-0 right-0 bottom-0 w-14 bg-gradient-to-l from-surface-void/60 to-transparent pointer-events-none z-10" />
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
                  {!isLast && renderPageBack(PROJECTS[i + 1])}
                </div>
              );
            })}

            {/* ── Book outer frame ── */}
            <div
              className="absolute inset-0 border border-gold/6 rounded-sm pointer-events-none"
              style={{ zIndex: 201 }}
            />
          </div>
        </div>
      </div>

      {/* ─── Project Nav Dots (display only) ─── */}
      <div className="hidden md:flex items-center justify-center gap-2.5 pt-2 pb-4 lg:pb-5 relative z-30">
        {PROJECTS.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
              i === currentPage
                ? "bg-gold-contrast scale-150"
                : i < currentPage
                  ? "bg-gold-contrast/30"
                  : "bg-navy/20"
            }`}
          />
        ))}
      </div>

      {/* ─── View All ─── */}
      <div className="hidden md:flex justify-center mt-3 lg:mt-4 relative z-30">
        <a
          href="/project"
          className="inline-flex items-center gap-2 px-8 py-3.5 border border-gold-dark text-gold-contrast text-sm tracking-wider uppercase rounded-sm hover:bg-gold-contrast hover:text-cream transition-all duration-500 group"
        >
          View All Projects
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-300" />
        </a>
      </div>

      {/* ══════════════════════════════════════════════════════
          MOBILE — Elegant Card Stack
         ══════════════════════════════════════════════════════ */}
      <div className="md:hidden px-5">
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
            Featured <span className="text-gold-contrast">Projects</span>
          </h2>
          <div className="w-20 h-px bg-gold/40 mx-auto mt-3" />
        </div>

        <div className="mob-grid space-y-6">
          {PROJECTS.map((project) => (
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
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-void/80 via-surface-void/30 to-transparent" />
                  <div className="absolute inset-0 bg-gold/2" />
                  <div className="absolute top-3 right-3">
                    <span
                      className="text-gold/50 text-[11px] tracking-[0.2em] uppercase border border-gold/15 px-2.5 py-1 rounded-full bg-surface-void/40 backdrop-blur-sm"
                      style={{ fontFamily: "var(--font-mono-custom)" }}
                    >
                      {project.type}
                    </span>
                  </div>
                </div>
                <div className="p-5" style={{ background: "rgba(25,22,19,0.94)" }}>
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
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-gold-dark text-gold-contrast text-sm tracking-wider uppercase rounded-sm hover:bg-gold-contrast hover:text-cream transition-all duration-500 group"
          >
            View All Projects
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-300" />
          </a>
        </div>
      </div>
    </section>
  );
}
