"use client";

import { AnimatePresence, motion } from "framer-motion";
import { apiUrl } from "@/lib/api-base";
import { Bot, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

const TEASER_KEY = "westbal-ai-teaser-dismissed";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Përshëndetje! Unë jam Asistenti Virtual i Westbal Consulting. Si mund t'ju ndihmoj me relokimin në Gjermani?",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, open]);

  useEffect(() => {
    if (open) {
      setShowTeaser(false);
      return;
    }
    if (typeof window !== "undefined" && sessionStorage.getItem(TEASER_KEY)) return;

    const showTimer = window.setTimeout(() => setShowTeaser(true), 2200);
    return () => window.clearTimeout(showTimer);
  }, [open]);

  function dismissTeaser() {
    setShowTeaser(false);
    try {
      sessionStorage.setItem(TEASER_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  async function send(text: string) {
    if (!text.trim()) return;
    const userMsg = text.trim();
    setInput("");
    dismissTeaser();
    setMessages((m) => [...m, { role: "user", content: userMsg }]);
    setTyping(true);
    try {
      const res = await fetch(apiUrl("/api/chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history: messages.slice(-8), sessionId }),
      });
      const data = (await res.json()) as { reply: string; sessionId?: string };
      if (data.sessionId) setSessionId(data.sessionId);
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Më vjen keq, shërbimi nuk është i disponueshëm për momentin. Ju lutemi kontaktoni ekipin tonë në faqen Kontakt.",
        },
      ]);
    } finally {
      setTyping(false);
    }
  }

  function openChat() {
    dismissTeaser();
    setOpen(true);
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="fixed bottom-[5.5rem] right-3 z-[70] flex h-[min(620px,78vh)] w-[min(420px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-[20px] border-2 border-[#2563EB]/25 shadow-[0_28px_90px_-20px_rgba(37,99,235,0.55)] backdrop-blur-xl sm:right-5 sm:bottom-28"
            style={{
              background: "linear-gradient(165deg, rgb(255 255 255 / 0.96), rgb(239 246 255 / 0.94))",
            }}
          >
            <div className="gradient-primary flex items-center justify-between px-5 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 shadow-inner">
                  <Bot className="h-6 w-6" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#10B981]" />
                </div>
                <div>
                  <p className="flex items-center gap-1.5 text-base font-semibold">
                    Westbal AI
                    <Sparkles className="h-4 w-4 text-[#C9A227]" aria-hidden />
                  </p>
                  <p className="text-xs text-white/90">Asistenti Virtual · Përgjigje për vizë & punësim</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl p-2 hover:bg-white/15"
                aria-label="Mbyll"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "gradient-primary text-white shadow-md"
                        : "border border-[#E2E8F0] bg-white text-[#334155] shadow-sm"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex gap-1 rounded-2xl border border-[#E2E8F0] bg-white px-3 py-2 w-fit shadow-sm">
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      className="h-2 w-2 rounded-full bg-[#2563EB]"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay: d * 0.15 }}
                    />
                  ))}
                </div>
              )}
              <div ref={endRef} />
            </div>

            <form
              className="border-t border-[#E2E8F0] bg-white/90 p-4"
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
            >
              <div className="flex items-center gap-2 rounded-2xl border-2 border-[#2563EB]/20 bg-white px-3 py-2.5 shadow-sm focus-within:border-[#2563EB]/50">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Pyet për vizë, dokumente, konsultim..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#94A3B8]"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-[#2563EB] p-2.5 text-white hover:bg-[#1D4ED8]"
                  aria-label="Dërgo"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Si funksionon procesi?", "Si rezervoj konsultim?", "Çfarë dokumentesh më duhen?"].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => void send(q)}
                    className="rounded-full border border-[#CBD5E1] bg-[#F8FAFC] px-3 py-1.5 text-xs font-medium text-[#475569] hover:border-[#2563EB] hover:bg-[#EFF6FF] hover:text-[#2563EB]"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Teaser — flluskë prezantuese */}
      <AnimatePresence>
        {showTeaser && !open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            className="fixed bottom-[5.25rem] right-3 z-[69] max-w-[min(320px,calc(100vw-2rem))] rounded-2xl border border-[#2563EB]/20 bg-white p-4 shadow-[0_20px_50px_-16px_rgba(15,23,42,0.35)] sm:right-5 sm:bottom-[6.5rem]"
          >
            <button
              type="button"
              onClick={dismissTeaser}
              className="absolute right-2 top-2 rounded-lg p-1 text-[#94A3B8] hover:bg-[#F1F5F9]"
              aria-label="Mbyll"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="pr-6 text-sm font-semibold text-[#0F172A]">Pyet Westbal AI</p>
            <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
              Vizë pune, dokumente, afate dhe rezervim konsultimi — përgjigje të shpejta në shqip.
            </p>
            <button
              type="button"
              onClick={openChat}
              className="btn-primary mt-3 w-full !py-2.5 text-xs"
            >
              Fillo bisedën
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher i madh */}
      <div className="fixed bottom-4 right-3 z-[70] sm:bottom-5 sm:right-5">
        {!open && (
          <>
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full bg-[#2563EB]"
              animate={{ scale: [1, 1.45, 1.45], opacity: [0.45, 0, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full bg-[#06B6D4]"
              animate={{ scale: [1, 1.25, 1.25], opacity: [0.35, 0, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
            />
          </>
        )}

        <motion.button
          type="button"
          onClick={() => (open ? setOpen(false) : openChat())}
          className="relative flex items-center gap-2.5 rounded-full text-white shadow-[0_16px_40px_-12px_rgba(37,99,235,0.75)] gradient-primary pl-4 pr-5 py-3.5 sm:pl-5 sm:pr-6 sm:py-4"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          aria-label={open ? "Mbyll chat" : "Hap Westbal AI"}
        >
          {open ? (
            <X className="h-6 w-6 shrink-0" />
          ) : (
            <>
              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20">
                <MessageCircle className="h-6 w-6" />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#10B981] text-[9px] font-bold ring-2 ring-[#1D4ED8]">
                  1
                </span>
              </span>
              <span className="hidden min-w-0 text-left sm:block">
                <span className="block text-sm font-bold leading-tight">Asistenti AI</span>
                <span className="block text-[11px] font-medium text-white/85">Online · pyet tani</span>
              </span>
            </>
          )}
        </motion.button>
      </div>
    </>
  );
}
