"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const alreadySeen = document.cookie.includes("preloaderSeen=true");
    const container = containerRef.current;
    if (!container) return;

    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        document.cookie = "preloaderSeen=true;max-age=86400;path=/";
        window.dispatchEvent(new Event("preloader-complete"));
        setIsComplete(true);
      },
    });

    if (alreadySeen) {
      // Quick slide-up for return visitors
      tl.to(container, {
        yPercent: -100,
        duration: 0.6,
        ease: "power3.inOut",
      });
      return () => {
        tl.kill();
        document.body.style.overflow = "";
      };
    }

    // Logo visible immediately, gold glow fades in, then exit
    tl.set(container, { opacity: 1 })
      // Gold radial glow fades in behind logo
      .fromTo(
        ".preloader-glow",
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: "power2.out" }
      )
      // Brief hold
      .to({}, { duration: 0.6 })

      // === EXIT: Slide UP ===
      .to(".preloader-content", {
        y: -80,
        duration: 0.85,
        ease: "power4.inOut",
      })
      .to(
        container,
        {
          yPercent: -100,
          duration: 0.85,
          ease: "power4.inOut",
        },
        "<"
      );

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, []);

  if (isComplete) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] pointer-events-auto bg-surface-primary"
    >
      {/* Gold radial glow behind logo — fades in for rich feel */}
      <div className="preloader-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(223,192,99,0.10) 0%, rgba(223,192,99,0.04) 40%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Centered content — logo fully visible */}
      <div className="preloader-content absolute inset-0 flex items-center justify-center z-20">
        <img
          src="/logo5.svg"
          alt="Pavani Infra"
          className="w-[150px] md:w-[190px] h-auto"
        />
      </div>
    </div>
  );
}
