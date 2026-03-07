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

  // Progress bar animation frame loop
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
      // 1. Giant kinetic "VOICES" text — per-character 3D flip
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

      // 2. Header elements cascade
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

      // 3. Showcase panel slides up with 3D tilt
      gsap.fromTo(
        ".story-showcase",
        { opacity: 0, y: 100, rotateX: -8, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".story-showcase",
            start: "top 95%",
            end: "top 55%",
            scrub: 0.6,
          },
        }
      );

      // 4. Thumbnail strip slides in from bottom
      gsap.fromTo(
        ".thumb-strip",
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".thumb-strip",
            start: "top 98%",
            end: "top 70%",
            scrub: 0.6,
          },
        }
      );

      // 5. Film sprocket decorations
      gsap.fromTo(
        ".film-sprocket",
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            end: "top 50%",
            scrub: 0.5,
          },
        }
      );

      // 6. Gold frame lines
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

      // 7. Play button pulse ring
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

      // 8. Counter number entrance
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
        className="relative py-24 md:py-36 overflow-hidden"
        style={{
          perspective: "1200px",
          background:
            "linear-gradient(180deg, #060606 0%, #0A0A08 50%, #070707 100%)",
        }}
      >
        {/* Film sprocket decoration — left */}
        <div className="film-sprocket absolute left-0 top-0 bottom-0 w-8 pointer-events-none hidden lg:flex flex-col items-center justify-center gap-4 opacity-0">
          {[...Array(18)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-sm border border-gold/15 bg-gold/[0.03]"
            />
          ))}
        </div>

        {/* Film sprocket decoration — right */}
        <div className="film-sprocket absolute right-0 top-0 bottom-0 w-8 pointer-events-none hidden lg:flex flex-col items-center justify-center gap-4 opacity-0">
          {[...Array(18)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-sm border border-gold/15 bg-gold/[0.03]"
            />
          ))}
        </div>

        {/* Gold frame lines */}
        <div className="stories-line absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/25 to-transparent origin-center" />
        <div className="stories-line absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/25 to-transparent origin-center" />

        {/* Ambient gold glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gold/[0.03] blur-[200px] rounded-full pointer-events-none" />

        {/* Giant kinetic "VOICES" background text */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex pointer-events-none select-none"
          style={{ perspective: "600px" }}
        >
          {bgChars.map((char, i) => (
            <span
              key={i}
              className="voices-char inline-block text-[100px] sm:text-[160px] md:text-[220px] lg:text-[300px] font-bold leading-none tracking-tight"
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
          <div className="text-center mb-14 md:mb-20">
            <span
              className="stories-head-el text-gold/60 text-xs tracking-[0.3em] uppercase block mb-4"
              style={{ fontFamily: "var(--font-mono-custom)" }}
            >
              Testimonials
            </span>
            <h2
              className="stories-head-el text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6"
              style={{ fontFamily: "var(--font-display-custom)" }}
            >
              Client <span className="text-gold">Stories</span>
            </h2>
            <div className="stories-head-el w-20 h-px bg-gold/40 mx-auto" />
          </div>

          {/* ── Cinematic Story Showcase — Split Layout ── */}
          <div
            className="story-showcase relative"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Counter badge — top-left */}
            <div className="story-counter absolute -top-8 left-0 md:left-4 z-20 flex items-baseline gap-1.5">
              <span
                className="text-gold text-3xl md:text-4xl font-bold"
                style={{ fontFamily: "var(--font-display-custom)" }}
              >
                {String(active + 1).padStart(2, "0")}
              </span>
              <span
                className="text-white/20 text-sm"
                style={{ fontFamily: "var(--font-mono-custom)" }}
              >
                / {String(total).padStart(2, "0")}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 rounded-2xl overflow-hidden border border-white/[0.06]">
              {/* ── LEFT — Cinematic Image + Play ── */}
              <div className="relative lg:col-span-7 aspect-[16/10] lg:aspect-auto lg:min-h-[480px] overflow-hidden group cursor-pointer"
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
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/70 lg:to-black/90" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                {/* Gold tint on hover */}
                <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/[0.06] transition-colors duration-500" />

                {/* Film frame corners */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-gold/25 group-hover:border-gold/50 transition-colors duration-500" />
                <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-gold/25 group-hover:border-gold/50 transition-colors duration-500 lg:hidden" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-gold/25 group-hover:border-gold/50 transition-colors duration-500" />

                {/* Centered play button */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                  <div className="play-ring absolute w-20 h-20 md:w-24 md:h-24 rounded-full border border-gold/30" />
                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-gold/80 group-hover:bg-gold group-hover:shadow-[0_0_50px_rgba(223,192,99,0.5)] flex items-center justify-center transition-all duration-500 group-hover:scale-110">
                    <Play
                      size={26}
                      className="text-surface-primary ml-1"
                      fill="currentColor"
                    />
                  </div>
                </div>

                {/* "Watch Story" label — bottom */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                  <span
                    className="text-white/60 text-[10px] tracking-[0.3em] uppercase"
                    style={{ fontFamily: "var(--font-mono-custom)" }}
                  >
                    Watch Their Story
                  </span>
                </div>
              </div>

              {/* ── RIGHT — Quote + Client Info ── */}
              <div className="lg:col-span-5 relative flex flex-col justify-center px-6 py-8 md:px-10 md:py-12 lg:px-12 lg:py-16 bg-[#0A0A0A]">
                {/* Subtle vertical gold accent line on left edge */}
                <div className="absolute top-8 left-0 bottom-8 w-[1px] bg-gradient-to-b from-transparent via-gold/20 to-transparent hidden lg:block" />

                {/* Decorative quote glyph — animated per slide */}
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
                    className="mb-6"
                  >
                    <Quote
                      size={36}
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
                    className="text-white/80 text-base md:text-lg lg:text-xl leading-relaxed mb-8 italic"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    &ldquo;{story.quote}&rdquo;
                  </motion.blockquote>
                </AnimatePresence>

                {/* Gold separator */}
                <div className="w-16 h-[1px] bg-gradient-to-r from-gold/50 to-transparent mb-6" />

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
                    className="flex items-center gap-4"
                  >
                    {/* Gold initial badge */}
                    <div className="w-11 h-11 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0">
                      <span
                        className="text-gold text-xs font-bold"
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
                      <p className="text-white font-semibold text-base md:text-lg">
                        {story.name}
                      </p>
                      <p
                        className="text-gold/60 text-[11px] tracking-[0.15em] uppercase mt-0.5"
                        style={{ fontFamily: "var(--font-mono-custom)" }}
                      >
                        {story.project}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation arrows — bottom-right of text panel */}
                <div className="flex items-center gap-2 mt-8 md:mt-10">
                  <button
                    onClick={prev}
                    className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-white/40 hover:border-gold/40 hover:text-gold hover:bg-gold/[0.08] transition-all duration-300"
                    aria-label="Previous story"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={next}
                    className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-white/40 hover:border-gold/40 hover:text-gold hover:bg-gold/[0.08] transition-all duration-300"
                    aria-label="Next story"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Thumbnail Navigation Strip ── */}
          <div className="thumb-strip mt-6 md:mt-8">
            <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {TESTIMONIALS.map((t, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={t.name}
                    onClick={() => goTo(i)}
                    className={`group relative shrink-0 rounded-lg overflow-hidden transition-all duration-500 ${
                      isActive
                        ? "w-[160px] md:w-[200px] ring-1 ring-gold/50 shadow-[0_0_20px_rgba(223,192,99,0.1)]"
                        : "w-[100px] md:w-[130px] ring-1 ring-white/[0.06] hover:ring-gold/30 opacity-50 hover:opacity-80"
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

                      {/* Active indicator — gold progress bar at bottom */}
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10">
                          <div
                            className="h-full bg-gold transition-none"
                            style={{ width: `${progress * 100}%` }}
                          />
                        </div>
                      )}

                      {/* Thumbnail name label */}
                      <div className="absolute bottom-0 left-0 right-0 p-1.5 md:p-2">
                        <p
                          className={`text-[8px] md:text-[9px] tracking-wider uppercase truncate ${
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
          {/* Dark curtain backdrop */}
          <div
            className="absolute inset-0 bg-black/95 backdrop-blur-md"
            style={{ animation: "fade-in 0.3s ease-out forwards" }}
          />

          {/* Close button */}
          <button
            onClick={closeVideo}
            className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:border-gold/40 hover:bg-gold/10 transition-all duration-300"
            aria-label="Close video"
          >
            <X size={20} />
          </button>

          {/* Decorative gold corner frames */}
          <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-gold/20 pointer-events-none" />
          <div className="absolute top-8 right-8 w-16 h-16 border-t border-r border-gold/20 pointer-events-none" />
          <div className="absolute bottom-8 left-8 w-16 h-16 border-b border-l border-gold/20 pointer-events-none" />
          <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-gold/20 pointer-events-none" />

          {/* Video container */}
          <div
            className="relative z-10 w-[90vw] max-w-5xl aspect-video rounded-xl overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(223,192,99,0.1)]"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation:
                "scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
            }}
          >
            {/* Gold top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/50 to-transparent z-10" />

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
