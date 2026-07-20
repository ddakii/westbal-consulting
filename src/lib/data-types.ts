import type {
  FAQ,
  JobOpening,
  Partner,
  ProcessStep,
  Service,
  SiteSettings,
  Testimonial,
  WhyUsItem,
} from "@/generated/prisma/client";

export type SiteData = {
  settings: SiteSettings;
  services: Service[];
  faqs: FAQ[];
  testimonials: Testimonial[];
  partners: Partner[];
  whyUs: WhyUsItem[];
  processSteps: ProcessStep[];
  jobs: JobOpening[];
};
