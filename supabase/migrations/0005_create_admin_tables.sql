-- Nexa: tables backing the admin panel (orders, discounts, store settings).
--
-- Orders/discounts have no writer yet (checkout/Stripe isn't built), so these
-- start empty. Admin panel reads them for real (not mocked), and Stripe
-- checkout will insert into orders/order_items once it exists.
--
-- All mutations from the admin panel go through server actions using the
-- Supabase service role key (never exposed to the client), gated by a Clerk
-- "admin" role check. RLS stays enabled with no public write policies as a
-- defense-in-depth backstop — the anon/publishable key can never write here.
create table if not exists public.orders (
  id bigint generated always as identity primary key,
  user_id text,
  email text not null,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'fulfilled', 'cancelled', 'refunded')),
  subtotal numeric(10, 2) not null,
  shipping numeric(10, 2) not null default 0,
  total numeric(10, 2) not null,
  currency text not null default 'usd',
  shipping_address jsonb,
  stripe_payment_intent_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

create table if not exists public.order_items (
  id bigint generated always as identity primary key,
  order_id bigint not null references public.orders (id) on delete cascade,
  product_id bigint references public.products (id) on delete set null,
  title text not null,
  thumbnail text,
  unit_price numeric(10, 2) not null,
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);

create table if not exists public.discount_codes (
  id bigint generated always as identity primary key,
  code text not null unique,
  type text not null check (type in ('percentage', 'fixed')),
  value numeric(10, 2) not null check (value > 0),
  active boolean not null default true,
  starts_at timestamptz,
  expires_at timestamptz,
  usage_limit integer,
  used_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Singleton row (id is always 1) holding editable store info that currently
-- lives as hardcoded constants (src/lib/constants.ts). Public pages read it
-- (with a fallback to those constants if the row is ever missing), only the
-- admin panel writes it.
create table if not exists public.store_settings (
  id smallint primary key default 1 check (id = 1),
  store_name text not null,
  contact_email text not null,
  contact_phone text not null,
  address text not null,
  free_shipping_threshold numeric(10, 2) not null default 100,
  updated_at timestamptz not null default now()
);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.discount_codes enable row level security;
alter table public.store_settings enable row level security;

-- store_settings is the one admin table the public storefront also reads
-- (header/footer/contact/homepage), so it gets a public SELECT policy —
-- everything else (orders, order_items, discount_codes) stays locked down.
create policy "Public can read store settings"
  on public.store_settings for select
  using (true);
