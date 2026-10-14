# REPORT.md — Nutting House Web App: Complete Function & Feature Record

> Generated 2026-09-23, extended 2026-09-24 with the staff operations suite, kitchen and blog.
> Describes the application exactly as it stands in this working tree
> (commit base `c4879a4` on `origin/main` plus uncommitted work). Verify with `npx tsc --noEmit` and `npm run lint` (both clean).

---

## 1. What the app is

A Next.js marketing + instant-quotation website for **Nutting House**, a lodge / wedding / conference venue at Plot 6, Burnside Road, Mbombela 1201, Mpumalanga, South Africa (`src/lib/site.ts`). Positioning: *"A serene home away from home"* — 3-star accommodation, 4-star conference venue, 21 years in operation. Phone +27 (0)72 414 4722, WhatsApp `27724144722`, email `info@nuttinghouse.co.za`, Google Maps pin on the Contact page.

There is **no online card payment**. The commercial engine is an **instant EFT quotation flow**: a guest picks dates/room (or venue/pax/catering), the app prices it, issues a reference (e.g. `NH-STAY-2026-8F3K2A`), shows EFT/banking details, and the guest confirms by sending proof of payment (upload or WhatsApp). Card payments (Paystack/Stripe) are stubbed for later — `PAYMENTS.mode: "manual"` (`src/lib/site.ts`).

---

## 2. Tech stack (exact)

| Layer | Choice | Version / file |
|---|---|---|
| Framework | Next.js App Router (Turbopack dev) | `16.3.5` (`package.json`) |
| UI | React + React DOM | `19.2.8` |
| Styling | Tailwind CSS v4 (`@import "tailwindcss"`), custom `@theme` tokens | `tailwindcss@^4`, `src/app/globals.css` |
| Fonts | Fraunces (display) + Manrope (body) via `next/font/google`, `display: swap` | `src/app/layout.tsx` |
| Validation | zod (server-side quote validation) | `zod@^4.6.5`, `src/lib/validation.ts` |
| Database | MongoDB via Mongoose (cached connection) | `mongoose@^9.10.2`, `src/lib/db.ts`, `src/models/Quote.ts` |
| File uploads | Cloudinary SDK (`nutting-house/proofs/` folder) | `cloudinary@^2.11.0`, `src/lib/cloudinary.ts` |
| Images | `next/image` (AVIF/WebP, Cloudinary remote pattern) + legacy `<img>` in a few spots | `next.config.ts` |
| Language | TypeScript strict | `typescript@^5`, `tsconfig.json` |

Scripts: `dev` (`next dev`), `build` (`next build`), `start`, `lint` (`eslint`).

---

## 3. How to run it

```bash
npm install
cp .env.example .env.local   # then fill in keys (Section 9)
npm run dev                  # http://localhost:3000
```

Without MongoDB/Cloudinary keys the app still runs in **demo mode**: quotes are appended to `data/quotes.jsonl` (gitignored), availability checks return "available", uploads are rejected with a 503 message, and `/admin` shows this-device quotes only. With keys set, all server features activate — no code changes needed.

---

## 4. Pages and sections (every route)

### 4.1 `/` — Home (`src/app/page.tsx`, 266 lines)
Order of sections, top to bottom:

