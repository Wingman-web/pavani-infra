"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    src: "https://pavaniinfra.com/_next/image?url=https%3A%2F%2Fbackend.pavaniinfra.com%2Fuploads%2FWeb_Banner_Home_Page_c6c53d52eb.webp&w=1920&q=75",
    alt: "Pavani Infra - Luxury Residences",
  },
  {
    src: "https://pavaniinfra.com/_next/image?url=https%3A%2F%2Fbackend.pavaniinfra.com%2Fuploads%2F12_dc3232c7c2.png&w=3840&q=75",
    alt: "Modern Architecture",
  },
  {
    src: "https://pavaniinfra.com/_next/image?url=https%3A%2F%2Fbackend.pavaniinfra.com%2Fuploads%2F4_8bb5abfb88.png&w=3840&q=75",
    alt: "Premium Living Spaces",
  },
  {
    src: "https://pavaniinfra.com/_next/image?url=https%3A%2F%2Fbackend.pavaniinfra.com%2Fuploads%2F5_bc8a2d829c.png&w=3840&q=75",
    alt: "Luxury Villas",
  },
];

const AUTO_SLIDE_MS = 5000;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const total = SLIDES.length;

  const goTo = useCallback(
    (idx: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(idx);
      setTimeout(() => setIsTransitioning(false), 1000);
    },
    [isTransitioning]
  );

  const nextSlide = useCallback(() => {
    goTo((current + 1) % total);
  }, [current, total, goTo]);

  const prevSlide = useCallback(() => {
    goTo((current - 1 + total) % total);
  }, [current, total, goTo]);

  // Auto-advance
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, AUTO_SLIDE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total]);

  // Reset timer on manual navigation
  const handleNav = useCallback(
    (fn: () => void) => {
      if (timerRef.current) clearInterval(timerRef.current);
      fn();
      timerRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % total);
      }, AUTO_SLIDE_MS);
    },
    [total]
  );

  // Entry animation
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-slider-container",
        { scale: 1.05, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.4, ease: "power3.out", delay: 0.3 }
      );
      gsap.fromTo(
        ".hero-nav-btn",
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)", delay: 1 }
      );
      gsap.fromTo(
        ".hero-dot",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out", delay: 1.2 }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  // Progress bar animation
  useEffect(() => {
    const bar = progressRef.current;
    if (!bar) return;
    bar.style.transition = "none";
    bar.style.width = "0%";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bar.style.transition = `width ${AUTO_SLIDE_MS}ms linear`;
        bar.style.width = "100%";
      });
    });
  }, [current]);

  return (
    <section ref={sectionRef} id="hero" className="relative h-screen w-full overflow-hidden rounded-b-[40px]">
      {/* Slider container */}
      <div className="hero-slider-container absolute inset-0">
        {/* Slides */}
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-all duration-1000 ease-in-out"
            style={{
              opacity: i === current ? 1 : 0,
              transform: i === current ? "scale(1)" : "scale(1.08)",
              zIndex: i === current ? 2 : 1,
            }}
          >
            <img
              src={slide.src}
              alt={slide.alt}
              className="absolute inset-0 w-full h-full object-cover"
              loading={i === 0 ? "eager" : "lazy"}
            />
            {/* Gradient overlays for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0D1A26]/40 via-transparent to-[#0D1A26]/60" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0D1A26]/30 via-transparent to-[#0D1A26]/30" />
          </div>
        ))}

        {/* Gold vignette frame */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            boxShadow: "inset 0 0 150px rgba(13,26,38,0.6), inset 0 0 60px rgba(13,26,38,0.3)",
          }}
        />
      </div>


      {/* Navigation arrows */}
      <button
        onClick={() => handleNav(prevSlide)}
        className="hero-nav-btn absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full border border-white/15 bg-[#0D1A26]/40 backdrop-blur-sm flex items-center justify-center text-white/60 hover:border-gold/50 hover:text-gold hover:bg-[#0D1A26]/60 hover:shadow-[0_0_30px_rgba(223, 192, 99,0.15)] transition-all duration-400 group"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform duration-300" />
      </button>
      <button
        onClick={() => handleNav(nextSlide)}
        className="hero-nav-btn absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full border border-white/15 bg-[#0D1A26]/40 backdrop-blur-sm flex items-center justify-center text-white/60 hover:border-gold/50 hover:text-gold hover:bg-[#0D1A26]/60 hover:shadow-[0_0_30px_rgba(223, 192, 99,0.15)] transition-all duration-400 group"
        aria-label="Next slide"
      >
        <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform duration-300" />
      </button>

      {/* Bottom indicators */}
      <div className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => handleNav(() => goTo(i))}
            className={`hero-dot group relative transition-all duration-500 ${
              i === current ? "w-8 sm:w-10" : "w-2 sm:w-2.5"
            } h-2 sm:h-2.5 rounded-full overflow-hidden`}
            aria-label={`Go to slide ${i + 1}`}
          >
            <div
              className={`absolute inset-0 rounded-full transition-all duration-500 ${
                i === current
                  ? "bg-gold/25 border border-gold/40"
                  : "bg-white/20 border border-white/10 hover:bg-gold/30 hover:border-gold/30"
              }`}
            />
            {i === current && (
              <div
                ref={i === current ? progressRef : undefined}
                className="absolute inset-0 rounded-full bg-gold/70"
                style={{ width: "0%" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Subtle gold line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent z-20" />
    </section>
  );
}
