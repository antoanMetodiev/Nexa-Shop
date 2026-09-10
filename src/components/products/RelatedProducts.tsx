import { useTranslations } from "next-intl";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/lib/products";

export function RelatedProducts({ products }: { products: Product[] }) {
  const t = useTranslations("productDetail");

  if (products.length === 0) return null;

  return (
    <section className="border-t border-navy-100 pt-10">
      <h2 className="mb-5 text-xl font-bold tracking-tight text-navy-950">
        {t("relatedHeading")}
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
