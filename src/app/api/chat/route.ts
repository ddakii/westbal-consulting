import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { handleChatMessage } from "@/lib/chat-handler";
import { applyCors, preflightCors } from "@/lib/cors";

export async function OPTIONS(request: Request) {
  return preflightCors(request);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      message?: string;
      history?: { role: string; content: string }[];
      sessionId?: string;
    };
    if (!body.message?.trim()) {
      return applyCors(NextResponse.json({ error: "Mesazhi mungon" }, { status: 400 }), req);
    }
    const sessionId = body.sessionId || nanoid();
    const reply = await handleChatMessage(body.message, body.history || [], sessionId);
    return applyCors(NextResponse.json({ reply, sessionId }), req);
  } catch {
    return applyCors(NextResponse.json({ error: "Gabim serveri" }, { status: 500 }), req);
  }
}