1. **Hero** — full-bleed 3-image crossfade slideshow (`src/components/HeroSlideshow.tsx`: lawns → wedding → dam, 18s loop, slow Ken Burns zoom, `prefers-reduced-motion` shows first slide statically). First slide is `priority` + high fetch priority (LCP). Height `min-h-[78svh]`, bleeds under the floating navbar (`-mt-20`). Content: eyebrow, H1 *"A serene home, away from home."*, one-line subcopy, primary CTA **Check availability →** (`/book`) + secondary **Wander the venues** (`/venues`), *"30-second quote · No card needed"* microcopy, trust row (21 years · 4 private venues · occasions).
2. **Stats strip** — forest band: 21+ years / 800+ in one hall / 4 venues.
3. **Marquee** — scrolling strip (Family rooms · Weddings at the dam · 800 in one hall · …), CSS animation, disabled under reduced motion.
4. **Story ("The place")** — image + copy + dual CTAs (Sleep here first → `/stay`, Explore the Lowveld → `/explore`).
5. **Rooms** — dark section rendering all 3 rooms from `ROOMS` with price-from, **Book {name} →** deep links (`/book?room=slug`).
6. **Gallery band ("Postcards")** — 5-tile mosaic linking to `/explore`.
7. **Venues** — 4 cards from `VENUES`, each linking to `/conference`.
8. **Wedding CTA** — full-bleed band: Plan a wedding → `/weddings`, Price your event → `/conference`.
9. **Reviews** (`src/components/Reviews.tsx`) — 3 cards. ⚠️ **Placeholders** (marked `TODO`): replace with real Google reviews before launch.
10. **Facilities strip** — 4 cards (parking, WiFi, bar & buffet, pools & gardens).
11. **FAQ** (`src/components/HomeFaq.tsx`) — 5-question accordion (check-in/out, EFT flow, capacity, weddings, amenities) + FAQPage JSON-LD for SEO.
12. **Final CTA** — forest panel: Check availability + WhatsApp buttons, phone/email.

### 4.2 `/stay` (`src/app/stay/page.tsx`)
Alternating room feature rows (image left/right) with perks pills, sleeps/beds, price-from, **Check dates →** deep links (`/book?room=`). Closes with a pools/lawns banner. SEO title/description/canonical set.

### 4.3 `/venues` (`src/app/venues/page.tsx`)
4 venue cards (tag, capacity, layouts, best-for, price-from/day) each with **Price this venue →** (`/conference?venue=slug`).

### 4.4 `/weddings` (`src/app/weddings/page.tsx`)
Dark full-bleed hero (bleeds under navbar, `-mt-20`), 3-step process cards (dream → design → arrive), 3-image row, CTAs to price the Dam venue and book a site visit.

### 4.5 `/conference` (`src/app/conference/page.tsx`, client)
Event estimate builder: venue picker (4), date (`min=today`), days 1–5, delegates 5–2000, layout (per-venue list), catering (none / half R420 / full R580 pp/day), extras (AV, décor, bar), contact details. **How it works:** live availability fetch on date change (server-backed when Mongo is on; 409-style "already held" banner blocks submit) → `POST /api/quote` → validated server-side (422 shows field issues) → success view renders `QuoteCard` + WhatsApp text + saves copy to `localStorage nh-quotes` (max 50) → "New estimate" resets.

### 4.6 `/book` (`src/app/book/page.tsx`, client)
Same pattern for stays: room picker (reads `?room=` via `Suspense` + `useSearchParams`), check-in/out (`min=today`), adults 1–4, kids 0–3, extras (breakfast R180 pp/night, late checkout R250, KMIA shuttle R900), contact + notes. Live per-room availability badge (Available ✓ / Already held). Success view: thank-you + `QuoteCard` + EFT/proof flow + "Make another quotation".

### 4.7 `/track` (`src/app/track/page.tsx`, client)
Guest self-service: enter reference (e.g. `NH-STAY-2026-XXXXXX`) → `GET /api/quote/[reference]` → full `QuoteCard` re-rendered (lines, total, EFT, proof upload, WhatsApp follow-up text). Requires MongoDB.

### 4.8 `/explore` (`src/app/explore/page.tsx`)
6 attraction cards (Kruger, Blyde Canyon, orchards, on-site activities, Mbombela city, slow afternoons at the dam).

### 4.9 `/contact` (`src/app/contact/page.tsx`)
Address + Maps pin link, phone, email, WhatsApp + Email buttons, entrance photo, nudge to `/book` for quotations.

### 4.11 `/kitchen` (`src/app/kitchen/page.tsx`, server)
Public "From the kitchen" menu. **How it works:** queries MongoDB directly for `available: true` dishes, grouped in order Special → Breakfast → Mains → Dessert → Function, each with photo (`next/image`), description and optional ZAR price. Empty state nudges to WhatsApp. SEO title/description/canonical set; in sitemap; linked in footer. Chefs publish via `/admin/dishes`.

### 4.12 `/blog` + `/blog/[slug]` (`src/app/blog/`, server)
Public stories. Index shows published posts (cover, title, excerpt, date) linking to per-post pages with cover hero, paragraph rendering (blank line = new paragraph), per-post OG metadata + canonical, and a book/WhatsApp CTA band. Data comes straight from MongoDB (`published: true` only). Managed at `/admin/blog`.

