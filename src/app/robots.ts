import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/urls";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteOrigin();
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/admin"] },
    sitemap: `${base}/sitemap.xml`,
  };
}
