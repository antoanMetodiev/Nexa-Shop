import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { UspBar } from "@/components/home/UspBar";
import {
  getCategories,
  getBrandsWithCounts,
  getProductsCount,
} from "@/lib/products";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("aboutPage");
  return { title: `${t("badge")} — Nexa` };
}

export const revalidate = 3600;

export default async function AboutPage() {
  const [productsCount, categories, brands, t, tBreadcrumb] =
    await Promise.all([
      getProductsCount(),
      getCategories(),
      getBrandsWithCounts(),
      getTranslations("aboutPage"),
      getTranslations("breadcrumb"),
    ]);

  const stats = [
    { value: productsCount, label: t("stats.products") },
    { value: categories.length, label: t("stats.categories") },
    { value: brands.length, label: t("stats.brands") },
  ];

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-navy-950">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#1f2e4d,transparent_60%)]"
        />
        <Container>
          <FadeIn className="relative flex flex-col items-start gap-4 py-16 sm:py-20">
            <nav className="text-xs text-navy-300">
              <Link href="/" className="hover:text-white">
                {tBreadcrumb("home")}
              </Link>
              <span className="mx-1.5">/</span>
              <span className="text-white">{t("badge")}</span>
            </nav>

            <span className="rounded-full border border-navy-600 px-3 py-1 text-xs font-medium uppercase tracking-widest text-navy-200">
              {t("badge")}
            </span>

            <h1 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              {t("heading")}
            </h1>
            <p className="max-w-xl text-base text-navy-200 sm:text-lg">
              {t("subtitle")}
            </p>
          </FadeIn>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr]">
            <FadeIn>
              <h2 className="text-2xl font-bold tracking-tight text-navy-950">
                {t("storyHeading")}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-navy-600">
                {t("storyBody1")}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-navy-600">
                {t("storyBody2")}
              </p>
            </FadeIn>

            <StaggerGrid className="grid grid-cols-3 gap-4 self-start rounded-2xl border border-navy-100 p-6 sm:gap-6 sm:p-8">
              {stats.map((stat) => (
                <StaggerItem key={stat.label} className="text-center">
                  <p className="text-2xl font-bold text-navy-950 sm:text-3xl">
                    {stat.value}+
                  </p>
                  <p className="mt-1 text-xs text-navy-500 sm:text-sm">
                    {stat.label}
                  </p>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>
        </Container>
      </section>

      <section className="border-t border-navy-100 py-16">
        <Container>
          <FadeIn>
            <h2 className="mb-8 text-2xl font-bold tracking-tight text-navy-950">
              {t("valuesHeading")}
            </h2>
          </FadeIn>
        </Container>
        <UspBar />
      </section>

      <section className="py-16">
        <Container>
          <FadeIn className="flex flex-col items-center gap-4 rounded-2xl bg-navy-900 px-8 py-14 text-center sm:px-16">
            <h2 className="max-w-xl text-2xl font-bold text-white sm:text-3xl">
              {t("ctaHeading")}
            </h2>
            <p className="max-w-md text-sm text-navy-200">
              {t("ctaSubtitle")}
            </p>
            <Link
              href="/products"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-navy-950 transition-all hover:scale-[1.03] hover:bg-navy-100 active:scale-95"
            >
              {t("ctaButton")}
              <ArrowRight className="size-4" />
            </Link>
          </FadeIn>
        </Container>
      </section>
    </div>
  );
}
