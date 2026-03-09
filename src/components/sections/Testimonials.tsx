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

  /* ── Auto-advance ── */
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
    (idx: number) => { setActive(idx); resetTimer(); },
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

  /* ── GSAP scroll entrance ── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".stories-head-el",
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 85%", end: "top 55%", scrub: 0.6 },
        }
      );
      gsap.fromTo(
        ".story-showcase",
        { opacity: 0, y: 80, scale: 0.97 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: ".story-showcase", start: "top 95%", end: "top 60%", scrub: 0.6 },
        }
      );
      gsap.fromTo(
        ".stories-line",
        { scaleX: 0 },
        {
          scaleX: 1, duration: 0.8, ease: "power2.inOut",
          scrollTrigger: { trigger: section, start: "top 70%", end: "top 45%", scrub: 0.6 },
        }
      );
      gsap.fromTo(
        ".play-ring",
        { scale: 1, opacity: 0.3 },
        { scale: 1.6, opacity: 0, duration: 1.5, repeat: -1, ease: "power2.out" }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  /* ── Framer Motion variants ── */
  const imageVariants = {
    initial: { opacity: 0, scale: 1.08, filter: "blur(8px)" },
    animate: {
      opacity: 1, scale: 1, filter: "blur(0px)",
      transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
    exit: {
      opacity: 0, scale: 0.96, filter: "blur(4px)",
      transition: { duration: 0.4, ease: "easeIn" as const },
    },
  };

  const textVariants = {
    initial: { opacity: 0, y: 30, filter: "blur(4px)" },
    animate: {
      opacity: 1, y: 0, filter: "blur(0px)",
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const, delay: 0.15 },
    },
    exit: {
      opacity: 0, y: -20, filter: "blur(4px)",
      transition: { duration: 0.35, ease: "easeIn" as const },
    },
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="relative py-24 md:py-36 overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #060606 0%, #0A0A08 50%, #070707 100%)",
        }}
      >
        {/* Gold frame lines */}
        <div className="stories-line absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/25 to-transparent origin-center" />
        <div className="stories-line absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/25 to-transparent origin-center" />

        {/* Ambient gold glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gold/[0.03] blur-[200px] rounded-full pointer-events-none" />

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

          {/* ═══ Side-by-side: Image LEFT (behind), Content RIGHT (on top, overlapping) ═══
              The image is larger and acts as the background layer.
              The content card overlaps the image's right edge and is vertically centered.
          */}
          <div className="story-showcase relative">
            {/* Mobile: stacked. Desktop: side-by-side with overlap */}
            <div className="relative flex flex-col lg:flex-row lg:items-center">

              {/* ── LEFT — Testimonial Image (behind, larger) ── */}
              <div
                className="relative lg:w-[58%] xl:w-[55%] shrink-0 cursor-pointer group"
                onClick={() => openVideo(story.videoId)}
              >
                <div className="relative aspect-[4/3] rounded-2xl lg:rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/60">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40 hidden lg:block" />
                  <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/[0.05] transition-colors duration-500" />

                  {/* Film frame corners */}
                  <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-gold/25 group-hover:border-gold/50 transition-colors duration-500" />
                  <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-gold/25 group-hover:border-gold/50 transition-colors duration-500" />
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-gold/25 group-hover:border-gold/50 transition-colors duration-500" />
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-gold/25 group-hover:border-gold/50 transition-colors duration-500" />

                  {/* Play button */}
                  <div className="absolute top-1/2 left-[40%] lg:left-[45%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                    <div className="play-ring absolute w-20 h-20 md:w-24 md:h-24 rounded-full border border-gold/30" />
                    <div className="relative w-14 h-14 md:w-18 md:h-18 rounded-full bg-gold/80 group-hover:bg-gold group-hover:shadow-[0_0_50px_rgba(223,192,99,0.5)] flex items-center justify-center transition-all duration-500 group-hover:scale-110">
                      <Play size={22} className="text-surface-primary ml-0.5" fill="currentColor" />
                    </div>
                  </div>

                  {/* Watch Story label */}
                  <div className="absolute top-1/2 left-[40%] lg:left-[45%] -translate-x-1/2 translate-y-8 md:translate-y-10 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <span
                      className="text-white/60 text-[10px] tracking-[0.3em] uppercase"
                      style={{ fontFamily: "var(--font-mono-custom)" }}
                    >
                      Watch Story
                    </span>
                  </div>
                </div>
              </div>

              {/* ── RIGHT — Content Card (on top, overlapping image, vertically centered) ── */}
              <div className="relative z-20 lg:w-[50%] xl:w-[50%] -mt-8 lg:mt-0 lg:-ml-[8%]">
                <div className="relative bg-[#0B0B0B]/95 backdrop-blur-md border border-white/[0.08] rounded-2xl lg:rounded-3xl px-6 py-7 sm:px-8 sm:py-8 md:px-10 md:py-10 lg:px-10 lg:py-10 xl:px-12 xl:py-12 shadow-2xl shadow-black/60">
                  {/* Top gold accent line */}
                  <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

                  {/* Subtle left border glow */}
                  <div className="absolute top-6 left-0 bottom-6 w-[1px] bg-gradient-to-b from-transparent via-gold/20 to-transparent hidden lg:block" />

                  {/* Counter + Quote icon row */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className="text-gold text-xl sm:text-2xl md:text-3xl font-bold"
                        style={{ fontFamily: "var(--font-display-custom)" }}
                      >
                        {String(active + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="text-white/20 text-xs sm:text-sm"
                        style={{ fontFamily: "var(--font-mono-custom)" }}
                      >
                        / {String(total).padStart(2, "0")}
                      </span>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`q-${active}`}
                        initial={{ opacity: 0, rotate: -10, scale: 0.7 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut", delay: 0.1 } }}
                        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                      >
                        <Quote size={28} className="text-gold/25 rotate-180" strokeWidth={1} />
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Quote */}
                  <AnimatePresence mode="wait">
                    <motion.blockquote
                      key={`quote-${active}`}
                      variants={textVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="text-white/80 text-sm sm:text-base md:text-lg leading-relaxed mb-6 italic"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      &ldquo;{story.quote}&rdquo;
                    </motion.blockquote>
                  </AnimatePresence>

                  {/* Gold separator */}
                  <div className="w-12 sm:w-16 h-[1px] bg-gradient-to-r from-gold/50 to-transparent mb-5" />

                  {/* Client info */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`info-${active}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut", delay: 0.25 } }}
                      exit={{ opacity: 0, y: -10, transition: { duration: 0.25 } }}
                      className="flex items-center gap-3 sm:gap-4"
                    >
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0">
                        <span
                          className="text-gold text-[10px] sm:text-xs font-bold"
                          style={{ fontFamily: "var(--font-mono-custom)" }}
                        >
                          {story.name.split(" ").slice(0, 2).map((n) => n[0]).join("")}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm sm:text-base md:text-lg">{story.name}</p>
                        <p
                          className="text-gold/60 text-[10px] sm:text-[11px] tracking-[0.15em] uppercase mt-0.5"
                          style={{ fontFamily: "var(--font-mono-custom)" }}
                        >
                          {story.project}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* ── Navigation ── */}
                  <div className="flex items-center justify-between mt-7 sm:mt-8 pt-5 border-t border-white/[0.05]">
                    {/* Progress dots */}
                    <div className="flex items-center gap-1.5">
                      {TESTIMONIALS.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => goTo(i)}
                          className={`relative h-[3px] rounded-full overflow-hidden transition-all duration-500 ${
                            i === active ? "w-7 sm:w-8 bg-white/15" : "w-2.5 sm:w-3 bg-white/10 hover:bg-white/20"
                          }`}
                          aria-label={`Go to story ${i + 1}`}
                        >
                          {i === active && (
                            <div
                              className="absolute inset-0 bg-gold rounded-full"
                              style={{ width: `${progress * 100}%`, transition: "none" }}
                            />
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Arrows */}
                    <div className="flex items-center gap-2 sm:gap-3">
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
            style={{ animation: "scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }}
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
