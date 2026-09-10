-- Nexa: fast ILIKE-based search over product title/brand.
--
-- pg_trgm lets a GIN index accelerate `ILIKE '%term%'` (substring, not just
-- prefix) queries, which is what the search-as-you-type feature needs.
create extension if not exists pg_trgm;

create index if not exists products_title_trgm_idx
  on public.products using gin (title gin_trgm_ops);

create index if not exists products_brand_trgm_idx
  on public.products using gin (brand gin_trgm_ops);
