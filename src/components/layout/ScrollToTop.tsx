"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after hero section is scrolled past
      setVisible(window.scrollY > window.innerHeight);
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
      className={`fixed bottom-8 right-8 z-[90] w-12 h-12 rounded-full border border-white/15 bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/50 hover:border-gold/50 hover:text-gold hover:bg-black/80 hover:shadow-[0_0_30px_rgba(223,192,99,0.2)] transition-all duration-400 group ${
        visible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-4 opacity-0 pointer-events-none"
      }`}
      aria-label="Scroll to top"
    >
      <ArrowUp
        size={18}
        className="group-hover:-translate-y-0.5 transition-transform duration-300"
      />
      {/* Pulsing ring on hover */}
      <div className="absolute inset-0 rounded-full border border-gold/0 group-hover:border-gold/20 group-hover:scale-150 group-hover:opacity-0 transition-all duration-700 pointer-events-none" />
    </button>
  );
}
