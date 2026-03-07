"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BLOGS } from "@/lib/constants";
import { Calendar, ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   Art Deco Chevron Band — editorial zigzag motif
   unique to the Insights section
   ───────────────────────────────────────────── */
const ArtDecoChevronBand = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 1200 40"
    fill="none"
    preserveAspectRatio="none"
    className={`blog-chevron-band w-full ${className}`}
  >
    {Array.from({ length: 20 }).map((_, i) => (
      <polyline
        key={i}
        points={`${i * 60},40 ${i * 60 + 30},0 ${i * 60 + 60},40`}
        stroke="rgba(223,192,99,0.08)"
        strokeWidth="1"
        fill="none"
      />
    ))}
    {/* Center diamond accent */}
    <rect
      x="594"
      y="14"
      width="12"
      height="12"
      transform="rotate(45 600 20)"
      fill="rgba(223,192,99,0.15)"
    />
  </svg>
);

/* ─────────────────────────────────────────────
   Floating Particles — ambient editorial dust
   ───────────────────────────────────────────── */
const PARTICLES = [
  { top: "10%", left: "8%", size: 2, delay: 0, opacity: 0.2 },
  { top: "20%", right: "12%", size: 3, delay: 0.6, opacity: 0.15 },
  { top: "35%", left: "4%", size: 2, delay: 1.2, opacity: 0.25 },
  { top: "55%", right: "6%", size: 3, delay: 0.3, opacity: 0.12 },
  { top: "70%", left: "15%", size: 2, delay: 0.9, opacity: 0.2 },
  { top: "45%", left: "50%", size: 2, delay: 1.5, opacity: 0.1 },
  { top: "80%", right: "20%", size: 3, delay: 0.4, opacity: 0.15 },
  { top: "15%", left: "40%", size: 2, delay: 1.1, opacity: 0.18 },
];

