/** Remote backend (Railway) when frontend is on Netlify. Empty = same origin. */
export function getApiBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!base) return "";
  return base.replace(/\/$/, "");
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
    process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ||
    `http://127.0.0.1:${process.env.PORT || 3000}`;

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
