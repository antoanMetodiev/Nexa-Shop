import { supabase } from "@/lib/supabase/client";
import type { ProductRow } from "@/lib/supabase/types";

export type Product = ProductRow;
export type Category = { slug: string; name: string };

function toTitleCase(slug: string): string {
  return slug
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export function categoryDisplayName(slug: string): string {
  return toTitleCase(slug);
}

export async function getTopRatedProducts(limit = 8): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("rating", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getTopRatedProducts failed:", error.message);
    return [];
  }
  return data;
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from("products").select("category");

  if (error || !data) {
    console.error("getCategories failed:", error?.message);
    return [];
  }

  const slugs = Array.from(new Set(data.map((row) => row.category))).sort();
  return slugs.map((slug) => ({ slug, name: toTitleCase(slug) }));
}

export async function getCategoryThumbnail(
  slug: string,
): Promise<string | null> {
  const { data, error } = await supabase
    .from("products")
    .select("thumbnail")
    .eq("category", slug)
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return data.thumbnail;
}

export type CategoryCount = Category & { count: number };
export type BrandCount = { name: string; count: number };

export async function getCategoriesWithCounts(): Promise<CategoryCount[]> {
  const { data, error } = await supabase.from("products").select("category");

  if (error || !data) {
    console.error("getCategoriesWithCounts failed:", error?.message);
    return [];
  }

  const counts = new Map<string, number>();
  for (const row of data) {
    counts.set(row.category, (counts.get(row.category) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([slug, count]) => ({ slug, name: toTitleCase(slug), count }));
}

export async function getProductsCount(): Promise<number> {
  const { count, error } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("getProductsCount failed:", error.message);
    return 0;
  }
  return count ?? 0;
}

export async function getBrandsWithCounts(): Promise<BrandCount[]> {
  const { data, error } = await supabase
    .from("products")
    .select("brand")
    .not("brand", "is", null);

  if (error || !data) {
    console.error("getBrandsWithCounts failed:", error?.message);
    return [];
  }

  const counts = new Map<string, number>();
  for (const row of data) {
    if (!row.brand) continue;
    counts.set(row.brand, (counts.get(row.brand) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, count]) => ({ name, count }));
}

export async function getPriceBounds(): Promise<{ min: number; max: number }> {
  const [minRes, maxRes] = await Promise.all([
    supabase
      .from("products")
      .select("price")
      .order("price", { ascending: true })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("products")
      .select("price")
      .order("price", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  return {
    min: Math.floor(minRes.data?.price ?? 0),
    max: Math.ceil(maxRes.data?.price ?? 0),
  };
}

export const PRODUCTS_PAGE_SIZE = 12;

export const SORT_OPTIONS = [
  "featured",
  "price-asc",
  "price-desc",
  "rating-desc",
] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

export type ProductsQuery = {
  category?: string[];
  brand?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort?: SortOption;
  page?: number;
};

export type ProductsResult = {
  products: Product[];
  total: number;
};

export async function getProducts(
  query: ProductsQuery = {},
): Promise<ProductsResult> {
  const page = query.page && query.page > 0 ? query.page : 1;
  const from = (page - 1) * PRODUCTS_PAGE_SIZE;
  const to = from + PRODUCTS_PAGE_SIZE - 1;

  let request = supabase.from("products").select("*", { count: "exact" });

  if (query.category?.length) {
    request = request.in("category", query.category);
  }
  if (query.brand?.length) {
    request = request.in("brand", query.brand);
  }
  if (query.minPrice != null) {
    request = request.gte("price", query.minPrice);
  }
  if (query.maxPrice != null) {
    request = request.lte("price", query.maxPrice);
  }
  if (query.minRating != null) {
    request = request.gte("rating", query.minRating);
  }

  switch (query.sort) {
    case "price-asc":
      request = request.order("price", { ascending: true });
      break;
    case "price-desc":
      request = request.order("price", { ascending: false });
      break;
    case "rating-desc":
      request = request.order("rating", { ascending: false });
      break;
    default:
      request = request.order("id", { ascending: true });
  }

  const { data, error, count } = await request.range(from, to);

  if (error || !data) {
    console.error("getProducts failed:", error?.message);
    return { products: [], total: 0 };
  }

  return { products: data, total: count ?? 0 };
}

export async function getDealsProducts(page = 1): Promise<ProductsResult> {
  const pageIndex = page > 0 ? page : 1;
  const from = (pageIndex - 1) * PRODUCTS_PAGE_SIZE;
  const to = from + PRODUCTS_PAGE_SIZE - 1;

  const { data, error, count } = await supabase
    .from("products")
    .select("*", { count: "exact" })
    .gt("discount_percentage", 1)
    .order("discount_percentage", { ascending: false })
    .range(from, to);

  if (error || !data) {
    console.error("getDealsProducts failed:", error?.message);
    return { products: [], total: 0 };
  }

  return { products: data, total: count ?? 0 };
}

export async function getProductById(id: number): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("getProductById failed:", error.message);
    return null;
  }
  return data;
}

export async function getRelatedProducts(
  category: string,
  excludeId: number,
  limit = 4,
): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .neq("id", excludeId)
    .order("rating", { ascending: false })
    .limit(limit);

  if (error || !data) {
    console.error("getRelatedProducts failed:", error?.message);
    return [];
  }
  return data;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function discountedPrice(product: Product): number {
  return product.price * (1 - product.discount_percentage / 100);
}
