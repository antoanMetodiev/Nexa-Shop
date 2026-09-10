export const SITE_NAME = "Nexa";

export const MAIN_NAV = [
  { label: "Начало", href: "/" },
  { label: "Продукти", href: "/products" },
  { label: "Категории", href: "/categories" },
  { label: "Промоции", href: "/deals" },
  { label: "За нас", href: "/about" },
] as const;

/** Curated category slugs shown in the homepage category grid. */
export const HOMEPAGE_CATEGORY_SLUGS = [
  "smartphones",
  "laptops",
  "mens-shoes",
  "womens-bags",
  "sunglasses",
  "fragrances",
] as const;
