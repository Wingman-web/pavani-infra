"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Send, ChevronDown, Phone, Mail } from "lucide-react";
import { CONTACT_INFO } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

export default function ContactForm() {
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    message: "",
  });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      /* ── Top gold line expands ── */
      gsap.fromTo(
        ".cta-top-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: section,
            start: "top 90%",
            end: "top 65%",
            scrub: 0.6,
          },
        }
      );

      /* ── Left CTA content reveal ── */
      gsap.fromTo(
        ".cta-left > *",
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 45%",
            scrub: 0.6,
          },
        }
      );

      /* ── Right form content reveal ── */
      gsap.fromTo(
        ".cta-right > *",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".cta-right",
            start: "top 85%",
            end: "top 45%",
            scrub: 0.6,
          },
        }
      );

      /* ── Gold accent line on form expands ── */
      gsap.fromTo(
        ".form-accent-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.6,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: ".cta-right",
            start: "top 80%",
            end: "top 55%",
            scrub: 0.6,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-24 overflow-hidden"
      style={{
        background:
          "#950921",
      }}
    >
      {/* Top gold accent line */}
      <div className="cta-top-line absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent origin-center" />

      {/* Subtle ambient glow */}
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[250px] bg-gold/[0.02] blur-[140px] rounded-full pointer-events-none" />

      {/* ═══ Content ═══ */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">

          {/* ── LEFT: CTA Content ── */}
          <div className="cta-left lg:pt-4">
            <span
              className="text-gold/70 text-sm tracking-[0.3em] uppercase block mb-4"
              style={{ fontFamily: "var(--font-mono-custom)" }}
            >
              The Next Step
            </span>

            <h2
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6 leading-[1.1]"
              style={{ fontFamily: "var(--font-display-custom)" }}
            >
              Begin Your
              <br />
              <span className="text-gold">Dream Together</span>
            </h2>

            <div className="w-16 h-[1px] bg-gold/40 mb-7" />

            <p
              className="text-white/70 text-base md:text-lg leading-relaxed mb-10 max-w-sm"
              style={{ fontFamily: "var(--font-body)" }}
            >
              A home is more than walls — it&apos;s the foundation for
              generations. Let us help you build your legacy.
            </p>

            {/* Contact info */}
            <div className="space-y-4">
              <a
                href={`tel:${CONTACT_INFO.phone}`}
                className="flex items-center gap-3 text-white/70 text-sm hover:text-gold transition-colors duration-300 group"
              >
                <Phone size={15} className="text-gold/50 group-hover:text-gold transition-colors" />
                {CONTACT_INFO.phone}
              </a>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="flex items-center gap-3 text-white/70 text-sm hover:text-gold transition-colors duration-300 group"
              >
                <Mail size={15} className="text-gold/50 group-hover:text-gold transition-colors" />
                {CONTACT_INFO.email}
              </a>
            </div>
          </div>

          {/* ── RIGHT: Form (no card, no glass — clean editorial) ── */}
          <div className="cta-right">
            {/* Form heading */}
            <h3
              className="text-white font-semibold text-lg md:text-xl tracking-wide mb-2"
              style={{ fontFamily: "var(--font-display-custom)" }}
            >
              Send Us A Message
            </h3>
            <div className="form-accent-line w-14 h-[1px] bg-gradient-to-r from-gold/50 to-transparent mb-8 origin-left" />

            <form onSubmit={handleSubmit}>
              {/* Row 1: Full Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-7">
                <div>
                  <label
                    className="text-gold/60 text-[11px] tracking-[0.2em] uppercase block mb-2.5"
                    style={{ fontFamily: "var(--font-mono-custom)" }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full bg-transparent border-b border-white/10 pb-3 text-white text-base placeholder:text-white/35 outline-none focus:border-gold/50 transition-colors duration-500"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label
                    className="text-gold/60 text-[11px] tracking-[0.2em] uppercase block mb-2.5"
                    style={{ fontFamily: "var(--font-mono-custom)" }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full bg-transparent border-b border-white/10 pb-3 text-white text-base placeholder:text-white/35 outline-none focus:border-gold/50 transition-colors duration-500"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Row 2: Phone + Preferred City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-9">
                <div>
                  <label
                    className="text-gold/60 text-[11px] tracking-[0.2em] uppercase block mb-2.5"
                    style={{ fontFamily: "var(--font-mono-custom)" }}
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="w-full bg-transparent border-b border-white/10 pb-3 text-white text-base placeholder:text-white/35 outline-none focus:border-gold/50 transition-colors duration-500"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="relative">
                  <label
                    className="text-gold/60 text-[11px] tracking-[0.2em] uppercase block mb-2.5"
                    style={{ fontFamily: "var(--font-mono-custom)" }}
                  >
                    Preferred City
                  </label>
                  <select
                    className="w-full bg-transparent border-b border-white/10 pb-3 text-white text-base outline-none appearance-none pr-8 cursor-pointer focus:border-gold/50 transition-colors duration-500"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    required
                  >
                    <option value="" disabled className="bg-[#950921]">
                      Select City
                    </option>
                    {["Hyderabad", "Bangalore", "Chennai", "Vijayawada", "Nellore"].map(
                      (city) => (
                        <option
                          key={city}
                          value={city}
                          className="bg-[#950921] text-white"
                        >
                          {city}
                        </option>
                      )
                    )}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-0 bottom-3 text-white/20 pointer-events-none"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="mb-9">
                <label
                  className="text-gold/60 text-[11px] tracking-[0.2em] uppercase block mb-2.5"
                  style={{ fontFamily: "var(--font-mono-custom)" }}
                >
                  Message
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your requirements..."
                  className="w-full bg-transparent border-b border-white/10 pb-3 text-white text-base placeholder:text-white/35 outline-none focus:border-gold/50 transition-colors duration-500 resize-none"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="group relative inline-flex items-center gap-2.5 px-10 py-3.5 border border-gold/30 text-gold text-sm tracking-[0.15em] uppercase overflow-hidden cursor-pointer transition-all duration-500 hover:bg-gold hover:text-[#0e1a26] hover:border-gold hover:shadow-[0_0_30px_rgba(211,185,115,0.15)]"
                style={{ fontFamily: "var(--font-mono-custom)" }}
              >
                <span className="relative z-10 flex items-center gap-2.5">
                  <Send
                    size={14}
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
                  />
                  Submit Enquiry
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Gold seam between Contact and CTA Banner */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold/30 to-transparent" />
    </section>
  );
}
