"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CITIES } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

interface CitySlide {
  city: (typeof CITIES)[number];
  back: {
    top: string;
    left: string;
    width: string;
    height: string;
    rotate: number;
  };
  front: {
    top: string;
    left: string;
    width: string;
    height: string;
    rotate: number;
  };
}

/* Images kept well inside the viewport — no overflow */
const SLIDES: CitySlide[] = [
  {
    city: CITIES[0], // Hyderabad
    back: { top: "10%", left: "50%", width: "22vw", height: "28vw", rotate: 8 },
    front: { top: "40%", left: "14%", width: "17vw", height: "22vw", rotate: -7 },
  },
  {
    city: CITIES[1], // Bangalore
    back: { top: "12%", left: "12%", width: "20vw", height: "26vw", rotate: -6 },
    front: { top: "38%", left: "52%", width: "19vw", height: "24vw", rotate: 10 },
  },
  {
    city: CITIES[2], // Chennai
    back: { top: "10%", left: "52%", width: "22vw", height: "26vw", rotate: 10 },
    front: { top: "42%", left: "10%", width: "16vw", height: "20vw", rotate: -9 },
  },
  {
    city: CITIES[3], // Vijayawada
    back: { top: "14%", left: "10%", width: "18vw", height: "24vw", rotate: -8 },
    front: { top: "36%", left: "54%", width: "21vw", height: "26vw", rotate: 6 },
  },
  {
    city: CITIES[4], // Nellore
    back: { top: "10%", left: "48%", width: "20vw", height: "26vw", rotate: 7 },
    front: { top: "42%", left: "16%", width: "18vw", height: "22vw", rotate: -7 },
  },
];

