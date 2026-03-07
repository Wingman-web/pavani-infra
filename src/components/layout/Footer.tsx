"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CONTACT_INFO, NAV_LINKS } from "@/lib/constants";
import {
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  ArrowUp,
  Phone,
  Mail,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const SOCIAL_ICONS = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  linkedin: Linkedin,
};

/* ─────────────────────────────────────────────
   Art Deco Sunburst — radiating golden rays
   at the top of the footer, drawn on scroll
   ───────────────────────────────────────────── */
const ArtDecoSunburst = () => {
  const rayCount = 24;
  return (
    <div className="footer-sunburst absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] pointer-events-none overflow-hidden">
      <svg
        viewBox="0 0 600 300"
        fill="none"
        className="w-full h-full"
        style={{ overflow: "visible" }}
      >
        {Array.from({ length: rayCount }).map((_, i) => {
          const angle = -90 + (i * 180) / (rayCount - 1);
          const rad = (angle * Math.PI) / 180;
          const length = 280 + (i % 3) * 40;
          const x2 = 300 + Math.cos(rad) * length;
          const y2 = 300 + Math.sin(rad) * length;
          return (
            <line
              key={i}
              className="footer-ray"
              x1="300"
              y1="300"
              x2={x2}
              y2={y2}
              stroke="rgba(223,192,99,0.06)"
              strokeWidth={i % 3 === 0 ? "1.5" : "0.5"}
              opacity="0"
            />
          );
        })}
        {/* Concentric arcs */}
        <path
          className="footer-arc"
          d="M50,300 A250,250 0 0,1 550,300"
          stroke="rgba(223,192,99,0.08)"
          strokeWidth="1"
          fill="none"
          strokeDasharray="800"
          strokeDashoffset="800"
        />
        <path
          className="footer-arc"
          d="M120,300 A180,180 0 0,1 480,300"
          stroke="rgba(223,192,99,0.05)"
          strokeWidth="0.5"
          fill="none"
          strokeDasharray="600"
          strokeDashoffset="600"
        />
      </svg>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Art Deco Ornament — decorative element
   ───────────────────────────────────────────── */
const ArtDecoOrnament = () => (
  <svg
    viewBox="0 0 200 20"
    fill="none"
    className="footer-ornament w-32 md:w-40 mx-auto"
  >
    <line
      x1="0"
      y1="10"
      x2="70"
      y2="10"
      stroke="rgba(223,192,99,0.25)"
      strokeWidth="1"
    />
    <rect
      x="80"
      y="4"
      width="8"
      height="8"
      transform="rotate(45 84 8)"
      fill="rgba(223,192,99,0.3)"
    />
    <circle cx="100" cy="10" r="2" fill="rgba(223,192,99,0.4)" />
    <rect
      x="112"
      y="4"
      width="8"
      height="8"
      transform="rotate(45 116 8)"
      fill="rgba(223,192,99,0.3)"
    />
    <line
      x1="130"
      y1="10"
      x2="200"
      y2="10"
      stroke="rgba(223,192,99,0.25)"
      strokeWidth="1"
    />
  </svg>
);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const ctx = gsap.context(() => {
      /* ── 1. Sunburst rays fan out ── */
      gsap.fromTo(
        ".footer-ray",
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.3,
          stagger: {
            each: 0.03,
            from: "center",
          },
          ease: "power2.out",
          scrollTrigger: {
            trigger: footer,
            start: "top 90%",
            end: "top 50%",
            scrub: 0.8,
          },
        },
      );

      /* Sunburst arcs draw */
      gsap.to(".footer-arc", {
        strokeDashoffset: 0,
        stagger: 0.2,
        scrollTrigger: {
          trigger: footer,
          start: "top 85%",
          end: "top 40%",
          scrub: 1,
        },
      });

      /* ── 2. Art Deco frame lines expand ── */
      gsap.fromTo(
        ".footer-frame-h",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: footer,
            start: "top 80%",
            end: "top 50%",
            scrub: 0.6,
          },
        },
      );
      gsap.fromTo(
        ".footer-frame-v",
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: footer,
            start: "top 80%",
            end: "top 40%",
            scrub: 0.8,
          },
        },
      );

      /* ── 3. Closing statement per-word reveal ── */
      gsap.fromTo(
        ".footer-closing-word",
        { opacity: 0, y: 25, rotateX: -20 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.4,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".footer-closing",
            start: "top 90%",
            end: "top 65%",
            scrub: 0.6,
          },
        },
      );

      /* ── 5. Logo and back-to-top fade in ── */
      gsap.fromTo(
        ".footer-top-el",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footer,
            start: "top 80%",
            end: "top 55%",
            scrub: 0.6,
          },
        },
      );

      /* ── 6. Gold separator line with diamond ── */
      gsap.fromTo(
        ".footer-separator",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: ".footer-separator",
            start: "top 90%",
            end: "top 70%",
            scrub: 0.6,
          },
        },
      );

      /* ── 7. Content columns stagger in ── */
      gsap.fromTo(
        ".footer-col",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".footer-links-grid",
            start: "top 90%",
            end: "top 60%",
            scrub: 0.6,
          },
        },
      );

      /* ── 8. Social icons pop in with rotation ── */
      gsap.fromTo(
        ".footer-social-icon",
        { opacity: 0, scale: 0, rotation: -45 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: ".footer-socials",
            start: "top 95%",
            end: "top 75%",
            scrub: 0.5,
          },
        },
      );

      /* ── 9. Ornament fades in ── */
      gsap.fromTo(
        ".footer-ornament",
        { opacity: 0, scaleX: 0 },
        {
          opacity: 1,
          scaleX: 1,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: ".footer-ornament",
            start: "top 92%",
            end: "top 72%",
            scrub: 0.5,
          },
        },
      );

      /* ── 10. Office constellation dots pulse ── */
      gsap.to(".footer-office-dot", {
        boxShadow: "0 0 12px rgba(223,192,99,0.5)",
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        stagger: 0.4,
        ease: "sine.inOut",
      });

      /* ── 11. Bottom bar slides up ── */
      gsap.fromTo(
        ".footer-bottom",
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".footer-bottom",
            start: "top 98%",
            end: "top 85%",
            scrub: 0.4,
          },
        },
      );
    }, footer);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closingWords = "Where Dreams Find Their Address".split(" ");

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #060606 0%, #080808 30%, #0A0A0A 60%, #0C0C0C 100%)",
      }}
    >
      {/* ═══ Art Deco Sunburst ═══ */}
      <ArtDecoSunburst />

      {/* Top gold gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      {/* Art Deco frame lines — golden borders that expand */}
      <div className="footer-frame-h absolute top-0 left-[5%] right-[5%] h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent origin-center" />
      <div className="footer-frame-v absolute top-[10%] left-[5%] bottom-[10%] w-px bg-gradient-to-b from-transparent via-gold/10 to-transparent origin-top hidden xl:block" />
      <div className="footer-frame-v absolute top-[10%] right-[5%] bottom-[10%] w-px bg-gradient-to-b from-transparent via-gold/10 to-transparent origin-top hidden xl:block" />

      {/* Ambient warm glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gold/[0.025] blur-[180px] rounded-full pointer-events-none" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(223,192,99,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(223,192,99,0.5) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* ═══ Main Content ═══ */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 md:px-10 lg:px-14">
        {/* Top section: Logo + back to top */}
        <div className="flex items-center justify-between py-14 md:py-20">
          <div className="footer-top-el">
            <a href="/" className="inline-block mb-3">
              <img
                src="/logo5.svg"
                alt="Pavani Infra"
                className="h-14 sm:h-16 md:h-18 lg:h-20 w-auto"
              />
            </a>
            <p className="text-white/40 text-sm max-w-xs leading-relaxed">
              Premier Real Estate Developers crafting quality spaces since 1995.
            </p>
          </div>

          {/* Back to top — with animated golden arrow */}
          <button
            onClick={scrollToTop}
            className="footer-top-el group flex flex-col items-center gap-2"
            aria-label="Back to top"
          >
            <div className="relative w-11 h-11 rounded-full border border-white/15 flex items-center justify-center group-hover:border-gold/50 group-hover:bg-gold/10 group-hover:shadow-[0_0_25px_rgba(223,192,99,0.2)] transition-all duration-400">
              <ArrowUp
                size={16}
                className="text-white/40 group-hover:text-gold group-hover:-translate-y-0.5 transition-all duration-300"
              />
              {/* Pulsing ring on hover */}
              <div className="absolute inset-0 rounded-full border border-gold/0 group-hover:border-gold/20 group-hover:scale-150 group-hover:opacity-0 transition-all duration-700" />
            </div>
            <span
              className="text-white/25 text-[9px] tracking-[0.2em] uppercase group-hover:text-gold/50 transition-colors"
              style={{ fontFamily: "var(--font-mono-custom)" }}
            >
              Top
            </span>
          </button>
        </div>

        {/* Gold separator with diamond */}
        <div className="footer-separator relative h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent origin-center mb-10 md:mb-14">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#0A0A0A] flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-gold/50 rotate-45" />
          </div>
        </div>

        {/* ═══ Cinematic Closing Statement ═══ */}
        <div
          className="footer-closing text-center mb-14 md:mb-20"
          style={{ perspective: "800px" }}
        >
          <div className="flex flex-wrap justify-center gap-x-[0.35em]">
            {closingWords.map((word, i) => (
              <span
                key={i}
                className="footer-closing-word text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight"
                style={{
                  fontFamily: "var(--font-display-custom)",
                  transformStyle: "preserve-3d",
                  color:
                    i === 1 || i === 4 ? "#DFC063" : "rgba(255,255,255,0.85)",
                }}
              >
                {word}
              </span>
            ))}
          </div>
          <div className="mt-6">
            <ArtDecoOrnament />
          </div>
        </div>

        {/* ═══ Links Grid — balanced 4-column layout ═══ */}
        <div className="footer-links-grid grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 lg:gap-14 pb-14 md:pb-20">
          {/* Quick Links */}
          <div className="footer-col">
            <h4
              className="text-gold/60 text-[10px] tracking-[0.25em] uppercase mb-5"
              style={{ fontFamily: "var(--font-mono-custom)" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-white/50 text-sm hover:text-gold hover:pl-2 transition-all duration-300 block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-col">
            <h4
              className="text-gold/60 text-[10px] tracking-[0.25em] uppercase mb-5"
              style={{ fontFamily: "var(--font-mono-custom)" }}
            >
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/privacypolicy"
                  className="text-white/50 text-sm hover:text-gold hover:pl-2 transition-all duration-300 block"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/Terms"
                  className="text-white/50 text-sm hover:text-gold hover:pl-2 transition-all duration-300 block"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="/contact-us"
                  className="text-white/50 text-sm hover:text-gold hover:pl-2 transition-all duration-300 block"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Offices with constellation dots */}
          <div className="footer-col">
            <h4
              className="text-gold/60 text-[10px] tracking-[0.25em] uppercase mb-5"
              style={{ fontFamily: "var(--font-mono-custom)" }}
            >
              Our Offices
            </h4>
            <div className="space-y-5">
              <div className="flex gap-3">
                <div className="flex flex-col items-center mt-1.5">
                  <div className="footer-office-dot w-2 h-2 rounded-full bg-gold/50 shrink-0" />
                  <div className="w-px h-full bg-gradient-to-b from-gold/20 to-transparent mt-1" />
                </div>
                <div>
                  <p
                    className="text-gold/50 text-[9px] tracking-[0.2em] uppercase mb-1"
                    style={{ fontFamily: "var(--font-mono-custom)" }}
                  >
                    Hyderabad
                  </p>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {CONTACT_INFO.offices.hyderabad}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex flex-col items-center mt-1.5">
                  <div className="footer-office-dot w-2 h-2 rounded-full bg-gold/50 shrink-0" />
                </div>
                <div>
                  <p
                    className="text-gold/50 text-[9px] tracking-[0.2em] uppercase mb-1"
                    style={{ fontFamily: "var(--font-mono-custom)" }}
                  >
                    Bangalore
                  </p>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {CONTACT_INFO.offices.bangalore}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social + Contact */}
          <div className="footer-col">
            <h4
              className="text-gold/60 text-[10px] tracking-[0.25em] uppercase mb-5"
              style={{ fontFamily: "var(--font-mono-custom)" }}
            >
              Connect
            </h4>

            {/* Social icons with orbital hover glow */}
            <div className="footer-socials flex items-center gap-2.5 mb-6">
              {Object.entries(CONTACT_INFO.social).map(([key, url]) => {
                const Icon = SOCIAL_ICONS[key as keyof typeof SOCIAL_ICONS];
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-icon relative w-10 h-10 rounded-full border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-white/40 hover:border-gold/40 hover:text-gold hover:bg-gold/[0.08] hover:shadow-[0_0_20px_rgba(223,192,99,0.2)] transition-all duration-400 group"
                    aria-label={key}
                  >
                    <Icon size={15} className="relative z-10" />
                    {/* Expanding ring on hover */}
                    <div className="absolute inset-0 rounded-full border border-gold/0 group-hover:border-gold/15 group-hover:scale-[1.6] group-hover:opacity-0 transition-all duration-600 pointer-events-none" />
                  </a>
                );
              })}
            </div>

            {/* Phone & Email */}
            <div className="space-y-3">
              <a
                href={`tel:${CONTACT_INFO.phone}`}
                className="flex items-center gap-2.5 text-white/50 text-sm hover:text-gold transition-colors group"
              >
                <Phone
                  size={12}
                  className="text-gold/50 group-hover:text-gold transition-colors"
                />
                {CONTACT_INFO.phone}
              </a>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="flex items-center gap-2.5 text-white/50 text-sm hover:text-gold transition-colors group"
              >
                <Mail
                  size={12}
                  className="text-gold/50 group-hover:text-gold transition-colors"
                />
                {CONTACT_INFO.email}
              </a>
            </div>
          </div>
        </div>

        {/* ═══ Bottom Bar ═══ */}
        <div className="footer-bottom py-6 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-[10px] text-center md:text-left tracking-wider">
            Copyright &copy; {new Date().getFullYear()} SAI SRAVANTHI INFRA
            PROJECTS PRIVATE LIMITED. All Rights Reserved.
          </p>
          <p
            className="text-white/20 text-[10px] tracking-wider"
            style={{ fontFamily: "var(--font-mono-custom)" }}
          >
            Designed & Developed by Lokesh Bavandla
          </p>
        </div>
      </div>
    </footer>
  );
}
