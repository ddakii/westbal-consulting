import { NextResponse } from "next/server";

function allowedOrigins(): string[] {
  const raw = process.env.CORS_ALLOWED_ORIGINS || process.env.NEXT_PUBLIC_SITE_URL || "";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  const allowed = allowedOrigins();
  if (allowed.includes("*")) return true;
  return allowed.some((a) => a === origin);
}

export function applyCors(response: NextResponse, request: Request): NextResponse {
  const origin = request.headers.get("origin");
  if (origin && isAllowedOrigin(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }
  response.headers.set("Vary", "Origin");
  return response;
}

export function preflightCors(request: Request): NextResponse {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Access-Control-Max-Age", "86400");
  return applyCors(response, request);
}
