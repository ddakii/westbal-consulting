import { prisma } from "@/lib/prisma";
import {
  cosineSimilarity,
  detectLanguage,
  embedText,
  generateGroundedAnswer,
  getFallbackMessage,
  scoreMatch,
} from "@/lib/rag";

type HistoryItem = { role: string; content: string };

type BookingState = {
  step: "name" | "phone" | "email" | "date" | "time" | "description" | "done";
  name?: string;
  phone?: string;
  email?: string;
  preferredDate?: string;
  preferredTime?: string;
  description?: string;
};

const bookingStore = new Map<string, BookingState>();

function wantsHuman(text: string) {
  return /(flas|bisedoj|kontakt|telefon|person|njeri|human|agent|mitarbeiter|speak)/i.test(text);
}

function wantsBooking(text: string) {
  return /(rezervo|konsultim|consultation|termin|appointment|takim|book)/i.test(text);
}

function getSessionId(body: { sessionId?: string }) {
  return body.sessionId || "default";
}

export async function handleChatMessage(message: string, history: HistoryItem[], sessionId: string) {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  const phone = settings?.phone || "+383 44 000 000";
  const email = settings?.email || "info@westbalconsulting.com";
  const address = settings?.address || "Prishtinë, Kosovë";
  const whatsapp = settings?.whatsapp || phone;
  const lang = detectLanguage(message);
  const fallback = () => getFallbackMessage(phone, email, lang);

  if (wantsHuman(message)) {
    if (lang === "en") {
      return `You can reach our team directly:\n📞 ${phone}\n📧 ${email}\n📍 ${address}\n💬 WhatsApp: ${whatsapp}`;
    }
    if (lang === "de") {
      return `Sie erreichen unser Team direkt:\n📞 ${phone}\n📧 ${email}\n📍 ${address}\n💬 WhatsApp: ${whatsapp}`;
    }
    return `Mund të flisni direkt me ekipin tonë:\n📞 ${phone}\n📧 ${email}\n📍 ${address}\n💬 WhatsApp: ${whatsapp}`;
  }

  const booking = bookingStore.get(sessionId);
  if (booking && booking.step !== "done") {
    return continueBooking(message, sessionId, lang);
  }

  if (wantsBooking(message)) {
    bookingStore.set(sessionId, { step: "name" });
    if (lang === "en") return "I'd be happy to help you book a consultation. What is your full name?";
    if (lang === "de") return "Gern helfe ich bei der Terminbuchung. Wie ist Ihr vollständiger Name?";
    return "Me kënaqësi ju ndihmoj të rezervoni konsultim. Si e keni emrin e plotë?";
  }

  const entries = await prisma.knowledgeEntry.findMany();
  const docs = await prisma.knowledgeDocument.findMany();

  let bestScore = 0;
  let bestAnswer: string | null = null;

  for (const e of entries) {
    const s = scoreMatch(message, e.question, e.answer, e.keywords);
    if (s > bestScore) {
      bestScore = s;
      bestAnswer = e.answer;
    }
  }

  for (const d of docs) {
    const s = scoreMatch(message, d.filename, d.extractedText.slice(0, 2000), null);
    if (s > bestScore) {
      bestScore = s;
      const snippet = d.extractedText.slice(0, 900);
      bestAnswer = snippet;
    }
  }

  const queryEmbedding = await embedText(message);
  if (queryEmbedding) {
    for (const e of entries) {
      if (!e.embedding) continue;
      try {
        const emb = JSON.parse(e.embedding) as number[];
        const sim = cosineSimilarity(queryEmbedding, emb);
        if (sim > 0.78 && sim * 10 > bestScore) {
          bestScore = sim * 10;
          bestAnswer = e.answer;
        }
      } catch {
        /* ignore */
      }
    }
  }

  const contextParts: string[] = [];
  if (bestAnswer && bestScore >= 3) contextParts.push(bestAnswer);
  contextParts.push(
    `Kontakt: ${phone}, ${email}, ${address}. Orari: ${settings?.officeHours || ""}`,
  );

  const grounded = await generateGroundedAnswer(message, contextParts.join("\n\n"), lang);
  if (grounded) return grounded;

  if (bestAnswer && bestScore >= 3) return bestAnswer;

  return fallback();
}

async function continueBooking(message: string, sessionId: string, lang: "sq" | "en" | "de") {
  const state = bookingStore.get(sessionId)!;
  const text = message.trim();

  const prompts = {
    name: { sq: "Faleminderit. Cili është numri juaj i telefonit?", en: "Thank you. What is your phone number?", de: "Danke. Wie lautet Ihre Telefonnummer?" },
    phone: { sq: "Email-i juaj?", en: "Your email address?", de: "Ihre E-Mail-Adresse?" },
    email: { sq: "Cila datë preferoni?", en: "Preferred date?", de: "Bevorzugtes Datum?" },
    date: { sq: "Cila orë preferoni?", en: "Preferred time?", de: "Bevorzugte Uhrzeit?" },
    time: { sq: "Përshkruani shkurt rastin tuaj.", en: "Please briefly describe your case.", de: "Bitte beschreiben Sie Ihr Anliegen kurz." },
  } as const;

  if (state.step === "name") {
    state.name = text;
    state.step = "phone";
    return prompts.name[lang];
  }
  if (state.step === "phone") {
    state.phone = text;
    state.step = "email";
    return prompts.phone[lang];
  }
  if (state.step === "email") {
    state.email = text;
    state.step = "date";
    return prompts.email[lang];
  }
  if (state.step === "date") {
    state.preferredDate = text;
    state.step = "time";
    return prompts.date[lang];
  }
  if (state.step === "time") {
    state.preferredTime = text;
    state.step = "description";
    return prompts.time[lang];
  }
  if (state.step === "description") {
    state.description = text;
    state.step = "done";
    await prisma.appointment.create({
      data: {
        name: state.name!,
        phone: state.phone!,
        email: state.email!,
        preferredDate: state.preferredDate!,
        preferredTime: state.preferredTime!,
        description: state.description!,
        source: "chatbot",
      },
    });
    bookingStore.delete(sessionId);
    if (lang === "en") {
      return "Thank you! Your consultation request has been saved. Our team will contact you shortly.";
    }
    if (lang === "de") {
      return "Vielen Dank! Ihre Terminanfrage wurde gespeichert. Unser Team meldet sich in Kürze.";
    }
    return "Faleminderit! Kërkesa juaj për konsultim u regjistrua. Ekipi ynë do t'ju kontaktojë shpejt.";
  }
  return getFallbackMessage("+383 44 000 000", "info@westbalconsulting.com", lang);
}
