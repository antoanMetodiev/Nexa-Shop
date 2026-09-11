-- Cart for signed-in users. Stores a snapshot of title/thumbnail/price at
-- add-to-cart time (matches order_items in migration 0005, and the current
-- localStorage CartItem shape) rather than a live join to products, so the
-- price shown doesn't drift after adding - same behavior as before, just
-- persisted.
create table if not exists public.cart_items (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id bigint not null references public.products (id) on delete cascade,
  title text not null,
  thumbnail text not null,
  price numeric(10, 2) not null,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create index if not exists cart_items_user_id_idx on public.cart_items (user_id);

alter table public.cart_items enable row level security;

create policy "Users can view their own cart items"
  on public.cart_items for select
  using (auth.uid() = user_id);

create policy "Users can insert their own cart items"
  on public.cart_items for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own cart items"
  on public.cart_items for update
  using (auth.uid() = user_id);

create policy "Users can delete their own cart items"
  on public.cart_items for delete
  using (auth.uid() = user_id);
