"use client";
import Link from "next/link";
import { useState } from "react";
import { SITE } from "@/lib/site";

const LINKS = [
  { href: "/stay", label: "Stay" },
  { href: "/venues", label: "Venues" },
  { href: "/conference", label: "Conferences" },
  { href: "/weddings", label: "Weddings" },
  { href: "/explore", label: "Explore" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto mt-3 flex max-w-6xl items-center justify-between gap-3 rounded-2xl border border-white/20 bg-forest-950/80 px-4 py-3 text-stone-100 shadow-xl backdrop-blur-md">
        <Link href="/" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/legacy/img/logo.png" alt="Nutting House nut mark" className="logo-glow h-10 w-auto" />
          <span className="leading-tight">
            <span className="font-display block text-lg tracking-wide">Nutting House</span>
            <span className="block text-[11px] uppercase tracking-[0.2em] text-stone-300">Mbombela · Lowveld</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm lg:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-stone-200 transition hover:text-white">
              {l.label}
            </Link>
          ))}
          <Link
            href="/book"
            className="rounded-full bg-clay-500 px-5 py-2.5 font-semibold text-white shadow hover:bg-clay-600"
          >
            Check availability
          </Link>
        </nav>
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg border border-white/20 px-3 py-2 text-sm lg:hidden"
          aria-label="Menu"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open && (
        <div className="mx-auto mt-2 max-w-6xl rounded-2xl border border-white/10 bg-forest-950/95 p-4 text-stone-100 backdrop-blur lg:hidden">
          <div className="grid gap-1">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 hover:bg-white/10">
                {l.label}
              </Link>
            ))}
            <Link href="/book" onClick={() => setOpen(false)} className="mt-2 rounded-full bg-clay-500 px-5 py-3 text-center font-semibold text-white">
              Check availability · {SITE.phone}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
