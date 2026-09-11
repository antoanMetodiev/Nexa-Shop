# Nexa — Modern E-Commerce Storefront

**Live demo:** [https://nexa-shop.nexa-shop2026.workers.dev](https://nexa-shop.nexa-shop2026.workers.dev)

Nexa is a full-featured, Shopify-inspired online store built from scratch with Next.js and Supabase — a complete storefront, customer accounts, and an internal admin panel, all wired to real backend services rather than mocked data. It ships as a bilingual (Bulgarian/English) shopping experience with dual EUR/BGN pricing, animated UI, and a Stripe-powered checkout.

## ✨ Features

### Storefront
- Full product catalog with category/price/rating/brand filters, sorting, and pagination
- Product detail pages with image galleries, tabs (description/shipping/reviews), and related products
- Live search with instant dropdown suggestions + a dedicated results page
- Deals page (products sorted by biggest discount)
- Cart and wishlist that persist to your account when signed in, and fall back to `localStorage` as a guest — merged automatically on sign-in
- Dual-currency pricing (EUR primary, BGN alongside) throughout the site
- Fully bilingual UI (BG/EN) via locale-prefixed routing, with per-page metadata and translated content
- Smooth, purposeful motion throughout (hover states, staggered grids, page transitions) built on top of `motion`

### Accounts & Auth
- Supabase Auth — email/password and "Sign in with Google"
- Self-service profile settings: display name, phone number, avatar upload (Supabase Storage), and password changes
- Session-aware header (avatar, join date, sign-out) that updates live across the app

### Checkout & Payments
- Stripe Checkout (hosted Checkout Session) with guest and signed-in checkout support
- Webhook-driven order recording — orders are only written to the database once payment is confirmed, never eagerly from the client
- Dynamic shipping cost based on an admin-configurable free-shipping threshold

### Admin Panel
A code-complete internal dashboard at `/admin`, gated by role-based access control:
- Dashboard with live stats (products, categories, orders, revenue, active promo codes)
- Full product CRUD (create/edit/delete, with a proper form and image fields)
- Category management (merge products between categories)
- Order list and detail views with status updates
- Customer list (real signed-up users, not mock data)
- Discount code management (percentage or fixed-amount codes)
- Store settings (contact info, free-shipping threshold) — reflected live on the public site

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | [motion](https://motion.dev) |
| Database & Auth | [Supabase](https://supabase.com) (Postgres, Auth, Storage, Row Level Security) |
| Payments | [Stripe](https://stripe.com) (Checkout Sessions + webhooks) |
| Internationalization | [next-intl](https://next-intl.dev) |
| Deployment | Cloudflare Workers, via [vinext](https://github.com/vinxi/vinext) |
| Seed data | [DummyJSON](https://dummyjson.com) |

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- A [Supabase](https://supabase.com) project
- A [Stripe](https://stripe.com) account (test mode is enough for local development)

### Setup

```bash
npm install
```

Create a `.env.local` file with:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

Run the SQL migrations in `supabase/migrations/` against your Supabase project (via the SQL Editor, in numeric order), then seed the product catalog:

```bash
npm run db:seed          # pulls the base catalog from DummyJSON
npm run db:seed-more      # adds a hand-curated set of extra (mostly tech) products
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For local Stripe webhook testing, forward events with the [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## 📦 Deployment

Nexa deploys to **Cloudflare Workers** via [vinext](https://github.com/vinxi/vinext), a Vite-based Next.js runtime built for the Workers platform:

```bash
npm run build:vinext
npm run deploy:vinext
```

The standard `npm run dev` / `npm run build` (plain Next.js) continue to work as usual for local development.

## 📁 Project Structure

```
src/
  app/[locale]/(shop)/    Public storefront pages (cart, checkout, account, auth, etc.)
  app/[locale]/admin/     Admin panel
  app/api/webhooks/       Stripe webhook handler
  app/auth/callback/      OAuth callback route
  components/             UI components, grouped by feature area
  lib/                    Data access, contexts, Supabase/Stripe clients, server actions
  i18n/                   next-intl routing/navigation config
supabase/migrations/      Versioned SQL migrations
messages/                 bg.json / en.json translation catalogs
```

## 📝 Notes

- Product data is seeded from [DummyJSON](https://dummyjson.com) for demo purposes, supplemented with hand-authored listings; this is not a real inventory.
- Stripe is configured in **test mode** — no real payments are processed.

---

Built as a hands-on exercise in shipping a production-shaped e-commerce app end-to-end: real auth, a real database, real payments infrastructure, and an admin surface to run it all.
