import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  buildProductsHref,
  toggleListValue,
  type FlatParams,
  type ProductsFilters,
} from "@/lib/filter-url";
import type { BrandCount, CategoryCount } from "@/lib/products";

const RATING_OPTIONS = [4, 3, 2, 1] as const;

function FilterCheckbox({
  href,
  checked,
  label,
  count,
}: {
  href: string;
  checked: boolean;
  label: string;
  count: number;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      className="flex items-center gap-2.5 rounded-md px-1.5 py-1.5 text-sm transition-colors hover:bg-navy-50"
    >
      <span
        className={`flex size-4 shrink-0 items-center justify-center rounded border ${
          checked
            ? "border-navy-900 bg-navy-900"
            : "border-navy-300 bg-white"
        }`}
      >
        {checked && (
          <svg viewBox="0 0 24 24" className="size-3 text-white" fill="none">
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span
        className={
          checked
            ? "font-medium text-navy-950"
            : "text-navy-600"
        }
      >
        {label}
      </span>
      <span className="ml-auto text-xs text-navy-400">{count}</span>
    </Link>
  );
}

export function FilterSidebar({
  locale,
  flat,
  filters,
  categories,
  brands,
  priceBounds,
}: {
  locale: string;
  flat: FlatParams;
  filters: ProductsFilters;
  categories: CategoryCount[];
  brands: BrandCount[];
  priceBounds: { min: number; max: number };
}) {
  const t = useTranslations("products.filters");
  const hasActiveFilters =
    filters.category.length > 0 ||
    filters.brand.length > 0 ||
    filters.minRating != null ||
    filters.minPrice != null ||
    filters.maxPrice != null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-navy-950">
          {t("heading")}
        </h2>
        {hasActiveFilters && (
          <Link
            href="/products"
            className="text-xs font-medium text-navy-500 hover:text-navy-950"
          >
            {t("clearAll")}
          </Link>
        )}
      </div>

      <section className="flex flex-col gap-1 border-b border-navy-100 pb-6">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy-400">
          {t("category")}
        </h3>
        {categories.map((category) => (
          <FilterCheckbox
            key={category.slug}
            href={buildProductsHref(flat, {
              category: toggleListValue(flat.category, category.slug),
            })}
            checked={filters.category.includes(category.slug)}
            label={category.name}
            count={category.count}
          />
        ))}
      </section>

      <section className="flex flex-col gap-3 border-b border-navy-100 pb-6">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-navy-400">
          {t("price")}
        </h3>
        <form
          method="get"
          action={`/${locale}/products`}
          className="flex items-center gap-2"
        >
          {flat.category && <input type="hidden" name="category" value={flat.category} />}
          {flat.brand && <input type="hidden" name="brand" value={flat.brand} />}
          {flat.rating && <input type="hidden" name="rating" value={flat.rating} />}
          {flat.sort && <input type="hidden" name="sort" value={flat.sort} />}
          <input
            type="number"
            name="minPrice"
            min={0}
            defaultValue={flat.minPrice ?? ""}
            placeholder={`${priceBounds.min}`}
            className="w-full min-w-0 rounded-md border border-navy-200 px-2.5 py-1.5 text-sm text-navy-950 placeholder:text-navy-400 focus:border-navy-500 focus:outline-none"
          />
          <span className="text-navy-300">–</span>
          <input
            type="number"
            name="maxPrice"
            min={0}
            defaultValue={flat.maxPrice ?? ""}
            placeholder={`${priceBounds.max}`}
            className="w-full min-w-0 rounded-md border border-navy-200 px-2.5 py-1.5 text-sm text-navy-950 placeholder:text-navy-400 focus:border-navy-500 focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-md bg-navy-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-navy-800"
          >
            {t("apply")}
          </button>
        </form>
      </section>

      <section className="flex flex-col gap-1 border-b border-navy-100 pb-6">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy-400">
          {t("rating")}
        </h3>
        {RATING_OPTIONS.map((rating) => {
          const checked = filters.minRating === rating;
          return (
            <Link
              key={rating}
              href={buildProductsHref(flat, {
                rating: checked ? undefined : String(rating),
              })}
              scroll={false}
              className="flex items-center gap-2.5 rounded-md px-1.5 py-1.5 text-sm transition-colors hover:bg-navy-50"
            >
              <span
                className={`flex size-4 shrink-0 items-center justify-center rounded-full border ${
                  checked
                    ? "border-navy-900 bg-navy-900"
                    : "border-navy-300 bg-white"
                }`}
              >
                {checked && <span className="size-1.5 rounded-full bg-white" />}
              </span>
              <span className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`size-3.5 ${
                      index < rating
                        ? "fill-navy-700 text-navy-700"
                        : "fill-navy-100 text-navy-100"
                    }`}
                  />
                ))}
              </span>
              <span className="text-navy-600">{t("andUp")}</span>
            </Link>
          );
        })}
      </section>

      <section className="flex max-h-72 flex-col gap-1 overflow-y-auto pr-1">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy-400">
          {t("brand")}
        </h3>
        {brands.map((brand) => (
          <FilterCheckbox
            key={brand.name}
            href={buildProductsHref(flat, {
              brand: toggleListValue(flat.brand, brand.name),
            })}
            checked={filters.brand.includes(brand.name)}
            label={brand.name}
            count={brand.count}
          />
        ))}
      </section>
    </div>
  );
}
