"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BLOGS } from "@/lib/constants";
import { Calendar, ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

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
      className="relative py-14 md:py-20 overflow-hidden bg-cream"
    >
      {/* ═══ Content ═══ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="blog-header text-center mb-10 md:mb-14">
          <span
            className="text-gold-contrast text-sm tracking-[0.3em] uppercase block mb-4"
            style={{ fontFamily: "var(--font-mono-custom)" }}
          >
            Insights
          </span>
          <h2
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-navy tracking-tight mb-6"
            style={{ fontFamily: "var(--font-display-custom)" }}
          >
            Real Estate <span className="text-gold-contrast">Trends</span>
          </h2>
          <div className="w-20 h-px bg-gold/40 mx-auto" />
        </div>

        {/* Blog Grid */}
        <div
          className="blog-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          style={{ perspective: "1400px" }}
        >
          {BLOGS.slice(0, 3).map((blog) => (
            <div key={blog.slug} className="relative">
              {/* Landing shadow */}
              <div className="blog-card-shadow absolute -bottom-2 left-4 right-4 h-6 bg-gold/4 blur-md rounded-full opacity-0" />

              <a
                href={`/blogs/${blog.slug}`}
                className="blog-card group block rounded-lg overflow-hidden border border-navy/10 bg-white/60 hover:border-gold/40 transition-all duration-500 relative"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-navy/15 to-transparent" />
                  <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/8 transition-colors duration-500" />

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
                    <Calendar size={12} className="text-emerald-dark" />
                    <span
                      className="text-emerald-dark text-[13px] tracking-wider"
                      style={{ fontFamily: "var(--font-mono-custom)" }}
                    >
                      {blog.date}
                    </span>
                  </div>

                  <h3 className="text-base md:text-lg font-medium text-navy/80 leading-relaxed line-clamp-2 group-hover:text-gold-contrast transition-colors duration-300">
                    {blog.title}
                  </h3>

                  <span className="inline-flex items-center gap-1.5 mt-3 text-gold-dark text-sm tracking-wider uppercase group-hover:text-gold-contrast transition-colors duration-300">
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

        {/* View All */}
        <div className="blog-view-all text-center mt-10">
          <a
            href="/blogs"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-gold-dark text-gold-contrast text-sm tracking-wider uppercase rounded-sm hover:bg-gold-contrast hover:text-cream transition-all duration-500 group"
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
