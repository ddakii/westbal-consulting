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
    <span style={{ fontFamily: "var(--font-space)" }} className="text-3xl font-semibold text-white md:text-4xl">
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
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A]/85 via-[#0F172A]/55 to-[#2563EB]/35" />
      </div>

      <div className="container-luxury relative z-10 flex min-h-[100svh] flex-col justify-center px-5 pb-24 pt-32 sm:px-8 lg:px-12">
        <div className="max-w-3xl">
          <Reveal>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#10B981]" />
              Konsultim relokimi · Gjermani
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="heading-xl text-white drop-shadow-sm">{settings.heroHeadline}</h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="body-lg mt-6 max-w-2xl text-white/85">{settings.heroSubtitle}</p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a href="#kontakt" className="btn-primary">
                {settings.primaryCtaLabel}
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#kontakt" className="btn-secondary border-white/30 bg-white/10 text-white hover:bg-white hover:text-[#0F172A]">
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
            <Reveal key={s.label} delay={0.1 * i} className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
              <AnimatedCounter value={s.value} suffix="+" />
              <p className="mt-2 flex items-center gap-2 text-sm text-white/85">
                <CheckCircle2 className="h-4 w-4 text-[#06B6D4]" />
                {s.label}
              </p>
            </Reveal>
          ))}
        </div>

        <motion.div
          aria-hidden
          className="pointer-events-none absolute right-8 top-36 hidden w-72 rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl lg:block"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-white/70">Proces transparent</p>
          <p className="mt-2 text-sm text-white">Hap pas hapi — pa premtime boshe.</p>
        </motion.div>
      </div>
    </section>
  );
}
