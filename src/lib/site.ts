export const SITE = {
  name: "Nutting House",
  tagline: "A serene home away from home",
  location: "Plot 6, Burnside Road, Mbombela, 1201",
  phone: "+27 (0)72 414 4722",
  phoneHref: "tel:+27724144722",
  whatsapp: "27724144722",
  email: "info@nuttinghouse.co.za",
  mapsPin: "https://maps.app.goo.gl/MkJct9cXrxk7Qoa79",
  grading: "3-star accommodation · 4-star conference venue",
  years: 21,
};

// TODO: Replace with Nutting House's real banking details before going live.
// Shown on every auto-generated quotation so guests can do manual EFT.
export const BANKING = {
  bank: "[Your Bank — e.g. First National Bank]",
  accountName: "Nutting House",
  accountNumber: "[Account number]",
  branchCode: "[Branch code]",
  accountType: "Current / Cheque",
  referenceNote: "Use your quotation reference (e.g. NH-2026-8F3K2A) as payment reference.",
};

// Payments are intentionally manual for v1 (EFT quotation).
// When ready, plug Paystack/Stripe here — the quote API already
// creates a payment-ready reference + amount in cents.
export const PAYMENTS = {
  mode: "manual" as "manual" | "paystack" | "stripe",
  paystackPublicKey: "",
  stripePublicKey: "",
};
