import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getIcon } from "@/lib/icons";
import { getServiceBySlug, getSiteData } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    const { services } = await getSiteData();
    return services.map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export const dynamicParams = true;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.shortDescription,
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service || !service.published) notFound();

  const data = await getSiteData();
  const Icon = getIcon(service.icon);
  const benefits = JSON.parse(service.benefits) as string[];
  const timeline = JSON.parse(service.timeline) as { title: string; duration: string }[];
  const requirements = JSON.parse(service.requirements) as string[];
  const faqs = JSON.parse(service.faqs) as { q: string; a: string }[];

  return (
    <>
      <Header settings={data.settings} />
      <main className="pt-24">
        <section className="relative overflow-hidden bg-[#0F172A] text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/30 to-transparent" />
          <div className="container-luxury relative px-5 py-20 sm:px-8 lg:px-12">
            <Link href="/#sherbimet" className="inline-flex items-center gap-2 text-sm text-white/75 hover:text-white">
              <ArrowLeft className="h-4 w-4" /> Kthehu te shërbimet
            </Link>
            <div className="mt-8 flex items-start gap-5">
              <div className="rounded-2xl bg-white/10 p-4">
                <Icon className="h-8 w-8" />
              </div>
              <div>
                <h1 className="heading-lg text-white">{service.title}</h1>
                <p className="mt-4 max-w-2xl text-lg text-white/80">{service.shortDescription}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="container-luxury grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-semibold">Përshkrimi</h2>
              <p className="mt-4 text-[#475569] leading-relaxed">{service.description}</p>

              <h3 className="mt-10 text-xl font-semibold">Përfitimet</h3>
              <ul className="mt-4 space-y-3">
                {benefits.map((b) => (
                  <li key={b} className="flex gap-3 text-[#475569]">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#10B981]" />
                    {b}
                  </li>
                ))}
              </ul>

              {faqs.length > 0 && (
                <>
                  <h3 className="mt-10 text-xl font-semibold">Pyetje të shpeshta</h3>
                  <div className="mt-4 space-y-4">
                    {faqs.map((f) => (
                      <div key={f.q} className="card-luxury p-5">
                        <p className="font-semibold">{f.q}</p>
                        <p className="mt-2 text-sm text-[#64748B]">{f.a}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <aside className="space-y-6">
              <div className="card-luxury p-6">
                <h3 className="font-semibold">Timeline</h3>
                <ul className="mt-4 space-y-4">
                  {timeline.map((t) => (
                    <li key={t.title} className="border-l-2 border-[#2563EB] pl-4">
                      <p className="text-sm font-medium">{t.title}</p>
                      <p className="text-xs text-[#64748B]">{t.duration}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card-luxury p-6">
                <h3 className="font-semibold">Kërkesat</h3>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[#64748B]">
                  {requirements.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
              <a href="/#kontakt" className="btn-primary w-full">
                {data.settings.primaryCtaLabel}
              </a>
            </aside>
          </div>
        </section>
      </main>
      <Footer settings={data.settings} services={data.services} />
    </>
  );
}
