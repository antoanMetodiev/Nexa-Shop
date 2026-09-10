-- Nexa: products table + public read-only RLS policy
create table if not exists public.products (
  id bigint generated always as identity primary key,
  dummy_id integer unique,
  slug text unique not null,
  title text not null,
  description text,
  category text not null,
  brand text,
  price numeric(10, 2) not null,
  discount_percentage numeric(5, 2) not null default 0,
  rating numeric(3, 2) not null default 0,
  stock integer not null default 0,
  thumbnail text not null,
  images text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category);

alter table public.products enable row level security;

drop policy if exists "Public can read products" on public.products;
create policy "Public can read products"
  on public.products
  for select
  to anon, authenticated
  using (true);