### 4.13 Staff operations suite (`/admin/*`, all staff-key gated via `AdminGate`)

| # | Page | What staff do | Data source |
|---|---|---|---|
| 1 | `/admin/briefing` | Owner's 06:00 digest: arrival/departure counts, today's movement, upcoming events, money watch per status, housekeeping + maintenance needing attention, print button | `GET /api/admin/briefing` (also hit by Vercel cron at 04:00 UTC, `vercel.json`; accepts `Bearer CRON_SECRET` or staff key) |
| 2 | `/admin/arrivals` | Front-desk board: checking-in vs checking-out today with names, rooms, pax, phones, references | Same briefing endpoint |
| 3 | `/admin/functions` + `/admin/functions/[reference]` | Function sheets: upcoming confirmed events + group stays; each opens a printable sheet (client, venue, dates, setup, pax, catering, priced lines, total, proof link, print button) | `GET /api/admin/functions`, public `GET /api/quote/[reference]` |
| 4 | `/admin/housekeeping` | Server-backed room task queue: add rooms, change state (Ready/Cleaning/Inspection/Out of order), notes, staff name | `GET/POST /api/admin/housekeeping` |
| 5 | `/admin/rota` | Three tabs — Shifts (add/list upcoming by role, delete), Leave (request, approve/decline), Clock-in (name + in/out punches, latest log, **CSV hours export**) | `/api/admin/rota` (`GET/POST/PATCH/DELETE`, `?type=`, `?format=csv`) |
| 6 | `/admin/maintenance` | Fix-it tickets: title, location, priority (urgent/routine/low), detail, assignee, Cloudinary photo (`maintenance` folder), status transitions | `GET/POST/PATCH /api/admin/maintenance` |
| 7 | `/admin/inbox` | Guest message threads grouped by booking reference (count + last message), open thread view, staff replies | `GET/POST /api/admin/inbox` |
| 8 | `/admin/catering` | Catering calculator (no server needed): pax 5–2000 × meal (breakfast / half-day / full-day / banquet) × wastage buffer % → ingredient order quantities + equipment checklist (plates, glasses, chairs, 8-seat tables…) | Pure client math |
| 9 | `/admin/incidents` | Log complaints, incidents, lost & found with booking-ref link and reporter; resolve/reopen | `GET/POST/PATCH /api/admin/incidents` |
| 10 | `/admin/dishes` | Chef posting: name, chef, description, optional price, category, Cloudinary photo (`food` folder), publish form; live/hidden toggle, delete | `GET/POST/PATCH/DELETE /api/admin/dishes` → renders on `/kitchen` |
| 11 | `/admin/blog` | Blog manager: create draft (title, slug auto-generated, excerpt, cover via `blog` folder), body editor (blank line = paragraph), publish/unpublish, delete | `GET/POST/PATCH/DELETE /api/admin/posts` → renders on `/blog` |

Shared staff UI: `src/components/ImageUpload.tsx` (file → `/api/upload` with folder + staff key). Non-proof upload folders require `x-admin-key` (`src/app/api/upload/route.ts`).

### 4.14 Guest messaging (`/track` form + inbox)
Below every looked-up quotation, guests can **Message the team** (name + text ≤1000 chars) via `POST /api/messages` (no key, but tied to a real reference). Messages appear in `/admin/inbox` threads where staff reply.

---

## 5. Global chrome (on every page via `src/app/layout.tsx`)

