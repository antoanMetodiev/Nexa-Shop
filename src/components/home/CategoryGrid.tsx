import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getCategories, getCategoryThumbnail } from "@/lib/products";
import { HOMEPAGE_CATEGORY_SLUGS } from "@/lib/constants";

export async function CategoryGrid() {
  const categories = await getCategories();
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
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-navy-950">
            Пазарувай по категория
          </h2>
          <Link
            href="/categories"
            className="text-sm font-medium text-navy-600 hover:text-navy-950"
          >
            Всички категории →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {curated.map((category, index) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group flex flex-col items-center gap-3 rounded-xl border border-navy-100 p-4 text-center transition-colors hover:border-navy-300 hover:bg-navy-50"
            >
              <div className="relative size-16 overflow-hidden rounded-full bg-navy-50">
                {thumbnails[index] && (
                  <Image
                    src={thumbnails[index]}
                    alt={category.name}
                    fill
                    sizes="64px"
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                )}
              </div>
              <span className="text-sm font-medium text-navy-800">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
