"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";

export function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const gallery = images.length > 0 ? images : [];
  const [active, setActive] = useState(0);
  const t = useTranslations("productDetail");

  if (gallery.length === 0) {
    return (
      <div className="aspect-square rounded-2xl border border-navy-100 bg-navy-50" />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-navy-100 bg-navy-50">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={gallery[active]}
              alt={title}
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-contain p-8"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {gallery.length > 1 && (
        <div className="flex gap-2">
          {gallery.map((src, index) => (
            <motion.button
              key={src + index}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActive(index)}
              aria-label={t("imageLabel", { index: index + 1 })}
              className={`relative size-16 shrink-0 overflow-hidden rounded-lg border transition-colors ${
                index === active
                  ? "border-navy-900"
                  : "border-navy-100 hover:border-navy-300"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="64px"
                className="object-contain p-1.5"
              />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
