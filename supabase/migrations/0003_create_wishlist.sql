-- Nexa: wishlist table, ready for when Clerk auth is wired up.
--
-- user_id will hold the Clerk user id (a plain string) once auth exists.
-- Until Clerk's JWT is passed through to Supabase (Authentication > Third
-- Party Auth), we cannot safely scope RLS to a verified identity - so this
-- table is created with RLS enabled and NO policies, meaning the anon /
-- publishable key has zero access to it. That's the correct, safe default
-- for an unused table. Real policies (using auth.jwt() claims from Clerk)
-- should be added alongside the auth integration.
create table if not exists public.wishlist_items (
  id bigint generated always as identity primary key,
  user_id text not null,
  product_id bigint not null references public.products (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create index if not exists wishlist_items_user_id_idx
  on public.wishlist_items (user_id);

alter table public.wishlist_items enable row level security;
