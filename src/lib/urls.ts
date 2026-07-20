export const DEFAULT_SITE_URL = "https://westbalconsulting.com";

export function tryGetValidUrl(value: string | undefined): URL | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    return parsed;
  } catch {
    try {
      return new URL(`https://${trimmed.replace(/^\/+/, "")}`);
    } catch {
      return null;
    }
  }
}

export function getValidUrl(
  value: string | undefined,
  fallback: string = DEFAULT_SITE_URL,
): URL {
  return tryGetValidUrl(value) ?? new URL(fallback);
}

/** Canonical public site origin (no trailing slash). */
export function getSiteOrigin(): string {
  return getValidUrl(process.env.NEXT_PUBLIC_SITE_URL).origin;
}

/** Railway API origin for Netlify; empty when unset or invalid. */
export function getOptionalApiOrigin(): string {
  const parsed = tryGetValidUrl(process.env.NEXT_PUBLIC_API_URL);
  return parsed?.origin ?? "";
}
