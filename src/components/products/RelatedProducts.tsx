import { useTranslations } from "next-intl";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/lib/products";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";

export function RelatedProducts({ products }: { products: Product[] }) {
  const t = useTranslations("productDetail");

  if (products.length === 0) return null;

  return (
    <section className="border-t border-navy-100 pt-10">
      <h2 className="mb-5 text-xl font-bold tracking-tight text-navy-950">
        {t("relatedHeading")}
      </h2>
      <StaggerGrid className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <StaggerItem key={product.id}>
            <ProductCard product={product} />
          </StaggerItem>
        ))}
      </StaggerGrid>
    </section>
  );
}
