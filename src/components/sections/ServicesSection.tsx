import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { getIcon } from "@/lib/icons";
import type { Service } from "@/generated/prisma/client";

export function ServicesSection({ services }: { services: Service[] }) {
  return (
    <section id="sherbimet" className="section-padding bg-white">
      <div className="container-luxury">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2563EB]">Shërbimet</p>
          <h2 className="heading-lg mt-3">Zgjidhje të plota për relokim në Gjermani</h2>
          <p className="body-lg mt-4">
            Nga CV-ja dhe intervista deri te vizë, leje qëndrimi dhe ndjekja e aplikimit — çdo shërbim është i strukturuar
            për qartësi dhe rezultat.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, i) => {
            const Icon = getIcon(service.icon);
            return (
              <Reveal key={service.id} delay={i * 0.04}>
                <article className="card-luxury group flex h-full flex-col p-7">
                  <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB] transition group-hover:gradient-primary group-hover:text-white">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#0F172A]">{service.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-[#64748B]">{service.shortDescription}</p>
                  <Link
                    href={`/sherbimet/${service.slug}`}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8]"
                  >
                    Mëso më shumë
                    <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
