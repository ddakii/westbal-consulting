import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import type { SiteSettings } from "@/generated/prisma/client";

export function AboutSection({ settings }: { settings: SiteSettings }) {
  return (
    <section id="rreth-nesh" className="section-padding bg-white">
      <div className="container-luxury grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2563EB]">Rreth nesh</p>
          <h2 className="heading-lg mt-3">{settings.aboutTitle}</h2>
          <p className="body-lg mt-6 whitespace-pre-line">{settings.aboutBody}</p>
          <ul className="mt-8 space-y-3 text-[#334155]">
            {[
              "Udhëzim profesional, jo premtime të pabaza",
              "Proces transparent nga konsultimi deri te punësimi",
              "Komunikim i besueshëm dhe i shpejtë",
              "Mbështetje hap pas hapi në çdo fazë",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#C9A227]" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1} className="relative">
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-[#2563EB]/10 to-[#06B6D4]/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-[1.75rem] shadow-[var(--shadow-luxury)]">
            <Image
              src={settings.aboutImage}
              alt="Zyrë profesionale konsultimi"
              width={900}
              height={700}
              className="h-[420px] w-full object-cover md:h-[520px]"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
