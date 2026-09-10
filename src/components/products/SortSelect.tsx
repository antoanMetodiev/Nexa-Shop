"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { buildProductsHref, type FlatParams } from "@/lib/filter-url";
import { SORT_OPTIONS, type SortOption } from "@/lib/products";

export function SortSelect({
  flat,
  value,
}: {
  flat: FlatParams;
  value: SortOption;
}) {
  const router = useRouter();
  const t = useTranslations("products.sort");

  const labels: Record<SortOption, string> = {
    featured: t("featured"),
    "price-asc": t("priceAsc"),
    "price-desc": t("priceDesc"),
    "rating-desc": t("ratingDesc"),
  };

  return (
    <select
      value={value}
      onChange={(event) => {
        const sort = event.target.value as SortOption;
        router.push(
          buildProductsHref(flat, {
            sort: sort === "featured" ? undefined : sort,
          }),
          { scroll: false },
        );
      }}
      className="rounded-full border border-navy-200 bg-white px-4 py-2 text-sm font-medium text-navy-800 focus:border-navy-500 focus:outline-none"
    >
      {SORT_OPTIONS.map((option) => (
        <option key={option} value={option}>
          {labels[option]}
        </option>
      ))}
    </select>
  );
}
