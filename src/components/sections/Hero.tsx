"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDER_IMAGES = [
  {
    src: "https://pavaniinfra.com/_next/image?url=https%3A%2F%2Fbackend.pavaniinfra.com%2Fuploads%2FWeb_Banner_Home_Page_c6c53d52eb.webp&w=1920&q=75",
    alt: "Pavani Infra - Luxury Residences",
  },
  {
    src: "https://pavaniinfra.com/_next/image?url=https%3A%2F%2Fbackend.pavaniinfra.com%2Fuploads%2F12_dc3232c7c2.png&w=3840&q=75",
    alt: "Pavani Infra - Modern Interiors",
  },
  {
    src: "https://pavaniinfra.com/_next/image?url=https%3A%2F%2Fbackend.pavaniinfra.com%2Fuploads%2F4_8bb5abfb88.png&w=3840&q=75",
    alt: "Pavani Infra - Premium Buildings",
  },
  {
    src: "https://pavaniinfra.com/_next/image?url=https%3A%2F%2Fbackend.pavaniinfra.com%2Fuploads%2F5_bc8a2d829c.png&w=3840&q=75",
    alt: "Pavani Infra - Luxury Villas",
  },
];

const AUTO_SLIDE_MS = 5000;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(Date.now());
  const progressRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);
  const hasAnimated = useRef(false);

  const total = SLIDER_IMAGES.length;

  /* ── Auto-advance ── */
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    startTimeRef.current = Date.now();
    setProgress(0);

    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
      startTimeRef.current = Date.now();
      setProgress(0);
    }, AUTO_SLIDE_MS);
  }, [total]);

  useEffect(() => {
    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      setProgress(Math.min(elapsed / AUTO_SLIDE_MS, 1));
      progressRef.current = requestAnimationFrame(tick);
    };
    progressRef.current = requestAnimationFrame(tick);
    return () => {
      if (progressRef.current) cancelAnimationFrame(progressRef.current);
    };
  }, [current]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  const goTo = useCallback(
    (idx: number) => {
      setCurrent(idx);
      resetTimer();
    },
    [resetTimer]
  );

  const prev = useCallback(() => goTo((current - 1 + total) % total), [current, total, goTo]);
  const next = useCallback(() => goTo((current + 1) % total), [current, total, goTo]);

  /* ── GSAP entrance animation ── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let ctx: gsap.Context | undefined;
    let fallbackTimer: ReturnType<typeof setTimeout>;

    const runAnimation = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;

      ctx = gsap.context(() => {
        const entry = gsap.timeline();

        entry
          .fromTo(
            ".hero-slide-container",
            { scale: 1.05, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.6, ease: "power3.out" }
          )
          .fromTo(
            ".hero-nav-el",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" },
            "-=0.6"
          )
          .fromTo(
            ".hero-corner",
            { opacity: 0, scale: 0 },
            { opacity: 1, scale: 1, duration: 0.5, stagger: 0.06, ease: "back.out(1.7)" },
            "-=0.4"
          )
          .fromTo(
            ".hero-scroll-hint",
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
            "-=0.3"
          );
      }, section);
    };

    const handler = () => runAnimation();
    window.addEventListener("preloader-complete", handler);
    const alreadySeen = document.cookie.includes("preloaderSeen=true");
    fallbackTimer = setTimeout(runAnimation, alreadySeen ? 700 : 4500);

    return () => {
      window.removeEventListener("preloader-complete", handler);
      clearTimeout(fallbackTimer);
      ctx?.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="hero" className="relative h-screen overflow-hidden bg-surface-primary">
      {/* ═══ Full-bleed Image Slider ═══ */}
      <div className="hero-slide-container absolute inset-0 opacity-0">
        {SLIDER_IMAGES.map((img, i) => (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              opacity: i === current ? 1 : 0,
              transform: i === current ? "scale(1)" : "scale(1.06)",
              transition: "opacity 1s cubic-bezier(0.25,0.46,0.45,0.94), transform 1.2s cubic-bezier(0.25,0.46,0.45,0.94)",
            }}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover"
              loading={i === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}

        {/* Cinematic overlays — bottom gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-primary/70 via-transparent to-surface-primary/30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-primary/30 via-transparent to-surface-primary/30 pointer-events-none" />

        {/* Subtle vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, transparent 50%, rgba(5,5,5,0.45) 100%)",
          }}
        />
      </div>

      {/* ═══ Art Deco Corner Ornaments ═══ */}
      <div className="hero-corner absolute top-6 left-6 sm:top-8 sm:left-8 w-12 h-12 sm:w-16 sm:h-16 pointer-events-none opacity-0 z-10">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-gold/40 to-transparent" />
        <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-gold/40 to-transparent" />
        <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-gold/50" />
      </div>
      <div className="hero-corner absolute top-6 right-6 sm:top-8 sm:right-8 w-12 h-12 sm:w-16 sm:h-16 pointer-events-none opacity-0 z-10">
        <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-l from-gold/40 to-transparent" />
        <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-gold/40 to-transparent" />
        <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-gold/50" />
      </div>
      <div className="hero-corner absolute bottom-6 left-6 sm:bottom-8 sm:left-8 w-12 h-12 sm:w-16 sm:h-16 pointer-events-none opacity-0 z-10">
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-gold/40 to-transparent" />
        <div className="absolute bottom-0 left-0 h-full w-px bg-gradient-to-t from-gold/40 to-transparent" />
        <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-gold/50" />
      </div>
      <div className="hero-corner absolute bottom-6 right-6 sm:bottom-8 sm:right-8 w-12 h-12 sm:w-16 sm:h-16 pointer-events-none opacity-0 z-10">
        <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-gold/40 to-transparent" />
        <div className="absolute bottom-0 right-0 h-full w-px bg-gradient-to-t from-gold/40 to-transparent" />
        <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-gold/50" />
      </div>

      {/* ═══ Navigation — bottom bar ═══ */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-6 sm:px-8 md:px-12 lg:px-20 pb-8 sm:pb-10 md:pb-12">
        <div className="flex items-end justify-between">
          {/* Slide counter */}
          <div className="hero-nav-el opacity-0 flex items-baseline gap-1.5">
            <span
              className="text-gold text-2xl sm:text-3xl md:text-4xl font-bold leading-none"
              style={{ fontFamily: "var(--font-display-custom)" }}
            >
              {String(current + 1).padStart(2, "0")}
            </span>
            <span
              className="text-white/25 text-xs sm:text-sm"
              style={{ fontFamily: "var(--font-mono-custom)" }}
            >
              / {String(total).padStart(2, "0")}
            </span>
          </div>

          {/* Progress indicators */}
          <div className="hero-nav-el opacity-0 flex items-center gap-2 sm:gap-2.5">
            {SLIDER_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`relative rounded-full overflow-hidden transition-all duration-500 ${
                  i === current
                    ? "w-12 sm:w-16 md:w-20 h-[3px] bg-white/15"
                    : "w-5 sm:w-6 h-[3px] bg-white/10 hover:bg-white/20"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              >
                {i === current && (
                  <div
                    className="absolute inset-0 bg-gold rounded-full"
                    style={{ width: `${progress * 100}%`, transition: "none" }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Arrow navigation */}
          <div className="hero-nav-el opacity-0 flex items-center gap-2 sm:gap-3">
            <button
              onClick={prev}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/15 bg-black/20 backdrop-blur-sm flex items-center justify-center text-white/50 hover:border-gold/50 hover:text-gold hover:bg-gold/10 transition-all duration-300"
              aria-label="Previous slide"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/15 bg-black/20 backdrop-blur-sm flex items-center justify-center text-white/50 hover:border-gold/50 hover:text-gold hover:bg-gold/10 transition-all duration-300"
              aria-label="Next slide"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ═══ Scroll hint — centered bottom ═══ */}
      <div className="hero-scroll-hint absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center opacity-0">
        <div
          className="w-5 h-8 rounded-full border border-gold/25 flex items-start justify-center pt-1.5"
        >
          <div
            className="w-[2px] h-2 bg-gold/60 rounded-full"
            style={{ animation: "scroll-hint 1.8s ease-in-out infinite" }}
          />
        </div>
      </div>
    </section>
  );
}
