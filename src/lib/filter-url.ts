import { SORT_OPTIONS, type SortOption } from "@/lib/products";

export type RawSearchParams = Record<string, string | string[] | undefined>;

const FILTER_KEYS = [
  "category",
  "brand",
  "rating",
  "minPrice",
  "maxPrice",
  "sort",
  "page",
] as const;
type FilterKey = (typeof FILTER_KEYS)[number];

export type FlatParams = Partial<Record<FilterKey, string>>;

export type ProductsFilters = {
  category: string[];
  brand: string[];
  minRating?: number;
  minPrice?: number;
  maxPrice?: number;
  sort: SortOption;
  page: number;
};

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function flattenSearchParams(searchParams: RawSearchParams): FlatParams {
  const out: FlatParams = {};
  for (const key of FILTER_KEYS) {
    const value = first(searchParams[key]);
    if (value) out[key] = value;
  }
  return out;
}

export function parseFilters(flat: FlatParams): ProductsFilters {
  const category = flat.category?.split(",").filter(Boolean) ?? [];
  const brand = flat.brand?.split(",").filter(Boolean) ?? [];
  const minRating = flat.rating ? Number(flat.rating) : undefined;
  const minPrice = flat.minPrice ? Number(flat.minPrice) : undefined;
  const maxPrice = flat.maxPrice ? Number(flat.maxPrice) : undefined;
  const sort = (SORT_OPTIONS as readonly string[]).includes(flat.sort ?? "")
    ? (flat.sort as SortOption)
    : "featured";
  const page = flat.page ? Math.max(1, parseInt(flat.page, 10) || 1) : 1;

  return {
    category,
    brand,
    minRating: Number.isFinite(minRating) ? minRating : undefined,
    minPrice: Number.isFinite(minPrice) ? minPrice : undefined,
    maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
    sort,
    page,
  };
}

export function buildProductsHref(
  base: FlatParams,
  overrides: FlatParams,
  options: { resetPage?: boolean } = {},
): string {
  const merged: FlatParams = { ...base, ...overrides };
  if (options.resetPage !== false && !("page" in overrides)) {
    delete merged.page;
  }

  const usp = new URLSearchParams();
  for (const key of FILTER_KEYS) {
    const value = merged[key];
    if (value) usp.set(key, value);
  }

  const qs = usp.toString();
  return qs ? `/products?${qs}` : "/products";
}

export function toggleListValue(
  current: string | undefined,
  value: string,
): string | undefined {
  const values = current ? current.split(",").filter(Boolean) : [];
  const next = values.includes(value)
    ? values.filter((v) => v !== value)
    : [...values, value];
  return next.length ? next.join(",") : undefined;
}
