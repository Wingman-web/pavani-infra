"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { STATS } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

const ICONS: Record<string, React.ReactNode> = {
  expertise: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  ),
  families: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  building: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="1" />
      <path d="M9 22V18H15V22" />
      <path d="M8 6H10" /><path d="M14 6H16" />
      <path d="M8 10H10" /><path d="M14 10H16" />
      <path d="M8 14H10" /><path d="M14 14H16" />
    </svg>
  ),
  area: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="1" />
      <path d="M3 9H21" /><path d="M3 15H21" />
      <path d="M9 3V21" /><path d="M15 3V21" />
    </svg>
  ),
};

export default function StatsCounter() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Stat cards stagger in
      gsap.fromTo(
        ".stat-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Gold dividers expand
      gsap.fromTo(
        ".stat-divider",
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );

      // Counter animations
      const numberEls = section.querySelectorAll<HTMLElement>(".stat-number");
      const targets = STATS.map((s) => s.value);
      const suffixes = STATS.map((s) => s.suffix);
      const objs = targets.map(() => ({ value: 0 }));

      const getCountDuration = (target: number) => {
        if (target <= 10) return 2.5;
        if (target <= 100) return 2;
        return 1.8;
      };

      const counterTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      objs.forEach((obj, i) => {
        counterTl.to(
          obj,
          {
            value: targets[i],
            duration: getCountDuration(targets[i]),
            ease: "power2.out",
            onUpdate: () => {
              const val = Math.round(obj.value);
              const text =
                (targets[i] >= 1000 ? val.toLocaleString() : String(val)) +
                suffixes[i];
              if (numberEls[i]) numberEls[i].textContent = text;
            },
          },
          i * 0.2
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-14 md:py-20 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0B1C2B 0%, #0D2536 50%, #0B1C2B 100%)" }}
    >
      {/* Top/bottom accent lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold/15 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold/15 to-transparent" />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold/[0.02] blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="relative flex">
              {/* Gold vertical divider (between items on desktop) */}
              {i > 0 && (
                <div
                  className={`stat-divider absolute left-0 top-[15%] bottom-[15%] w-px bg-linear-to-b from-transparent via-gold/20 to-transparent origin-center ${
                    i === 2 ? "hidden lg:block" : ""
                  }`}
                />
              )}

              {/* Horizontal divider for mobile (between row 1 and row 2) */}
              {i >= 2 && (
                <div className="absolute top-0 left-[10%] right-[10%] h-px bg-linear-to-r from-transparent via-gold/15 to-transparent lg:hidden" />
              )}

              <div className="stat-card flex-1 flex flex-col items-center text-center py-6 md:py-8 px-3">
                {/* Icon */}
                <div className="w-10 h-10 rounded-full border border-gold/20 bg-gold/[0.05] flex items-center justify-center text-gold/50 mb-4">
                  {ICONS[stat.icon]}
                </div>

                {/* Number */}
                <span
                  className="stat-number text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-none tracking-tight"
                  style={{ fontFamily: "var(--font-display-custom)" }}
                >
                  0{stat.suffix}
                </span>

                {/* Gold accent */}
                <div className="w-8 h-px bg-linear-to-r from-transparent via-gold/40 to-transparent mt-3 mb-2.5" />

                {/* Label */}
                <p
                  className="text-white/35 text-[10px] sm:text-xs tracking-[0.2em] uppercase leading-tight"
                  style={{ fontFamily: "var(--font-mono-custom)" }}
                >
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
