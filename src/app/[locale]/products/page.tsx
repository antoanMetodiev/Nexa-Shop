import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
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
import type { CategorySlug } from "@/i18n/category-slug";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("products");
  return { title: `${t("title")} — Nexa` };
}

export const revalidate = 300;

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<RawSearchParams>;
}) {
  const { locale } = await params;
  const rawSearchParams = await searchParams;
  const flat = flattenSearchParams(rawSearchParams);
  const filters = parseFilters(flat);

  const [
    { products, total },
    categoriesRaw,
    brands,
    priceBounds,
    t,
    tCategoryNames,
  ] = await Promise.all([
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
    getTranslations("products"),
    getTranslations("categoryNames"),
  ]);
  const tBreadcrumb = await getTranslations("breadcrumb");

  const categories = categoriesRaw.map((category) => ({
    ...category,
    name: tCategoryNames(category.slug as CategorySlug),
  }));

  const totalPages = Math.max(1, Math.ceil(total / PRODUCTS_PAGE_SIZE));
  const categoryNames = Object.fromEntries(
    categories.map((category) => [category.slug, category.name]),
  );

  const filterSidebar = (
    <FilterSidebar
      locale={locale}
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
            {tBreadcrumb("home")}
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-navy-800">{t("breadcrumb")}</span>
        </nav>

        <FadeIn className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-navy-950">
              {t("title")}
            </h1>
            <p className="mt-1 text-sm text-navy-500">
              {t("count", { count: total })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <MobileFilterDrawer>{filterSidebar}</MobileFilterDrawer>
            <SortSelect flat={flat} value={filters.sort} />
          </div>
        </FadeIn>

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
                <StaggerGrid
                  key={JSON.stringify(flat)}
                  className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4"
                >
                  {products.map((product) => (
                    <StaggerItem key={product.id}>
                      <ProductCard product={product} />
                    </StaggerItem>
                  ))}
                </StaggerGrid>
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
