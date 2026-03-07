"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CITIES } from "@/lib/constants";
import { MapPin } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function CityShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      // Section label animation
      gsap.from(".city-section-label", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
        },
      });

      // Horizontal scroll pinning
      const totalWidth = track.scrollWidth - window.innerWidth;

      const scrollTween = gsap.to(track, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          end: `+=${totalWidth}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      // Parallax on each city image — use the scrollTween as containerAnimation
      const cards = track.querySelectorAll(".city-card-img");
      cards.forEach((img) => {
        const card = img.closest(".city-card");
        if (!card) return;
        gsap.to(img, {
          x: -50,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            containerAnimation: scrollTween,
            start: "left right",
            end: "right left",
            scrub: true,
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-clip bg-surface-primary">
      {/* Header */}
      <div className="city-section-label absolute top-8 left-4 md:left-8 z-20 opacity-0">
        <span
          className="text-gold/60 text-xs tracking-[0.3em] uppercase block mb-2"
          style={{ fontFamily: "var(--font-mono-custom)" }}
        >
          Our Presence
        </span>
        <h2
          className="text-2xl md:text-4xl font-bold text-white tracking-tight"
          style={{ fontFamily: "var(--font-display-custom)" }}
        >
          Across <span className="text-gold">5 Cities</span>
        </h2>
      </div>

      {/* Horizontal Track */}
      <div ref={trackRef} className="flex h-screen will-change-transform">
        {CITIES.map((city, i) => (
          <div
            key={city.name}
            className="city-card relative flex-shrink-0 w-screen h-screen overflow-hidden group cursor-pointer"
          >
            {/* Image */}
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="city-card-img absolute inset-0 bg-cover bg-center scale-110 transition-transform duration-[2s] group-hover:scale-100"
                style={{ backgroundImage: `url(${city.image})` }}
              />
            </div>

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 z-10" />
            <div className="absolute inset-0 bg-gold/[0.03] z-10" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 z-20">
              {/* City number */}
              <span
                className="text-gold/30 text-6xl md:text-8xl font-bold block mb-2"
                style={{ fontFamily: "var(--font-display-custom)" }}
              >
                0{i + 1}
              </span>

              {/* City name */}
              <h3
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-2 tracking-tight"
                style={{ fontFamily: "var(--font-display-custom)" }}
              >
                {city.name}
              </h3>

              {/* Description */}
              <p className="text-white/50 text-sm md:text-base flex items-center gap-2 mb-6">
                <MapPin size={14} className="text-gold/60" />
                {city.description}
              </p>

              {/* Gold line */}
              <div className="w-16 h-[1px] bg-gold/40" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
