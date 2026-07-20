import type { MetadataRoute } from "next";
import { getSiteData } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://westbalconsulting.com";
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/privatesia`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/kushtet`, changeFrequency: "yearly", priority: 0.3 },
  ];
  try {
    const { services } = await getSiteData();
    return [
      ...staticRoutes,
      ...services.map((s) => ({
        url: `${base}/sherbimet/${s.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
