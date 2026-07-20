import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { AboutSection } from "@/components/sections/AboutSection";
import { PartnersSection } from "@/components/sections/PartnersSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { WhyUsSection } from "@/components/sections/WhyUsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { getSiteData } from "@/lib/data";
import { withAssetVersion } from "@/lib/asset-url";
import { getSiteOrigin } from "@/lib/urls";
import type { Metadata } from "next";

/** Hero/imazhet lokale lexohen me version të freskët (mtime). */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteData();
  return {
    title: settings.seoTitle,
    description: settings.seoDescription,
    openGraph: {
      title: settings.seoTitle,
      description: settings.seoDescription,
      images: settings.ogImage
        ? [{ url: withAssetVersion(settings.ogImage) }]
        : undefined,
    },
    twitter: {
      title: settings.seoTitle,
      description: settings.seoDescription,
      images: settings.ogImage ? [withAssetVersion(settings.ogImage)] : undefined,
    },
  };
}

export default async function HomePage() {
  const data = await getSiteData();
  const { settings, services, faqs, testimonials, partners, whyUs, processSteps } = data;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Westbal Consulting",
    url: getSiteOrigin(),
    description: settings.seoDescription,
    areaServed: ["Albania", "Kosovo", "Germany"],
    telephone: settings.phone,
    email: settings.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: settings.address,
    },
    serviceType: services.map((s) => s.title),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header settings={settings} />
      <main>
        <Hero settings={settings} heroImageSrc={withAssetVersion(settings.heroImage)} />
        <AboutSection settings={settings} />
        <PartnersSection partners={partners} />
        <ServicesSection services={services} />
        <ProcessSection steps={processSteps} />
        <WhyUsSection items={whyUs} />
        <TestimonialsSection testimonials={testimonials} />
        <FAQSection faqs={faqs} />
        <ContactSection settings={settings} />
      </main>
      <Footer settings={settings} services={services} />
    </>
  );
}
