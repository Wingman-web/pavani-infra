"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
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
      className={`fixed bottom-8 right-8 z-[90] w-12 h-12 rounded-full flex items-center justify-center group transition-all duration-500 ${
        visible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-4 opacity-0 pointer-events-none"
      }`}
      style={{
        background: "linear-gradient(135deg, #DFC063 0%, #C4A44D 100%)",
        boxShadow:
          "0 4px 20px rgba(223, 192, 99, 0.35), 0 2px 8px rgba(0, 0, 0, 0.15)",
      }}
      aria-label="Scroll to top"
    >
      <ArrowUp
        size={18}
        className="text-[#0D1A26] group-hover:-translate-y-1 transition-transform duration-300"
        strokeWidth={2.5}
      />
      {/* Glow ring on hover */}
      <div className="absolute inset-0 rounded-full border-2 border-gold/0 group-hover:border-gold-light/40 group-hover:scale-[1.4] group-hover:opacity-0 transition-all duration-700 pointer-events-none" />
      {/* Inner highlight */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity duration-300"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)",
        }}
      />
    </button>
  );
}
