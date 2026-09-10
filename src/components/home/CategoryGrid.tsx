import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { getCategories, getCategoryThumbnail } from "@/lib/products";
import { HOMEPAGE_CATEGORY_SLUGS } from "@/lib/constants";
import type { CategorySlug } from "@/i18n/category-slug";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";

export async function CategoryGrid() {
  const [categories, t, tCategoryNames] = await Promise.all([
    getCategories(),
    getTranslations("home.categories"),
    getTranslations("categoryNames"),
  ]);

  const curated = HOMEPAGE_CATEGORY_SLUGS.map((slug) =>
    categories.find((category) => category.slug === slug),
  ).filter((category): category is NonNullable<typeof category> =>
    Boolean(category),
  );

  const thumbnails = await Promise.all(
    curated.map((category) => getCategoryThumbnail(category.slug)),
  );

  return (
    <section className="bg-white py-16">
      <Container>
        <FadeIn className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-navy-950">
            {t("heading")}
          </h2>
          <Link
            href="/categories"
            className="text-sm font-medium text-navy-600 hover:text-navy-950"
          >
            {t("viewAll")}
          </Link>
        </FadeIn>

        <StaggerGrid className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {curated.map((category, index) => (
            <StaggerItem key={category.slug}>
              <Link
                href={`/products?category=${category.slug}`}
                className="group flex flex-col items-center gap-3 rounded-xl border border-navy-100 p-4 text-center transition-all hover:-translate-y-1 hover:border-navy-300 hover:bg-navy-50 hover:shadow-md"
              >
                <div className="relative size-16 overflow-hidden rounded-full bg-navy-50">
                  {thumbnails[index] && (
                    <Image
                      src={thumbnails[index]}
                      alt={tCategoryNames(category.slug as CategorySlug)}
                      fill
                      sizes="64px"
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  )}
                </div>
                <span className="text-sm font-medium text-navy-800">
                  {tCategoryNames(category.slug as CategorySlug)}
                </span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </Container>
    </section>
  );
}
