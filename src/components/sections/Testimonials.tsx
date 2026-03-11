"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TESTIMONIALS } from "@/lib/constants";
import { Play, X, Quote, ChevronLeft, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const AUTO_ADVANCE_MS = 6000;

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);
  const startTimeRef = useRef(Date.now());

  const total = TESTIMONIALS.length;
  const story = TESTIMONIALS[active];

  /* ── Auto-advance logic ── */
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    startTimeRef.current = Date.now();
    setProgress(0);

    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % total);
      startTimeRef.current = Date.now();
      setProgress(0);
    }, AUTO_ADVANCE_MS);
  }, [total]);

  useEffect(() => {
    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      setProgress(Math.min(elapsed / AUTO_ADVANCE_MS, 1));
      progressRef.current = requestAnimationFrame(tick);
    };
    progressRef.current = requestAnimationFrame(tick);
    return () => {
      if (progressRef.current) cancelAnimationFrame(progressRef.current);
    };
  }, [active]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  const goTo = useCallback(
    (idx: number) => {
      setActive(idx);
      resetTimer();
    },
    [resetTimer]
  );

  const prev = useCallback(() => goTo((active - 1 + total) % total), [active, total, goTo]);
  const next = useCallback(() => goTo((active + 1) % total), [active, total, goTo]);

  /* ── Video modal ── */
  const openVideo = useCallback((videoId: string) => {
    setActiveVideo(videoId);
    document.body.style.overflow = "hidden";
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const closeVideo = useCallback(() => {
    setActiveVideo(null);
    document.body.style.overflow = "";
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeVideo();
      if (e.key === "ArrowLeft" && !activeVideo) prev();
      if (e.key === "ArrowRight" && !activeVideo) next();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeVideo, prev, next, activeVideo]);

  /* ── GSAP scroll-driven entrance animations ── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".voices-char",
        { opacity: 0, y: 80, rotateX: -90, scale: 0.6 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 0.3,
          stagger: 0.05,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 30%",
            scrub: 0.8,
          },
        }
      );

      gsap.fromTo(
        ".stories-head-el",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            end: "top 55%",
            scrub: 0.6,
          },
        }
      );

      gsap.fromTo(
        ".story-showcase",
        { opacity: 0, y: 80, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".story-showcase",
            start: "top 95%",
            end: "top 60%",
            scrub: 0.6,
          },
        }
      );

      gsap.fromTo(
        ".thumb-strip",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".thumb-strip",
            start: "top 98%",
            end: "top 75%",
            scrub: 0.6,
          },
        }
      );

      gsap.fromTo(
        ".stories-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            end: "top 45%",
            scrub: 0.6,
          },
        }
      );

      gsap.fromTo(
        ".play-ring",
        { scale: 1, opacity: 0.3 },
        {
          scale: 1.6,
          opacity: 0,
          duration: 1.5,
          repeat: -1,
          ease: "power2.out",
        }
      );

      gsap.fromTo(
        ".story-counter",
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            end: "top 55%",
            scrub: 0.6,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const bgChars = "VOICES".split("");

  /* ── Framer Motion crossfade variants ── */
  const imageVariants = {
    initial: { opacity: 0, scale: 1.1, filter: "blur(8px)" },
    animate: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      filter: "blur(4px)",
      transition: { duration: 0.4, ease: "easeIn" as const },
    },
  };

  const textVariants = {
    initial: { opacity: 0, y: 30, filter: "blur(4px)" },
    animate: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const, delay: 0.15 },
    },
    exit: {
      opacity: 0,
      y: -20,
      filter: "blur(4px)",
      transition: { duration: 0.35, ease: "easeIn" as const },
    },
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="relative py-14 md:py-20 overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #0B1C2B 0%, #0D2536 50%, #0B1C2B 100%)",
        }}
      >
        {/* Gold frame lines */}
        <div className="stories-line absolute top-0 left-0 right-0 h-[1px] bg-linear-to-r from-transparent via-gold/25 to-transparent origin-center" />
        <div className="stories-line absolute bottom-0 left-0 right-0 h-[1px] bg-linear-to-r from-transparent via-gold/25 to-transparent origin-center" />

        {/* Ambient gold glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gold/[0.03] blur-[160px] rounded-full pointer-events-none" />

        {/* Giant kinetic "VOICES" background text */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex pointer-events-none select-none"
          style={{ perspective: "600px" }}
        >
          {bgChars.map((char, i) => (
            <span
              key={i}
              className="voices-char inline-block text-[80px] sm:text-[120px] md:text-[160px] lg:text-[220px] font-bold leading-none tracking-tight"
              style={{
                fontFamily: "var(--font-display-custom)",
                transformStyle: "preserve-3d",
                color: "rgba(223, 192, 99, 0.025)",
                textShadow: "0 0 80px rgba(223,192,99,0.015)",
              }}
            >
              {char}
            </span>
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          {/* ── Header ── */}
          <div className="text-center mb-10 md:mb-14">
            <span
              className="stories-head-el text-gold/60 text-xs tracking-[0.3em] uppercase block mb-3"
              style={{ fontFamily: "var(--font-mono-custom)" }}
            >
              Testimonials
            </span>
            <h2
              className="stories-head-el text-2xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4"
              style={{ fontFamily: "var(--font-display-custom)" }}
            >
              Client <span className="text-gold">Stories</span>
            </h2>
            <div className="stories-head-el w-16 h-px bg-gold/40 mx-auto" />
          </div>

          {/* ── Cinematic Story Showcase — Split Layout ── */}
          <div className="story-showcase relative">
            {/* Counter badge — top-left */}
            <div className="story-counter absolute -top-7 left-0 md:left-4 z-20 flex items-baseline gap-1.5">
              <span
                className="text-gold text-2xl md:text-3xl font-bold"
                style={{ fontFamily: "var(--font-display-custom)" }}
              >
                {String(active + 1).padStart(2, "0")}
              </span>
              <span
                className="text-white/20 text-xs"
                style={{ fontFamily: "var(--font-mono-custom)" }}
              >
                / {String(total).padStart(2, "0")}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 rounded-xl overflow-hidden border border-white/[0.06]">
              {/* ── LEFT — Cinematic Image + Play ── */}
              <div className="relative lg:col-span-7 aspect-[16/10] lg:aspect-auto lg:min-h-[380px] overflow-hidden group cursor-pointer"
                onClick={() => openVideo(story.videoId)}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={`img-${active}`}
                    src={story.image}
                    alt={story.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                    variants={imageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  />
                </AnimatePresence>

                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-linear-to-r from-black/20 via-transparent to-black/70 lg:to-black/90" />
                <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/50" />

                {/* Gold tint on hover */}
                <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/[0.06] transition-colors duration-500" />

                {/* Film frame corners */}
                <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-gold/25 group-hover:border-gold/50 transition-colors duration-500" />
                <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-gold/25 group-hover:border-gold/50 transition-colors duration-500 lg:hidden" />
                <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-gold/25 group-hover:border-gold/50 transition-colors duration-500" />

                {/* Centered play button */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                  <div className="play-ring absolute w-16 h-16 md:w-20 md:h-20 rounded-full border border-gold/30" />
                  <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full bg-gold/80 group-hover:bg-gold group-hover:shadow-[0_0_40px_rgba(223,192,99,0.4)] flex items-center justify-center transition-all duration-500 group-hover:scale-110">
                    <Play
                      size={22}
                      className="text-surface-primary ml-0.5"
                      fill="currentColor"
                    />
                  </div>
                </div>

                {/* "Watch Story" label — bottom */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                  <span
                    className="text-white/60 text-[9px] tracking-[0.3em] uppercase"
                    style={{ fontFamily: "var(--font-mono-custom)" }}
                  >
                    Watch Their Story
                  </span>
                </div>
              </div>

              {/* ── RIGHT — Quote + Client Info ── */}
              <div className="lg:col-span-5 relative flex flex-col justify-center px-5 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10 bg-[#0A1620]">
                {/* Subtle vertical gold accent line on left edge */}
                <div className="absolute top-6 left-0 bottom-6 w-[1px] bg-linear-to-b from-transparent via-gold/20 to-transparent hidden lg:block" />

                {/* Decorative quote glyph */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`quote-decor-${active}`}
                    initial={{ opacity: 0, rotate: -10, scale: 0.7 }}
                    animate={{
                      opacity: 1,
                      rotate: 0,
                      scale: 1,
                      transition: { duration: 0.5, ease: "easeOut", delay: 0.1 },
                    }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                    className="mb-4"
                  >
                    <Quote
                      size={28}
                      className="text-gold/30 rotate-180"
                      strokeWidth={1}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Quote text */}
                <AnimatePresence mode="wait">
                  <motion.blockquote
                    key={`quote-${active}`}
                    variants={textVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="text-white/80 text-sm md:text-base lg:text-lg leading-relaxed mb-6 italic"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    &ldquo;{story.quote}&rdquo;
                  </motion.blockquote>
                </AnimatePresence>

                {/* Gold separator */}
                <div className="w-12 h-[1px] bg-linear-to-r from-gold/50 to-transparent mb-5" />

                {/* Client info */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`info-${active}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, ease: "easeOut", delay: 0.25 },
                    }}
                    exit={{ opacity: 0, y: -10, transition: { duration: 0.25 } }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-9 h-9 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0">
                      <span
                        className="text-gold text-[10px] font-bold"
                        style={{ fontFamily: "var(--font-mono-custom)" }}
                      >
                        {story.name
                          .split(" ")
                          .slice(0, 2)
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm md:text-base">
                        {story.name}
                      </p>
                      <p
                        className="text-gold/60 text-[10px] tracking-[0.15em] uppercase mt-0.5"
                        style={{ fontFamily: "var(--font-mono-custom)" }}
                      >
                        {story.project}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation arrows */}
                <div className="flex items-center gap-2 mt-6">
                  <button
                    onClick={prev}
                    className="w-8 h-8 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-white/40 hover:border-gold/40 hover:text-gold hover:bg-gold/[0.08] transition-all duration-300"
                    aria-label="Previous story"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    onClick={next}
                    className="w-8 h-8 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-white/40 hover:border-gold/40 hover:text-gold hover:bg-gold/[0.08] transition-all duration-300"
                    aria-label="Next story"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Thumbnail Navigation Strip ── */}
          <div className="thumb-strip mt-5 md:mt-6">
            <div className="flex gap-2.5 md:gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {TESTIMONIALS.map((t, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={t.name}
                    onClick={() => goTo(i)}
                    className={`group relative shrink-0 rounded-lg overflow-hidden transition-all duration-500 ${
                      isActive
                        ? "w-[140px] md:w-[170px] ring-1 ring-gold/50 shadow-[0_0_20px_rgba(223,192,99,0.1)]"
                        : "w-[90px] md:w-[110px] ring-1 ring-white/[0.06] hover:ring-gold/30 opacity-50 hover:opacity-80"
                    }`}
                    aria-label={`Go to ${t.name}'s story`}
                  >
                    <div className="aspect-[16/10] relative">
                      <img
                        src={t.image}
                        alt={t.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />

                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10">
                          <div
                            className="h-full bg-gold transition-none"
                            style={{ width: `${progress * 100}%` }}
                          />
                        </div>
                      )}

                      <div className="absolute bottom-0 left-0 right-0 p-1 md:p-1.5">
                        <p
                          className={`text-[7px] md:text-[8px] tracking-wider uppercase truncate ${
                            isActive ? "text-gold" : "text-white/50"
                          }`}
                          style={{ fontFamily: "var(--font-mono-custom)" }}
                        >
                          {t.name.split(" ").slice(1, 3).join(" ")}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Cinematic YouTube Modal ── */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          onClick={closeVideo}
        >
          <div
            className="absolute inset-0 bg-black/95 backdrop-blur-md"
            style={{ animation: "fade-in 0.3s ease-out forwards" }}
          />

          <button
            onClick={closeVideo}
            className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:border-gold/40 hover:bg-gold/10 transition-all duration-300"
            aria-label="Close video"
          >
            <X size={20} />
          </button>

          <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-gold/20 pointer-events-none" />
          <div className="absolute top-8 right-8 w-16 h-16 border-t border-r border-gold/20 pointer-events-none" />
          <div className="absolute bottom-8 left-8 w-16 h-16 border-b border-l border-gold/20 pointer-events-none" />
          <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-gold/20 pointer-events-none" />

          <div
            className="relative z-10 w-[90vw] max-w-5xl aspect-video rounded-xl overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(223,192,99,0.1)]"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation:
                "scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-gold/50 to-transparent z-10" />

            <iframe
              src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Client Story Video"
            />
          </div>
        </div>
      )}
    </>
  );
}
