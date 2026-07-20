"use client";

import { useState } from "react";
import { Mail, MapPin, MessageCircle, Phone, Clock } from "lucide-react";
import { apiUrl } from "@/lib/api-base";
import { Reveal } from "@/components/motion/Reveal";
import type { SiteSettings } from "@/generated/prisma/client";

export function ContactSection({ settings }: { settings: SiteSettings }) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = new FormData(e.currentTarget);
    const res = await fetch(apiUrl("/api/contact"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });
    setStatus(res.ok ? "ok" : "err");
  }

  const wa = settings.whatsapp.replace(/\s/g, "");

  return (
    <section id="kontakt" className="section-padding bg-[#F8FAFC]">
      <div className="container-luxury">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2563EB]">Kontakt</p>
          <h2 className="heading-lg mt-3">Rezervoni konsultimin tuaj</h2>
          <p className="body-lg mt-4">Na tregoni profilin tuaj — ne kthehemi me hapat e ardhshëm dhe një plan të qartë.</p>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-5">
          <Reveal className="card-luxury p-8 lg:col-span-2">
            <h3 className="text-lg font-semibold">Westbal Consulting</h3>
            <ul className="mt-6 space-y-4 text-sm text-[#475569]">
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-5 w-5 text-[#2563EB]" />
                <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-[#2563EB]">
                  {settings.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-[#2563EB]" />
                <a href={`mailto:${settings.email}`} className="hover:text-[#2563EB]">
                  {settings.email}
                </a>
              </li>
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-[#2563EB]" />
                {settings.address}
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-5 w-5 text-[#2563EB]" />
                {settings.officeHours}
              </li>
            </ul>
            <a
              href={`https://wa.me/${wa.replace("+", "")}`}
              target="_blank"
              rel="noreferrer"
              className="btn-primary mt-8 w-full"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
            <div className="mt-6 overflow-hidden rounded-2xl border border-[#E2E8F0]">
              <iframe
                title="Harta e zyrës"
                src={
                  settings.mapEmbedUrl ||
                  "https://maps.google.com/maps?q=Prishtina&z=13&output=embed"
                }
                className="h-48 w-full border-0"
                loading="lazy"
              />
            </div>
          </Reveal>

          <Reveal delay={0.08} className="card-luxury p-8 lg:col-span-3">
            <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
              <Field label="Emri" name="name" required />
              <Field label="Telefoni" name="phone" required />
              <Field label="Email" name="email" type="email" required className="md:col-span-2" />
              <Field label="Data e preferuar" name="preferredDate" type="date" className="md:col-span-1" />
              <Field label="Ora e preferuar" name="preferredTime" type="time" className="md:col-span-1" />
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-[#334155]">Përshkrim i shkurtër</label>
                <textarea
                  name="description"
                  rows={4}
                  required
                  className="mt-2 w-full rounded-xl border border-[#E2E8F0] px-4 py-3 text-sm outline-none ring-[#2563EB]/20 focus:ring-4"
                  placeholder="Profili, sektori, pyetjet kryesore..."
                />
              </div>
              <div className="md:col-span-2">
                <button type="submit" disabled={status === "loading"} className="btn-primary w-full md:w-auto">
                  {status === "loading" ? "Duke dërguar..." : settings.primaryCtaLabel}
                </button>
                {status === "ok" && (
                  <p className="mt-3 text-sm text-[#10B981]">Faleminderit! Do t&apos;ju kontaktojmë shpejt.</p>
                )}
                {status === "err" && (
                  <p className="mt-3 text-sm text-red-600">Ndodhi një gabim. Provoni përsëri ose na telefononi.</p>
                )}
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  className = "",
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="text-sm font-medium text-[#334155]">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full rounded-xl border border-[#E2E8F0] px-4 py-3 text-sm outline-none ring-[#2563EB]/20 focus:ring-4"
      />
    </div>
  );
}
