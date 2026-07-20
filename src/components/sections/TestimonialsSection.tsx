"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import type { Testimonial } from "@/generated/prisma/client";

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 6000);
    return () => window.clearInterval(id);
  }, [testimonials.length]);

  const t = testimonials[index];
  if (!t) return null;

  return (
    <section className="section-padding bg-[#0F172A] text-white">
      <div className="container-luxury">
        <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-[#06B6D4]">Dëshmi klientësh</p>
        <h2 className="heading-lg mt-3 text-center text-white">Histori reale, rezultate reale</h2>

        <div className="relative mx-auto mt-14 max-w-3xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 p-8 md:p-12 backdrop-blur">
          <AnimatePresence mode="wait">
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45 }}
              className="text-center"
            >
              <div className="mx-auto flex w-fit gap-1 text-[#C9A227]">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-6 text-lg leading-relaxed text-white/90 md:text-xl">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-8 flex items-center justify-center gap-4">
                <Image src={t.photo} alt={t.name} width={56} height={56} className="h-14 w-14 rounded-full object-cover ring-2 ring-[#2563EB]" />
                <div className="text-left">
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-white/65">{t.country}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((item, i) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Dëshmi ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${i === index ? "w-8 bg-[#2563EB]" : "w-2 bg-white/30"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
