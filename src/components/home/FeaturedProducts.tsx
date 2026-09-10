import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/product/ProductCard";
import { getTopRatedProducts } from "@/lib/products";

export async function FeaturedProducts() {
  const products = await getTopRatedProducts(8);

  if (products.length === 0) return null;

  return (
    <section className="bg-navy-50/40 py-16">
      <Container>
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-navy-950">
              Топ оценени продукти
            </h2>
            <p className="mt-1 text-sm text-navy-500">
              Избрани заради високите отзиви от клиенти
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm font-medium text-navy-600 hover:text-navy-950"
          >
            Всички продукти →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}
