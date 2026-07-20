import {
  getApiBaseUrl,
  hasDatabaseUrl,
  isRemoteFrontendOnly,
  serverFetchUrl,
} from "./api-base";
import type { SiteData } from "./data-types";

export type { SiteData } from "./data-types";

/** Always reads from PostgreSQL — for API routes on Railway. */
export async function getSiteDataFromDb(): Promise<SiteData> {
  const { prisma } = await import("./prisma");
  const [
    settings,
    services,
    faqs,
    testimonials,
    partners,
    whyUs,
    processSteps,
    jobs,
  ] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
    prisma.service.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
    prisma.fAQ.findMany({ orderBy: { order: "asc" } }),
    prisma.testimonial.findMany({ orderBy: { order: "asc" } }),
    prisma.partner.findMany({ orderBy: { order: "asc" } }),
    prisma.whyUsItem.findMany({ orderBy: { order: "asc" } }),
    prisma.processStep.findMany({ orderBy: { step: "asc" } }),
    prisma.jobOpening.findMany({ where: { published: true }, orderBy: { createdAt: "desc" } }),
  ]);

  if (!settings) throw new Error("Site settings missing. Run npm run db:seed");

  return {
    settings,
    services,
    faqs,
    testimonials,
    partners,
    whyUs,
    processSteps,
    jobs,
  };
}

async function fetchSiteDataFromApi(): Promise<SiteData> {
  const url = serverFetchUrl("/api/public/site-data");
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to load site data from ${url}`);
  }
  return res.json() as Promise<SiteData>;
}

export async function getSiteData(): Promise<SiteData> {
  if (hasDatabaseUrl()) {
    try {
      return await getSiteDataFromDb();
    } catch {
      if (getApiBaseUrl()) return fetchSiteDataFromApi();
      throw new Error("Database unavailable. Check DATABASE_URL and run npm run db:seed.");
    }
  }

  if (isRemoteFrontendOnly()) {
    return fetchSiteDataFromApi();
  }

  throw new Error(
    "DATABASE_URL is not set. Add your Railway PostgreSQL URL to .env for local development, or set NEXT_PUBLIC_API_URL to a deployed Railway backend.",
  );
}

export async function getServiceBySlug(slug: string) {
  if (hasDatabaseUrl()) {
    try {
      const { prisma } = await import("./prisma");
      return prisma.service.findUnique({ where: { slug } });
    } catch {
      if (!getApiBaseUrl()) throw new Error("Database unavailable");
    }
  }

  if (!isRemoteFrontendOnly() && !hasDatabaseUrl()) {
    throw new Error("DATABASE_URL or NEXT_PUBLIC_API_URL is required.");
  }

  const res = await fetch(serverFetchUrl(`/api/public/services/${slug}`), {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load service");
  return res.json();
}
