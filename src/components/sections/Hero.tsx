"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_URL =
  "https://backend.pavaniinfra.com/uploads/1920_by_1080_8e415f658b.mp4";

const CARDS = [
  {
    src: "https://pavaniinfra.com/_next/image?url=https%3A%2F%2Fbackend.pavaniinfra.com%2Fuploads%2FWeb_Banner_Home_Page_c6c53d52eb.webp&w=1920&q=75",
    alt: "Luxury residence",
    cls: "left-[1%] lg:left-[2%] top-[3%] lg:top-[4%] w-52 sm:w-72 lg:w-96 h-32 sm:h-44 lg:h-56",
    from: { x: -400, y: 60, rotateY: 85, rotateX: 0 },
    settle: { rotateY: -8, rotateX: 3 },
    drift: -30,
  },
  {
    src: "https://pavaniinfra.com/_next/image?url=https%3A%2F%2Fbackend.pavaniinfra.com%2Fuploads%2F12_dc3232c7c2.png&w=3840&q=75",
    alt: "Modern interior",
    cls: "right-[0%] lg:right-[1%] top-[2%] lg:top-[3%] w-56 sm:w-80 lg:w-[28rem] h-36 sm:h-48 lg:h-64",
    from: { x: 400, y: -50, rotateY: -85, rotateX: 0 },
    settle: { rotateY: 6, rotateX: -2 },
    drift: -42,
  },
  {
    src: "https://pavaniinfra.com/_next/image?url=https%3A%2F%2Fbackend.pavaniinfra.com%2Fuploads%2F4_8bb5abfb88.png&w=3840&q=75",
    alt: "Premium building",
    cls: "left-[1%] lg:left-[2%] bottom-[3%] lg:bottom-[3%] w-56 sm:w-80 lg:w-[28rem] h-36 sm:h-48 lg:h-64",
    from: { x: -350, y: -80, rotateY: 75, rotateX: 10 },
    settle: { rotateY: 7, rotateX: -3 },
    drift: -22,
  },
  {
    src: "https://pavaniinfra.com/_next/image?url=https%3A%2F%2Fbackend.pavaniinfra.com%2Fuploads%2F5_bc8a2d829c.png&w=3840&q=75",
    alt: "Luxury villa",
    cls: "right-[1%] lg:right-[3%] bottom-[2%] lg:bottom-[4%] w-52 sm:w-72 lg:w-[22rem] h-32 sm:h-44 lg:h-52",
    from: { x: 380, y: 70, rotateY: -80, rotateX: -5 },
    settle: { rotateY: -5, rotateX: 2 },
    drift: -34,
  },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    const pinned = pinnedRef.current;
    if (!section || !pinned) return;

    let ctx: gsap.Context | undefined;
    let fallbackTimer: ReturnType<typeof setTimeout>;

    const runAnimation = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;

      ctx = gsap.context(() => {
        /* ── Initial states for proper scrub reversal ── */
        gsap.set(".hero-gold-wipe", {
          xPercent: -50,
          yPercent: -50,
          scale: 0,
          opacity: 0,
        });
        gsap.set(".hero-video-section", { opacity: 1 });
        gsap.set(".hero-golden-flash", { opacity: 0 });
        gsap.set(".hero-char", { color: "transparent" });
        gsap.set(".hero-accent-line", { scaleX: 0 });
        gsap.set(".hero-label", { opacity: 0, y: 20 });
        gsap.set(".hero-cta", { opacity: 0, y: 15 });
        gsap.set(".hero-card-gold", { opacity: 1 });
        gsap.set(".hero-black-fade", { opacity: 0 });

        gsap.utils.toArray<HTMLElement>(".hero-card").forEach((card, i) => {
          const c = CARDS[i];
          if (!c) return;
          gsap.set(card, {
            opacity: 0,
            transformPerspective: 800,
            x: c.from.x,
            y: c.from.y,
            rotateY: c.from.rotateY,
            rotateX: c.from.rotateX,
            scale: 0.5,
          });
        });

        /* ── Entry after preloader ── */
        const entry = gsap.timeline();
        entry
          .fromTo(
            ".hero-video-frame",
            { scale: 0.85, opacity: 0, rotateX: 6 },
            {
              scale: 1,
              opacity: 1,
              rotateX: 0,
              duration: 1.6,
              ease: "power3.out",
            },
          )
          .fromTo(
            ".hero-frame-glow",
            { opacity: 0 },
            { opacity: 1, duration: 1, ease: "power2.out" },
            "-=0.8",
          )
          .fromTo(
            ".hero-frame-ornament",
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              stagger: 0.08,
              duration: 0.5,
              ease: "back.out(1.7)",
            },
            "-=0.5",
          )
          .fromTo(
            ".hero-scroll-indicator",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
            "-=0.3",
          );

        /* ── Scroll-driven master timeline ── */
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2,
            pin: pinned,
            pinSpacing: false,
          },
        });

        /* Phase 1 — Scroll indicator (0→10%) */
        tl.to(".hero-scroll-text", { opacity: 0, y: -10, duration: 0.03 }, 0);
        tl.to(
          ".hero-chevron",
          { scale: 3, y: 60, duration: 0.05, ease: "power1.in" },
          0,
        );
        tl.to(
          ".hero-pulse-ring",
          { scale: 15, opacity: 0, duration: 0.08, ease: "power2.in" },
          0.01,
        );
        tl.to(
          ".hero-chevron",
          { scale: 10, y: 250, opacity: 0, duration: 0.05, ease: "power2.in" },
          0.05,
        );
        tl.to(".hero-scroll-indicator", { opacity: 0, duration: 0.02 }, 0.08);

        /* Phase 2 — Gold wipe (8→35%) */
        tl.to(
          ".hero-gold-wipe",
          { scale: 1, opacity: 1, duration: 0.18, ease: "power2.inOut" },
          0.08,
        );
        tl.to(
          ".hero-video-section",
          { opacity: 0, duration: 0.12, ease: "power1.in" },
          0.14,
        );

        /* Phase 3 — Gold dissolves (28→48%) */
        tl.to(".hero-golden-flash", { opacity: 0.2, duration: 0.03 }, 0.28);
        tl.to(".hero-golden-flash", { opacity: 0, duration: 0.08 }, 0.31);
        tl.to(
          ".hero-gold-wipe",
          { opacity: 0, duration: 0.16, ease: "power2.out" },
          0.3,
        );

        /* Phase 4 — 3D Image Cards flip in + Text outline-to-fill (36→62%) */

        // Cards flip in from scattered 3D positions (gold-coated initially)
        gsap.utils.toArray<HTMLElement>(".hero-card").forEach((card, i) => {
          const c = CARDS[i];
          if (!c) return;
          tl.to(
            card,
            {
              opacity: 1,
              x: 0,
              y: 0,
              rotateY: c.settle.rotateY,
              rotateX: c.settle.rotateX,
              scale: 1,
              duration: 0.14,
              ease: "back.out(1.2)",
            },
            0.36 + i * 0.028,
          );
        });

        // Gold coating on cards dissolves → reveals images underneath
        tl.to(
          ".hero-card-gold",
          {
            opacity: 0,
            stagger: 0.028,
            duration: 0.1,
            ease: "power2.out",
          },
          0.44,
        );

        // Label
        tl.to(
          ".hero-label",
          { opacity: 1, y: 0, duration: 0.05, ease: "power3.out" },
          0.42,
        );

        // Characters fill in: outline → solid (white line)
        tl.to(
          ".hero-char-w",
          {
            color: "#ffffff",
            stagger: 0.008,
            duration: 0.12,
            ease: "power2.out",
          },
          0.44,
        );

        // Characters fill in: outline → solid (gold line)
        tl.to(
          ".hero-char-g",
          {
            color: "#DFC063",
            stagger: 0.008,
            duration: 0.1,
            ease: "power2.out",
          },
          0.52,
        );

        // Gold accent line
        tl.to(
          ".hero-accent-line",
          { scaleX: 1, duration: 0.06, ease: "power2.inOut" },
          0.57,
        );

        // CTA
        tl.to(
          ".hero-cta",
          { opacity: 1, y: 0, duration: 0.05, ease: "power3.out" },
          0.6,
        );

        /* Phase 5 — Parallax drift (62→80%) */
        gsap.utils.toArray<HTMLElement>(".hero-card").forEach((card, i) => {
          const c = CARDS[i];
          if (!c) return;
          tl.to(
            card,
            {
              y: c.drift,
              rotateY: (c.settle.rotateY || 0) * 1.5,
              duration: 0.18,
              ease: "none",
            },
            0.62,
          );
        });
        tl.to(
          ".hero-text-wrap",
          { y: -20, duration: 0.18, ease: "none" },
          0.62,
        );

        /* Phase 6 — Cards flip away + fade to black (80→100%) */
        gsap.utils.toArray<HTMLElement>(".hero-card").forEach((card, i) => {
          const c = CARDS[i];
          if (!c) return;
          tl.to(
            card,
            {
              opacity: 0,
              rotateY: (c.settle.rotateY || 0) * -4,
              scale: 0.8,
              duration: 0.16,
            },
            0.8 + i * 0.012,
          );
        });
        tl.to(".hero-text-wrap", { opacity: 0, y: -35, duration: 0.14 }, 0.82);
        tl.to(
          ".hero-black-fade",
          { opacity: 1, duration: 0.2, ease: "power2.in" },
          0.8,
        );

        /* Ambient glow */
        gsap.to(".hero-content-glow", {
          opacity: 0.12,
          scale: 1.2,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
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
    <section ref={sectionRef} className="relative" style={{ height: "300vh" }}>
      <div
        ref={pinnedRef}
        className="relative w-full h-screen overflow-hidden"
        style={{ perspective: "1200px" }}
      >
        {/* ═══ SOLID GOLD WIPE ═══ */}
        <div
          className="hero-gold-wipe absolute left-1/2 top-1/2 z-40 pointer-events-none rounded-full opacity-0"
          style={{
            width: "250vmax",
            height: "250vmax",
            background:
              "radial-gradient(circle, #DFC063 0%, #C5A648 40%, #B89A3E 70%, #8B7730 100%)",
            boxShadow:
              "0 0 120px rgba(223,192,99,0.5), 0 0 300px rgba(223,192,99,0.2)",
          }}
        />

        {/* ═══ VIDEO LAYER — Art Deco arch frame ═══ */}
        <div
          className="hero-video-section absolute inset-0 z-30"
          style={{
            transformStyle: "preserve-3d",
            transformOrigin: "center top",
          }}
        >
          <div className="absolute inset-0 bg-surface-primary" />

          <div className="absolute inset-0 flex items-center justify-center pt-6 pb-8 md:pt-8 md:pb-10 px-6 md:px-12 lg:px-20">
            <div
              className="hero-video-frame relative w-full h-full overflow-hidden opacity-0"
              style={{
                borderRadius: "50% 50% 2% 2% / 30% 30% 2% 2%",
                transformStyle: "preserve-3d",
              }}
            >
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ transform: "scale(1.05)" }}
              >
                <source src={VIDEO_URL} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-b from-surface-primary/30 via-transparent to-surface-primary/50 pointer-events-none" />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, transparent 40%, rgba(5,5,5,0.55) 100%)",
                }}
              />
              <div
                className="hero-frame-glow absolute inset-[5px] pointer-events-none opacity-0"
                style={{
                  borderRadius: "50% 50% 2% 2% / 30% 30% 2% 2%",
                  border: "1px solid rgba(223,192,99,0.2)",
                  boxShadow:
                    "inset 0 0 80px rgba(5,5,5,0.4), 0 0 40px rgba(223,192,99,0.04)",
                }}
              />
              <div className="hero-frame-ornament absolute bottom-5 left-5 w-8 h-8 border-b border-l border-gold/25 opacity-0" />
              <div className="hero-frame-ornament absolute bottom-5 right-5 w-8 h-8 border-b border-r border-gold/25 opacity-0" />
              <div className="hero-frame-ornament absolute top-[40%] left-5 w-5 h-10 border-l border-gold/15 opacity-0" />
              <div className="hero-frame-ornament absolute top-[40%] right-5 w-5 h-10 border-r border-gold/15 opacity-0" />
            </div>
          </div>

          <div
            className="hero-frame-glow absolute inset-0 pointer-events-none opacity-0"
            style={{
              margin: "24px 24px 40px 24px",
              borderRadius: "50% 50% 2% 2% / 30% 30% 2% 2%",
              boxShadow:
                "0 0 60px rgba(223,192,99,0.06), 0 0 120px rgba(223,192,99,0.03)",
            }}
          />

          <div className="absolute inset-0 z-[3] pointer-events-none opacity-[0.015]">
            <div className="absolute top-0 left-[25%] w-px h-full bg-gold" />
            <div className="absolute top-0 left-[50%] w-px h-full bg-gold" />
            <div className="absolute top-0 left-[75%] w-px h-full bg-gold" />
          </div>

          {/* Scroll indicator */}
          <div className="hero-scroll-indicator absolute bottom-3 sm:bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center opacity-0">
            <span
              className="hero-scroll-text text-white/25 text-[9px] tracking-[0.4em] uppercase mb-4"
              style={{ fontFamily: "var(--font-mono-custom)" }}
            >
              Scroll
            </span>
            <div className="relative flex items-center justify-center w-14 h-14">
              <div
                className="hero-pulse-ring absolute inset-0 rounded-full border border-gold/20"
                style={{ animation: "hero-ring-pulse 2.5s ease-out infinite" }}
              />
              <div
                className="hero-pulse-ring absolute inset-1 rounded-full border border-gold/10"
                style={{
                  animation: "hero-ring-pulse 2.5s ease-out 0.8s infinite",
                }}
              />
              <div className="hero-chevron relative z-10">
                <svg width="24" height="14" viewBox="0 0 24 14" fill="none">
                  <path
                    d="M2 2L12 12L22 2"
                    stroke="rgba(223,192,99,0.85)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ GOLDEN FLASH ═══ */}
        <div className="hero-golden-flash absolute inset-0 z-35 bg-gold pointer-events-none opacity-0" />

        {/* ═══ CONTENT LAYER — 3D Image Cards + Outline-to-Fill Text ═══ */}
        <div className="absolute inset-0 z-10">
          {/* Background — Rich atmospheric layer */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(165deg, #080808 0%, #0A0908 30%, #0B0A08 60%, #090909 100%)",
            }}
          >
            {/* Architectural grid — vertical lines */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.06]">
              <div className="absolute top-0 left-[8%] w-px h-full bg-gold" />
              <div className="absolute top-0 left-[25%] w-px h-full bg-gold" />
              <div className="absolute top-0 left-[50%] w-px h-full bg-gold" />
              <div className="absolute top-0 left-[75%] w-px h-full bg-gold" />
              <div className="absolute top-0 right-[8%] w-px h-full bg-gold" />
            </div>
            {/* Architectural grid — horizontal lines */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.05]">
              <div className="absolute left-0 top-[20%] w-full h-px bg-gold" />
              <div className="absolute left-0 top-[50%] w-full h-px bg-gold" />
              <div className="absolute left-0 bottom-[20%] w-full h-px bg-gold" />
            </div>
            {/* Diagonal Art Deco accent rays */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.055]">
              <div
                className="absolute top-0 left-0 w-[200%] h-[2px] origin-top-left rotate-[22deg]"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(223,192,99,0.7) 0%, rgba(223,192,99,0.2) 30%, transparent 55%)",
                }}
              />
              <div
                className="absolute top-0 right-0 w-[200%] h-[2px] origin-top-right -rotate-[22deg]"
                style={{
                  background:
                    "linear-gradient(270deg, rgba(223,192,99,0.7) 0%, rgba(223,192,99,0.2) 30%, transparent 55%)",
                }}
              />
              <div
                className="absolute bottom-0 left-0 w-[200%] h-[2px] origin-bottom-left -rotate-[22deg]"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(223,192,99,0.6) 0%, rgba(223,192,99,0.15) 30%, transparent 55%)",
                }}
              />
              <div
                className="absolute bottom-0 right-0 w-[200%] h-[2px] origin-bottom-right rotate-[22deg]"
                style={{
                  background:
                    "linear-gradient(270deg, rgba(223,192,99,0.6) 0%, rgba(223,192,99,0.15) 30%, transparent 55%)",
                }}
              />
            </div>
            {/* Central volumetric haze */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(223,192,99,0.055) 0%, transparent 70%)",
              }}
            />
            {/* Volumetric light sources */}
            <div className="hero-content-glow absolute top-[28%] left-1/2 -translate-x-1/2 w-[700px] h-[550px] bg-gold/[0.07] blur-[180px] rounded-full pointer-events-none" />
            <div className="absolute top-[8%] left-[15%] w-[400px] h-[350px] bg-gold/[0.045] blur-[130px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[12%] right-[10%] w-[350px] h-[320px] bg-gold/[0.05] blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-[55%] left-[5%] w-[280px] h-[280px] bg-gold/[0.035] blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[35%] right-[20%] w-[300px] h-[250px] bg-gold/[0.04] blur-[110px] rounded-full pointer-events-none" />
            {/* Art Deco rotated diamond motifs — center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.08]">
              <div className="w-[350px] h-[350px] lg:w-[550px] lg:h-[550px] border border-gold/25 rotate-45 rounded-sm" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.06]">
              <div className="w-[250px] h-[250px] lg:w-[400px] lg:h-[400px] border border-gold/20 rotate-45 rounded-sm" />
            </div>
            {/* Art Deco corner ornaments */}
            <div className="absolute top-5 left-5 sm:top-8 sm:left-8 w-16 h-16 sm:w-24 sm:h-24 pointer-events-none opacity-[0.16]">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-gold to-transparent" />
              <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-gold to-transparent" />
              <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-gold/60" />
            </div>
            <div className="absolute top-5 right-5 sm:top-8 sm:right-8 w-16 h-16 sm:w-24 sm:h-24 pointer-events-none opacity-[0.16]">
              <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-l from-gold to-transparent" />
              <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-gold to-transparent" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-gold/60" />
            </div>
            <div className="absolute bottom-5 left-5 sm:bottom-8 sm:left-8 w-16 h-16 sm:w-24 sm:h-24 pointer-events-none opacity-[0.16]">
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-gold to-transparent" />
              <div className="absolute bottom-0 left-0 h-full w-px bg-gradient-to-b from-transparent to-gold" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-gold/60" />
            </div>
            <div className="absolute bottom-5 right-5 sm:bottom-8 sm:right-8 w-16 h-16 sm:w-24 sm:h-24 pointer-events-none opacity-[0.16]">
              <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-gold to-transparent" />
              <div className="absolute bottom-0 right-0 h-full w-px bg-gradient-to-b from-transparent to-gold" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-gold/60" />
            </div>
            {/* Film grain texture overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.045]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
              }}
            />
            {/* Edge vignette — depth framing */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 30%, rgba(5,5,5,0.55) 100%)",
              }}
            />
          </div>

          {/* Floating particles */}
          {[
            { top: "8%", left: "5%", size: 3, delay: 0 },
            { top: "20%", left: "92%", size: 4, delay: 0.5 },
            { top: "45%", left: "96%", size: 2, delay: 1.5 },
            { top: "60%", left: "3%", size: 3, delay: 1.1 },
            { top: "75%", left: "88%", size: 3, delay: 0.8 },
            { top: "35%", left: "2%", size: 2, delay: 2.0 },
          ].map((p, i) => (
            <div
              key={i}
              className="absolute rounded-full pointer-events-none z-[1]"
              style={{
                top: p.top,
                left: p.left,
                width: p.size,
                height: p.size,
                background: "rgba(223,192,99,0.5)",
                boxShadow: `0 0 ${p.size * 6}px rgba(223,192,99,0.3)`,
                animation: `float ${4 + i * 0.5}s ease-in-out ${p.delay}s infinite`,
              }}
            />
          ))}

          {/* ═══ 3D IMAGE CARDS — flip in from scattered positions ═══ */}
          {CARDS.map((card, i) => (
            <div
              key={i}
              className={`hero-card absolute opacity-0 z-10 ${card.cls}`}
              style={{
                transformStyle: "preserve-3d",
                willChange: "transform, opacity",
              }}
            >
              <div className="relative w-full h-full overflow-hidden rounded-sm border border-white/[0.12] shadow-2xl shadow-black/50">
                <img
                  src={card.src}
                  alt={card.alt}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
                <div className="absolute inset-0 bg-gold/[0.06]" />
                <div className="absolute inset-[4px] border border-gold/[0.12] rounded-sm pointer-events-none" />
                {/* Architectural corner marks */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-gold/30" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-gold/30" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-gold/30" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-gold/30" />
                {/* Gold coating that dissolves to reveal the image */}
                <div
                  className="hero-card-gold absolute inset-0 z-10"
                  style={{
                    background:
                      "linear-gradient(135deg, #DFC063 0%, #C5A648 50%, #B89A3E 100%)",
                  }}
                />
              </div>
            </div>
          ))}

          {/* ═══ CENTER TEXT — outline-to-fill characters ═══ */}
          <div className="hero-text-wrap absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            {/* Dark vignette behind text for readability */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(8,8,8,0.8) 0%, rgba(8,8,8,0.35) 42%, transparent 70%)",
              }}
            />

            <div className="text-center relative z-10">
              <div className="hero-label opacity-0 mb-4 sm:mb-6">
                <span
                  className="text-gold/45 text-[9px] sm:text-[10px] md:text-xs tracking-[0.3em] uppercase"
                  style={{ fontFamily: "var(--font-mono-custom)" }}
                >
                  Est. 1995 — Premier Developers
                </span>
              </div>

              <h1
                className="mb-4 sm:mb-5"
                style={{ fontFamily: "var(--font-display-custom)" }}
              >
                <div className="overflow-hidden">
                  {"Crafting".split("").map((char, i) => (
                    <span
                      key={`w${i}`}
                      className="hero-char hero-char-w inline-block text-[2.5rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[0.95]"
                      style={{
                        color: "transparent",
                        WebkitTextStroke: "1.5px rgba(255,255,255,0.2)",
                        transformStyle: "preserve-3d",
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </div>
                <div className="overflow-hidden mt-1 sm:mt-2">
                  {"Legacies".split("").map((char, i) => (
                    <span
                      key={`g${i}`}
                      className="hero-char hero-char-g inline-block text-[2.5rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[0.95]"
                      style={{
                        color: "transparent",
                        WebkitTextStroke: "1.5px rgba(223,192,99,0.3)",
                        transformStyle: "preserve-3d",
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </h1>

              <div className="hero-accent-line w-14 sm:w-20 h-[1px] bg-gradient-to-r from-gold/60 to-transparent mx-auto mb-5 sm:mb-6 origin-center" />

              <div className="hero-cta opacity-0 pointer-events-auto">
                <a
                  href="/project"
                  className="group inline-flex items-center gap-3 text-white/40 text-xs sm:text-sm tracking-wider uppercase hover:text-gold transition-colors duration-400"
                >
                  Explore Projects
                  <div className="w-6 h-px bg-white/20 group-hover:w-10 group-hover:bg-gold/50 transition-all duration-500" />
                  <ArrowRight
                    size={13}
                    className="text-white/30 group-hover:text-gold group-hover:translate-x-1 transition-all duration-300"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* ═══ FADE TO BLACK — smooth transition into next section ═══ */}
          <div className="hero-black-fade absolute inset-0 z-30 bg-surface-primary pointer-events-none opacity-0" />
        </div>
      </div>
    </section>
  );
}
