const FALLBACK_SQ = `Më vjen keq, nuk kam informacion të mjaftueshëm për këtë pyetje.

Për ndihmë të mëtejshme ju lutemi kontaktoni ekipin tonë.

📞 +383 44 000 000
📧 info@westbalconsulting.com

Ne do t'ju përgjigjemi sa më shpejt.`;

export function getFallbackMessage(phone: string, email: string, lang: "sq" | "en" | "de") {
  if (lang === "en") {
    return `Sorry, I don't have enough information to answer that.

Please contact our team:
📞 ${phone}
📧 ${email}

We'll get back to you as soon as possible.`;
  }
  if (lang === "de") {
    return `Es tut mir leid, dazu liegen mir nicht genügend Informationen vor.

Bitte kontaktieren Sie unser Team:
📞 ${phone}
📧 ${email}

Wir melden uns so schnell wie möglich.`;
  }
  return FALLBACK_SQ.replace("+383 44 000 000", phone).replace(
    "info@westbalconsulting.com",
    email,
  );
}

export function detectLanguage(text: string): "sq" | "en" | "de" {
  const lower = text.toLowerCase();
  const deHints =
    /\b(visa|visum|termin|beratung|kosten|dokumente|deutschland|guten tag|hallo|wie|was|können|kann ich)\b/i;
  const enHints =
    /\b(hello|hi|consultation|visa|documents|how|what|can you|appointment|germany|work|job)\b/i;
  if (deHints.test(lower) && !/\b(për|çfarë|si |unë|ju |mirë)\b/i.test(lower)) return "de";
  if (enHints.test(lower) && !/\b(për|çfarë|si |unë|ju |mirë)\b/i.test(lower)) return "en";
  return "sq";
}

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9]+/i)
    .filter((t) => t.length > 2);
}

export function scoreMatch(query: string, question: string, answer: string, keywords?: string | null) {
  const qTokens = new Set(tokenize(query));
  const corpus = `${question} ${answer} ${keywords || ""}`.toLowerCase();
  let score = 0;
  for (const t of qTokens) {
    if (corpus.includes(t)) score += 2;
  }
  if (question.toLowerCase().includes(query.toLowerCase().slice(0, 12))) score += 3;
  return score;
}

export async function embedText(text: string): Promise<number[] | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  const { default: OpenAI } = await import("openai");
  const openai = new OpenAI({ apiKey: key });
  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text.slice(0, 8000),
  });
  return res.data[0]?.embedding ?? null;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    dot += a[i]! * b[i]!;
    na += a[i]! * a[i]!;
    nb += b[i]! * b[i]!;
  }
  if (!na || !nb) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export async function generateGroundedAnswer(
  question: string,
  context: string,
  lang: "sq" | "en" | "de",
): Promise<string | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key || !context.trim()) return null;
  const { default: OpenAI } = await import("openai");
  const openai = new OpenAI({ apiKey: key });
  const langName = lang === "en" ? "English" : lang === "de" ? "German" : "Albanian";
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content: `You are Westbal AI, a migration consultant assistant. Answer ONLY using the provided CONTEXT. If context is insufficient, reply exactly: __FALLBACK__
Respond in ${langName}. Be professional, friendly, concise. Never invent facts.`,
      },
      {
        role: "user",
        content: `CONTEXT:\n${context}\n\nQUESTION:\n${question}`,
      },
    ],
  });
  const text = res.choices[0]?.message?.content?.trim();
  if (!text || text.includes("__FALLBACK__")) return null;
  return text;
}
