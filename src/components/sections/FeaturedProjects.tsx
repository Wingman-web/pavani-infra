"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "@/lib/constants";
import { MapPin, Maximize2, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/*
 * Only transform + opacity — fully GPU composited, no layout thrash.
 * Slow ease so you can watch the card physically travel.
 */
const DURATION = "1.3s";
const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

export default function FeaturedProjects() {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredCenter, setHoveredCenter] = useState(false);
  const total = PROJECTS.length;
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Circular offset from center: wraps so cards loop */
  const getOffset = useCallback(
    (i: number) => {
      let diff = i - currentIndex;
      if (diff > total / 2) diff -= total;
      if (diff < -total / 2) diff += total;
      return diff;
    },
    [currentIndex, total]
  );

  /* Auto-play */
  const resetAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 6000);
  }, [total]);

  useEffect(() => {
    resetAutoPlay();
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [resetAutoPlay]);

  /* Entrance animation */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".fp-header-title",
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 75%", once: true },
        }
      );
      gsap.fromTo(
        ".fp-header-sub",
        { opacity: 0 },
        {
          opacity: 1, duration: 0.8, delay: 0.3, ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 75%", once: true },
        }
      );
      gsap.fromTo(
        ".fp-carousel-container",
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 1, delay: 0.2, ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 70%", once: true },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating || index === currentIndex) return;
      setIsAnimating(true);
      resetAutoPlay();
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 1400);
    },
    [isAnimating, currentIndex, resetAutoPlay]
  );

  const goNext = useCallback(() => {
    if (isAnimating) return;
    goToSlide((currentIndex + 1) % total);
  }, [isAnimating, currentIndex, total, goToSlide]);

  const goPrev = useCallback(() => {
    if (isAnimating) return;
    goToSlide((currentIndex - 1 + total) % total);
  }, [isAnimating, currentIndex, total, goToSlide]);

  /*
   * Desktop card transform — ONLY uses transform + opacity.
   * All cards share the same base size, positioned with translate/scale.
   */
  const getDesktopTransform = (offset: number) => {
    const absOffset = Math.abs(offset);
    const sign = offset > 0 ? 1 : -1;

    if (absOffset === 0) {
      return {
        transform: "translate(-50%, -50%) scale(1) rotateY(0deg)",
        opacity: 1,
        zIndex: 20,
      };
    }
    if (absOffset === 1) {
      return {
        transform: `translate(calc(-50% + ${sign * 72}%), calc(-50% + 2%)) scale(0.82) rotateY(${sign * -3}deg)`,
        opacity: 1,
        zIndex: 10,
      };
    }
    // ±2 — off-screen, ready to slide in
    return {
      transform: `translate(calc(-50% + ${sign * 130}%), calc(-50% + 4%)) scale(0.72) rotateY(${sign * -5}deg)`,
      opacity: 0,
      zIndex: 5,
    };
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-12 md:py-16 overflow-hidden"
      style={{ background: "#FAFAFA" }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="blueprint-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <rect width="80" height="80" fill="none" stroke="#950921" strokeWidth="0.5" />
              <rect width="40" height="40" fill="none" stroke="#950921" strokeWidth="0.25" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#blueprint-grid)" />
        </svg>
      </div>
      {/* Diagonal gold accent lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50">
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[#d3b973] to-transparent rotate-[35deg]" />
        <div className="absolute -top-[10%] -right-[10%] w-[500px] h-[1px] bg-gradient-to-r from-transparent via-[#d3b973] to-transparent rotate-[35deg]" />
        <div className="absolute bottom-[15%] -left-[5%] w-[450px] h-[1px] bg-gradient-to-r from-transparent via-[#d3b973] to-transparent rotate-[35deg]" />
        <div className="absolute bottom-[25%] -left-[5%] w-[550px] h-[1px] bg-gradient-to-r from-transparent via-[#d3b973] to-transparent rotate-[35deg]" />
      </div>

      {/* Section header */}
      <div className="text-center pb-6 lg:pb-8 z-30 relative">
        <span
          className="fp-header-sub text-gold-contrast text-[11px] md:text-xs tracking-[0.35em] uppercase block mb-2"
          style={{ fontFamily: "var(--font-mono-custom)" }}
        >
          Portfolio
        </span>
        <h2
          className="fp-header-title text-3xl md:text-5xl lg:text-6xl font-bold text-[#0e1a26] tracking-tight"
          style={{ fontFamily: "var(--font-display-custom)" }}
        >
          Featured <span className="text-gold-contrast">Projects</span>
        </h2>
      </div>

      {/* ══════════════════════════════════════════════════════
          DESKTOP — GPU-only smooth carousel
         ══════════════════════════════════════════════════════ */}
      <div className="hidden md:block fp-carousel-container relative z-10">
        <div
          className="relative"
          style={{ height: "clamp(360px, 50vh, 520px)" }}
        >
          {/* Navigation arrows */}
          <button
            onClick={goPrev}
            disabled={isAnimating}
            className="absolute left-4 lg:left-10 top-1/2 -translate-y-1/2 z-[15] flex items-center justify-center w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border border-gold/20 text-gold-contrast hover:bg-gold-contrast hover:text-white hover:border-gold-contrast shadow-lg transition-all duration-300 cursor-pointer"
            aria-label="Previous project"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goNext}
            disabled={isAnimating}
            className="absolute right-4 lg:right-10 top-1/2 -translate-y-1/2 z-[15] flex items-center justify-center w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border border-gold/20 text-gold-contrast hover:bg-gold-contrast hover:text-white hover:border-gold-contrast shadow-lg transition-all duration-300 cursor-pointer"
            aria-label="Next project"
          >
            <ChevronRight size={20} />
          </button>

          {/* Cards container */}
          <div
            className="relative w-full h-full max-w-[1400px] mx-auto"
            style={{ perspective: "1200px" }}
          >
            {PROJECTS.map((project, i) => {
              const offset = getOffset(i);
              const absOffset = Math.abs(offset);
              const isCenter = offset === 0;
              const { transform, opacity, zIndex } = getDesktopTransform(offset);

              /* Hide cards beyond ±2 without removing from DOM */
              const isVisible = absOffset <= 2;

              return (
                <div
                  key={`card-${i}`}
                  className="absolute top-1/2 left-1/2 will-change-transform"
                  onClick={() => !isCenter && isVisible && goToSlide(i)}
                  onMouseEnter={() => isCenter && setHoveredCenter(true)}
                  onMouseLeave={() => isCenter && setHoveredCenter(false)}
                  style={{
                    width: "40%",
                    height: "88%",
                    transform,
                    opacity: isVisible ? opacity : 0,
                    zIndex,
                    transition: `transform ${DURATION} ${EASE}, opacity ${DURATION} ${EASE}`,
                    transformStyle: "preserve-3d",
                    cursor: isCenter ? "default" : "pointer",
                    pointerEvents: isVisible ? "auto" : "none",
                  }}
                >
                  <div
                    className={`relative w-full h-full rounded-xl overflow-hidden group ${
                      isCenter
                        ? "shadow-[0_30px_70px_-15px_rgba(0,0,0,0.35)] ring-1 ring-white/20"
                        : "shadow-[0_15px_40px_-10px_rgba(0,0,0,0.2)]"
                    }`}
                  >
                    {/* Image — parallax shifts slightly opposite to slide direction */}
                    <div
                      className="absolute inset-[-6%] bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${project.image})`,
                        transform: isCenter
                          ? `scale(${hoveredCenter ? 1.05 : 1})`
                          : `translateX(${offset > 0 ? "-3%" : "3%"})`,
                        transition: `transform 1.6s ${EASE}`,
                        filter: isCenter ? "none" : "brightness(0.92)",
                      }}
                    />

                    {/* Subtle gradient for depth */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(to top, rgba(0,0,0,0.15) 0%, transparent 40%)",
                      }}
                    />

                    {/* View icon on hover — center only */}
                    <div
                      className="absolute top-4 right-4 z-10"
                      style={{
                        opacity: isCenter && hoveredCenter ? 1 : 0,
                        transform: isCenter && hoveredCenter ? "scale(1)" : "scale(0.8)",
                        transition: "opacity 0.35s ease, transform 0.35s ease",
                      }}
                    >
                      <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                        <Maximize2 size={14} className="text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Project info — single block, cross-fades on slide change */}
        <div className="relative z-30 mt-5 flex justify-center" style={{ minHeight: "88px" }}>
          {PROJECTS.map((project, i) => (
            <div
              key={`info-${i}`}
              className="absolute inset-0 flex flex-col items-center text-center"
              style={{
                opacity: i === currentIndex ? 1 : 0,
                transform: i === currentIndex ? "translateY(0)" : "translateY(8px)",
                transition: `opacity 0.5s ${EASE}, transform 0.5s ${EASE}`,
                pointerEvents: i === currentIndex ? "auto" : "none",
              }}
            >
              <span
                className="text-[10px] tracking-[0.25em] uppercase text-gold-contrast/70 mb-1"
                style={{ fontFamily: "var(--font-mono-custom)" }}
              >
                {project.type}
              </span>
              <h3
                className="text-xl lg:text-2xl font-bold text-[#0e1a26] tracking-tight"
                style={{ fontFamily: "var(--font-display-custom)" }}
              >
                {project.name}
              </h3>
              <p className="flex items-center gap-1.5 text-[#0e1a26]/50 text-sm mt-1">
                <MapPin size={12} className="text-gold-contrast shrink-0" />
                {project.area} &middot; {project.location}
              </p>
              <p
                className="text-[#0e1a26]/35 text-xs mt-1"
                style={{ fontFamily: "var(--font-mono-custom)" }}
              >
                RERA No: {project.rera}
              </p>
            </div>
          ))}
        </div>

        {/* View More button — matches BlogInsights outline style */}
        <div className="flex justify-center mt-8 relative z-30">
          <a
            href="/project"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-gold-dark text-gold-contrast text-sm tracking-wider uppercase rounded-sm hover:bg-gold-contrast hover:text-white transition-all duration-500 group"
          >
            View More
            <ArrowRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </a>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          MOBILE — Smooth sliding cards
         ══════════════════════════════════════════════════════ */}
      <div className="md:hidden px-5">
        <div className="relative overflow-hidden">
          <div className="relative" style={{ height: "420px" }}>
            {PROJECTS.map((project, i) => {
              const offset = getOffset(i);
              const absOffset = Math.abs(offset);
              const isActive = offset === 0;

              return (
                <div
                  key={project.slug}
                  className="absolute inset-0 will-change-transform"
                  style={{
                    transform: `translateX(${offset * 105}%) scale(${isActive ? 1 : 0.9})`,
                    opacity: absOffset <= 1 ? 1 : 0,
                    zIndex: isActive ? 10 : 5,
                    transition: `transform ${DURATION} ${EASE}, opacity ${DURATION} ${EASE}`,
                    pointerEvents: absOffset > 1 ? "none" : "auto",
                  }}
                >
                  <a href={`/project/${project.slug}`} className="block h-full">
                    <div className="relative h-80 overflow-hidden rounded-xl shadow-xl">
                      <div
                        className="absolute inset-[-4%] bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${project.image})`,
                          transform: isActive ? "translateX(0)" : `translateX(${offset > 0 ? "-2%" : "2%"})`,
                          transition: `transform 1.6s ${EASE}`,
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                      {/* Type badge */}
                      <div className="absolute top-3 left-3 z-10">
                        <span
                          className="px-2.5 py-0.5 bg-white/15 backdrop-blur-md text-white text-[9px] tracking-[0.2em] uppercase rounded-full border border-white/20"
                          style={{ fontFamily: "var(--font-mono-custom)" }}
                        >
                          {project.type}
                        </span>
                      </div>

                      {/* Info inside card */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                        <h3
                          className="text-lg font-bold text-white tracking-tight"
                          style={{ fontFamily: "var(--font-display-custom)" }}
                        >
                          {project.name}
                        </h3>
                        <p className="text-white/60 text-sm flex items-center gap-1.5 mt-1">
                          <MapPin size={11} className="text-[#d3b973]" />
                          {project.area} &middot; {project.location}
                        </p>
                        <p
                          className="text-white/40 text-[10px] mt-1"
                          style={{ fontFamily: "var(--font-mono-custom)" }}
                        >
                          RERA No: {project.rera}
                        </p>
                      </div>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>

          {/* Mobile nav controls — arrows only */}
          <div className="flex items-center justify-center gap-4 mt-5">
            <button
              onClick={goPrev}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-gold/30 text-gold-contrast hover:bg-gold-contrast hover:text-white transition-all duration-300 cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={goNext}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-gold/30 text-gold-contrast hover:bg-gold-contrast hover:text-white transition-all duration-300 cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="text-center mt-8">
          <a
            href="/project"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-gold-dark text-gold-contrast text-sm tracking-wider uppercase rounded-sm hover:bg-gold-contrast hover:text-white transition-all duration-500 group"
          >
            View More
            <ArrowRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </a>
        </div>
      </div>
    </section>
  );
}
