"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { STATS } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

export default function StatsCounter() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Header reveal
      gsap.fromTo(
        ".stats-header > *",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            end: "top 60%",
            scrub: 0.6,
          },
        }
      );

      // Each stat row slides in from its side (alternating left/right)
      const statRows = section.querySelectorAll<HTMLElement>(".stat-row");
      statRows.forEach((row, i) => {
        const isLeft = i % 2 === 0;
        gsap.fromTo(
          row,
          {
            opacity: 0,
            x: isLeft ? -120 : 120,
            filter: "blur(8px)",
          },
          {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 90%",
              end: "top 55%",
              scrub: 0.7,
            },
          }
        );
      });

      // Gold connecting lines expand
      gsap.fromTo(
        ".stat-gold-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: ".stats-container",
            start: "top 75%",
            end: "bottom 60%",
            scrub: 0.8,
          },
        }
      );

      // Ghost background numbers fade in
      gsap.fromTo(
        ".stat-ghost",
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".stats-container",
            start: "top 80%",
            end: "bottom 65%",
            scrub: 0.8,
          },
        }
      );

      // Scroll-driven counters
      const numberEls = section.querySelectorAll<HTMLElement>(".stat-number");
      const ghostEls = section.querySelectorAll<HTMLElement>(".stat-ghost-num");
      const targets = STATS.map((s) => s.value);
      const suffixes = STATS.map((s) => s.suffix);
      const objs = targets.map(() => ({ value: 0 }));

      const counterTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".stats-container",
          start: "top 75%",
          end: "bottom 55%",
          scrub: 1,
        },
      });

      objs.forEach((obj, i) => {
        counterTl.to(
          obj,
          {
            value: targets[i],
            duration: 1,
            ease: "power2.out",
            onUpdate: () => {
              const val = Math.round(obj.value);
              const text =
                (targets[i] >= 1000 ? val.toLocaleString() : String(val)) +
                suffixes[i];
              if (numberEls[i]) numberEls[i].textContent = text;
              if (ghostEls[i]) ghostEls[i].textContent = text;
            },
          },
          i * 0.12
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-28 md:py-40 bg-surface-primary overflow-hidden"
    >
      {/* Ambient effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gold/[0.02] blur-[180px] rounded-full" />
      </div>

      {/* Decorative vertical line running through the center */}
      <div className="absolute top-0 left-1/2 -translate-x-px w-px h-full bg-gradient-to-b from-transparent via-gold/[0.06] to-transparent pointer-events-none hidden lg:block" />

      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="stats-header text-center mb-20 md:mb-28">
          <span
            className="text-gold/60 text-xs tracking-[0.3em] uppercase block mb-4"
            style={{ fontFamily: "var(--font-mono-custom)" }}
          >
            Our Achievements
          </span>
          <h2
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6"
            style={{ fontFamily: "var(--font-display-custom)" }}
          >
            Numbers That Speak
            <br />
            <span className="text-gold">For Themselves</span>
          </h2>
          <div className="w-20 h-px bg-gold/40 mx-auto" />
        </div>

        {/* Stats — vertical stacked, alternating left/right alignment */}
        <div className="stats-container space-y-16 md:space-y-20">
          {STATS.map((stat, i) => {
            const isLeft = i % 2 === 0;
            return (
              <div key={stat.label} className="relative">
                {/* Giant ghost number in background */}
                <div
                  className={`stat-ghost absolute top-1/2 -translate-y-1/2 opacity-0 pointer-events-none select-none ${
                    isLeft ? "right-0 lg:right-[5%]" : "left-0 lg:left-[5%]"
                  }`}
                >
                  <span
                    className="stat-ghost-num text-[100px] sm:text-[140px] md:text-[180px] lg:text-[220px] font-bold text-white/[0.03] leading-none"
                    style={{ fontFamily: "var(--font-mono-custom)" }}
                  >
                    0{stat.suffix}
                  </span>
                </div>

                {/* Stat content */}
                <div
                  className={`stat-row relative flex flex-col ${
                    isLeft
                      ? "items-start text-left"
                      : "items-end text-right"
                  }`}
                >
                  {/* Number */}
                  <span
                    className="stat-number text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white leading-none tracking-tight"
                    style={{ fontFamily: "var(--font-mono-custom)" }}
                  >
                    0{stat.suffix}
                  </span>

                  {/* Gold expanding line */}
                  <div
                    className={`stat-gold-line w-16 sm:w-24 md:w-40 lg:w-56 h-[2px] bg-gradient-to-r from-gold via-gold/80 to-gold/30 mt-4 mb-3 ${
                      isLeft ? "origin-left" : "origin-right"
                    }`}
                  />

                  {/* Label */}
                  <p
                    className="text-white/30 text-[10px] sm:text-xs tracking-[0.25em] uppercase"
                    style={{ fontFamily: "var(--font-mono-custom)" }}
                  >
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
