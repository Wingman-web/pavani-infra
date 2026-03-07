"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  className?: string;
  delay?: number;
  splitBy?: "chars" | "words" | "lines";
  scrollTrigger?: boolean;
  goldWords?: string[];
}

export default function TextReveal({
  children,
  as: Tag = "h2",
  className = "",
  delay = 0,
  splitBy = "words",
  scrollTrigger = true,
  goldWords = [],
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Manual split text approach (no GSAP Club needed)
    const text = el.textContent || "";
    let parts: string[];

    if (splitBy === "chars") {
      parts = text.split("");
    } else if (splitBy === "words") {
      parts = text.split(" ");
    } else {
      parts = [text];
    }

    el.innerHTML = parts
      .map((part, i) => {
        const isGold = goldWords.some(
          (w) => part.toLowerCase().includes(w.toLowerCase())
        );
        const separator = splitBy === "chars" ? "" : " ";
        return `<span class="inline-block overflow-hidden"><span class="text-reveal-part inline-block ${
          isGold ? "text-gold" : ""
        }" style="will-change:transform,opacity">${part}${i < parts.length - 1 ? separator : ""}</span></span>`;
      })
      .join("");

    const spans = el.querySelectorAll(".text-reveal-part");

    const animProps: gsap.TweenVars = {
      y: splitBy === "chars" ? 30 : 50,
      opacity: 0,
      duration: splitBy === "chars" ? 0.4 : 0.6,
      stagger: splitBy === "chars" ? 0.02 : 0.06,
      delay,
      ease: "power3.out",
    };

    if (scrollTrigger) {
      animProps.scrollTrigger = {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
      };
    }

    const ctx = gsap.context(() => {
      gsap.from(spans, animProps);
    });

    return () => ctx.revert();
  }, [children, splitBy, delay, scrollTrigger, goldWords]);

  return (
    // @ts-expect-error -- dynamic tag
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
