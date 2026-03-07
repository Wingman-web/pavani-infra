"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CtaBanner() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Background parallax glow shift
      gsap.to(".cta-glow", {
        y: -60,
        scale: 1.3,
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      // Diamond icon: slow rotation + fade in
      gsap.fromTo(
        ".cta-diamond",
        { opacity: 0, scale: 0.5, rotation: -90 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.8,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 55%",
            scrub: 0.6,
          },
        }
      );

      // Title words reveal one by one — scrub-linked
      gsap.fromTo(
        ".cta-word",
        { opacity: 0, y: 50, rotateX: -20 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".cta-title",
            start: "top 85%",
            end: "top 55%",
            scrub: 0.6,
          },
        }
      );

      // Description
      gsap.fromTo(
        ".cta-desc",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".cta-desc",
            start: "top 90%",
            end: "top 70%",
            scrub: 0.5,
          },
        }
      );

      // Buttons stagger in
      gsap.fromTo(
        ".cta-btn",
        { opacity: 0, y: 20, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".cta-buttons",
            start: "top 92%",
            end: "top 72%",
            scrub: 0.5,
          },
        }
      );

      // Gold sweep line across section
      gsap.fromTo(
        ".cta-sweep",
        { xPercent: -100 },
        {
          xPercent: 100,
          duration: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 60%",
            end: "bottom 40%",
            scrub: 1,
          },
        }
      );

      // Decorative lines expand
      gsap.fromTo(
        ".cta-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            end: "top 45%",
            scrub: 0.6,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const titleWords = ["Begin", "Your", "New", "Chapter", "Today"];

  return (
    <section
      ref={sectionRef}
      className="relative py-28 md:py-40 overflow-hidden"
      style={{ perspective: "1000px" }}
    >
      {/* Dark background */}
      <div className="absolute inset-0 bg-surface-primary" />

      {/* Animated gold glow — parallax */}
      <div className="cta-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(ellipse_at_center,rgba(223,192,99,0.08)_0%,transparent_55%)] pointer-events-none" />

      {/* Gold sweep line — moves across on scroll */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="cta-sweep absolute top-0 left-0 w-[40%] h-full"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(223,192,99,0.03) 40%, rgba(223,192,99,0.06) 50%, rgba(223,192,99,0.03) 60%, transparent 100%)",
          }}
        />
      </div>

      {/* Decorative border lines */}
      <div className="cta-line absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent origin-center" />
      <div className="cta-line absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent origin-center" />

      {/* Decorative corner accents */}
      <div className="absolute top-6 left-6 w-12 h-12 border-t border-l border-gold/10 pointer-events-none" />
      <div className="absolute top-6 right-6 w-12 h-12 border-t border-r border-gold/10 pointer-events-none" />
      <div className="absolute bottom-6 left-6 w-12 h-12 border-b border-l border-gold/10 pointer-events-none" />
      <div className="absolute bottom-6 right-6 w-12 h-12 border-b border-r border-gold/10 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center">
          {/* Diamond icon with rotation */}
          <div className="mb-8 flex justify-center">
            <svg
              className="cta-diamond w-12 h-12 opacity-0"
              viewBox="0 0 86 34"
              fill="none"
            >
              <path
                d="M27.4062 32.7174L43.3399 24.3041L27.4062 15.8906V32.7174Z"
                fill="#DFC063"
                opacity="0.5"
              />
              <path
                d="M59.251 15.8906L43.3174 24.3041L59.251 32.7174V15.8906Z"
                fill="#DFC063"
                opacity="0.5"
              />
              <path
                d="M27.4062 15.8933L43.3315 0.0371094L59.2503 15.8869L27.4062 15.8933Z"
                fill="#DFC063"
                opacity="0.5"
              />
            </svg>
          </div>

          {/* Title — word by word reveal */}
          <h2
            className="cta-title text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight"
            style={{
              fontFamily: "var(--font-display-custom)",
              perspective: "600px",
            }}
          >
            {titleWords.map((word, i) => (
              <span
                key={i}
                className={`cta-word inline-block opacity-0 mr-[0.25em] ${
                  word === "Chapter" || word === "Today"
                    ? "text-gold"
                    : "text-white"
                }`}
              >
                {word}
              </span>
            ))}
          </h2>

          {/* Description */}
          <p className="cta-desc opacity-0 text-white/40 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-10">
            A home is more than walls — it&apos;s the foundation for
            generations. Let us help you build your legacy.
          </p>

          {/* Buttons */}
          <div className="cta-buttons flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/contact-us"
              className="cta-btn group relative px-10 py-4 bg-gold text-surface-primary font-semibold text-sm tracking-wider uppercase rounded-sm overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(223,192,99,0.3)]"
            >
              <span className="relative z-10">Request a Call</span>
              <div className="absolute inset-0 bg-gold-light transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            </a>
            <a
              href="/project"
              className="cta-btn px-10 py-4 border border-gold/30 text-gold font-medium text-sm tracking-wider uppercase rounded-sm hover:bg-gold/10 transition-all duration-400"
            >
              Browse Projects
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
