import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/product/ProductCard";
import { FilterSidebar } from "@/components/products/FilterSidebar";
import { MobileFilterDrawer } from "@/components/products/MobileFilterDrawer";
import { SortSelect } from "@/components/products/SortSelect";
import { ActiveFilterPills } from "@/components/products/ActiveFilterPills";
import { ProductsPagination } from "@/components/products/ProductsPagination";
import { EmptyState } from "@/components/products/EmptyState";
import {
  flattenSearchParams,
  parseFilters,
  type RawSearchParams,
} from "@/lib/filter-url";
import {
  getBrandsWithCounts,
  getCategoriesWithCounts,
  getPriceBounds,
  getProducts,
  PRODUCTS_PAGE_SIZE,
} from "@/lib/products";

export const metadata: Metadata = {
  title: "Продукти — Nexa",
  description: "Разгледай целия каталог продукти на Nexa.",
};

export const revalidate = 300;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const rawSearchParams = await searchParams;
  const flat = flattenSearchParams(rawSearchParams);
  const filters = parseFilters(flat);

  const [{ products, total }, categories, brands, priceBounds] =
    await Promise.all([
      getProducts({
        category: filters.category,
        brand: filters.brand,
        minRating: filters.minRating,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        sort: filters.sort,
        page: filters.page,
      }),
      getCategoriesWithCounts(),
      getBrandsWithCounts(),
      getPriceBounds(),
    ]);

  const totalPages = Math.max(1, Math.ceil(total / PRODUCTS_PAGE_SIZE));
  const categoryNames = Object.fromEntries(
    categories.map((category) => [category.slug, category.name]),
  );

  const filterSidebar = (
    <FilterSidebar
      flat={flat}
      filters={filters}
      categories={categories}
      brands={brands}
      priceBounds={priceBounds}
    />
  );

  return (
    <div className="bg-white py-10">
      <Container>
        <nav className="mb-4 text-xs text-navy-500">
          <Link href="/" className="hover:text-navy-950">
            Начало
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-navy-800">Продукти</span>
        </nav>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-navy-950">
              Всички продукти
            </h1>
            <p className="mt-1 text-sm text-navy-500">
              {total} {total === 1 ? "продукт" : "продукта"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <MobileFilterDrawer>{filterSidebar}</MobileFilterDrawer>
            <SortSelect flat={flat} value={filters.sort} />
          </div>
        </div>

        <div className="mb-6">
          <ActiveFilterPills
            flat={flat}
            filters={filters}
            categoryNames={categoryNames}
          />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24">{filterSidebar}</div>
          </aside>

          <div>
            {products.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                <ProductsPagination
                  flat={flat}
                  currentPage={filters.page}
                  totalPages={totalPages}
                />
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
