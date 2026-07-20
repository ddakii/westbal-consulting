"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/api-base";
import { useRouter } from "next/navigation";

type AdminData = {
  settings: Record<string, unknown>;
  services: Array<Record<string, unknown>>;
  faqs: Array<Record<string, unknown>>;
  testimonials: Array<Record<string, unknown>>;
  partners: Array<Record<string, unknown>>;
  knowledge: Array<Record<string, unknown>>;
  documents: Array<Record<string, unknown>>;
  appointments: Array<Record<string, unknown>>;
  jobs: Array<Record<string, unknown>>;
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<AdminData | null>(null);
  const [tab, setTab] = useState("hero");
  const [msg, setMsg] = useState("");

  async function load() {
    const res = await fetch(apiUrl("/api/admin/data"), { credentials: "include" });
    if (res.status === 401) {
      router.replace("/admin");
      return;
    }
    setData(await res.json());
  }

  useEffect(() => {
    void load();
  }, [router]);

  async function save(type: string, payload: Record<string, unknown>) {
    setMsg("");
    const res = await fetch(apiUrl("/api/admin/content"), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, payload }),
      credentials: "include",
    });
    setMsg(res.ok ? "U ruajt." : "Gabim gjatë ruajtjes.");
    if (res.ok) void load();
  }

  async function uploadDoc(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(apiUrl("/api/admin/content"), {
      method: "POST",
      body: fd,
      credentials: "include",
    });
    setMsg(res.ok ? "Dokumenti u ngarkua dhe u indeksua." : "Ngarkimi dështoi.");
    if (res.ok) void load();
  }

  async function logout() {
    await fetch(apiUrl("/api/admin/auth"), { method: "DELETE", credentials: "include" });
    router.replace("/admin");
  }

  if (!data) {
    return <div className="flex min-h-screen items-center justify-center text-[#64748B]">Duke u ngarkuar...</div>;
  }

  const s = data.settings;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-lg font-semibold">Westbal Admin</h1>
            <p className="text-xs text-[#64748B]">Menaxhim i përmbajtjes dhe bazës së njohurive</p>
          </div>
          <button type="button" onClick={logout} className="btn-secondary !py-2 !px-4 text-xs">
            Dil
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[220px_1fr]">
        <nav className="card-luxury h-fit p-3 text-sm">
          {[
            ["hero", "Hero & SEO"],
            ["services", "Shërbimet"],
            ["faq", "FAQ"],
            ["testimonials", "Dëshmi"],
            ["partners", "Partnerë"],
            ["contact", "Kontakt"],
            ["knowledge", "AI Knowledge"],
            ["docs", "Dokumente RAG"],
            ["appointments", "Terminet"],
            ["jobs", "Punët e lira"],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`mb-1 w-full rounded-xl px-3 py-2 text-left ${tab === id ? "bg-[#EFF6FF] font-semibold text-[#2563EB]" : "hover:bg-[#F8FAFC]"}`}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="card-luxury p-6">
          {msg && <p className="mb-4 text-sm text-[#10B981]">{msg}</p>}

          {tab === "hero" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Hero & SEO</h2>
              {[
                ["heroHeadline", "Titulli Hero"],
                ["heroSubtitle", "Nëntitulli"],
                ["heroImage", "URL Imazhi Hero"],
                ["seoTitle", "Meta Title"],
                ["seoDescription", "Meta Description"],
                ["primaryCtaLabel", "Teksti CTA Primar"],
                ["secondaryCtaLabel", "Teksti CTA Sekondar"],
              ].map(([key, label]) => (
                <label key={key} className="block text-sm">
                  {label}
                  <input
                    className="mt-1 w-full rounded-xl border border-[#E2E8F0] px-3 py-2"
                    defaultValue={String(s[key] ?? "")}
                    onBlur={(e) => save("settings", { ...s, [key]: e.target.value })}
                  />
                </label>
              ))}
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["statsSuccessfulCandidates", "Kandidatë"],
                  ["statsApprovedVisas", "Viza"],
                  ["statsPartners", "Partnerë"],
                  ["statsYearsExperience", "Vite"],
                ].map(([key, label]) => (
                  <label key={key} className="block text-sm">
                    {label}
                    <input
                      type="number"
                      className="mt-1 w-full rounded-xl border border-[#E2E8F0] px-3 py-2"
                      defaultValue={Number(s[key] ?? 0)}
                      onBlur={(e) => save("settings", { ...s, [key]: Number(e.target.value) })}
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {tab === "contact" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Kontakt</h2>
              {[
                ["phone", "Telefon"],
                ["email", "Email"],
                ["whatsapp", "WhatsApp"],
                ["address", "Adresa"],
                ["officeHours", "Orari"],
                ["mapEmbedUrl", "Google Maps Embed URL"],
              ].map(([key, label]) => (
                <label key={key} className="block text-sm">
                  {label}
                  <input
                    className="mt-1 w-full rounded-xl border border-[#E2E8F0] px-3 py-2"
                    defaultValue={String(s[key] ?? "")}
                    onBlur={(e) => save("settings", { ...s, [key]: e.target.value })}
                  />
                </label>
              ))}
            </div>
          )}

          {tab === "services" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Shërbimet</h2>
              {data.services.map((service) => (
                <div key={String(service.id)} className="rounded-xl border border-[#E2E8F0] p-4">
                  <p className="font-semibold">{String(service.title)}</p>
                  <label className="mt-2 block text-sm">
                    Përshkrim i shkurtër
                    <textarea
                      className="mt-1 w-full rounded-xl border px-3 py-2"
                      defaultValue={String(service.shortDescription)}
                      rows={2}
                      onBlur={(e) =>
                        save("service", { ...service, shortDescription: e.target.value })
                      }
                    />
                  </label>
                </div>
              ))}
            </div>
          )}

          {tab === "faq" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">FAQ</h2>
              {data.faqs.map((faq) => (
                <div key={String(faq.id)} className="rounded-xl border p-4">
                  <input
                    className="w-full rounded-lg border px-3 py-2 text-sm font-medium"
                    defaultValue={String(faq.question)}
                    onBlur={(e) => save("faq-update", { ...faq, question: e.target.value })}
                  />
                  <textarea
                    className="mt-2 w-full rounded-lg border px-3 py-2 text-sm"
                    defaultValue={String(faq.answer)}
                    rows={3}
                    onBlur={(e) => save("faq-update", { ...faq, answer: e.target.value })}
                  />
                </div>
              ))}
              <button
                type="button"
                className="btn-secondary"
                onClick={() =>
                  save("faq-create", {
                    question: "Pyetje e re",
                    answer: "Përgjigje",
                    order: data.faqs.length + 1,
                  })
                }
              >
                + Shto FAQ
              </button>
            </div>
          )}

          {tab === "testimonials" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Dëshmi klientësh</h2>
              {data.testimonials.map((t) => (
                <div key={String(t.id)} className="rounded-xl border p-4">
                  <input
                    className="mb-2 w-full rounded-lg border px-3 py-2"
                    defaultValue={String(t.name)}
                    onBlur={(e) => save("testimonial-update", { ...t, name: e.target.value })}
                  />
                  <textarea
                    className="w-full rounded-lg border px-3 py-2"
                    defaultValue={String(t.text)}
                    rows={3}
                    onBlur={(e) => save("testimonial-update", { ...t, text: e.target.value })}
                  />
                </div>
              ))}
            </div>
          )}

          {tab === "partners" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Partnerë</h2>
              {data.partners.map((p) => (
                <div key={String(p.id)} className="grid gap-2 rounded-xl border p-4 md:grid-cols-2">
                  <input
                    defaultValue={String(p.name)}
                    onBlur={(e) => save("partner-update", { ...p, name: e.target.value })}
                    className="rounded-lg border px-3 py-2"
                  />
                  <input
                    defaultValue={String(p.logoUrl)}
                    onBlur={(e) => save("partner-update", { ...p, logoUrl: e.target.value })}
                    className="rounded-lg border px-3 py-2"
                  />
                </div>
              ))}
              <button
                type="button"
                className="btn-secondary"
                onClick={() =>
                  save("partner-create", {
                    name: "Partner i ri",
                    logoUrl: "/partners/partner-1.svg",
                    order: data.partners.length + 1,
                  })
                }
              >
                + Shto partner
              </button>
            </div>
          )}

          {tab === "knowledge" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Baza e njohurive (Chatbot)</h2>
              {data.knowledge
                .filter((k) => k.source === "manual")
                .map((k) => (
                  <div key={String(k.id)} className="rounded-xl border p-4">
                    <input
                      className="w-full rounded-lg border px-3 py-2 font-medium"
                      defaultValue={String(k.question)}
                      onBlur={(e) => save("knowledge-update", { ...k, question: e.target.value })}
                    />
                    <textarea
                      className="mt-2 w-full rounded-lg border px-3 py-2"
                      defaultValue={String(k.answer)}
                      rows={3}
                      onBlur={(e) => save("knowledge-update", { ...k, answer: e.target.value })}
                    />
                    <button
                      type="button"
                      className="mt-2 text-xs text-red-600"
                      onClick={() => save("knowledge-delete", { id: k.id })}
                    >
                      Fshi
                    </button>
                  </div>
                ))}
              <button
                type="button"
                className="btn-secondary"
                onClick={() =>
                  save("knowledge-create", {
                    question: "Pyetje e re",
                    answer: "Përgjigje",
                    keywords: "",
                  })
                }
              >
                + Shto pyetje/përgjigje
              </button>
            </div>
          )}

          {tab === "docs" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Dokumente për RAG</h2>
              <p className="text-sm text-[#64748B]">Ngarkoni PDF, DOCX ose TXT. Përmbajtja indeksohet për chatbot-in.</p>
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void uploadDoc(f);
                }}
              />
              <ul className="text-sm text-[#475569]">
                {data.documents.map((d) => (
                  <li key={String(d.id)}>{String(d.filename)}</li>
                ))}
              </ul>
            </div>
          )}

          {tab === "appointments" && (
            <div className="space-y-3">
              <h2 className="text-xl font-semibold">Terminet / CRM</h2>
              {data.appointments.map((a) => (
                <div key={String(a.id)} className="rounded-xl border p-4 text-sm">
                  <p className="font-semibold">{String(a.name)} · {String(a.phone)}</p>
                  <p className="text-[#64748B]">{String(a.email)}</p>
                  <p>{String(a.preferredDate)} {String(a.preferredTime)}</p>
                  <p className="mt-1">{String(a.description)}</p>
                  <p className="mt-1 text-xs text-[#94A3B8]">{String(a.source)} · {String(a.createdAt)}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "jobs" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Punë të lira</h2>
              {data.jobs.map((j) => (
                <div key={String(j.id)} className="rounded-xl border p-4">
                  <input
                    className="w-full rounded-lg border px-3 py-2 font-medium"
                    defaultValue={String(j.title)}
                    onBlur={(e) => save("job-update", { ...j, title: e.target.value })}
                  />
                  <textarea
                    className="mt-2 w-full rounded-lg border px-3 py-2"
                    defaultValue={String(j.description)}
                    rows={2}
                    onBlur={(e) => save("job-update", { ...j, description: e.target.value })}
                  />
                </div>
              ))}
              <button
                type="button"
                className="btn-secondary"
                onClick={() =>
                  save("job-create", {
                    title: "Pozicion i ri",
                    location: "Gjermani",
                    description: "Përshkrim",
                    requirements: "Kërkesat",
                    published: true,
                  })
                }
              >
                + Shto punë
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
