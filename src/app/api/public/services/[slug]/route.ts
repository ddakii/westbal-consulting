import { NextResponse } from "next/server";
import { applyCors, preflightCors } from "@/lib/cors";

type Props = { params: Promise<{ slug: string }> };

export async function OPTIONS(request: Request) {
  return preflightCors(request);
}

export async function GET(request: Request, { params }: Props) {
  const { slug } = await params;
  const { prisma } = await import("@/lib/prisma");
  const service = await prisma.service.findUnique({ where: { slug } });
  if (!service || !service.published) {
    return applyCors(NextResponse.json({ error: "Not found" }, { status: 404 }), request);
  }
  return applyCors(NextResponse.json(service), request);
}
