"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after hero section (approximately one viewport height)
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[90] group flex flex-col items-center gap-1.5 transition-all duration-500 ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      aria-label="Back to top"
    >
      <div className="relative w-11 h-11 rounded-full border border-white/15 bg-surface-primary/80 backdrop-blur-sm flex items-center justify-center group-hover:border-gold/50 group-hover:bg-gold/10 group-hover:shadow-[0_0_25px_rgba(223,192,99,0.2)] transition-all duration-400">
        <ArrowUp
          size={16}
          className="text-white/40 group-hover:text-gold group-hover:-translate-y-0.5 transition-all duration-300"
        />
        {/* Pulsing ring on hover */}
        <div className="absolute inset-0 rounded-full border border-gold/0 group-hover:border-gold/20 group-hover:scale-150 group-hover:opacity-0 transition-all duration-700" />
      </div>
      <span
        className="text-white/25 text-[8px] tracking-[0.2em] uppercase group-hover:text-gold/50 transition-colors"
        style={{ fontFamily: "var(--font-mono-custom)" }}
      >
        Top
      </span>
    </button>
  );
}