- **Navbar** (`src/components/Navbar.tsx`, client): fixed floating frosted pill — transparent glowing nut-mark logo (`logo-glow` white drop-shadow, `public/legacy/img/logo.png`) + "Nutting House / Mbombela · Lowveld" wordmark; desktop links Stay, Venues, Conferences, Weddings, Explore, Contact + clay **Check availability** CTA; mobile hamburger → dropdown panel with links + CTA with phone number.
- **Footer** (`src/components/Footer.tsx`): 4 columns (brand + tagline/grading, Visit with Maps pin/phone/email, Explore links incl. `/track` "Find my booking", `/kitchen` "From the kitchen", `/blog` "Stories", Good to know + check-in/out times + **Staff login →** to `/admin`); copyright bar.
- **Concierge "Nala"** (`src/components/Concierge.tsx`, client): floating labeled **Chat** pill (bottom-right) opening a 320px panel — keyword-matching FAQ bot (prices, weddings, conferences, location, times, pools/family, WiFi/food, booking, human contact) with greeting, quick replies, and **Continue on WhatsApp →** handoff. Rule-based, not AI.
- **Reveal** (`src/components/Reveal.tsx`): IntersectionObserver scroll-reveal wrapper (`threshold 0.12`, optional `slow`); disabled under reduced motion.
- **HotelSchema** (`src/components/HotelSchema.tsx`): Hotel JSON-LD on every page (address, geo −25.4745/30.9707, phone, priceRange, amenities, areaServed, check-in/out).

---

## 6. Quotation engine (the money logic)

Pure functions in `src/lib/quote.ts`; catalog in `src/lib/data.ts`.