export default function CityShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const line = lineRef.current;
    if (!section || !line) return;

    const ctx = gsap.context(() => {
      const slides = section.querySelectorAll<HTMLElement>(".city-slide");
      const totalSlides = slides.length;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 0.8,
          start: "top top",
          end: `+=${totalSlides * 100}%`,
          anticipatePin: 1,
        },
      });

      /* line extends across the full scroll */
      tl.fromTo(
        line,
        { scaleX: 0 },
        { scaleX: 1, ease: "none", duration: totalSlides },
        0
      );

      slides.forEach((slide, i) => {
        const cityText = slide.querySelector(".city-name-text");
        const backImg = slide.querySelector(".img-back");
        const frontImg = slide.querySelector(".img-front");
        const desc = slide.querySelector(".city-desc");

        if (i === 0) {
          tl.fromTo(
            slide,
            { xPercent: 30, opacity: 0 },
            { xPercent: 0, opacity: 1, ease: "power2.out", duration: 0.3 },
            0
          );
          tl.fromTo(
            backImg,
            { scale: 0.8, rotateY: -15, opacity: 0 },
            { scale: 1, rotateY: 0, opacity: 1, ease: "power2.out", duration: 0.4 },
            0
          );
          tl.fromTo(
            frontImg,
            { scale: 0.7, rotateY: 20, opacity: 0 },
            { scale: 1, rotateY: 0, opacity: 1, ease: "power2.out", duration: 0.5 },
            0.05
          );
          tl.fromTo(
            cityText,
            { x: 60, opacity: 0 },
            { x: 0, opacity: 1, ease: "power2.out", duration: 0.4 },
            0.05
          );
          tl.fromTo(
            desc,
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, ease: "power2.out", duration: 0.3 },
            0.15
          );

          tl.to(
            slide,
            { xPercent: -110, ease: "power2.inOut", duration: 0.8 },
            0.7
          );
          tl.to(
            backImg,
            { rotateY: 15, scale: 0.9, ease: "power2.in", duration: 0.6 },
            0.7
          );
          tl.to(
            frontImg,
            { rotateY: -20, scale: 0.85, ease: "power2.in", duration: 0.6 },
            0.7
          );
        } else {
          const enterTime = i * 1;
          const holdEnd = enterTime + 0.7;

          tl.fromTo(
            slide,
            { xPercent: 110, opacity: 1 },
            { xPercent: 0, ease: "power2.out", duration: 0.8 },
            enterTime
          );
          tl.fromTo(
            backImg,
            { scale: 0.75, rotateY: -20, opacity: 0 },
            { scale: 1, rotateY: 0, opacity: 1, ease: "power2.out", duration: 0.7 },
            enterTime + 0.1
          );
          tl.fromTo(
            frontImg,
            { scale: 0.65, rotateY: 25, opacity: 0 },
            { scale: 1, rotateY: 0, opacity: 1, ease: "power2.out", duration: 0.8 },
            enterTime + 0.15
          );
          tl.fromTo(
            cityText,
            { x: 80, opacity: 0 },
            { x: 0, opacity: 1, ease: "power2.out", duration: 0.6 },
            enterTime + 0.1
          );
          tl.fromTo(
            desc,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, ease: "power2.out", duration: 0.4 },
            enterTime + 0.25
          );

          if (i < totalSlides - 1) {
            tl.to(
              slide,
              { xPercent: -110, ease: "power2.inOut", duration: 0.8 },
              holdEnd
            );
            tl.to(
              backImg,
              { rotateY: 15, scale: 0.9, ease: "power2.in", duration: 0.6 },
              holdEnd
            );
            tl.to(
              frontImg,
              { rotateY: -20, scale: 0.85, ease: "power2.in", duration: 0.6 },
              holdEnd
            );
          }
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-cream"
    >
      {/* ── Horizontal line at ~58% — navy/dark color ── */}
      <div
        className="absolute left-0 w-full pointer-events-none z-[6]"
        style={{ top: "58%" }}
      >
        <div
          ref={lineRef}
          className="h-[1px] w-full origin-left"
          style={{
            background:
              "linear-gradient(90deg, transparent 2%, #0D1A2630 10%, #0D1A2630 90%, transparent 98%)",
          }}
        />
      </div>

      {/* ── City slides ── */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.city.name}
          className="city-slide absolute inset-0"
          style={{
            perspective: "1200px",
            opacity: i === 0 ? 1 : 0,
          }}
        >
          {/* BACK image — behind the text (z-[3]) */}
          <div
            className="img-back absolute"
            style={{
              top: slide.back.top,
              left: slide.back.left,
              width: slide.back.width,
              height: slide.back.height,
              maxWidth: "calc(100vw - 80px)",
              transform: `rotate(${slide.back.rotate}deg)`,
              transformStyle: "preserve-3d",
              zIndex: 3,
            }}
          >
            <div
              className="w-full h-full rounded-sm overflow-hidden"
              style={{
                boxShadow:
                  "0 14px 45px rgba(0,0,0,0.14), 0 3px 14px rgba(0,0,0,0.08)",
                border: "5px solid rgba(255,255,255,0.85)",
              }}
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${slide.city.image})`,
                  filter: "grayscale(0.85) contrast(1.08)",
                }}
              />
            </div>
          </div>

          {/* CITY NAME — center, dark navy color (z-[5]) */}
          <div
            className="city-name-text absolute inset-0 flex items-center justify-center pointer-events-none select-none"
            style={{ zIndex: 5 }}
          >
            <h2
              className="text-[13vw] md:text-[12vw] leading-none font-bold tracking-[0.06em] uppercase whitespace-nowrap"
              style={{
                fontFamily: "var(--font-display-custom)",
                color: "#C4A44D",
              }}
            >
              {slide.city.name}
            </h2>
          </div>

          {/* FRONT image — in front of the text (z-[8]) */}
          <div
            className="img-front absolute"
            style={{
              top: slide.front.top,
              left: slide.front.left,
              width: slide.front.width,
              height: slide.front.height,
              maxWidth: "calc(100vw - 80px)",
              transform: `rotate(${slide.front.rotate}deg)`,
              transformStyle: "preserve-3d",
              zIndex: 8,
            }}
          >
            <div
              className="w-full h-full rounded-sm overflow-hidden"
              style={{
                boxShadow:
                  "0 18px 55px rgba(0,0,0,0.18), 0 5px 18px rgba(0,0,0,0.1)",
                border: "5px solid rgba(255,255,255,0.85)",
              }}
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${slide.city.image})`,
                  filter: "grayscale(0.85) contrast(1.08)",
                }}
              />
            </div>
          </div>

          {/* City description — bottom right */}
          <div
            className="city-desc absolute text-right"
            style={{
              bottom: "8%",
              right: "6%",
              zIndex: 10,
            }}
          >
            <span
              className="text-[10px] tracking-[0.4em] uppercase block mb-1"
              style={{
                fontFamily: "var(--font-mono-custom)",
                color: "#0D1A2650",
              }}
            >
              {String(i + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
            </span>
            <span
              className="text-xs md:text-sm tracking-[0.25em] uppercase block"
              style={{
                fontFamily: "var(--font-display-custom)",
                color: "#0D1A2670",
              }}
            >
              {slide.city.description}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
}
