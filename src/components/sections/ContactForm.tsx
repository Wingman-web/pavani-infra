"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CONTACT_INFO } from "@/lib/constants";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  ChevronDown,
  ArrowUpRight,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   Art Deco Gateway Arch — signature decoration
   Draws itself on scroll like a golden portal
   ───────────────────────────────────────────── */
const ArtDecoGateway = () => (
  <svg
    viewBox="0 0 800 260"
    fill="none"
    className="contact-gateway w-[500px] md:w-[700px] lg:w-[800px] mx-auto"
    style={{ overflow: "visible" }}
  >
    {/* Outer arch */}
    <path
      className="contact-arch-outer"
      d="M60,260 L60,80 Q60,15 140,15 L660,15 Q740,15 740,80 L740,260"
      stroke="rgba(223,192,99,0.2)"
      strokeWidth="1.5"
      fill="none"
      strokeDasharray="1800"
      strokeDashoffset="1800"
    />
    {/* Inner arch */}
    <path
      className="contact-arch-inner"
      d="M120,260 L120,100 Q120,45 190,45 L610,45 Q680,45 680,100 L680,260"
      stroke="rgba(223,192,99,0.12)"
      strokeWidth="1"
      fill="none"
      strokeDasharray="1500"
      strokeDashoffset="1500"
    />
    {/* Keystone diamond */}
    <rect
      className="contact-keystone"
      x="392"
      y="2"
      width="16"
      height="16"
      transform="rotate(45 400 10)"
      fill="rgba(223,192,99,0.3)"
      opacity="0"
    />
    {/* Decorative horizontal lines */}
    <line
      className="contact-arch-line"
      x1="180"
      y1="30"
      x2="340"
      y2="30"
      stroke="rgba(223,192,99,0.15)"
      strokeWidth="1"
      strokeDasharray="160"
      strokeDashoffset="160"
    />
    <line
      className="contact-arch-line"
      x1="460"
      y1="30"
      x2="620"
      y2="30"
      stroke="rgba(223,192,99,0.15)"
      strokeWidth="1"
      strokeDasharray="160"
      strokeDashoffset="160"
    />
    {/* Vertical accent lines at arch base */}
    <line
      className="contact-arch-vert"
      x1="60"
      y1="200"
      x2="60"
      y2="260"
      stroke="rgba(223,192,99,0.1)"
      strokeWidth="2"
      strokeDasharray="60"
      strokeDashoffset="60"
    />
    <line
      className="contact-arch-vert"
      x1="740"
      y1="200"
      x2="740"
      y2="260"
      stroke="rgba(223,192,99,0.1)"
      strokeWidth="2"
      strokeDasharray="60"
      strokeDashoffset="60"
    />
  </svg>
);

/* ─────────────────────────────────────────────
   Art Deco Ornamental Divider
   ───────────────────────────────────────────── */
const ArtDecoDivider = () => (
  <div className="contact-divider flex items-center justify-center gap-4 my-10 md:my-14">
    <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-gold/30" />
    <div className="flex items-center gap-2">
      <div className="w-1 h-1 bg-gold/40 rotate-45" />
      <div className="w-1.5 h-1.5 bg-gold/60 rotate-45" />
      <div className="w-1 h-1 bg-gold/40 rotate-45" />
    </div>
    <div className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-gold/30" />
  </div>
);

/* ─────────────────────────────────────────────
   Golden Particle — ambient floating element
   ───────────────────────────────────────────── */
