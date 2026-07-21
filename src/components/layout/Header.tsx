"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import type { SiteSettings } from "@/generated/prisma/client";
import { LogoMark } from "@/components/brand/LogoMark";

const links = [
  { href: "#ballina", label: "Ballina" },
  { href: "#rreth-nesh", label: "Rreth Nesh" },
  { href: "#sherbimet", label: "Shërbimet" },
  { href: "#procesi", label: "Procesi" },
  { href: "#pyetje", label: "Pyetje" },
  { href: "#kontakt", label: "Kontakt" },
];

export function Header({ settings }: { settings: SiteSettings }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  return (
    <motion.header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? "glass border-b border-white/40 shadow-sm" : "bg-transparent"
      }`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container-luxury flex items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
        <Link href="/" className="group flex items-center gap-2.5" aria-label="Westbal Consulting — Ballina">
          <LogoMark
            variant={scrolled ? "dark" : "light"}
            size={44}
            priority
            className="transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors hover:text-[#2563EB] ${
                scrolled ? "text-[#334155]" : "text-white/90"
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="btn-secondary !py-2.5 !px-4 text-xs">
            <Phone className="h-4 w-4" />
            {settings.secondaryCtaLabel}
          </a>
          <a href="#kontakt" className="btn-primary !py-2.5 !px-5 text-xs">
            {settings.primaryCtaLabel}
          </a>
        </div>

        <button
          type="button"
          className={`rounded-xl p-2 lg:hidden ${scrolled ? "text-[#0F172A]" : "text-white"}`}
          onClick={() => setOpen((o) => !o)}
          aria-label="Meny"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass border-t border-white/40 px-5 pb-6 pt-2 lg:hidden"
        >
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="py-2 text-sm font-medium text-[#0F172A]" onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
            <a href="#kontakt" className="btn-primary mt-2 w-full" onClick={() => setOpen(false)}>
              {settings.primaryCtaLabel}
            </a>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
