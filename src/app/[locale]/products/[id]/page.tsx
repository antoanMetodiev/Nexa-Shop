import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { ProductGallery } from "@/components/products/ProductGallery";
import { AddToCartPanel } from "@/components/products/AddToCartPanel";
import { WishlistButton } from "@/components/product/WishlistButton";
import { ProductTabs } from "@/components/products/ProductTabs";
import { RelatedProducts } from "@/components/products/RelatedProducts";
import {
  discountedPrice,
  formatPrice,
  getProductById,
  getRelatedProducts,
} from "@/lib/products";
import type { CategorySlug } from "@/i18n/category-slug";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(Number(id));
  if (!product) return {};

  return {
    title: `${product.title} — Nexa`,
    description: product.description ?? undefined,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isFinite(productId)) notFound();

  const product = await getProductById(productId);
  if (!product) notFound();

  const [related, t, tBreadcrumb, tCategoryNames] = await Promise.all([
    getRelatedProducts(product.category, product.id, 4),
    getTranslations("productDetail"),
    getTranslations("breadcrumb"),
    getTranslations("categoryNames"),
  ]);

  const hasDiscount = product.discount_percentage > 1;
  const finalPrice = discountedPrice(product);
  const categoryName = tCategoryNames(product.category as CategorySlug);
  const availabilityLabel =
    product.availability_status === "In Stock"
      ? t("inStock")
      : product.availability_status === "Low Stock"
        ? t("lowStock")
        : product.stock > 0
          ? t("inStock")
          : t("outOfStock");

  return (
    <div className="bg-white py-10">
      <Container>
        <nav className="mb-6 text-xs text-navy-500">
          <Link href="/" className="hover:text-navy-950">
            {tBreadcrumb("home")}
          </Link>
          <span className="mx-1.5">/</span>
          <Link
            href={`/products?category=${product.category}`}
            className="hover:text-navy-950"
          >
            {categoryName}
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-navy-800">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <ProductGallery images={product.images} title={product.title} />

          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              {product.brand && (
                <span className="text-xs font-semibold uppercase tracking-wide text-navy-400">
                  {product.brand}
                </span>
              )}
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  product.stock > 0
                    ? "bg-navy-900 text-white"
                    : "bg-navy-100 text-navy-500"
                }`}
              >
                {availabilityLabel}
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-navy-950 sm:text-3xl">
              {product.title}
            </h1>

            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`size-4 ${
                      i < Math.round(product.rating)
                        ? "fill-navy-700 text-navy-700"
                        : "fill-navy-100 text-navy-100"
                    }`}
                  />
                ))}
              </div>
              <span className="text-navy-500">
                {product.rating.toFixed(1)} ·{" "}
                {t("reviewsCount", { count: product.reviews.length })}
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-navy-950">
                {formatPrice(finalPrice)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-navy-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="rounded-full bg-navy-100 px-2 py-0.5 text-xs font-semibold text-navy-700">
                    -{Math.round(product.discount_percentage)}%
                  </span>
                </>
              )}
            </div>

            {product.description && (
              <p className="text-sm leading-relaxed text-navy-600">
                {product.description}
              </p>
            )}

            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-navy-100 px-2.5 py-1 text-xs text-navy-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <div className="flex-1">
                <AddToCartPanel
                  id={product.id}
                  title={product.title}
                  price={finalPrice}
                  thumbnail={product.thumbnail}
                  stock={product.stock}
                />
              </div>
              <WishlistButton productId={product.id} variant="standalone" />
            </div>

            <dl className="grid grid-cols-2 gap-3 border-t border-navy-100 pt-5 text-sm sm:grid-cols-3">
              {product.sku && (
                <div>
                  <dt className="text-navy-400">{t("sku")}</dt>
                  <dd className="font-medium text-navy-800">{product.sku}</dd>
                </div>
              )}
              <div>
                <dt className="text-navy-400">{t("category")}</dt>
                <dd className="font-medium text-navy-800">{categoryName}</dd>
              </div>
              <div>
                <dt className="text-navy-400">{t("availability")}</dt>
                <dd className="font-medium text-navy-800">
                  {t("stockUnits", { count: product.stock })}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-12">
          <ProductTabs
            description={product.description}
            warrantyInformation={product.warranty_information}
            shippingInformation={product.shipping_information}
            returnPolicy={product.return_policy}
            reviews={product.reviews}
          />
        </div>

        <div className="mt-4">
          <RelatedProducts products={related} />
        </div>
      </Container>
    </div>
  );
}
