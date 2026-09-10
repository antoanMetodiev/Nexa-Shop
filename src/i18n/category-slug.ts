import type messages from "../../messages/bg.json";

/**
 * Category slugs are dynamic (sourced from the database), but the
 * translation dictionary covers a known, fixed set of DummyJSON
 * categories — cast through this type at the `t("categoryNames.<slug>")`
 * call sites instead of loosening the whole messages type.
 */
export type CategorySlug = keyof typeof messages.categoryNames;
