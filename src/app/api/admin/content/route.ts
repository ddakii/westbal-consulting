import { NextResponse } from "next/server";
import { getAdminSessionEmail } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { embedText } from "@/lib/rag";
import { chunkText, saveUpload } from "@/lib/documents";

export async function PATCH(req: Request) {
  const email = await getAdminSessionEmail();
  if (!email) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const body = (await req.json()) as {
    type: string;
    payload: Record<string, unknown>;
  };

  switch (body.type) {
    case "settings":
      await prisma.siteSettings.update({ where: { id: "default" }, data: body.payload });
      break;
    case "service":
      await prisma.service.update({
        where: { id: body.payload.id as string },
        data: body.payload,
      });
      break;
    case "faq-create":
      await prisma.fAQ.create({ data: body.payload as never });
      break;
    case "faq-update":
      await prisma.fAQ.update({
        where: { id: body.payload.id as string },
        data: body.payload,
      });
      break;
    case "faq-delete":
      await prisma.fAQ.delete({ where: { id: body.payload.id as string } });
      break;
    case "testimonial-create":
      await prisma.testimonial.create({ data: body.payload as never });
      break;
    case "testimonial-update":
      await prisma.testimonial.update({
        where: { id: body.payload.id as string },
        data: body.payload,
      });
      break;
    case "partner-create":
      await prisma.partner.create({ data: body.payload as never });
      break;
    case "partner-update":
      await prisma.partner.update({
        where: { id: body.payload.id as string },
        data: body.payload,
      });
      break;
    case "knowledge-create": {
      const answer = body.payload.answer as string;
      const question = body.payload.question as string;
      const embedding = await embedText(`${question}\n${answer}`);
      await prisma.knowledgeEntry.create({
        data: {
          question,
          answer,
          keywords: (body.payload.keywords as string) || null,
          embedding: embedding ? JSON.stringify(embedding) : null,
          source: "manual",
        },
      });
      break;
    }
    case "knowledge-update": {
      const id = body.payload.id as string;
      const question = body.payload.question as string;
      const answer = body.payload.answer as string;
      const embedding = await embedText(`${question}\n${answer}`);
      await prisma.knowledgeEntry.update({
        where: { id },
        data: {
          question,
          answer,
          keywords: (body.payload.keywords as string) || null,
          embedding: embedding ? JSON.stringify(embedding) : null,
        },
      });
      break;
    }
    case "knowledge-delete":
      await prisma.knowledgeEntry.delete({ where: { id: body.payload.id as string } });
      break;
    case "job-create":
      await prisma.jobOpening.create({ data: body.payload as never });
      break;
    case "job-update":
      await prisma.jobOpening.update({
        where: { id: body.payload.id as string },
        data: body.payload,
      });
      break;
    default:
      return NextResponse.json({ error: "Lloj i panjohur" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

export async function POST(req: Request) {
  const email = await getAdminSessionEmail();
  if (!email) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Skedari mungon" }, { status: 400 });
  }

  const { filePath, filename, text } = await saveUpload(file);
  const doc = await prisma.knowledgeDocument.create({
    data: {
      filename,
      mimeType: file.type,
      filePath,
      extractedText: text.slice(0, 200_000),
    },
  });

  const chunks = chunkText(text);
  for (const chunk of chunks.slice(0, 40)) {
    const embedding = await embedText(chunk);
    await prisma.knowledgeEntry.create({
      data: {
        question: `Dokument: ${filename}`,
        answer: chunk,
        source: "document",
        documentId: doc.id,
        embedding: embedding ? JSON.stringify(embedding) : null,
      },
    });
  }

  return NextResponse.json({ ok: true, documentId: doc.id, chunks: chunks.length });
}
