import { BANKING, SITE } from "@/lib/site";
import { zar } from "@/lib/data";

export default function QuoteCard({
  title,
  reference,
  lines,
  total,
  depositDue,
  meta,
  whatsappText,
}: {
  title: string;
  reference: string;
  lines: { label: string; amount: number }[];
  total: number;
  depositDue: number;
  meta: string[];
  whatsappText: string;
}) {
  const wa = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(whatsappText)}`;
  const mail = `mailto:${SITE.email}?subject=${encodeURIComponent(`Booking ${reference}`)}&body=${encodeURIComponent(whatsappText)}`;
  return (
    <div className="overflow-hidden rounded-3xl border border-forest-800/15 bg-white shadow-xl">
      <div className="bg-forest-950 px-6 py-5 text-stone-100">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-300">{title}</p>
        <h3 className="font-display mt-1 text-2xl">{reference}</h3>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          {meta.map((m) => (
            <span key={m} className="rounded-full bg-white/10 px-3 py-1">{m}</span>
          ))}
        </div>
      </div>
      <div className="px-6 py-5">
        <ul className="divide-y text-sm">
          {lines.map((l) => (
            <li key={l.label} className="flex items-center justify-between gap-4 py-2">
              <span>{l.label}</span>
              <span className="font-semibold">{zar(l.amount)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center justify-between rounded-xl bg-stone-100 px-4 py-3">
          <span className="font-semibold">Total</span>
          <span className="font-display text-2xl">{zar(total)}</span>
        </div>
        <p className="mt-2 text-sm">
          Deposit to secure (50%): <strong>{zar(depositDue)}</strong> · Balance on arrival.
        </p>
        <div className="mt-4 rounded-xl border border-dashed border-clay-500/60 bg-stone-100 p-4 text-sm">
          <p className="font-semibold">Pay via EFT (manual) — no card needed</p>
          <p className="mt-1">Bank: {BANKING.bank}</p>
          <p>Account: {BANKING.accountName} · {BANKING.accountNumber}</p>
          <p>Branch: {BANKING.branchCode} · {BANKING.accountType}</p>
          <p className="mt-1 font-medium">Reference: {reference}</p>
          <p className="mt-1 text-xs text-ink-600">{BANKING.referenceNote}</p>
        </div>
        <div className="no-print mt-4 grid gap-2 sm:grid-cols-3">
          <a href={wa} target="_blank" className="rounded-full bg-[#25D366] px-4 py-2.5 text-center text-sm font-semibold text-white">
            Send via WhatsApp
          </a>
          <a href={mail} className="rounded-full bg-forest-900 px-4 py-2.5 text-center text-sm font-semibold text-white">
            Send via Email
          </a>
          <button onClick={() => window.print()} className="rounded-full border border-forest-900 px-4 py-2.5 text-sm font-semibold">
            Print / PDF
          </button>
        </div>
        <p className="mt-3 text-xs text-ink-600">
          Valid 7 days. Your dates are held for 48 hours once you send proof of payment. Card payments (Paystack/Stripe) coming soon — this reference will carry over.
        </p>
      </div>
    </div>
  );
}
