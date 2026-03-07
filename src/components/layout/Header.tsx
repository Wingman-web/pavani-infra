"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Menu, X, ArrowUpRight, Instagram, Facebook, Youtube, Linkedin } from "lucide-react";
import { NAV_LINKS, CONTACT_INFO } from "@/lib/constants";

const SOCIAL_ICONS = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  linkedin: Linkedin,
};

const HERO_NAV = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/project" },
  { label: "Contact", href: "/contact-us" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [inHero, setInHero] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const heroThreshold = window.innerHeight * 0.7;
      setScrolled(y > 50);
      setInHero(y < heroThreshold);
      setHidden(y > 200 && y > lastScrollY.current && y >= heroThreshold);
      lastScrollY.current = y;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = useCallback(() => setMenuOpen((p) => !p), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${
          hidden ? "-translate-y-full" : "translate-y-0"
        } ${
          inHero
            ? "bg-transparent"
            : "header-scrolled border-b border-white/[0.06]"
        }`}
      >
        {/* ═══ UNIFIED HEADER: Logo left, 3 links + hamburger right ═══ */}
        <div className="w-full max-w-[1920px] mx-auto px-5 sm:px-8 md:px-10 lg:px-14 xl:px-20 2xl:px-24 flex items-center justify-between h-16 sm:h-18 md:h-20 lg:h-22 xl:h-24">
          {/* Logo */}
          <a href="/" className="flex items-center group shrink-0">
            <img
              src="/logo5.svg"
              alt="Pavani Infra"
              className="h-9 sm:h-10 md:h-11 lg:h-12 xl:h-14 w-auto transition-transform duration-500 group-hover:scale-105"
            />
          </a>

          {/* Right: nav links + hamburger */}
          <div className="flex items-center gap-5 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12">
            <nav className="hidden sm:flex items-center gap-5 md:gap-7 lg:gap-8 xl:gap-10">
              {HERO_NAV.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative text-[11px] sm:text-xs md:text-[13px] lg:text-sm text-white/60 hover:text-gold tracking-[0.18em] md:tracking-[0.22em] uppercase transition-all duration-300 group"
                >
                  <span className="relative z-10">{link.label}</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold/60 group-hover:w-full transition-all duration-400" />
                </a>
              ))}
            </nav>

            {/* Hamburger */}
            <button
              onClick={toggleMenu}
              className="relative w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 flex items-center justify-center group"
              aria-label="Open menu"
            >
              <div className="flex flex-col items-end gap-[5px] md:gap-[6px]">
                <span className="block w-5.5 md:w-6 lg:w-7 h-[1.5px] bg-white/70 group-hover:bg-gold group-hover:w-7 md:group-hover:w-7 lg:group-hover:w-8 transition-all duration-300 origin-right" />
                <span className="block w-4 md:w-4.5 lg:w-5 h-[1.5px] bg-white/70 group-hover:bg-gold group-hover:w-7 md:group-hover:w-7 lg:group-hover:w-8 transition-all duration-300 origin-right" />
                <span className="block w-4.5 md:w-5 lg:w-6 h-[1.5px] bg-white/70 group-hover:bg-gold group-hover:w-7 md:group-hover:w-7 lg:group-hover:w-8 transition-all duration-300 origin-right" />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* ═══ FULL-SCREEN 3D SLIDE MENU ═══ */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 z-[198] bg-black/60 backdrop-blur-sm"
              onClick={closeMenu}
            />

            {/* Menu panel — 3D perspective slide from right */}
            <motion.div
              initial={{ x: "100%", rotateY: -15 }}
              animate={{ x: 0, rotateY: 0 }}
              exit={{ x: "100%", rotateY: -15 }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 250,
                mass: 0.8,
              }}
              className="fixed top-0 right-0 bottom-0 z-[199] w-full sm:w-[480px] overflow-hidden"
              style={{
                perspective: "1200px",
                transformOrigin: "right center",
              }}
            >
              {/* Panel background */}
              <div className="absolute inset-0 bg-[#0A0A0A]">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(45deg, transparent, transparent 60px, rgba(223,192,99,1) 60px, rgba(223,192,99,1) 61px)",
                    }}
                  />
                </div>
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gold/[0.04] blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-[20%] left-[10%] w-[200px] h-[200px] bg-gold/[0.03] blur-[100px] rounded-full pointer-events-none" />
              </div>

              {/* Close button */}
              <motion.button
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                onClick={closeMenu}
                className="absolute top-5 right-5 sm:top-6 sm:right-6 z-20 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-full border border-white/10 hover:border-gold/40 hover:bg-gold/5 transition-all duration-300 group"
                aria-label="Close menu"
              >
                <X
                  size={18}
                  className="text-white/60 group-hover:text-gold transition-colors duration-300"
                />
              </motion.button>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-between px-8 sm:px-10 md:px-14 py-20 sm:py-24">
                {/* Nav links */}
                <nav className="flex flex-col gap-1 sm:gap-2">
                  {NAV_LINKS.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 80, rotateX: -20 }}
                      animate={{ opacity: 1, x: 0, rotateX: 0 }}
                      exit={{ opacity: 0, x: 60 }}
                      transition={{
                        delay: 0.15 + i * 0.06,
                        duration: 0.5,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                      style={{ perspective: "600px" }}
                    >
                      <a
                        href={link.href}
                        onClick={closeMenu}
                        className="group relative flex items-center justify-between py-3 sm:py-4 border-b border-white/[0.04] hover:border-gold/20 transition-all duration-500"
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <span
                            className="text-[9px] sm:text-[10px] text-white/20 group-hover:text-gold/50 tracking-widest transition-colors duration-300"
                            style={{
                              fontFamily: "var(--font-mono-custom)",
                            }}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span
                            className="text-xl sm:text-2xl md:text-3xl text-white/70 group-hover:text-white tracking-[0.05em] uppercase transition-all duration-500 group-hover:translate-x-2"
                            style={{
                              fontFamily: "var(--font-display-custom)",
                              transformStyle: "preserve-3d",
                            }}
                          >
                            {link.label}
                          </span>
                        </div>
                        <ArrowUpRight
                          size={16}
                          className="text-white/0 group-hover:text-gold opacity-0 group-hover:opacity-100 -translate-x-3 group-hover:translate-x-0 transition-all duration-400"
                        />
                        <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-gradient-to-r from-gold/60 to-transparent group-hover:w-full transition-all duration-600" />
                      </a>
                    </motion.div>
                  ))}
                </nav>

                {/* Bottom: Contact info */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="space-y-5 sm:space-y-6"
                >
                  <div className="w-10 sm:w-12 h-px bg-gold/30" />

                  <div className="space-y-2.5 sm:space-y-3">
                    <a
                      href={`tel:${CONTACT_INFO.phone}`}
                      className="flex items-center gap-2.5 sm:gap-3 text-gold/80 hover:text-gold transition-colors duration-300"
                    >
                      <Phone size={13} />
                      <span
                        className="text-xs sm:text-sm tracking-wider"
                        style={{ fontFamily: "var(--font-mono-custom)" }}
                      >
                        {CONTACT_INFO.phone}
                      </span>
                    </a>
                    <a
                      href={`mailto:${CONTACT_INFO.email}`}
                      className="block text-white/40 hover:text-white/70 text-[10px] sm:text-xs tracking-wider transition-colors duration-300"
                      style={{ fontFamily: "var(--font-mono-custom)" }}
                    >
                      {CONTACT_INFO.email}
                    </a>
                  </div>

                  <div className="flex items-center gap-2.5 sm:gap-3">
                    {Object.entries(CONTACT_INFO.social).map(
                      ([name, url], i) => {
                        const Icon =
                          SOCIAL_ICONS[name as keyof typeof SOCIAL_ICONS];
                        return (
                          <motion.a
                            key={name}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, scale: 0, rotate: -45 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{
                              delay: 0.7 + i * 0.06,
                              type: "spring",
                              stiffness: 300,
                              damping: 15,
                            }}
                            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/8 bg-white/3 flex items-center justify-center text-white/40 hover:border-gold/40 hover:text-gold hover:bg-gold/8 hover:shadow-[0_0_20px_rgba(223,192,99,0.2)] transition-all duration-400 group"
                            aria-label={name}
                          >
                            <Icon size={15} className="relative z-10" />
                            <div className="absolute inset-0 rounded-full border border-gold/0 group-hover:border-gold/15 group-hover:scale-[1.6] group-hover:opacity-0 transition-all duration-600 pointer-events-none" />
                          </motion.a>
                        );
                      }
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Decorative gold line */}
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                exit={{ scaleY: 0 }}
                transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-transparent via-gold/30 to-transparent origin-top"
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
