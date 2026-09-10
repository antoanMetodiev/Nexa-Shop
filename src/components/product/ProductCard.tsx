"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { WishlistButton } from "@/components/product/WishlistButton";
import {
  discountedPrice,
  formatPrice,
  type Product,
} from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const hasDiscount = product.discount_percentage > 1;
  const finalPrice = discountedPrice(product);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-navy-100 bg-white transition-shadow hover:shadow-lg hover:shadow-navy-900/5"
    >
      <Link href={`/products/${product.id}`} className="contents">
        <div className="relative aspect-square w-full overflow-hidden bg-navy-50">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {hasDiscount && (
            <span className="absolute left-3 top-3 rounded-full bg-navy-900 px-2.5 py-1 text-xs font-semibold text-white">
              -{Math.round(product.discount_percentage)}%
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1.5 p-4">
          {product.brand && (
            <span className="text-xs font-medium uppercase tracking-wide text-navy-400">
              {product.brand}
            </span>
          )}
          <h3 className="line-clamp-2 text-sm font-medium text-navy-950">
            {product.title}
          </h3>

          <div className="flex items-center gap-1 text-xs text-navy-500">
            <Star className="size-3.5 fill-navy-700 text-navy-700" />
            {product.rating.toFixed(1)}
          </div>

          <div className="mt-auto flex items-baseline gap-2 pt-1">
            <span className="text-base font-semibold text-navy-950">
              {formatPrice(finalPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-navy-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>

      <WishlistButton productId={product.id} />
    </motion.div>
  );
}
