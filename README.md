# Nutting House · Mbombela

Next.js lodge / weddings / conferences site with instant EFT quotations.

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in keys
npm run dev
```

Open http://localhost:3000.

## Keys you must add (`.env.local`)

| Key | Where | Used for |
| --- | --- | --- |
| `MONGODB_URI` | MongoDB Atlas → Connect → Node driver | Stores quotes/bookings, availability holds, proof links |
| `CLOUDINARY_CLOUD_NAME` / `API_KEY` / `API_SECRET` | Cloudinary → Dashboard | Proof-of-payment uploads (`nutting-house/proofs/`) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | same as above | Enables `next/image` Cloudinary remote pattern |
| `NEXT_PUBLIC_SITE_URL` | your domain | Canonical, sitemap, OG |
| `ADMIN_KEY` | choose long random | Unlocks `/admin` server quotes + confirm/cancel |
| `NEXT_PUBLIC_BANK_*` | your bank | EFT details on QuoteCard (hidden until set) |

Without Mongo/Cloudinary the app still runs in demo mode (local JSONL + this-device admin), but availability checks and server quotes need Mongo.

## Key routes

- `/book` stay quotes · `/conference` event estimates · `/track` find booking by reference
- `POST /api/quote` validated (zod), overlap-checked, saved to Mongo
- `GET /api/availability?kind=stay&roomSlug&checkIn&checkOut`
- `POST /api/upload` multipart `file + reference` → Cloudinary → links to quote
- `GET /api/quote/[reference]` guest lookup · `PATCH` proof attach / admin status
- `GET /api/admin/quotes` (header `x-admin-key`) → `/admin` dashboard

## SEO/GEO

- Global metadata + OG/Twitter + canonical in `src/app/layout.tsx`
- Hotel JSON-LD (`HotelSchema`), geo meta (`geo.region ZA-MP`, ICBM), `sitemap.ts`, `robots.ts` (blocks `/admin`, `/api/`), `manifest.ts`
- Per-page titles/descriptions/canonicals on stay, venues, weddings, explore, contact

## Deploy (Vercel)

1. Push to GitHub, import in Vercel
2. Add all `.env.local` vars in Vercel → Environment Variables
3. Deploy. Test `/api/availability` and a `/book` quote, then `/admin`.
