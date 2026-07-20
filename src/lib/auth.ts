import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "westbal_admin_session";

function sign(value: string): string {
  const secret = process.env.SESSION_SECRET || "dev-secret";
  return createHash("sha256").update(`${value}:${secret}`).digest("hex");
}

export async function createAdminSession(email: string) {
  const token = `${email}:${Date.now()}`;
  const signature = sign(token);
  const payload = Buffer.from(`${token}:${signature}`).toString("base64url");
  const jar = await cookies();
  const crossOrigin = Boolean(process.env.CORS_ALLOWED_ORIGINS?.trim());
  jar.set(COOKIE_NAME, payload, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: crossOrigin ? "none" : "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroyAdminSession() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function getAdminSessionEmail(): Promise<string | null> {
  const jar = await cookies();
  const payload = jar.get(COOKIE_NAME)?.value;
  if (!payload) return null;
  try {
    const decoded = Buffer.from(payload, "base64url").toString("utf8");
    const [email, ts, signature] = decoded.split(":");
    const token = `${email}:${ts}`;
    const expected = sign(token);
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    return email;
  } catch {
    return null;
  }
}

export async function requireAdminSession() {
  const email = await getAdminSessionEmail();
  if (!email) throw new Error("UNAUTHORIZED");
  return email;
}
