-- Prices display in EUR (with BGN alongside) as of this session's currency
-- change (see src/lib/products.ts formatPrice) — orders should charge and
-- record in EUR going forward, not the original 'usd' default.
alter table public.orders alter column currency set default 'eur';
