"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const VIDEO_URL =
  "https://backend.pavaniinfra.com/uploads/1920_by_1080_8e415f658b.mp4";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

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
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "center top",
        }}
      >
        {/* Rich gold background */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(160deg, #D3B973 0%, #B89D56 40%, #A08A45 70%, #8B7738 100%)",
          }}
        />


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
            <div
              className="hero-frame-glow absolute inset-[5px] pointer-events-none opacity-0"
              style={{
                borderRadius: "50% 50% 2% 2% / 30% 30% 2% 2%",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            />
            <div className="hero-frame-ornament absolute bottom-5 left-5 w-8 h-8 border-b border-l border-white/30 opacity-0" />
            <div className="hero-frame-ornament absolute bottom-5 right-5 w-8 h-8 border-b border-r border-white/30 opacity-0" />
            <div className="hero-frame-ornament absolute top-[40%] left-5 w-5 h-10 border-l border-white/20 opacity-0" />
            <div className="hero-frame-ornament absolute top-[40%] right-5 w-5 h-10 border-r border-white/20 opacity-0" />
          </div>
        </div>


        <div className="absolute inset-0 z-[3] pointer-events-none opacity-[0.04]">
          <div className="absolute top-0 left-[25%] w-px h-full bg-white" />
          <div className="absolute top-0 left-[50%] w-px h-full bg-white" />
          <div className="absolute top-0 left-[75%] w-px h-full bg-white" />
        </div>

        {/* Scroll indicator with crimson accent */}
        <div className="hero-scroll-indicator absolute bottom-3 sm:bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center opacity-0">
          <span
            className="hero-scroll-text text-navy/40 text-[9px] tracking-[0.4em] uppercase mb-4"
            style={{ fontFamily: "var(--font-mono-custom)" }}
          >
            Scroll
          </span>
          <div className="relative flex items-center justify-center w-14 h-14">
            <div
              className="hero-pulse-ring absolute inset-0 rounded-full border border-emerald/25"
              style={{ animation: "hero-ring-pulse 2.5s ease-out infinite" }}
            />
            <div
              className="hero-pulse-ring absolute inset-1 rounded-full border border-emerald/15"
              style={{
                animation: "hero-ring-pulse 2.5s ease-out 0.8s infinite",
              }}
            />
            <div className="relative z-10">
              <svg width="24" height="14" viewBox="0 0 24 14" fill="none">
                <path
                  d="M2 2L12 12L22 2"
                  stroke="rgba(151,8,30,0.85)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Crimson accent line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald/40 to-transparent z-20" />
    </section>
  );
}
