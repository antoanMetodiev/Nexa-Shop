import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Search, SearchX } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Pagination } from "@/components/ui/Pagination";
import { ProductCard } from "@/components/product/ProductCard";
import { searchProductsPaginated, PRODUCTS_PAGE_SIZE } from "@/lib/products";
import type { RawSearchParams } from "@/lib/filter-url";

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}): Promise<Metadata> {
  const raw = await searchParams;
  const q = first(raw.q)?.trim() ?? "";
  const t = await getTranslations("search");
  return { title: q ? `${t("resultsTitle", { query: q })} — Nexa` : "Nexa" };
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<RawSearchParams>;
}) {
  const { locale } = await params;
  const raw = await searchParams;
  const q = first(raw.q)?.trim() ?? "";
  const pageRaw = first(raw.page);
  const page = pageRaw ? Math.max(1, parseInt(pageRaw, 10) || 1) : 1;

  const [{ products, total }, t, tBreadcrumb] = await Promise.all([
    searchProductsPaginated(q, page),
    getTranslations("search"),
    getTranslations("breadcrumb"),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PRODUCTS_PAGE_SIZE));

  return (
    <div className="bg-white py-10">
      <Container>
        <nav className="mb-4 text-xs text-navy-500">
          <Link href="/" className="hover:text-navy-950">
            {tBreadcrumb("home")}
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-navy-800">
            {q ? t("resultsTitle", { query: q }) : t("placeholder")}
          </span>
        </nav>

        <form
          method="get"
          action={`/${locale}/search`}
          className="mb-8 flex max-w-xl items-center gap-2 rounded-full border border-navy-200 px-4 py-2.5"
        >
          <Search className="size-4 shrink-0 text-navy-400" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder={t("searchAgainPlaceholder")}
            className="min-w-0 flex-1 text-sm text-navy-950 placeholder:text-navy-400 focus:outline-none"
          />
          <button
            type="submit"
            aria-label={t("placeholder")}
            className="flex shrink-0 items-center justify-center rounded-full bg-navy-900 p-2 text-white transition-colors hover:bg-navy-800"
          >
            <Search className="size-4" />
          </button>
        </form>

        {q ? (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-navy-950">
                {t("resultsTitle", { query: q })}
              </h1>
              <p className="mt-1 text-sm text-navy-500">
                {t("resultsCount", { count: total })}
              </p>
            </div>

            {products.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-24 text-center">
                <span className="flex size-14 items-center justify-center rounded-full bg-navy-50 text-navy-400">
                  <SearchX className="size-7" />
                </span>
                <p className="text-sm text-navy-500">
                  {t("noResults", { query: q })}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                <Pagination
                  basePath="/search"
                  currentPage={page}
                  totalPages={totalPages}
                  extraParams={{ q }}
                />
              </>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-navy-50 text-navy-400">
              <Search className="size-7" />
            </span>
            <p className="text-sm text-navy-500">{t("startTyping")}</p>
          </div>
        )}
      </Container>
    </div>
  );
}
