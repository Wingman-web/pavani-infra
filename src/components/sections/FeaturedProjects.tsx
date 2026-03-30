"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "@/lib/constants";
import { MapPin, Maximize2, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedProjects() {
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const total = PROJECTS.length;
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Get indices for visible cards (previous, current, next)
  const getVisibleIndices = useCallback((index: number) => {
    const prev = (index - 1 + total) % total;
    const next = (index + 1) % total;
    return { prev, current: index, next };
  }, [total]);

  // Auto-play
  useEffect(() => {
    const startAutoPlay = () => {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % total);
      }, 5000);
    };
    startAutoPlay();
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [total]);

  const resetAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 5000);
  }, [total]);

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

  const goToSlide = useCallback((index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    resetAutoPlay();
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 800);
  }, [isAnimating, currentIndex, resetAutoPlay]);

  const goNext = useCallback(() => {
    if (isAnimating) return;
    goToSlide((currentIndex + 1) % total);
  }, [isAnimating, currentIndex, total, goToSlide]);

  const goPrev = useCallback(() => {
    if (isAnimating) return;
    goToSlide((currentIndex - 1 + total) % total);
  }, [isAnimating, currentIndex, total, goToSlide]);

  const { prev, current, next } = getVisibleIndices(currentIndex);

  const cardPositions = [
    { index: prev, position: "left" as const },
    { index: current, position: "center" as const },
    { index: next, position: "right" as const },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-24 overflow-hidden"
      style={{ background: "#FAFAFA" }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="blueprint-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <rect width="80" height="80" fill="none" stroke="#950921" strokeWidth="0.5"/>
              <rect width="40" height="40" fill="none" stroke="#950921" strokeWidth="0.25"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#blueprint-grid)"/>
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
      <div className="text-center pb-8 lg:pb-12 z-30 relative">
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
          DESKTOP — 3-Card Carousel
         ══════════════════════════════════════════════════════ */}
      <div className="hidden md:block fp-carousel-container relative z-10">
        <div
          ref={carouselRef}
          className="relative flex items-center justify-center"
          style={{ height: "clamp(500px, 65vh, 700px)" }}
        >
          {/* Navigation arrows */}
          <button
            onClick={goPrev}
            disabled={isAnimating}
            className="absolute left-4 lg:left-10 z-30 flex items-center justify-center w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border border-gold/20 text-gold-contrast hover:bg-gold-contrast hover:text-white hover:border-gold-contrast shadow-lg transition-all duration-300 cursor-pointer"
            aria-label="Previous project"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goNext}
            disabled={isAnimating}
            className="absolute right-4 lg:right-10 z-30 flex items-center justify-center w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border border-gold/20 text-gold-contrast hover:bg-gold-contrast hover:text-white hover:border-gold-contrast shadow-lg transition-all duration-300 cursor-pointer"
            aria-label="Next project"
          >
            <ChevronRight size={20} />
          </button>

          {/* Cards */}
          <div className="relative w-full h-full max-w-[1400px] mx-auto flex items-center justify-center px-16 lg:px-24" style={{ perspective: "1200px" }}>
            {cardPositions.map(({ index, position }) => {
              const project = PROJECTS[index];
              const isCenter = position === "center";
              const isLeft = position === "left";

              return (
                <div
                  key={`${position}-${index}`}
                  className="carousel-card absolute"
                  onClick={() => {
                    if (!isCenter) goToSlide(index);
                  }}
                  style={{
                    width: isCenter ? "42%" : "28%",
                    top: isCenter ? "0" : "8%",
                    height: isCenter ? "78%" : "65%",
                    left: isLeft ? "2%" : isCenter ? "29%" : "70%",
                    zIndex: isCenter ? 20 : 10,
                    transform: isCenter
                      ? "scale(1) rotateY(0deg)"
                      : isLeft
                        ? "scale(0.95) rotateY(4deg)"
                        : "scale(0.95) rotateY(-4deg)",
                    filter: isCenter ? "none" : "brightness(0.8)",
                    transformStyle: "preserve-3d",
                    transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    cursor: isCenter ? "default" : "pointer",
                  }}
                >
                  <div className={`relative w-full h-full rounded-lg overflow-hidden shadow-2xl group ${isCenter ? "ring-2 ring-gold/30" : ""}`}>
                    {/* Project image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${project.image})`,
                        transition: "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                      }}
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>

                  {/* Details below card — all cards */}
                  <div
                    className="absolute left-0 right-0 text-center"
                    style={{
                      bottom: isCenter ? "-90px" : "-70px",
                      transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    }}
                  >
                    <h3
                      className={`font-bold tracking-tight mb-1 ${
                        isCenter
                          ? "text-xl lg:text-2xl text-[#0e1a26]"
                          : "text-sm lg:text-base text-[#0e1a26]/70"
                      }`}
                      style={{
                        fontFamily: "var(--font-display-custom)",
                        transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                      }}
                    >
                      {project.name}
                    </h3>
                    <p
                      className={`flex items-center justify-center gap-1 ${
                        isCenter
                          ? "text-[#0e1a26]/60 text-sm mb-1"
                          : "text-[#0e1a26]/40 text-xs"
                      }`}
                      style={{ transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}
                    >
                      <MapPin size={isCenter ? 12 : 10} className={isCenter ? "text-gold-contrast" : "text-gold-contrast/60"} />
                      {isCenter ? `${project.area} | ${project.location}` : project.location}
                    </p>
                    <p
                      className={`${
                        isCenter ? "text-[#0e1a26]/40 text-xs" : "text-[#0e1a26]/25 text-[10px]"
                      }`}
                      style={{
                        fontFamily: "var(--font-mono-custom)",
                        transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                      }}
                    >
                      RERA No: {isCenter ? "TN/02/Building/0020/2022" : project.slug.toUpperCase().slice(0, 20)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Nav dots */}
        <div className="flex items-center justify-center gap-2.5 mt-28 relative z-30">
          {PROJECTS.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`rounded-full transition-all duration-500 cursor-pointer ${
                i === currentIndex
                  ? "w-8 h-2 bg-gold-contrast"
                  : "w-2 h-2 bg-[#0e1a26]/20 hover:bg-gold-contrast/40"
              }`}
              aria-label={`Go to project ${i + 1}`}
            />
          ))}
        </div>

        {/* View More button */}
        <div className="flex justify-center mt-8 relative z-30">
          <a
            href="/project"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gold-contrast text-white text-sm tracking-wider uppercase rounded-sm hover:bg-gold-dark transition-all duration-500 group shadow-lg"
          >
            View More
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-300" />
          </a>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          MOBILE — Card Stack
         ══════════════════════════════════════════════════════ */}
      <div className="md:hidden px-5">
        <div className="relative overflow-hidden">
          {/* Mobile carousel */}
          <div className="relative" style={{ height: "420px" }}>
            {PROJECTS.map((project, i) => {
              const offset = i - currentIndex;
              const isActive = i === currentIndex;
              return (
                <div
                  key={project.slug}
                  className="absolute inset-0 transition-all duration-700 ease-out"
                  style={{
                    transform: `translateX(${offset * 105}%) scale(${isActive ? 1 : 0.85})`,
                    opacity: Math.abs(offset) <= 1 ? 1 : 0,
                    zIndex: isActive ? 10 : 5,
                  }}
                >
                  <a href={`/project/${project.slug}`} className="block h-full">
                    <div className="relative h-72 overflow-hidden rounded-lg shadow-xl">
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${project.image})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                    <div className="mt-4 text-center">
                      <h3
                        className="text-lg font-bold text-[#0e1a26] tracking-tight"
                        style={{ fontFamily: "var(--font-display-custom)" }}
                      >
                        {project.name}
                      </h3>
                      <p className="text-[#0e1a26]/50 text-sm flex items-center justify-center gap-1.5 mt-1">
                        <MapPin size={11} className="text-gold-contrast" />
                        {project.area} | {project.location}
                      </p>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>

          {/* Mobile nav controls */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={() => { goPrev(); }}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-gold/30 text-gold-contrast hover:bg-gold-contrast hover:text-white transition-all duration-300 cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-2">
              {PROJECTS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`rounded-full transition-all duration-400 cursor-pointer ${
                    i === currentIndex
                      ? "w-6 h-1.5 bg-gold-contrast"
                      : "w-1.5 h-1.5 bg-[#0e1a26]/20"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => { goNext(); }}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-gold/30 text-gold-contrast hover:bg-gold-contrast hover:text-white transition-all duration-300 cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="text-center mt-8">
          <a
            href="/project"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gold-contrast text-white text-sm tracking-wider uppercase rounded-sm hover:bg-gold-dark transition-all duration-500 group shadow-lg"
          >
            View More
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-300" />
          </a>
        </div>
      </div>
    </section>
  );
}
