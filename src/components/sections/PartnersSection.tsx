"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Partner } from "@/generated/prisma/client";

export function PartnersSection({ partners }: { partners: Partner[] }) {
  const loop = [...partners, ...partners];
  return (
    <section className="section-padding bg-[#F8FAFC]">
      <div className="container-luxury">
        <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-[#64748B]">
          Partnerë në Gjermani
        </p>
        <h2 className="heading-lg mt-3 text-center">Kompanitë që na besojnë</h2>
        <div className="relative mt-12 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#F8FAFC] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#F8FAFC] to-transparent" />
          <motion.div
            className="flex w-max gap-8"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          >
            {loop.map((p, i) => (
              <div
                key={`${p.id}-${i}`}
                className="card-luxury flex h-24 w-56 shrink-0 items-center justify-center px-6 hover:border-[#2563EB]/30"
              >
                <Image src={p.logoUrl} alt={p.name} width={160} height={48} className="opacity-70 transition hover:opacity-100" />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
