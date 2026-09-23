export const SITE = {
  name: "Nutting House",
  tagline: "A serene home away from home",
  location: "Plot 6, Burnside Road, Mbombela, 1201, Mpumalanga, South Africa",
  phone: "+27 (0)72 414 4722",
  phoneHref: "tel:+27724144722",
  whatsapp: "27724144722",
  email: "info@nuttinghouse.co.za",
  mapsPin: "https://maps.app.goo.gl/MkJct9cXrxk7Qoa79",
  grading: "3-star accommodation · 4-star conference venue",
  years: 21,
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://nuttinghouse.co.za",
  geo: { lat: -25.4745, lng: 30.9707, region: "ZA-MP", placename: "Mbombela, Mpumalanga" },
};

// Banking comes from public env so the client can render EFT details.
// Set these in .env.local (see .env.example). Until set, the UI hides
// raw placeholders and asks guests to confirm via WhatsApp instead.
export const BANKING = {
  bank: process.env.NEXT_PUBLIC_BANK_NAME || "",
  accountName: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME || "Nutting House",
  accountNumber: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER || "",
  branchCode: process.env.NEXT_PUBLIC_BANK_BRANCH_CODE || "",
  accountType: process.env.NEXT_PUBLIC_BANK_ACCOUNT_TYPE || "Current / Cheque",
  referenceNote: "Use your quotation reference (e.g. NH-2026-8F3K2A) as payment reference.",
};

export const BANKING_CONFIGURED =
  BANKING.bank !== "" && BANKING.accountNumber !== "" && !BANKING.accountNumber.includes("[");

// Payments are intentionally manual for v1 (EFT quotation).
// When ready, plug Paystack/Stripe here — the quote API already
// creates a payment-ready reference + amount in cents.
export const PAYMENTS = {
  mode: "manual" as "manual" | "paystack" | "stripe",
  paystackPublicKey: "",
  stripePublicKey: "",
};
