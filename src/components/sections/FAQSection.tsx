"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import type { FAQ } from "@/generated/prisma/client";

export function FAQSection({ faqs }: { faqs: FAQ[] }) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  return (
    <section id="pyetje" className="section-padding bg-white">
      <div className="container-luxury grid gap-12 lg:grid-cols-5">
        <Reveal className="lg:col-span-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2563EB]">Pyetje të shpeshta</p>
          <h2 className="heading-lg mt-3">Përgjigje të qarta para se të filloni</h2>
          <p className="body-lg mt-4">Nuk gjeni përgjigjen? Na shkruani — ekipi ynë përgjigjet shpejt dhe me transparencë.</p>
        </Reveal>
        <div className="space-y-3 lg:col-span-3">
          {faqs.map((faq, i) => {
            const open = openId === faq.id;
            return (
              <Reveal key={faq.id} delay={i * 0.03}>
                <div className="card-luxury overflow-hidden">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 p-5 text-left"
                    onClick={() => setOpenId(open ? null : faq.id)}
                  >
                    <span className="font-semibold text-[#0F172A]">{faq.question}</span>
                    <motion.span animate={{ rotate: open ? 45 : 0 }}>
                      <Plus className="h-5 w-5 text-[#2563EB]" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="border-t border-[#E2E8F0] px-5 pb-5 pt-3 text-sm leading-relaxed text-[#64748B]">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
