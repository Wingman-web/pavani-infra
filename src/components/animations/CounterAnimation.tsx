"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface CounterAnimationProps {
  target: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export default function CounterAnimation({
  target,
  suffix = "",
  duration = 2,
  className = "",
}: CounterAnimationProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || hasAnimated) return;

    const obj = { value: 0 };

    // Small delay to ensure ScrollTrigger is connected with Lenis
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        gsap.to(obj, {
          value: target,
          duration,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none",
          },
          onUpdate: () => {
            if (target >= 1000) {
              el.textContent = Math.round(obj.value).toLocaleString() + suffix;
            } else {
              el.textContent = Math.round(obj.value) + suffix;
            }
          },
          onComplete: () => setHasAnimated(true),
        });
      });

      return () => ctx.revert();
    }, 100);

    return () => clearTimeout(timer);
  }, [target, suffix, duration, hasAnimated]);

  // Show the target value as fallback text so content is never invisible
  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  );
}
