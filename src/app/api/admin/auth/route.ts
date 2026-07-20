import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createAdminSession, destroyAdminSession, getAdminSessionEmail } from "@/lib/auth";
import { applyCors, preflightCors } from "@/lib/cors";

export async function OPTIONS(request: Request) {
  return preflightCors(request);
}

export async function POST(req: Request) {
  const { email, password } = (await req.json()) as { email?: string; password?: string };
  if (!email || !password) {
    return applyCors(NextResponse.json({ error: "Kredencialet mungojnë" }, { status: 400 }), req);
  }
  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) return applyCors(NextResponse.json({ error: "Gabim hyrjeje" }, { status: 401 }), req);
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return applyCors(NextResponse.json({ error: "Gabim hyrjeje" }, { status: 401 }), req);
  await createAdminSession(email);
  return applyCors(NextResponse.json({ ok: true }), req);
}

export async function DELETE(request: Request) {
  await destroyAdminSession();
  return applyCors(NextResponse.json({ ok: true }), request);
}

export async function GET(request: Request) {
  const email = await getAdminSessionEmail();
  return applyCors(
    NextResponse.json({ authenticated: Boolean(email), email }),
    request,
  );
}
