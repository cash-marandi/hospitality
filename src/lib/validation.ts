import { z } from "zod";
import { ROOMS, VENUES } from "./data";

const roomSlugs = ROOMS.map((r) => r.slug);
const venueSlugs = VENUES.map((v) => v.slug);

const saPhone = z
  .string()
  .trim()
  .min(9, "Phone looks too short")
  .max(16, "Phone looks too long")
  .regex(/^[+0][0-9\s-]{8,15}$/, "Enter a valid SA phone, e.g. 072 414 4722");

const emailOpt = z.string().trim().email("Enter a valid email").optional().or(z.literal(""));

const todayISO = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
};

export const stayInputSchema = z
  .object({
    roomSlug: z.enum(roomSlugs as [string, ...string[]]),
    checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a check-in date"),
    checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a check-out date"),
    adults: z.coerce.number().int().min(1).max(6),
    kids: z.coerce.number().int().min(0).max(4),
    extras: z.object({
      breakfast: z.boolean(),
      lateCheckout: z.boolean(),
      shuttle: z.boolean(),
    }),
    name: z.string().trim().min(2, "Add your full name").max(80),
    email: emailOpt,
    phone: z.string().trim().optional().or(z.literal("")),
    notes: z.string().trim().max(1000).optional().or(z.literal("")),
  })
  .superRefine((v, ctx) => {
    if (!v.email && !v.phone) {
      ctx.addIssue({ code: "custom", message: "Add email or phone so we can confirm", path: ["phone"] });
    }
    if (v.phone) {
      const r = saPhone.safeParse(v.phone);
      if (!r.success) ctx.addIssue({ code: "custom", message: r.error.issues[0].message, path: ["phone"] });
    }
    if (v.checkIn < todayISO()) {
      ctx.addIssue({ code: "custom", message: "Check-in can't be in the past", path: ["checkIn"] });
    }
    if (v.checkOut <= v.checkIn) {
      ctx.addIssue({ code: "custom", message: "Check-out must be after check-in", path: ["checkOut"] });
    }
  });

export const venueInputSchema = z
  .object({
    venueSlug: z.enum(venueSlugs as [string, ...string[]]),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick an event date"),
    days: z.coerce.number().int().min(1).max(14),
    pax: z.coerce.number().int().min(5).max(2000),
    layout: z.string().trim().min(2).max(40),
    catering: z.enum(["none", "half", "full"]),
    extras: z.object({ av: z.boolean(), decor: z.boolean(), bar: z.boolean() }),
    name: z.string().trim().min(2, "Add your full name").max(80),
    email: emailOpt,
    phone: z.string().trim().optional().or(z.literal("")),
    notes: z.string().trim().max(1000).optional().or(z.literal("")),
  })
  .superRefine((v, ctx) => {
    if (!v.email && !v.phone) {
      ctx.addIssue({ code: "custom", message: "Add email or phone so we can confirm", path: ["phone"] });
    }
    if (v.phone) {
      const r = saPhone.safeParse(v.phone);
      if (!r.success) ctx.addIssue({ code: "custom", message: r.error.issues[0].message, path: ["phone"] });
    }
    if (v.date < todayISO()) {
      ctx.addIssue({ code: "custom", message: "Event date can't be in the past", path: ["date"] });
    }
  });

export const quoteBodySchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("stay"), input: stayInputSchema }),
  z.object({ kind: z.literal("venue"), input: venueInputSchema }),
]);

export type StayInput = z.infer<typeof stayInputSchema>;
export type VenueInput = z.infer<typeof venueInputSchema>;