const PARTICLES = [
  { top: "8%", left: "12%", size: 3, delay: 0, opacity: 0.25, speed: 1.2 },
  { top: "15%", right: "8%", size: 4, delay: 0.5, opacity: 0.2, speed: 1.5 },
  { top: "25%", left: "6%", size: 2, delay: 1, opacity: 0.3, speed: 1 },
  { top: "35%", right: "15%", size: 3, delay: 1.5, opacity: 0.15, speed: 1.8 },
  { top: "50%", left: "20%", size: 5, delay: 0.3, opacity: 0.1, speed: 2 },
  { top: "60%", right: "5%", size: 2, delay: 0.8, opacity: 0.25, speed: 1.3 },
  { top: "70%", left: "3%", size: 3, delay: 1.2, opacity: 0.2, speed: 1.6 },
  { top: "80%", right: "12%", size: 4, delay: 0.6, opacity: 0.15, speed: 1.1 },
  { top: "45%", left: "45%", size: 2, delay: 1.8, opacity: 0.12, speed: 2.2 },
  { top: "20%", left: "35%", size: 3, delay: 0.2, opacity: 0.18, speed: 1.4 },
  { top: "90%", left: "25%", size: 2, delay: 1.1, opacity: 0.2, speed: 1.7 },
  { top: "75%", right: "30%", size: 3, delay: 0.9, opacity: 0.15, speed: 1.9 },
];

