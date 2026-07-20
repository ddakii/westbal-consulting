"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import type { ProcessStep } from "@/generated/prisma/client";

export function ProcessSection({ steps }: { steps: ProcessStep[] }) {
  return (
    <section id="procesi" className="section-padding bg-[#F8FAFC]">
      <div className="container-luxury">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2563EB]">Procesi</p>
          <h2 className="heading-lg mt-3">Rrugëtimi juaj, hap pas hapi</h2>
          <p className="body-lg mt-4">Një timeline i qartë që ju ndihmon të dini ku jeni dhe çfarë vjen më pas.</p>
        </Reveal>

        <div className="relative mx-auto mt-16 max-w-3xl">
          <div className="absolute bottom-0 left-6 top-0 w-px bg-gradient-to-b from-[#2563EB] via-[#06B6D4] to-transparent md:left-1/2" />
          {steps.map((step, i) => (
            <Reveal key={step.id} delay={i * 0.06}>
              <motion.div
                className="relative mb-10 grid gap-4 md:grid-cols-2 md:gap-10"
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: i % 2 ? 20 : -20 }}
                viewport={{ once: true }}
              >
                <div className={`${i % 2 ? "md:order-2 md:text-left" : "md:text-right"} pl-14 md:pl-0`}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#06B6D4]">Hapi {step.step}</p>
                  <h3 className="mt-1 text-xl font-semibold text-[#0F172A]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#64748B]">{step.description}</p>
                </div>
                <div className="hidden md:block" />
                <div className="absolute left-3 top-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#2563EB] text-xs font-bold text-white shadow-lg md:left-1/2 md:-translate-x-1/2">
                  {step.step}
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
