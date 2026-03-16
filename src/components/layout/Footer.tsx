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
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const SOCIAL_ICONS = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  linkedin: Linkedin,
};

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const ctx = gsap.context(() => {
      /* ── Top row reveal ── */
      gsap.fromTo(
        ".footer-top-row",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footer,
            start: "top 85%",
            end: "top 55%",
            scrub: 0.6,
          },
        },
      );

      /* ── Quick links stagger ── */
      gsap.fromTo(
        ".footer-links-section",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".footer-links-section",
            start: "top 92%",
            end: "top 70%",
            scrub: 0.6,
          },
        },
      );

      /* ── Social icons pop in ── */
      gsap.fromTo(
        ".footer-social-icon",
        { opacity: 0, scale: 0, rotation: -30 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.4,
          stagger: 0.06,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: ".footer-bottom-bar",
            start: "top 95%",
            end: "top 80%",
            scrub: 0.5,
          },
        },
      );

      /* ── Divider lines expand ── */
      gsap.fromTo(
        ".footer-divider",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: footer,
            start: "top 80%",
            end: "top 55%",
            scrub: 0.6,
          },
        },
      );

      /* ── Office dots pulse ── */
      gsap.to(".footer-office-dot", {
        boxShadow: "0 0 10px rgba(211,185,115,0.6)",
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        stagger: 0.3,
        ease: "sine.inOut",
      });

      /* ── Bottom bar fade ── */
      gsap.fromTo(
        ".footer-bottom",
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".footer-bottom",
            start: "top 98%",
            end: "top 88%",
            scrub: 0.4,
          },
        },
      );
    }, footer);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #5c1116 0%, #7a1519 50%, #5c1116 100%)",
      }}
    >
      {/* Top accent line */}
      <div className="footer-divider absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent origin-center" />

      {/* Subtle warm glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[250px] bg-gold/[0.02] blur-[120px] rounded-full pointer-events-none" />

      {/* ═══ Main Content ═══ */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 md:px-10 lg:px-14">
        {/* ── Row 1: Logo + Tagline | Offices (side by side) ── */}
        <div className="footer-top-row pt-10 md:pt-14 pb-8 md:pb-10 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6 items-start">
          {/* Logo + tagline */}
          <div className="md:col-span-4">
            <a href="/" className="shrink-0 inline-block">
              <img
                src="/logo5.svg"
                alt="Pavani Infra"
                className="h-12 sm:h-14 md:h-16 w-auto"
              />
            </a>
            <p className="text-white/70 text-sm leading-relaxed max-w-[280px] mt-3">
              Premier Real Estate Developers crafting quality spaces since 1995.
            </p>
            {/* Contact row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4">
              <a
                href={`tel:${CONTACT_INFO.phone}`}
                className="flex items-center gap-2 text-white/70 text-sm hover:text-gold transition-colors group"
              >
                <Phone
                  size={12}
                  className="text-gold/50 group-hover:text-gold transition-colors"
                />
                {CONTACT_INFO.phone}
              </a>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="flex items-center gap-2 text-white/70 text-sm hover:text-gold transition-colors group"
              >
                <Mail
                  size={12}
                  className="text-gold/50 group-hover:text-gold transition-colors"
                />
                {CONTACT_INFO.email}
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 md:col-start-6">
            <h4
              className="text-gold/70 text-xs tracking-[0.25em] uppercase mb-4"
              style={{ fontFamily: "var(--font-mono-custom)" }}
            >
              Quick Links
            </h4>
            <div className="flex flex-col gap-2.5">
              {NAV_LINKS.filter((link) => link.label !== "Home").map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-white/70 text-sm hover:text-gold hover:pl-1 transition-all duration-300 block"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Offices */}
          <div className="md:col-span-5 md:col-start-9">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={13} className="text-gold" />
              <h4
                className="text-gold/70 text-xs tracking-[0.25em] uppercase"
                style={{ fontFamily: "var(--font-mono-custom)" }}
              >
                Our Offices
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative pl-4 border-l border-gold/30">
                <div className="footer-office-dot absolute top-1.5 -left-[3px] w-1.5 h-1.5 rounded-full bg-gold" />
                <p
                  className="text-gold/60 text-[11px] tracking-[0.2em] uppercase mb-1"
                  style={{ fontFamily: "var(--font-mono-custom)" }}
                >
                  Hyderabad
                </p>
                <p className="text-white/70 text-sm leading-relaxed">
                  {CONTACT_INFO.offices.hyderabad}
                </p>
              </div>
              <div className="relative pl-4 border-l border-gold/30">
                <div className="footer-office-dot absolute top-1.5 -left-[3px] w-1.5 h-1.5 rounded-full bg-gold" />
                <p
                  className="text-gold/60 text-[11px] tracking-[0.2em] uppercase mb-1"
                  style={{ fontFamily: "var(--font-mono-custom)" }}
                >
                  Bangalore
                </p>
                <p className="text-white/70 text-sm leading-relaxed">
                  {CONTACT_INFO.offices.bangalore}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="footer-divider h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent origin-center" />

        {/* ── Row 2: Social + Legal links in one line ── */}
        <div className="footer-bottom-bar py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Social icons */}
          <div className="flex items-center gap-2">
            {Object.entries(CONTACT_INFO.social).map(([key, url]) => {
              const Icon = SOCIAL_ICONS[key as keyof typeof SOCIAL_ICONS];
              return (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-icon w-8 h-8 rounded-full border border-white/[0.08] bg-white/[0.02] flex items-center justify-center text-white/35 hover:border-gold/40 hover:text-gold hover:bg-gold/[0.06] transition-all duration-300"
                  aria-label={key}
                >
                  <Icon size={13} className="relative z-10" />
                </a>
              );
            })}
          </div>

          {/* Legal links */}
          <div className="flex items-center gap-4 text-white/40 text-xs tracking-wider">
            <a
              href="/privacypolicy"
              className="hover:text-gold transition-colors duration-300"
            >
              Privacy Policy
            </a>
            <span className="text-white/10">|</span>
            <a
              href="/Terms"
              className="hover:text-gold transition-colors duration-300"
            >
              Terms
            </a>
          </div>
        </div>

        {/* ── Row 3: Copyright ── */}
        <div className="footer-bottom py-5 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/45 text-xs text-center sm:text-left tracking-wider">
            &copy; {new Date().getFullYear()} SAI SRAVANTHI INFRA PROJECTS
            PRIVATE LIMITED. All Rights Reserved.
          </p>
          <p
            className="text-white/35 text-xs tracking-wider"
            style={{ fontFamily: "var(--font-mono-custom)" }}
          >
            Designed & Developed by Wingman Brandworks LLP
          </p>
        </div>
      </div>
    </footer>
  );
}
