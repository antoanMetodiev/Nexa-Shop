import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/product/ProductCard";
import { getTopRatedProducts } from "@/lib/products";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";

export async function FeaturedProducts() {
  const [products, t] = await Promise.all([
    getTopRatedProducts(8),
    getTranslations("home.featured"),
  ]);

  if (products.length === 0) return null;

  return (
    <section className="bg-navy-50/40 py-16">
      <Container>
        <FadeIn className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-navy-950">
              {t("heading")}
            </h2>
            <p className="mt-1 text-sm text-navy-500">{t("subheading")}</p>
          </div>
          <Link
            href="/products"
            className="text-sm font-medium text-navy-600 hover:text-navy-950"
          >
            {t("viewAll")}
          </Link>
        </FadeIn>

        <StaggerGrid className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </StaggerGrid>
      </Container>
    </section>
  );
}
