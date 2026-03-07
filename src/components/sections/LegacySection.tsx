"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function LegacySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Top decorative line expands
      gsap.fromTo(
        ".legacy-line-top",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          ease: "power2.inOut",
          scrollTrigger: { trigger: section, start: "top 75%" },
        }
      );

      // Diamond decorations pop in
      gsap.fromTo(
        ".legacy-diamond",
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "back.out(1.7)",
          scrollTrigger: { trigger: section, start: "top 70%" },
        }
      );

      // Label
      gsap.fromTo(
        ".legacy-label",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 68%" },
        }
      );

      // Title words stagger
      gsap.fromTo(
        ".legacy-title-word",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 65%" },
        }
      );

      // Description lines
      gsap.fromTo(
        ".legacy-desc",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: ".legacy-desc", start: "top 85%" },
        }
      );

      // CTA button
      gsap.fromTo(
        ".legacy-cta",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: ".legacy-cta", start: "top 90%" },
        }
      );

      // Bottom decorative line
      gsap.fromTo(
        ".legacy-line-bottom",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          ease: "power2.inOut",
          scrollTrigger: { trigger: ".legacy-line-bottom", start: "top 90%" },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-28 md:py-40 bg-surface-primary overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gold/[0.025] blur-[160px] rounded-full" />
      </div>

      {/* Subtle side accents */}
      <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-gold/10 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-gold/10 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 md:px-8 text-center relative">
        {/* Top decorative line */}
        <div className="legacy-line-top w-24 h-px bg-gold/30 mx-auto mb-12 origin-center" />

        {/* Diamond decorations with logo icon */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="legacy-diamond w-1.5 h-1.5 bg-gold/30 rotate-45 opacity-0" />
          <div className="legacy-diamond w-2 h-2 bg-gold/40 rotate-45 opacity-0" />
          <svg
            className="legacy-diamond w-8 h-8 opacity-0"
            viewBox="27 0 33 33"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M27.4062 32.7174L43.3399 24.3041L27.4062 15.8906V32.7174Z"
              fill="#DFC063"
              fillOpacity="0.7"
            />
            <path
              d="M59.251 15.8906L43.3174 24.3041L59.251 32.7174V15.8906Z"
              fill="#DFC063"
              fillOpacity="0.7"
            />
            <path
              d="M27.4062 15.8933L43.3315 0.0371094L59.2503 15.8869L27.4062 15.8933Z"
              fill="#DFC063"
              fillOpacity="0.7"
            />
          </svg>
          <div className="legacy-diamond w-2 h-2 bg-gold/40 rotate-45 opacity-0" />
          <div className="legacy-diamond w-1.5 h-1.5 bg-gold/30 rotate-45 opacity-0" />
        </div>

        {/* Section label */}
        <span
          className="legacy-label text-gold/60 text-xs tracking-[0.3em] uppercase block mb-6 opacity-0"
          style={{ fontFamily: "var(--font-mono-custom)" }}
        >
          Our Vision
        </span>

        {/* Title */}
        <h2
          className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 leading-tight"
          style={{ fontFamily: "var(--font-display-custom)" }}
        >
          {"A LEGACY OF".split(" ").map((word, i) => (
            <span
              key={i}
              className="legacy-title-word inline-block text-white mr-[0.25em] opacity-0"
            >
              {word}
            </span>
          ))}
          <br className="hidden sm:block" />
          <span className="legacy-title-word inline-block text-gold opacity-0 mt-1 sm:mt-0">
            EXCELLENCE
          </span>
        </h2>

        {/* Thin gold divider */}
        <div className="w-16 h-px bg-gold/20 mx-auto mb-8" />

        {/* Description */}
        <p className="legacy-desc opacity-0 text-white/50 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-12">
          A home is a foundation for dreams, a space where generations create
          memories and build their future. With this vision, Pavani Infra is
          dedicated to helping people find their perfect home, crafting spaces
          that inspire growth, comfort, and a lasting legacy.
        </p>

        {/* Read More CTA */}
        <a
          href="/about"
          className="legacy-cta opacity-0 inline-flex items-center gap-3 group"
        >
          <span className="text-gold text-sm tracking-[0.2em] uppercase font-medium group-hover:tracking-[0.25em] transition-all duration-500">
            Read More
          </span>
          <div className="w-10 h-px bg-gold/40 group-hover:w-16 transition-all duration-500" />
          <ArrowRight
            size={16}
            className="text-gold/60 group-hover:translate-x-1 group-hover:text-gold transition-all duration-300"
          />
        </a>

        {/* Bottom decorative line */}
        <div className="legacy-line-bottom w-24 h-px bg-gold/30 mx-auto mt-14 origin-center" />
      </div>
    </section>
  );
}
