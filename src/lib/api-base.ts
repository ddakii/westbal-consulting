import { getOptionalApiOrigin, getSiteOrigin } from "@/lib/urls";

/** Remote backend (Railway) when frontend is on Netlify. Empty = same origin. */
export function getApiBaseUrl(): string {
  return getOptionalApiOrigin();
}

/** Browser / client — relative path is OK when same origin. */
export function apiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const base = getApiBaseUrl();
  return `${base}${normalized}`;
}

/** Server-side fetch requires an absolute URL. */
export function serverFetchUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const base = getApiBaseUrl();
  if (base) return `${base}${normalized}`;

  const origin =
    getSiteOrigin() || `http://127.0.0.1:${process.env.PORT || 3000}`;

  return `${origin}${normalized}`;
}

export function hasDatabaseUrl(): boolean {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return false;
  return url.startsWith("postgresql://") || url.startsWith("postgres://");
}

export function isRemoteFrontendOnly(): boolean {
  return !hasDatabaseUrl() && Boolean(getApiBaseUrl());
}
