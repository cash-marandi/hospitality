import Reveal from "@/components/Reveal";
import { SITE } from "@/lib/site";

export const metadata = { title: "Contact | Nutting House" };

export default function Contact() {
  const wa = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent("Hello Nutting House! I'd like to check availability.")}`;
  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.3em] text-clay-600">Contact</p>
        <h1 className="font-display mt-2 text-5xl">Come see it. You&apos;ll believe it.</h1>
      </Reveal>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Reveal>
          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <p className="font-display text-2xl">Visit / call / WhatsApp</p>
            <p className="mt-3">{SITE.location}</p>
            <a href={SITE.mapsPin} target="_blank" className="mt-1 inline-block font-semibold text-clay-600 underline">Open Google Maps pin →</a>
            <p className="mt-4 text-lg font-semibold">{SITE.phone}</p>
            <p>{SITE.email}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={wa} target="_blank" className="rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white">WhatsApp us →</a>
              <a href={`mailto:${SITE.email}`} className="rounded-full bg-forest-900 px-6 py-3 text-sm font-semibold text-white">Email us</a>
            </div>
            <p className="mt-4 text-sm text-ink-600">Fastest: use <a href="/book" className="underline">Check availability</a> — your quotation arrives with EFT details and a reference to quote on WhatsApp.</p>
          </div>
        </Reveal>
        <Reveal>
          <div className="overflow-hidden rounded-3xl shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/legacy/img/1.jpg" alt="Nutting House entrance" className="h-full min-h-[380px] w-full object-cover" />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
