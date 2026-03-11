"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CITIES } from "@/lib/constants";
import { MapPin } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function CityShowcase() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".city-head > *",
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
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".city-card-top",
        { opacity: 0, y: 60, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".city-grid",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".city-card-bottom",
        { opacity: 0, y: 50, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".city-grid-bottom",
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".city-accent-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.6,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const primaryCities = CITIES.slice(0, 3);
  const secondaryCities = CITIES.slice(3);

  return (
    <section
      ref={sectionRef}
      className="relative bg-cream py-14 md:py-20 overflow-hidden"
    >
      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Header */}
        <div className="city-head text-center mb-10 md:mb-14">
          <span
            className="text-gold-contrast text-sm tracking-[0.3em] uppercase block mb-3"
            style={{ fontFamily: "var(--font-mono-custom)" }}
          >
            Our Presence
          </span>
          <h2
            className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 leading-tight"
            style={{ fontFamily: "var(--font-display-custom)" }}
          >
            <span className="text-navy mr-[0.25em]">ACROSS</span>
            <span className="text-gold-contrast">5 CITIES</span>
          </h2>
          <div className="city-accent-line w-16 h-px bg-gold/40 mx-auto origin-center" />
        </div>

        {/* Primary Cities - 3 columns */}
        <div className="city-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-4 md:mb-5">
          {primaryCities.map((city, i) => (
            <div
              key={city.name}
              className="city-card-top group relative overflow-hidden rounded-sm cursor-pointer"
              style={{ aspectRatio: "4 / 5" }}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ backgroundImage: `url(${city.image})` }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-navy/90 via-navy/30 to-transparent" />

              {/* Corner accents */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-gold/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-gold/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-gold/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-gold/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                {/* City number */}
                <span
                  className="text-[10px] tracking-[0.4em] uppercase text-white/30 block mb-2"
                  style={{ fontFamily: "var(--font-mono-custom)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* City name */}
                <h3
                  className="text-xl md:text-2xl font-bold text-white tracking-wide uppercase mb-2"
                  style={{ fontFamily: "var(--font-display-custom)" }}
                >
                  {city.name}
                </h3>

                {/* Description */}
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-gold/70 shrink-0" />
                  <span
                    className="text-xs tracking-[0.15em] uppercase text-white/50"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {city.description}
                  </span>
                </div>

                {/* Gold line on hover */}
                <div className="mt-3 h-px w-0 group-hover:w-full bg-gold/50 transition-all duration-500 ease-out" />
              </div>
            </div>
          ))}
        </div>

        {/* Secondary Cities - 2 columns */}
        <div className="city-grid-bottom grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          {secondaryCities.map((city, i) => (
            <div
              key={city.name}
              className="city-card-bottom group relative overflow-hidden rounded-sm cursor-pointer"
              style={{ aspectRatio: "16 / 9" }}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ backgroundImage: `url(${city.image})` }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-navy/90 via-navy/30 to-transparent" />

              {/* Corner accents */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-gold/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-gold/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-gold/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-gold/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                {/* City number */}
                <span
                  className="text-[10px] tracking-[0.4em] uppercase text-white/30 block mb-2"
                  style={{ fontFamily: "var(--font-mono-custom)" }}
                >
                  {String(i + 4).padStart(2, "0")}
                </span>

                {/* City name */}
                <h3
                  className="text-xl md:text-2xl font-bold text-white tracking-wide uppercase mb-2"
                  style={{ fontFamily: "var(--font-display-custom)" }}
                >
                  {city.name}
                </h3>

                {/* Description */}
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-gold/70 shrink-0" />
                  <span
                    className="text-xs tracking-[0.15em] uppercase text-white/50"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {city.description}
                  </span>
                </div>

                {/* Gold line on hover */}
                <div className="mt-3 h-px w-0 group-hover:w-full bg-gold/50 transition-all duration-500 ease-out" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gold line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold/20 to-transparent" />
    </section>
  );
}
