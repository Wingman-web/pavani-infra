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

  /* ── GSAP entrance animations ── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".testi-header > *",
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
        ".testi-showcase",
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".testi-showcase",
            start: "top 95%",
            end: "top 60%",
            scrub: 0.6,
          },
        }
      );

      gsap.fromTo(
        ".testi-line",
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
    }, section);

    return () => ctx.revert();
  }, []);

  /* ── Framer Motion variants ── */
  const imageVariants = {
    initial: { opacity: 0, scale: 1.08, filter: "blur(6px)" },
    animate: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
    exit: {
      opacity: 0,
      scale: 0.96,
      filter: "blur(4px)",
      transition: { duration: 0.4, ease: "easeIn" as const },
    },
  };

  const textVariants = {
    initial: { opacity: 0, y: 25, filter: "blur(3px)" },
    animate: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const, delay: 0.15 },
    },
    exit: {
      opacity: 0,
      y: -15,
      filter: "blur(3px)",
      transition: { duration: 0.3, ease: "easeIn" as const },
    },
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="relative py-16 md:py-24 overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #7a1519 0%, #981b21 50%, #7a1519 100%)",
        }}
      >
        {/* Gold frame lines */}
        <div className="testi-line absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent origin-center" />
        <div className="testi-line absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent origin-center" />

        {/* Ambient gold glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gold/[0.03] blur-[160px] rounded-full pointer-events-none" />

        {/* Gold wave decorations */}
        <img
          src="/images/Gold Waves.svg"
          alt=""
          className="absolute -top-14 -left-10 w-[650px] md:w-[880px] opacity-[0.50] pointer-events-none select-none -rotate-[5deg]"
          aria-hidden="true"
        />
        <img
          src="/images/Gold Waves.svg"
          alt=""
          className="absolute -bottom-10 -right-8 w-[450px] md:w-[620px] opacity-[0.50] pointer-events-none select-none rotate-[175deg] scale-y-[-1]"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          {/* ── Header ── */}
          <div className="testi-header text-center mb-10 md:mb-14">
            <span
              className="text-gold/70 text-sm tracking-[0.3em] uppercase block mb-4"
              style={{ fontFamily: "var(--font-mono-custom)" }}
            >
              Testimonials
            </span>
            <h2
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6"
              style={{ fontFamily: "var(--font-display-custom)" }}
            >
              Client <span className="text-gold">Stories</span>
            </h2>
            <div className="w-20 h-px bg-gold/40 mx-auto" />
          </div>

          {/* ── Side-by-side Showcase ── */}
          <div className="testi-showcase">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-0">
              {/* LEFT — Image with play button */}
              <div
                className="relative w-full lg:w-[55%] aspect-[16/10] lg:aspect-[16/10] rounded-xl overflow-hidden group cursor-pointer shrink-0"
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#7a1519]/50 via-transparent to-[#7a1519]/20" />
                <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/[0.06] transition-colors duration-500" />

                {/* Film frame corners */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-gold/25 group-hover:border-gold/50 transition-colors duration-500" />
                <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-gold/25 group-hover:border-gold/50 transition-colors duration-500" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-gold/25 group-hover:border-gold/50 transition-colors duration-500" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-gold/25 group-hover:border-gold/50 transition-colors duration-500" />

                {/* Centered play button */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                  <div className="absolute w-20 h-20 md:w-24 md:h-24 rounded-full border border-gold/30 animate-ping opacity-20" />
                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-gold/80 group-hover:bg-gold group-hover:shadow-[0_0_50px_rgba(211, 185, 115,0.5)] flex items-center justify-center transition-all duration-500 group-hover:scale-110">
                    <Play
                      size={26}
                      className="text-[#FAFAFA] ml-1"
                      fill="currentColor"
                    />
                  </div>
                </div>

                {/* Watch Story label */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                  <span
                    className="text-white/60 text-xs tracking-[0.3em] uppercase"
                    style={{ fontFamily: "var(--font-mono-custom)" }}
                  >
                    Watch Their Story
                  </span>
                </div>
              </div>

              {/* RIGHT — Testimonial content card, overlapping the image */}
              <div className="relative w-full lg:w-[55%] lg:-ml-[6%] z-10">
                <div className="relative bg-[#FAFAFA] backdrop-blur-md border border-[#0e1a26]/8 rounded-xl px-6 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10 shadow-2xl shadow-black/15">
                  {/* Red-to-gold accent on left edge */}
                  <div className="absolute top-6 left-0 bottom-6 w-[2px] bg-gradient-to-b from-red/50 via-gold/40 to-red/30 rounded-full" />

                  {/* Counter badge — top-right */}
                  <div className="absolute -top-4 right-6 md:right-10 flex items-baseline gap-1.5 bg-[#981b21] px-3 py-1 border border-red-dark/30 rounded-full">
                    <span
                      className="text-gold text-lg font-bold"
                      style={{ fontFamily: "var(--font-display-custom)" }}
                    >
                      {String(active + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="text-white/50 text-xs"
                      style={{ fontFamily: "var(--font-mono-custom)" }}
                    >
                      / {String(total).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Quote icon */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`quote-icon-${active}`}
                      initial={{ opacity: 0, rotate: -10, scale: 0.7 }}
                      animate={{
                        opacity: 1,
                        rotate: 0,
                        scale: 1,
                        transition: { duration: 0.5, ease: "easeOut", delay: 0.1 },
                      }}
                      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                      className="mb-5"
                    >
                      <Quote
                        size={32}
                        className="text-red/25 rotate-180"
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
                      className="text-[#0e1a26]/80 text-base md:text-lg lg:text-xl leading-relaxed mb-7 italic"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      &ldquo;{story.quote}&rdquo;
                    </motion.blockquote>
                  </AnimatePresence>

                  {/* Gold separator */}
                  <div className="w-14 h-[1px] bg-gradient-to-r from-gold to-gold/20 mb-5" />

                  {/* Client info */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`info-${active}`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.5, ease: "easeOut", delay: 0.25 },
                      }}
                      exit={{ opacity: 0, y: -10, transition: { duration: 0.25 } }}
                      className="flex items-center gap-4"
                    >
                      <div className="w-10 h-10 rounded-full bg-red/10 border border-red/20 flex items-center justify-center shrink-0">
                        <span
                          className="text-red text-xs font-bold"
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
                        <p className="text-[#0e1a26] font-semibold text-base md:text-lg">
                          {story.name}
                        </p>
                        <p
                          className="text-gold-contrast text-[11px] tracking-[0.15em] uppercase mt-0.5"
                          style={{ fontFamily: "var(--font-mono-custom)" }}
                        >
                          {story.project}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation arrows */}
                  <div className="flex items-center gap-2 mt-7">
                    <button
                      onClick={prev}
                      className="w-9 h-9 rounded-full border border-[#0e1a26]/10 bg-[#0e1a26]/[0.03] flex items-center justify-center text-[#0e1a26]/40 hover:border-red/30 hover:text-red hover:bg-red/[0.06] transition-all duration-300"
                      aria-label="Previous story"
                    >
                      <ChevronLeft size={15} />
                    </button>
                    <button
                      onClick={next}
                      className="w-9 h-9 rounded-full border border-[#0e1a26]/10 bg-[#0e1a26]/[0.03] flex items-center justify-center text-[#0e1a26]/40 hover:border-red/30 hover:text-red hover:bg-red/[0.06] transition-all duration-300"
                      aria-label="Next story"
                    >
                      <ChevronRight size={15} />
                    </button>

                    {/* Progress dots */}
                    <div className="flex items-center gap-1.5 ml-3">
                      {TESTIMONIALS.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => goTo(i)}
                          className={`relative transition-all duration-500 rounded-full overflow-hidden ${
                            i === active ? "w-8 h-2" : "w-2 h-2"
                          }`}
                          aria-label={`Go to story ${i + 1}`}
                        >
                          <div
                            className={`absolute inset-0 rounded-full ${
                              i === active
                                ? "bg-red/15 border border-red/30"
                                : "bg-[#0e1a26]/10 hover:bg-[#0e1a26]/20"
                            }`}
                          />
                          {i === active && (
                            <div
                              className="absolute inset-0 rounded-full bg-red/60"
                              style={{ width: `${progress * 100}%` }}
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
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
            className="relative z-10 w-[90vw] max-w-5xl aspect-video rounded-xl overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(211, 185, 115,0.1)]"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation:
                "scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
            }}
          >
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
