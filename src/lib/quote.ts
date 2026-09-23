import { ROOMS, VENUES } from "./data";

export type StayQuoteInput = {
  roomSlug: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  kids: number;
  extras: { breakfast: boolean; lateCheckout: boolean; shuttle: boolean };
  name: string;
  email: string;
  phone: string;
  notes: string;
};

export type StayQuote = {
  reference: string;
  room: string;
  nights: number;
  lines: { label: string; amount: number }[];
  total: number;
  depositDue: number;
  input: StayQuoteInput;
  createdAt: string;
};

export type VenueQuoteInput = {
  venueSlug: string;
  date: string;
  days: number;
  pax: number;
  layout: string;
  catering: "none" | "half" | "full";
  extras: { av: boolean; decor: boolean; bar: boolean };
  name: string;
  email: string;
  phone: string;
  notes: string;
};

export type VenueQuote = {
  reference: string;
  venue: string;
  lines: { label: string; amount: number }[];
  total: number;
  depositDue: number;
  input: VenueQuoteInput;
  createdAt: string;
};

export function makeReference(prefix = "NH"): string {
  const d = new Date();
  const y = d.getFullYear();
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `${prefix}-${y}-${s}`;
}

export function nightsBetween(a: string, b: string): number {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.max(0, Math.round(ms / 86400000));
}

export function buildStayQuote(input: StayQuoteInput): StayQuote {
  const room = ROOMS.find((r) => r.slug === input.roomSlug) ?? ROOMS[0];
  const nights = Math.max(1, nightsBetween(input.checkIn, input.checkOut));
  const lines = [{ label: `${room.name} × ${nights} night${nights > 1 ? "s" : ""}`, amount: room.priceFrom * nights }];
  if (input.extras.breakfast) {
    const pax = input.adults + input.kids;
    lines.push({ label: `Breakfast × ${pax} guest${pax === 1 ? "" : "s"} × ${nights} night${nights > 1 ? "s" : ""}`, amount: 180 * pax * nights });
  }
  if (input.extras.lateCheckout) lines.push({ label: "Late checkout (until 12:00)", amount: 250 });
  if (input.extras.shuttle) lines.push({ label: "Airport shuttle (KMIA return)", amount: 900 });
  const total = lines.reduce((t, l) => t + l.amount, 0);
  return {
    reference: makeReference("NH-STAY"),
    room: room.name,
    nights,
    lines,
    total,
    depositDue: Math.round(total * 0.5),
    input,
    createdAt: new Date().toISOString(),
  };
}

const CATERING_RATES: Record<string, { label: string; perPaxDay: number }> = {
  none: { label: "Venue only", perPaxDay: 0 },
  half: { label: "Half-day catering (tea + lunch)", perPaxDay: 420 },
  full: { label: "Full-day catering (tea + lunch + water)", perPaxDay: 580 },
};

export function buildVenueQuote(input: VenueQuoteInput): VenueQuote {
  const venue = VENUES.find((v) => v.slug === input.venueSlug) ?? VENUES[0];
  const days = Math.max(1, input.days);
  const lines = [{ label: `${venue.name} hire × ${days} day${days > 1 ? "s" : ""}`, amount: venue.priceFrom * days }];
  const cat = CATERING_RATES[input.catering];
  if (input.catering !== "none") {
    lines.push({ label: `${cat.label} × ${input.pax} pax × ${days} day${days > 1 ? "s" : ""}`, amount: cat.perPaxDay * input.pax * days });
  }
  if (input.extras.av) lines.push({ label: "AV + sound + projector", amount: 3500 * days });
  if (input.extras.decor) lines.push({ label: "Décor & styling", amount: 4500 });
  if (input.extras.bar) lines.push({ label: "Cash bar service", amount: 2500 * days });
  const total = lines.reduce((t, l) => t + l.amount, 0);
  return {
    reference: makeReference("NH-EVENT"),
    venue: venue.name,
    lines,
    total,
    depositDue: Math.round(total * 0.5),
    input,
    createdAt: new Date().toISOString(),
  };
}