export default function BlogInsights() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      /* ── Header elements stagger in ── */
      gsap.fromTo(
        ".blog-header > *",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            end: "top 55%",
            scrub: 0.6,
          },
        }
      );

      /* ── Chevron bands reveal ── */
      gsap.fromTo(
        ".blog-chevron-band",
        { opacity: 0, scaleX: 0 },
        {
          opacity: 1,
          scaleX: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 50%",
            scrub: 0.7,
          },
        }
      );

      /* ── Blog cards fall from sky ── */
      gsap.fromTo(
        ".blog-card",
        {
          opacity: 0,
          y: -180,
          rotateX: -30,
          rotateZ: -4,
          scale: 0.8,
          transformOrigin: "center top",
          filter: "blur(4px)",
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          rotateZ: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.5,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".blog-grid",
            start: "top 92%",
            end: "top 35%",
            scrub: 0.5,
          },
        }
      );

      /* ── Card shadows grow as they land ── */
      gsap.fromTo(
        ".blog-card-shadow",
        { opacity: 0, scaleX: 0.6 },
        {
          opacity: 1,
          scaleX: 1,
          duration: 0.5,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".blog-grid",
            start: "top 80%",
            end: "top 35%",
            scrub: 0.5,
          },
        }
      );

      /* ── Floating particles parallax ── */
      gsap.utils.toArray<HTMLElement>(".blog-particle").forEach((p, i) => {
        const speed = 0.6 + (i % 3) * 0.4;
        gsap.to(p, {
          y: -60 * speed,
          x: (i % 2 === 0 ? 1 : -1) * 15,
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1 + (i % 3) * 0.5,
          },
        });
      });

      /* ── Art Deco corner brackets scale in ── */
      gsap.fromTo(
        ".blog-deco-corner",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.06,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: ".blog-grid",
            start: "top 85%",
            end: "top 55%",
            scrub: 0.5,
          },
        }
      );

      /* ── Ambient glow pulse ── */
      gsap.to(".blog-ambient-glow", {
        opacity: 0.05,
        scale: 1.08,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      /* ── View All button ── */
      gsap.fromTo(
        ".blog-view-all",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".blog-view-all",
            start: "top 95%",
            end: "top 75%",
            scrub: 0.5,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-36 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #080808 0%, #0A0A09 35%, #0B0A08 65%, #090909 100%)",
      }}
    >
      {/* ═══ Background Layers ═══ */}

      {/* Architectural grid lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
        <div className="absolute top-0 left-[16%] w-px h-full bg-gold" />
        <div className="absolute top-0 left-[50%] w-px h-full bg-gold" />
        <div className="absolute top-0 left-[84%] w-px h-full bg-gold" />
        <div className="absolute top-[25%] left-0 w-full h-px bg-gold" />
        <div className="absolute top-[75%] left-0 w-full h-px bg-gold" />
      </div>

      {/* Primary ambient glow — center */}
      <div className="blog-ambient-glow absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[700px] h-[500px] bg-gold/[0.03] blur-[160px] rounded-full pointer-events-none" />

      {/* Secondary glow — bottom right */}
      <div className="absolute bottom-0 right-[10%] w-[400px] h-[300px] bg-gold/[0.02] blur-[120px] rounded-full pointer-events-none" />

      {/* Diagonal gold accent lines — subtle editorial rule lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px w-[200%] bg-gradient-to-r from-transparent via-gold/[0.05] to-transparent"
            style={{
              top: `${15 + i * 25}%`,
              left: "-50%",
              transform: `rotate(${i % 2 === 0 ? -3 : 3}deg)`,
            }}
          />
        ))}
      </div>

      {/* Floating gold particles */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="blog-particle absolute rounded-full pointer-events-none"
          style={{
            top: p.top,
            left: p.left,
            right: (p as { right?: string }).right,
            width: p.size,
            height: p.size,
            background: `rgba(223, 192, 99, ${p.opacity})`,
            boxShadow: `0 0 ${p.size * 3}px rgba(223, 192, 99, ${p.opacity * 0.4})`,
            animation: `float ${4 + i * 0.3}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* ═══ Content ═══ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Art Deco Chevron Band — top editorial accent */}
        <div className="mb-10 md:mb-14 origin-center">
          <ArtDecoChevronBand />
        </div>

        {/* Header */}
        <div className="blog-header text-center mb-16 md:mb-20">
          <span
            className="text-gold/60 text-xs tracking-[0.3em] uppercase block mb-4"
            style={{ fontFamily: "var(--font-mono-custom)" }}
          >
            Insights
          </span>
          <h2
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6"
            style={{ fontFamily: "var(--font-display-custom)" }}
          >
            Real Estate <span className="text-gold">Trends</span>
          </h2>
          <div className="w-20 h-px bg-gold/40 mx-auto" />
        </div>

        {/* Blog Grid — perspective container for 3D falling effect */}
        <div className="relative">
          {/* Art Deco corner brackets around the grid */}
          <div className="blog-deco-corner absolute -top-3 -left-3 w-7 h-7 border-t border-l border-gold/15 hidden lg:block" />
          <div className="blog-deco-corner absolute -top-3 -right-3 w-7 h-7 border-t border-r border-gold/15 hidden lg:block" />
          <div className="blog-deco-corner absolute -bottom-3 -left-3 w-7 h-7 border-b border-l border-gold/15 hidden lg:block" />
          <div className="blog-deco-corner absolute -bottom-3 -right-3 w-7 h-7 border-b border-r border-gold/15 hidden lg:block" />

          <div
            className="blog-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            style={{ perspective: "1400px" }}
          >
            {BLOGS.map((blog) => (
              <div key={blog.slug} className="relative">
                {/* Landing shadow */}
                <div className="blog-card-shadow absolute -bottom-2 left-4 right-4 h-6 bg-gold/[0.04] blur-[12px] rounded-full opacity-0" />

                <a
                  href={`/blogs/${blog.slug}`}
                  className="blog-card group block rounded-lg overflow-hidden border border-white/[0.06] bg-white/[0.02] hover:border-gold/20 transition-all duration-500 relative"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Image area */}
                  <div className="aspect-[16/10] relative overflow-hidden">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-primary/70 via-surface-primary/20 to-transparent" />
                    <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/[0.08] transition-colors duration-500" />

                    {/* Hover arrow */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <div className="w-8 h-8 rounded-full bg-gold/90 flex items-center justify-center shadow-lg shadow-gold/20">
                        <ArrowUpRight
                          size={14}
                          className="text-surface-primary"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-1.5 mb-3">
                      <Calendar size={12} className="text-gold/50" />
                      <span
                        className="text-gold/60 text-xs tracking-wider"
                        style={{ fontFamily: "var(--font-mono-custom)" }}
                      >
                        {blog.date}
                      </span>
                    </div>

                    <h3 className="text-sm md:text-base font-medium text-white/80 leading-relaxed line-clamp-2 group-hover:text-gold transition-colors duration-300">
                      {blog.title}
                    </h3>

                    <span className="inline-flex items-center gap-1.5 mt-3 text-gold/50 text-xs tracking-wider uppercase group-hover:text-gold transition-colors duration-300">
                      Read More
                      <ArrowUpRight
                        size={12}
                        className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
                      />
                    </span>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom chevron band */}
        <div className="mt-10 md:mt-14 origin-center">
          <ArtDecoChevronBand />
        </div>

        {/* View All */}
        <div className="blog-view-all text-center mt-12">
          <a
            href="/blogs"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-gold/30 text-gold text-sm tracking-wider uppercase rounded-sm hover:bg-gold hover:text-surface-primary transition-all duration-500 group"
          >
            View All Insights
            <ArrowUpRight
              size={16}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
