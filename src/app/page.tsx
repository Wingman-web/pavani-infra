"use client";

import dynamic from "next/dynamic";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/layout/ScrollProgress";
import Hero from "@/components/sections/Hero";
import StatsCounter from "@/components/sections/StatsCounter";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import LegacySection from "@/components/sections/LegacySection";
import CityShowcase from "@/components/sections/CityShowcase";
import Testimonials from "@/components/sections/Testimonials";
import BlogInsights from "@/components/sections/BlogInsights";
import ContactForm from "@/components/sections/ContactForm";

const Preloader = dynamic(() => import("@/components/sections/Preloader"), {
  ssr: false,
});

const SmoothScrollProvider = dynamic(
  () => import("@/components/providers/SmoothScrollProvider"),
  { ssr: false },
);

export default function HomePage() {
  return (
    <SmoothScrollProvider>
      <Preloader />
      <ScrollProgress />
      <Header />
      <main>
        <h1 className="sr-only">
          Pavani Infra - Premier Real Estate Developers Since 1995
        </h1>
        <Hero />
        <LegacySection />
        <CityShowcase />
        <StatsCounter />
        <FeaturedProjects />
        <Testimonials />
        <BlogInsights />
        <ContactForm />
      </main>
      <Footer />
    </SmoothScrollProvider>
  );
}
