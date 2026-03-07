"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  stagger?: number;
  duration?: number;
  className?: string;
  as?: "div" | "section" | "article" | "span";
}

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  stagger = 0,
  duration = 0.8,
  className = "",
  as: Tag = "div",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const dirMap = {
      up: { y: 50, x: 0 },
      down: { y: -50, x: 0 },
      left: { x: 50, y: 0 },
      right: { x: -50, y: 0 },
    };

    const { x, y } = dirMap[direction];
    const targets = stagger > 0 ? el.children : el;

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        y,
        x,
        opacity: 0,
        duration,
        delay,
        stagger: stagger > 0 ? stagger : undefined,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    });

    return () => ctx.revert();
  }, [direction, delay, stagger, duration]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
