import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  buildProductsHref,
  toggleListValue,
  type FlatParams,
  type ProductsFilters,
} from "@/lib/filter-url";
import { formatPrice } from "@/lib/products";

function Pill({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      scroll={false}
      className="flex items-center gap-1.5 rounded-full border border-navy-200 bg-white py-1 pl-3 pr-2 text-xs font-medium text-navy-800 transition-colors hover:border-navy-400"
    >
      {label}
      <X className="size-3.5 text-navy-400" />
    </Link>
  );
}

export function ActiveFilterPills({
  flat,
  filters,
  categoryNames,
}: {
  flat: FlatParams;
  filters: ProductsFilters;
  categoryNames: Record<string, string>;
}) {
  const t = useTranslations("products.activeFilters");
  const pills: { key: string; label: string; href: string }[] = [];

  for (const slug of filters.category) {
    pills.push({
      key: `category-${slug}`,
      label: categoryNames[slug] ?? slug,
      href: buildProductsHref(flat, {
        category: toggleListValue(flat.category, slug),
      }),
    });
  }

  for (const brand of filters.brand) {
    pills.push({
      key: `brand-${brand}`,
      label: brand,
      href: buildProductsHref(flat, {
        brand: toggleListValue(flat.brand, brand),
      }),
    });
  }

  if (filters.minRating != null) {
    pills.push({
      key: "rating",
      label: t("ratingLabel", { rating: filters.minRating }),
      href: buildProductsHref(flat, { rating: undefined }),
    });
  }

  if (filters.minPrice != null || filters.maxPrice != null) {
    const min = filters.minPrice != null ? formatPrice(filters.minPrice) : "0";
    const max = filters.maxPrice != null ? formatPrice(filters.maxPrice) : "∞";
    pills.push({
      key: "price",
      label: `${min} – ${max}`,
      href: buildProductsHref(flat, { minPrice: undefined, maxPrice: undefined }),
    });
  }

  if (pills.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {pills.map((pill) => (
        <Pill key={pill.key} label={pill.label} href={pill.href} />
      ))}
      <Link
        href="/products"
        scroll={false}
        className="text-xs font-medium text-navy-500 hover:text-navy-950"
      >
        {t("clearAll")}
      </Link>
    </div>
  );
}
