-- Nexa: extra product detail fields for the product detail page
alter table public.products
  add column if not exists sku text,
  add column if not exists tags text[] not null default '{}',
  add column if not exists warranty_information text,
  add column if not exists shipping_information text,
  add column if not exists return_policy text,
  add column if not exists availability_status text,
  add column if not exists reviews jsonb not null default '[]';
