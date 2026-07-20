import { NextResponse } from "next/server";
import { getAdminSessionEmail } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const email = await getAdminSessionEmail();
  if (!email) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const data = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
  const faqs = await prisma.fAQ.findMany({ orderBy: { order: "asc" } });
  const testimonials = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
  const partners = await prisma.partner.findMany({ orderBy: { order: "asc" } });
  const knowledge = await prisma.knowledgeEntry.findMany({ orderBy: { updatedAt: "desc" } });
  const documents = await prisma.knowledgeDocument.findMany({ orderBy: { createdAt: "desc" } });
  const appointments = await prisma.appointment.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
  const jobs = await prisma.jobOpening.findMany({ orderBy: { createdAt: "desc" } });

  return NextResponse.json({
    settings: data,
    services,
    faqs,
    testimonials,
    partners,
    knowledge,
    documents,
    appointments,
    jobs,
  });
}
