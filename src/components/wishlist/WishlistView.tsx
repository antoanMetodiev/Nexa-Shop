"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { Heart } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useWishlist } from "@/lib/wishlist-context";
import { getProductsByIds, type Product } from "@/lib/products";
import { ProductCard } from "@/components/product/ProductCard";
import { FadeIn } from "@/components/motion/FadeIn";

export function WishlistView() {
  const { ids, hydrated } = useWishlist();
  const t = useTranslations("wishlist");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hydrated) return;

    if (ids.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing local state to the ids from context, not derivable during render
      setProducts([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    getProductsByIds(ids).then((data) => {
      if (cancelled) return;
      const order = new Map(ids.map((id, index) => [id, index]));
      const sorted = [...data].sort(
        (a, b) => (order.get(b.id) ?? 0) - (order.get(a.id) ?? 0),
      );
      setProducts(sorted);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [hydrated, ids]);

  if (!hydrated || loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="aspect-[3/4] animate-pulse rounded-xl bg-navy-50"
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <FadeIn className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-navy-200 py-24 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-navy-50 text-navy-400">
          <Heart className="size-7" />
        </span>
        <div>
          <p className="font-medium text-navy-950">{t("emptyTitle")}</p>
          <p className="mt-1 text-sm text-navy-500">{t("emptySubtitle")}</p>
        </div>
        <Link
          href="/products"
          className="rounded-full bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
        >
          {t("emptyCta")}
        </Link>
      </FadeIn>
    );
  }

  return (
    <div>
      <p className="mb-4 text-sm text-navy-500">
        {t("itemsCount", { count: products.length })}
      </p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {products.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
