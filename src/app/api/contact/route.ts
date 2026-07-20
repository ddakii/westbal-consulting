import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { applyCors, preflightCors } from "@/lib/cors";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email(),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  description: z.string().min(5),
});

export async function OPTIONS(request: Request) {
  return preflightCors(request);
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = schema.parse(json);
    await prisma.appointment.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        preferredDate: data.preferredDate || "—",
        preferredTime: data.preferredTime || "—",
        description: data.description,
        source: "website",
      },
    });
    return applyCors(NextResponse.json({ ok: true }), req);
  } catch {
    return applyCors(NextResponse.json({ error: "Të dhënat nuk janë valide" }, { status: 400 }), req);
  }
}
