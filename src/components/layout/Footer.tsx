import Link from "next/link";
import type { Service, SiteSettings } from "@/generated/prisma/client";
import { LogoMark } from "@/components/brand/LogoMark";

export function Footer({ settings, services }: { settings: SiteSettings; services: Service[] }) {
  return (
    <footer className="border-t border-[#E2E8F0] bg-white">
      <div className="container-luxury grid gap-10 px-5 py-16 sm:px-8 lg:grid-cols-4 lg:px-12">
        <div>
          <Link href="/" className="inline-flex items-center gap-3" aria-label="Westbal Consulting">
            <LogoMark variant="dark" size={40} />
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-[#64748B]">
            Konsultim premium për punësim, vizë dhe leje qëndrimi në Gjermani.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[#94A3B8]">Linqe</p>
          <ul className="mt-4 space-y-2 text-sm text-[#475569]">
            <li><a href="#ballina">Ballina</a></li>
            <li><a href="#rreth-nesh">Rreth Nesh</a></li>
            <li><a href="#procesi">Procesi</a></li>
            <li><a href="#kontakt">Kontakt</a></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[#94A3B8]">Shërbimet</p>
          <ul className="mt-4 space-y-2 text-sm text-[#475569]">
            {services.slice(0, 6).map((s) => (
              <li key={s.id}>
                <Link href={`/sherbimet/${s.slug}`}>{s.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[#94A3B8]">Ligjore</p>
          <ul className="mt-4 space-y-2 text-sm text-[#475569]">
            <li><Link href="/privatesia">Politika e Privatësisë</Link></li>
            <li><Link href="/kushtet">Kushtet e Përdorimit</Link></li>
          </ul>
          <p className="mt-6 text-sm text-[#64748B]">{settings.email}</p>
          <p className="text-sm text-[#64748B]">{settings.phone}</p>
        </div>
      </div>
      <div className="border-t border-[#E2E8F0] py-6 text-center text-xs text-[#94A3B8]">
        © {new Date().getFullYear()} Westbal Consulting. Të gjitha të drejtat e rezervuara.
      </div>
    </footer>
  );
}
