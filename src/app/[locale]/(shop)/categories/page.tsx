import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { getCategoriesWithCounts, getCategoryThumbnail } from "@/lib/products";
import type { CategorySlug } from "@/i18n/category-slug";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("categoriesPage");
  return { title: `${t("title")} - Nexa` };
}

export const revalidate = 3600;

export default async function CategoriesPage() {
  const [categories, t, tBreadcrumb, tCategoryNames, tProducts] =
    await Promise.all([
      getCategoriesWithCounts(),
      getTranslations("categoriesPage"),
      getTranslations("breadcrumb"),
      getTranslations("categoryNames"),
      getTranslations("products"),
    ]);

  const thumbnails = await Promise.all(
    categories.map((category) => getCategoryThumbnail(category.slug)),
  );

  return (
    <div className="bg-white py-10">
      <Container>
        <nav className="mb-4 text-xs text-navy-500">
          <Link href="/" className="hover:text-navy-950">
            {tBreadcrumb("home")}
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-navy-800">{t("title")}</span>
        </nav>

        <FadeIn>
          <h1 className="text-3xl font-bold tracking-tight text-navy-950">
            {t("title")}
          </h1>
          <p className="mt-1 text-sm text-navy-500">{t("subtitle")}</p>
        </FadeIn>

        <StaggerGrid className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {categories.map((category, index) => (
            <StaggerItem key={category.slug}>
              <Link
                href={`/products?category=${category.slug}`}
                className="group flex flex-col items-center gap-3 rounded-xl border border-navy-100 p-5 text-center transition-all hover:-translate-y-1 hover:border-navy-300 hover:bg-navy-50 hover:shadow-md"
              >
                <div className="relative size-20 overflow-hidden rounded-full bg-navy-50">
                  {thumbnails[index] && (
                    <Image
                      src={thumbnails[index]}
                      alt={tCategoryNames(category.slug as CategorySlug)}
                      fill
                      sizes="80px"
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-navy-800">
                    {tCategoryNames(category.slug as CategorySlug)}
                  </p>
                  <p className="mt-0.5 text-xs text-navy-400">
                    {tProducts("count", { count: category.count })}
                  </p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </Container>
    </div>
  );
}