**Catalog:** 3 rooms (Standard R950, Executive R1250, Family R1450/night; sleeps/beds/perks/gallery) and 4 venues (Main Hall ≤800 R8500, Rali's Rock ≤400 R7500, Edamini Dam ≤300 R6500, Conference 1A&1B 10–60 R2500/day; layouts, best-for).

**Stay pricing** (`buildStayQuote`): room rate × nights (min 1) + optional breakfast (R180 × pax × nights) + late checkout (R250 flat) + KMIA shuttle (R900 flat). **Venue pricing** (`buildVenueQuote`): hire × days + catering (half R420 / full R580 × pax × days) + AV R3500/day + décor R4500 flat + bar R2500/day. Both: `total` = sum of lines, `depositDue` = 50% rounded, `reference` = `NH-STAY|NH-EVENT-YYYY-XXXXXX` (ambiguous chars excluded), `createdAt` ISO. Lifecycle `status`: `quoted → proof_received → confirmed → paid → checked_in → checked_out` (plus `cancelled`), advanced by staff from the `/admin` pipeline dropdown or `/admin/*` pages.

**Validation** (`src/lib/validation.ts`, zod): room/venue slug enums from catalog; ISO dates; check-out after check-in; nothing in the past; adults 1–6, kids 0–4, days 1–14, pax 5–2000; name ≥2 chars; notes ≤1000; email-or-phone required (at least one), SA phone pattern.

**Availability** (`src/lib/availability.ts`): stay = same `roomSlug` with overlapping `[checkIn, checkOut)` among non-cancelled quotes; venue = same `venueSlug` with overlapping date ranges (days expanded). No MongoDB → no conflicts (demo mode).

---

## 7. API inventory (all routes)

| Method + path | Purpose | Auth | Input → Output |
|---|---|---|---|
| `POST /api/quote` | Validate, overlap-check, price, store quote | none | `{kind:"stay"\|"venue", input}` → `422` issues / `409` conflicts / `200 {ok, quote, stored}` |
| `GET /api/availability?kind=stay&roomSlug&checkIn&checkOut` | Live room check | none | → `{ok, available, conflicts[]}` |
| `GET /api/availability?kind=venue&venueSlug&date&days` | Live venue check | none | → `{ok, available, conflicts[]}` |
| `POST /api/upload` | Proof-of-payment upload | none | multipart `file` (JPG/PNG/WebP/PDF ≤6MB) + `reference` → Cloudinary `secure_url`, sets quote `proof_received` (Mongo). `503` if Cloudinary unconfigured |
| `GET /api/quote/[reference]` | Guest lookup (powers `/track`) | none | → `{ok, quote}` / `404` |
| `PATCH /api/quote/[reference]` | Attach `proofUrl` (guest) or change `status` (staff) | `x-admin-key` required for status | → updated quote / `401` |
| `GET /api/admin/quotes?limit=` | Dashboard feed + pipeline stats | `x-admin-key` | → `{ok, quotes[], stats{total,count}}` |
| `GET /api/admin/briefing` | Morning digest aggregates (arrivals, departures, events, money, housekeeping, maintenance) | `x-admin-key` or `Bearer CRON_SECRET` (Vercel cron 04:00 UTC) | → `{ok, date, arrivals[], departures[], events[], money[], housekeepingAttention[], maintenanceOpen[]}` |
| `GET /api/admin/functions` | Function-sheet source: upcoming confirmed venue events + group stays | `x-admin-key` | → `{ok, events[], stays[]}` |
| `GET/POST /api/admin/housekeeping` | Room task queue (upsert by room) | `x-admin-key` | `{room, state, note?, photoUrl?, updatedBy?}` → `{ok, task}` |
| `GET/POST/PATCH/DELETE /api/admin/rota` | Shifts, leave requests, clock punches (`?type=shifts\|leave\|clock`, `?format=csv` for hours export) | `x-admin-key` | → `{ok, items[]}` / `{ok, item}` |
| `GET/POST/PATCH /api/admin/maintenance` | Fix-it tickets | `x-admin-key` | → `{ok, items[]}` / `{ok, item}` |
| `GET/POST/PATCH /api/admin/incidents` | Complaints, incidents, lost & found | `x-admin-key` | → `{ok, items[]}` / `{ok, item}` |
| `GET/POST /api/admin/inbox` | Message threads by reference + staff replies | `x-admin-key` | `?reference=` → `{ok, messages[]}`; else `{ok, threads[]}` |
| `POST /api/messages` | Guest message from `/track` | none (tied to reference) | `{reference, name, text≤1000}` → `{ok, message}` |
| `POST /api/upload` | Proof + staff photo uploads (`folder`: `proofs` default, `maintenance`, `food`, `blog`) | `x-admin-key` required for non-proof folders | multipart → `{ok, url, public_id}`; proofs auto-link to quote |
| `GET/POST/PATCH/DELETE /api/admin/dishes` | Chef dish manager | `x-admin-key` | → renders on `/kitchen` |
| `GET /api/dishes` | Public menu (available only) | none | → `{ok, dishes[]}` |
| `GET/POST/PATCH/DELETE /api/admin/posts` | Blog manager (slug auto-generated, publish flags) | `x-admin-key` | → renders on `/blog` |
| `GET /api/blog` / `GET /api/blog/[slug]` | Public blog index / post (published only) | none | → `{ok, posts[]}` / `{ok, post}` |

---

## 8. Data: where everything is stored

- **MongoDB** (`src/models/Quote.ts`, collection `nhquotes`): `reference` (unique, indexed), `kind`, `title`, `room|venue`, `roomSlug|venueSlug` (indexed), `nights|days`, `checkIn|checkOut|eventDate`, `lines[{label,amount}]`, `total`, `depositDue`, `input` (raw validated form), `status` (`quoted|proof_received|confirmed|paid|checked_in|checked_out|cancelled`, indexed), `proofUrl`, `proofPublicId`, timestamps. Compound indexes for overlap queries.
- **MongoDB staff collections** (`src/models/staff.ts`): `NHHousekeeping` (room, state, note, photo, updatedBy), `NHShift` (date, role, staffName, shift), `NHLeave` (staffName, from, to, reason, pending/approved/declined), `NHClock` (staffName+date unique, clockIn, clockOut), `NHMaintenance` (title, location, urgent/routine/low, open/in_progress/done, detail, photo, assignedTo), `NHMessage` (reference, guest/staff, name, text), `NHIncident` (complaint/incident/lost/found, title, detail, booking ref, photo, open/resolved, reporter), `NHDish` (name, description, price?, Breakfast/Mains/Dessert/Function/Special, photo, available, postedBy), `NHPost` (slug unique, title, excerpt, body, cover, published, publishedAt).
- **Cloudinary**: proof images/PDFs in `nutting-house/proofs/` (`src/lib/cloudinary.ts`).
- **Browser**: `localStorage nh-quotes` (last 50 quotes, this device), `nh-house` (housekeeping states), `sessionStorage nh-admin-key`.
- **Legacy fallback**: `data/quotes.jsonl` append (gitignored) when MongoDB is absent.
- **Static catalog**: `src/lib/data.ts` (`ROOMS`, `VENUES`, `zar()` ZAR formatter); site constants in `src/lib/site.ts`.

---

## 9. Environment variables (`.env.example` → `.env.local`, never committed)

`MONGODB_URI` (Atlas Node driver string) · `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` · `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (image remote pattern) · `NEXT_PUBLIC_SITE_URL` (canonical/sitemap/OG, default `https://nuttinghouse.co.za`) · `ADMIN_KEY` (≥8 chars, staff login) · `CRON_SECRET` (optional; authorises Vercel cron for the briefing) · `NEXT_PUBLIC_BANK_*` (EFT details shown on quotes). Typed accessors + `hasMongo()/hasCloudinary()/hasAdminKey()` in `src/lib/env.ts`; staff-gate helper `requireAdmin()` / `requireAdminOrCron()` in `src/lib/adminAuth.ts`.

---

## 10. QuoteCard + conversion flow (`src/components/QuoteCard.tsx`, `ProofUpload.tsx`)

Every quote renders: reference header + meta pills → itemised lines → total + 50% deposit → EFT box (real bank details from env, else *"EFT details on confirmation — send reference on WhatsApp"*) → **proof-of-payment uploader** (file picker, 6MB limit, success message + view link) → **Send via WhatsApp** (pre-filled `wa.me` text with reference/dates/total) / **Send via Email** (`mailto:`) / **Print-PDF** (`window.print`, print CSS hides chrome) → validity note (7 days, 48h hold on proof).

---

## 11. SEO / GEO readiness

Global metadata: title template, description, keywords (Mbombela/Nelspruit/Lowveld/Kruger terms), canonical, OG `en_ZA` + Twitter cards with hero image, robots directives, geo meta (`geo.region ZA-MP`, `geo.placename`, `geo.position`, `ICBM`). Structured data: Hotel JSON-LD sitewide + FAQPage JSON-LD on home. `sitemap.ts` (11 pages incl. `/kitchen`, `/blog`), `robots.ts` (allows all except `/admin`, `/api/`), `manifest.ts` (PWA installable, theme `#0e1f14`). Per-page titles/descriptions/canonicals on stay, venues, weddings, explore, contact, kitchen, blog (+ per-post OG/canonical). semantic headings; descriptive image alts; keyword-rich home copy + FAQ content matching the schema.

---

## 12. Design system

Palette (`globals.css` `@theme`): forest 950 `#0e1f14` / 900 `#14291b` / 800 `#1a2e1f`, stone 100 `#f4eee1` / 200 / 300, clay 500 `#c67b4a` (primary CTA) / 600 / 700, ink 900/600 text. Type: Fraunces display + Manrope body. Signature effects: film grain (`.hero-grain`), scroll reveal (`.reveal`), image zoom (`.img-zoom`), marquee, soft float, glowing logo (`.logo-glow`), all with `prefers-reduced-motion` fallbacks and print stylesheet.

---

## 13. What is deliberately NOT done yet (before going live)

1. Fill `.env.local`: MongoDB, Cloudinary, `ADMIN_KEY`, real `NEXT_PUBLIC_BANK_*`, `NEXT_PUBLIC_SITE_URL` (plus `CRON_SECRET` if you want the Vercel briefing cron authorised).
2. Replace `Reviews.tsx` placeholders with real Google reviews; publish the first dishes (`/admin/dishes`) and blog posts (`/admin/blog`) so `/kitchen` and `/blog` aren't empty.
3. Test end-to-end on `npm run dev`: `/book` quote → `/track` lookup + guest message → proof upload → `/admin` unlock → pipeline advance → briefing/arrivals/functions pages.
4. Run `npm run build` and deploy (Vercel: import repo, add env vars; `vercel.json` schedules the briefing cron at 04:00 UTC).
5. Later: Paystack/Stripe (`PAYMENTS` stub ready — reference + totals already payment-ready), wedding-specific builder, gallery lightbox, rota/leave/maintenance in admin, AI concierge.

## 14. Known limitations

- Availability holds exist only once MongoDB is configured (demo mode always "available").
- `/admin` uses a shared `ADMIN_KEY`, not per-user accounts.
- Concierge is keyword rules, not AI; no sent emails/WhatsApp API — only `wa.me`/`mailto:` handoffs.
- ~39MB of legacy JPGs ship in `public/legacy` (home page itself uses `next/image`; other pages mix `next/image` and `<img>`).
- `npm run build` was not run to completion in this environment (slow network for Google Fonts fetch); `tsc` + `lint` are clean.
