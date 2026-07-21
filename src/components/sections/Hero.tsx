"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { SiteSettings } from "@/generated/prisma/client";
import { Reveal } from "@/components/motion/Reveal";

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.max(1, Math.floor(value / 60));
    const id = window.setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        window.clearInterval(id);
      } else setCount(start);
    }, 16);
    return () => window.clearInterval(id);
  }, [value]);
  return (
    <span
      style={{ fontFamily: "var(--font-numbers)" }}
      className="text-3xl font-semibold text-white md:text-4xl"
    >
      {count}
      {suffix}
    </span>
  );
}

export function Hero({
  settings,
  heroImageSrc,
}: {
  settings: SiteSettings;
  heroImageSrc: string;
}) {
  return (
    <section id="ballina" className="relative min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={heroImageSrc}
          alt="Panoramë e qytetit në Gjermani"
          fill
          priority
          unoptimized={heroImageSrc.startsWith("/images/")}
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="hero-overlay-base" aria-hidden />
        <div className="hero-overlay-scrim" aria-hidden />
      </div>

      <div className="container-luxury relative z-10 flex min-h-[100svh] flex-col justify-center px-5 pb-24 pt-32 sm:px-8 lg:px-12">
        <div className="relative max-w-3xl">
          <Reveal delay={0.05}>
            <h1 className="heading-xl hero-text">{settings.heroHeadline}</h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="body-lg mt-6 max-w-2xl !text-base md:!text-lg hero-subtitle">
              {settings.heroSubtitle}
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a href="#kontakt" className="btn-primary">
                {settings.primaryCtaLabel}
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#kontakt" className="btn-secondary-hero">
                Na Kontakto
              </a>
            </div>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-4">
          {[
            { label: "Kandidatë të suksesshëm", value: settings.statsSuccessfulCandidates },
            { label: "Viza të aprovuara", value: settings.statsApprovedVisas },
            { label: "Partnerë në Gjermani", value: settings.statsPartners },
            { label: "Vite përvojë", value: settings.statsYearsExperience },
          ].map((s, i) => (
            <Reveal
              key={s.label}
              delay={0.1 * i}
              className="rounded-2xl border border-white/20 bg-black/25 p-5 backdrop-blur-md"
            >
              <AnimatedCounter value={s.value} suffix="+" />
              <p className="mt-2 flex items-center gap-2 text-sm font-medium text-white/90">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#06B6D4]" />
                {s.label}
              </p>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