export default function ContactForm() {
  const sectionRef = useRef<HTMLElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    message: "",
  });

  /* 3D Mouse-Tracking Tilt — form card follows cursor in 3D space */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = formCardRef.current;
      if (!card || window.innerWidth < 1024) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {
        rotateY: x * 5,
        rotateX: y * -5,
        duration: 0.5,
        ease: "power2.out",
      });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    const card = formCardRef.current;
    if (!card) return;
    gsap.to(card, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.5)",
    });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      /* ── 1. Art Deco Gateway Arch draws on scroll ── */
      gsap.to(".contact-arch-outer", {
        strokeDashoffset: 0,
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          end: "top 25%",
          scrub: 1,
        },
      });
      gsap.to(".contact-arch-inner", {
        strokeDashoffset: 0,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "top 20%",
          scrub: 1.2,
        },
      });
      gsap.to(".contact-arch-line", {
        strokeDashoffset: 0,
        stagger: 0.1,
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          end: "top 35%",
          scrub: 1,
        },
      });
      gsap.to(".contact-arch-vert", {
        strokeDashoffset: 0,
        stagger: 0.05,
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          end: "top 40%",
          scrub: 0.8,
        },
      });
      gsap.to(".contact-keystone", {
        opacity: 1,
        scale: 1.2,
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
          end: "top 35%",
          scrub: 0.6,
        },
      });

      /* ── 2. Golden particles parallax ── */
      gsap.utils.toArray<HTMLElement>(".contact-particle").forEach((p, i) => {
        const speed = 0.8 + (i % 4) * 0.4;
        const direction = i % 2 === 0 ? -1 : 1;
        gsap.to(p, {
          y: -80 * speed,
          x: direction * 20 * speed,
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1 + (i % 3) * 0.5,
          },
        });
      });

      /* ── 3. Section header — per-word 3D reveal ── */
      gsap.fromTo(
        ".contact-label",
        { opacity: 0, y: 30, letterSpacing: "0.6em" },
        {
          opacity: 1,
          y: 0,
          letterSpacing: "0.3em",
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            end: "top 60%",
            scrub: 0.5,
          },
        }
      );

      gsap.fromTo(
        ".contact-title-word",
        { opacity: 0, y: 60, rotateX: -35, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            end: "top 48%",
            scrub: 0.7,
          },
        }
      );

      /* Gold accent line expands */
      gsap.fromTo(
        ".contact-accent-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.6,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: section,
            start: "top 65%",
            end: "top 45%",
            scrub: 0.6,
          },
        }
      );

      /* ── 4. Art Deco divider fades in ── */
      gsap.fromTo(
        ".contact-divider",
        { opacity: 0, scaleX: 0 },
        {
          opacity: 1,
          scaleX: 1,
          duration: 0.5,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: ".contact-divider",
            start: "top 85%",
            end: "top 65%",
            scrub: 0.5,
          },
        }
      );

      /* ── 5. Timeline connector line grows ── */
      gsap.fromTo(
        ".contact-timeline",
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: ".contact-info-area",
            start: "top 75%",
            end: "bottom 50%",
            scrub: 0.8,
          },
        }
      );

      /* Timeline diamond nodes pop in */
      gsap.fromTo(
        ".contact-timeline-node",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.15,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: ".contact-info-area",
            start: "top 70%",
            end: "bottom 55%",
            scrub: 0.6,
          },
        }
      );

      /* ── 6. Contact info cards slide in ── */
      gsap.fromTo(
        ".contact-info-card",
        { opacity: 0, x: -60, rotateY: 12, filter: "blur(4px)" },
        {
          opacity: 1,
          x: 0,
          rotateY: 0,
          filter: "blur(0px)",
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".contact-info-area",
            start: "top 80%",
            end: "top 40%",
            scrub: 0.7,
          },
        }
      );

      /* ── 7. Form panel rises with 3D perspective ── */
      gsap.fromTo(
        ".contact-form-wrapper",
        { opacity: 0, y: 80, rotateX: 6, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".contact-form-wrapper",
            start: "top 90%",
            end: "top 45%",
            scrub: 0.8,
          },
        }
      );

      /* ── 8. Form fields cascade diagonally ── */
      gsap.fromTo(
        ".contact-field",
        { opacity: 0, y: 25, x: 30 },
        {
          opacity: 1,
          y: 0,
          x: 0,
          duration: 0.4,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".contact-form-wrapper",
            start: "top 70%",
            end: "top 25%",
            scrub: 0.6,
          },
        }
      );

      /* ── 9. Closing statement cinematic fade ── */
      gsap.fromTo(
        ".contact-closing-word",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".contact-closing",
            start: "top 90%",
            end: "top 65%",
            scrub: 0.6,
          },
        }
      );

      /* ── 10. Art Deco corner ornaments scale in ── */
      gsap.fromTo(
        ".contact-deco-corner",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.08,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: ".contact-grid",
            start: "top 80%",
            end: "top 50%",
            scrub: 0.5,
          },
        }
      );

      /* ── 11. Ambient glow pulses ── */
      gsap.to(".contact-ambient-glow", {
        opacity: 0.06,
        scale: 1.1,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const titleWords = ["Begin", "Your"];
  const titleGoldWords = ["Dream", "Together"];
  const closingWords =
    "Your new chapter begins with a single conversation".split(" ");

  return (
    <section
      ref={sectionRef}
      className="relative py-28 md:py-40 overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      {/* ═══ Background Layers ═══ */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #060606 0%, #0A0908 40%, #080807 70%, #070707 100%)",
        }}
      />

      {/* Subtle architectural grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]">
        <div className="absolute top-0 left-[15%] w-px h-full bg-gold" />
        <div className="absolute top-0 left-[50%] w-px h-full bg-gold" />
        <div className="absolute top-0 left-[85%] w-px h-full bg-gold" />
      </div>

      {/* Ambient golden glow */}
      <div className="contact-ambient-glow absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[700px] h-[500px] bg-gold/[0.04] blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-gold/[0.02] blur-[120px] rounded-full pointer-events-none" />

      {/* Golden Floating Particles */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="contact-particle absolute rounded-full pointer-events-none"
          style={{
            top: p.top,
            left: p.left,
            right: (p as { right?: string }).right,
            width: p.size,
            height: p.size,
            background: `rgba(223, 192, 99, ${p.opacity})`,
            boxShadow: `0 0 ${p.size * 3}px rgba(223, 192, 99, ${p.opacity * 0.5})`,
            animation: `float ${3 + p.speed}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* ═══ Art Deco Gateway Arch ═══ */}
      <div className="relative z-10 flex justify-center mb-6 md:mb-10 pointer-events-none">
        <ArtDecoGateway />
      </div>

      {/* ═══ Content Layer ═══ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header — dramatic per-word reveal */}
        <div
          className="text-center mb-4 md:mb-6 relative"
          style={{ perspective: "800px" }}
        >
          <span
            className="contact-label text-gold/60 text-[10px] md:text-xs tracking-[0.3em] uppercase block mb-5"
            style={{ fontFamily: "var(--font-mono-custom)" }}
          >
            The Next Step
          </span>
          <h2
            className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-5"
            style={{
              fontFamily: "var(--font-display-custom)",
              transformStyle: "preserve-3d",
            }}
          >
            {titleWords.map((word, i) => (
              <span
                key={i}
                className="contact-title-word inline-block text-white mr-[0.3em]"
                style={{ transformStyle: "preserve-3d" }}
              >
                {word}
              </span>
            ))}
            <br className="hidden sm:block" />
            {titleGoldWords.map((word, i) => (
              <span
                key={i}
                className="contact-title-word inline-block text-gold mr-[0.3em]"
                style={{ transformStyle: "preserve-3d" }}
              >
                {word}
              </span>
            ))}
          </h2>
          <div className="contact-accent-line w-24 h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent mx-auto origin-center" />
        </div>

        {/* Art Deco Ornamental Divider */}
        <ArtDecoDivider />

        {/* ═══ Main Grid — contact info + 3D form ═══ */}
        <div className="contact-grid relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-0">
          {/* Art Deco corner ornaments */}
          <div className="contact-deco-corner absolute -top-4 -left-4 w-8 h-8 border-t border-l border-gold/20 hidden lg:block" />
          <div className="contact-deco-corner absolute -top-4 -right-4 w-8 h-8 border-t border-r border-gold/20 hidden lg:block" />
          <div className="contact-deco-corner absolute -bottom-4 -left-4 w-8 h-8 border-b border-l border-gold/20 hidden lg:block" />
          <div className="contact-deco-corner absolute -bottom-4 -right-4 w-8 h-8 border-b border-r border-gold/20 hidden lg:block" />

          {/* ── Left: Contact Info with Timeline ── */}
          <div
            className="contact-info-area lg:col-span-5 relative lg:pr-12"
            style={{ perspective: "600px" }}
          >
            {/* Timeline connector */}
            <div className="contact-timeline hidden lg:block absolute left-0 top-[60px] bottom-[20px] w-px bg-gradient-to-b from-gold/30 via-gold/15 to-transparent origin-top" />

            {/* Description */}
            <p className="contact-info-card text-white/50 text-base leading-relaxed max-w-md mb-8 lg:pl-8">
              Your dream home awaits. Reach out and let&apos;s craft something
              extraordinary together.
            </p>

            {/* Phone */}
            <div className="relative lg:pl-8 mb-5">
              <div className="contact-timeline-node hidden lg:flex absolute -left-[5px] top-1/2 -translate-y-1/2 w-[11px] h-[11px] items-center justify-center">
                <div className="w-2 h-2 bg-gold/50 rotate-45" />
              </div>
              <a
                href={`tel:${CONTACT_INFO.phone}`}
                className="contact-info-card group flex items-center gap-5 p-5 rounded-xl bg-gradient-to-r from-white/[0.04] to-transparent hover:from-gold/[0.08] hover:to-gold/[0.02] border-l-2 border-gold/20 hover:border-gold/60 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_0%_50%,rgba(223,192,99,0.08)_0%,transparent_70%)]" />
                <div className="relative w-13 h-13 rounded-xl bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 group-hover:shadow-[0_0_30px_rgba(223,192,99,0.2)] transition-all duration-500 shrink-0">
                  <Phone size={18} className="text-gold" />
                </div>
                <div className="relative flex-1">
                  <p
                    className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-1"
                    style={{ fontFamily: "var(--font-mono-custom)" }}
                  >
                    Call Us
                  </p>
                  <p className="text-white/80 group-hover:text-gold transition-colors text-base font-medium">
                    {CONTACT_INFO.phone}
                  </p>
                </div>
                <ArrowUpRight
                  size={16}
                  className="relative text-white/15 group-hover:text-gold/60 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300"
                />
              </a>
            </div>

            {/* Email */}
            <div className="relative lg:pl-8 mb-5">
              <div className="contact-timeline-node hidden lg:flex absolute -left-[5px] top-1/2 -translate-y-1/2 w-[11px] h-[11px] items-center justify-center">
                <div className="w-2 h-2 bg-gold/50 rotate-45" />
              </div>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="contact-info-card group flex items-center gap-5 p-5 rounded-xl bg-gradient-to-r from-white/[0.04] to-transparent hover:from-gold/[0.08] hover:to-gold/[0.02] border-l-2 border-gold/20 hover:border-gold/60 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_0%_50%,rgba(223,192,99,0.08)_0%,transparent_70%)]" />
                <div className="relative w-13 h-13 rounded-xl bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 group-hover:shadow-[0_0_30px_rgba(223,192,99,0.2)] transition-all duration-500 shrink-0">
                  <Mail size={18} className="text-gold" />
                </div>
                <div className="relative flex-1">
                  <p
                    className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-1"
                    style={{ fontFamily: "var(--font-mono-custom)" }}
                  >
                    Email Us
                  </p>
                  <p className="text-white/80 group-hover:text-gold transition-colors text-[15px] font-medium">
                    {CONTACT_INFO.email}
                  </p>
                </div>
                <ArrowUpRight
                  size={16}
                  className="relative text-white/15 group-hover:text-gold/60 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300"
                />
              </a>
            </div>

            {/* Address */}
            <div className="relative lg:pl-8">
              <div className="contact-timeline-node hidden lg:flex absolute -left-[5px] top-8 w-[11px] h-[11px] items-center justify-center">
                <div className="w-2 h-2 bg-gold/50 rotate-45" />
              </div>
              <div className="contact-info-card group flex items-start gap-5 p-5 rounded-xl bg-gradient-to-r from-white/[0.04] to-transparent border-l-2 border-gold/20 relative overflow-hidden">
                <div className="relative w-13 h-13 rounded-xl bg-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={18} className="text-gold" />
                </div>
                <div className="relative">
                  <p
                    className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-3"
                    style={{ fontFamily: "var(--font-mono-custom)" }}
                  >
                    Visit Us
                  </p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gold/60 text-[10px] tracking-wider uppercase mb-0.5">
                        Hyderabad
                      </p>
                      <p className="text-white/60 text-sm leading-relaxed">
                        {CONTACT_INFO.offices.hyderabad}
                      </p>
                    </div>
                    <div>
                      <p className="text-gold/60 text-[10px] tracking-wider uppercase mb-0.5">
                        Bangalore
                      </p>
                      <p className="text-white/60 text-sm leading-relaxed">
                        {CONTACT_INFO.offices.bangalore}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: 3D Mouse-Tracking Form ── */}
          <div
            className="contact-form-wrapper lg:col-span-7 lg:-ml-4 relative"
            style={{ perspective: "1200px" }}
          >
            {/* Soft glow behind form */}
            <div className="absolute -inset-8 bg-gold/[0.03] blur-[60px] rounded-3xl pointer-events-none" />

            <div
              ref={formCardRef}
              className="relative will-change-transform"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ transformStyle: "preserve-3d" }}
            >
              <form
                onSubmit={handleSubmit}
                className="relative rounded-2xl overflow-hidden"
              >
                {/* Multi-layer glassmorphism */}
                <div className="absolute inset-0 bg-white/[0.04] backdrop-blur-2xl" />
                <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.04] via-transparent to-gold/[0.02]" />
                <div className="absolute inset-0 border border-white/[0.08] rounded-2xl" />

                {/* Animated shimmer accent line at top */}
                <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden">
                  <div
                    className="w-[200%] h-full bg-gradient-to-r from-transparent via-gold/60 to-transparent"
                    style={{ animation: "shimmer 3s infinite linear" }}
                  />
                </div>

                {/* Art Deco corner details on form */}
                <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-gold/15 rounded-tl pointer-events-none" />
                <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-gold/15 rounded-tr pointer-events-none" />
                <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-gold/15 rounded-bl pointer-events-none" />
                <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-gold/15 rounded-br pointer-events-none" />

                <div className="relative p-8 md:p-10 lg:p-12 space-y-6">
                  {/* Form header */}
                  <div className="contact-field mb-2">
                    <h3
                      className="text-white/90 text-lg font-semibold tracking-wide mb-1"
                      style={{ fontFamily: "var(--font-display-custom)" }}
                    >
                      Send Us A Message
                    </h3>
                    <p className="text-white/40 text-sm">
                      We&apos;ll get back to you within 24 hours.
                    </p>
                  </div>

                  {/* Name */}
                  <div className="contact-field">
                    <label
                      className="text-gold/50 text-[10px] tracking-[0.2em] uppercase block mb-2"
                      style={{ fontFamily: "var(--font-mono-custom)" }}
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full bg-transparent border-b border-white/10 pb-3 text-white text-base placeholder:text-white/20 outline-none focus:border-gold/50 transition-colors duration-500"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* Email + Phone */}
                  <div className="contact-field grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        className="text-gold/50 text-[10px] tracking-[0.2em] uppercase block mb-2"
                        style={{ fontFamily: "var(--font-mono-custom)" }}
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        className="w-full bg-transparent border-b border-white/10 pb-3 text-white text-base placeholder:text-white/20 outline-none focus:border-gold/50 transition-colors duration-500"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label
                        className="text-gold/50 text-[10px] tracking-[0.2em] uppercase block mb-2"
                        style={{ fontFamily: "var(--font-mono-custom)" }}
                      >
                        Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        className="w-full bg-transparent border-b border-white/10 pb-3 text-white text-base placeholder:text-white/20 outline-none focus:border-gold/50 transition-colors duration-500"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  {/* City */}
                  <div className="contact-field relative">
                    <label
                      className="text-gold/50 text-[10px] tracking-[0.2em] uppercase block mb-2"
                      style={{ fontFamily: "var(--font-mono-custom)" }}
                    >
                      Preferred City
                    </label>
                    <select
                      className="w-full bg-transparent border-b border-white/10 pb-3 text-white text-base outline-none appearance-none pr-8 cursor-pointer focus:border-gold/50 transition-colors duration-500"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      required
                    >
                      <option
                        value=""
                        disabled
                        className="bg-surface-primary"
                      >
                        Select City
                      </option>
                      {[
                        "Hyderabad",
                        "Bangalore",
                        "Chennai",
                        "Vijayawada",
                        "Nellore",
                      ].map((city) => (
                        <option
                          key={city}
                          value={city}
                          className="bg-surface-primary text-white"
                        >
                          {city}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-0 bottom-3 text-white/20 pointer-events-none"
                    />
                  </div>

                  {/* Message */}
                  <div className="contact-field">
                    <label
                      className="text-gold/50 text-[10px] tracking-[0.2em] uppercase block mb-2"
                      style={{ fontFamily: "var(--font-mono-custom)" }}
                    >
                      Message
                    </label>
                    <textarea
                      placeholder="Tell us about your dream home..."
                      rows={3}
                      className="w-full bg-transparent border-b border-white/10 pb-3 text-white text-base placeholder:text-white/20 outline-none resize-none focus:border-gold/50 transition-colors duration-500"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                    />
                  </div>

                  {/* Submit */}
                  <div className="contact-field pt-4">
                    <button
                      type="submit"
                      className="group relative w-full py-4 overflow-hidden rounded-xl cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-gold via-gold-light to-gold" />
                      {/* Shimmer sweep */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%]" style={{ transition: "transform 0.8s ease, opacity 0.3s ease" }} />
                      {/* Gold glow on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_40px_rgba(223,192,99,0.3)]" />
                      <span className="relative z-10 flex items-center justify-center gap-2 text-surface-primary font-bold text-sm tracking-wider uppercase">
                        <Send
                          size={16}
                          className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
                        />
                        Submit Enquiry
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* ═══ Closing Cinematic Statement ═══ */}
        <div className="contact-closing text-center mt-20 md:mt-28">
          <div
            className="flex flex-wrap justify-center gap-x-[0.35em]"
            style={{
              fontFamily: "var(--font-display-custom)",
              perspective: "600px",
            }}
          >
            {closingWords.map((word, i) => (
              <span
                key={i}
                className="contact-closing-word text-white/20 text-sm md:text-base lg:text-lg italic tracking-wide"
              >
                {word}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="w-8 h-px bg-gold/20" />
            <div className="w-1.5 h-1.5 bg-gold/30 rotate-45" />
            <div className="w-8 h-px bg-gold/20" />
          </div>
        </div>
      </div>
    </section>
  );
}
