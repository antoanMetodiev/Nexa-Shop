export const SITE_NAME = "Nexa";

export const MAIN_NAV = [
  { key: "home", href: "/" },
  { key: "products", href: "/products" },
  { key: "categories", href: "/categories" },
  { key: "deals", href: "/deals" },
  { key: "about", href: "/about" },
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
