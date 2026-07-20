import { NextResponse } from "next/server";
import { getSiteDataFromDb } from "@/lib/data";
import { applyCors, preflightCors } from "@/lib/cors";

export async function OPTIONS(request: Request) {
  return preflightCors(request);
}

export async function GET(request: Request) {
  try {
    const data = await getSiteDataFromDb();
    return applyCors(NextResponse.json(data), request);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error";
    return applyCors(NextResponse.json({ error: message }, { status: 500 }), request);
  }
}
