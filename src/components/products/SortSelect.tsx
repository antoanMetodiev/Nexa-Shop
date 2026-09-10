"use client";

import { useRouter } from "next/navigation";
import { buildProductsHref, type FlatParams } from "@/lib/filter-url";
import type { SortOption } from "@/lib/products";

const SORT_LABELS: Record<SortOption, string> = {
  featured: "Препоръчани",
  "price-asc": "Цена: ниска към висока",
  "price-desc": "Цена: висока към ниска",
  "rating-desc": "Най-високо оценени",
};

export function SortSelect({
  flat,
  value,
}: {
  flat: FlatParams;
  value: SortOption;
}) {
  const router = useRouter();

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
      {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
        <option key={option} value={option}>
          {SORT_LABELS[option]}
        </option>
      ))}
    </select>
  );
}
