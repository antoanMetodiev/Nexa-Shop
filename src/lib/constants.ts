export const SITE_NAME = "Nexa";

/** Flat shipping fee (EUR) below the free-shipping threshold. Shared by
 * OrderSummary (display) and the Stripe checkout session (actual charge) so
 * the two can never drift apart. */
export const SHIPPING_FEE = 9.99;

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

/**
 * Placeholder store location — swap this out once a real address is decided.
 * Used for the /contact page's Google Maps embed and "open in Maps" link.
 */
export const STORE_ADDRESS = "1 Vitosha Blvd, 1000 Sofia, Bulgaria";
export const STORE_EMAIL = "hello@nexa-shop.example";
export const STORE_PHONE = "+359 2 123 4567";
export const STORE_PHONE_HREF = "+35921234567";

export const STORE_MAPS_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(STORE_ADDRESS)}&output=embed`;
export const STORE_MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE_ADDRESS)}`;
