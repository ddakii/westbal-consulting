import { Reveal } from "@/components/motion/Reveal";
import { getIcon } from "@/lib/icons";
import type { WhyUsItem } from "@/generated/prisma/client";

export function WhyUsSection({ items }: { items: WhyUsItem[] }) {
  return (
    <section className="section-padding bg-white">
      <div className="container-luxury">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C9A227]">Pse ne</p>
          <h2 className="heading-lg mt-3">Eksperiencë që ndihet në çdo detaj</h2>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const Icon = getIcon(item.icon);
            return (
              <Reveal key={item.id} delay={i * 0.05}>
                <div className="card-luxury h-full p-7">
                  <Icon className="h-8 w-8 text-[#2563EB]" />
                  <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#64748B]">{item.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
