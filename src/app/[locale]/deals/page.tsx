import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Tag } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Pagination } from "@/components/ui/Pagination";
import { ProductCard } from "@/components/product/ProductCard";
import { getDealsProducts, PRODUCTS_PAGE_SIZE } from "@/lib/products";
import type { RawSearchParams } from "@/lib/filter-url";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("dealsPage");
  return { title: `${t("title")} — Nexa` };
}

export const revalidate = 300;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function DealsPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const rawSearchParams = await searchParams;
  const pageRaw = first(rawSearchParams.page);
  const page = pageRaw ? Math.max(1, parseInt(pageRaw, 10) || 1) : 1;

  const [{ products, total }, t, tBreadcrumb] = await Promise.all([
    getDealsProducts(page),
    getTranslations("dealsPage"),
    getTranslations("breadcrumb"),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PRODUCTS_PAGE_SIZE));
  const topDiscount = products[0]
    ? Math.round(products[0].discount_percentage)
    : 0;

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-navy-950">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#1f2e4d,transparent_60%)]"
        />
        <Container>
          <FadeIn className="relative flex flex-col items-start gap-4 py-16">
            <nav className="text-xs text-navy-300">
              <Link href="/" className="hover:text-white">
                {tBreadcrumb("home")}
              </Link>
              <span className="mx-1.5">/</span>
              <span className="text-white">{t("title")}</span>
            </nav>

            {topDiscount > 0 && (
              <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-navy-100">
                <Tag className="size-3.5" />
                {t("badge", { percent: topDiscount })}
              </span>
            )}

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {t("heading")}
            </h1>
            <p className="max-w-lg text-sm text-navy-200 sm:text-base">
              {t("subtitle")}
            </p>
          </FadeIn>
        </Container>
      </section>

      <Container>
        <div className="py-10">
          {products.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-24 text-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-navy-50 text-navy-400">
                <Tag className="size-7" />
              </span>
              <p className="font-medium text-navy-950">{t("emptyTitle")}</p>
              <p className="text-sm text-navy-500">{t("emptySubtitle")}</p>
            </div>
          ) : (
            <>
              <StaggerGrid
                key={page}
                className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4"
              >
                {products.map((product) => (
                  <StaggerItem key={product.id}>
                    <ProductCard product={product} />
                  </StaggerItem>
                ))}
              </StaggerGrid>
              <Pagination
                basePath="/deals"
                currentPage={page}
                totalPages={totalPages}
              />
            </>
          )}
        </div>
      </Container>
    </div>
  );
}
