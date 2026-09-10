"use client";

import { useState } from "react";
import Image from "next/image";

export function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const gallery = images.length > 0 ? images : [];
  const [active, setActive] = useState(0);

  if (gallery.length === 0) {
    return (
      <div className="aspect-square rounded-2xl border border-navy-100 bg-navy-50" />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-navy-100 bg-navy-50">
        <Image
          src={gallery[active]}
          alt={title}
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-contain p-8"
        />
      </div>

      {gallery.length > 1 && (
        <div className="flex gap-2">
          {gallery.map((src, index) => (
            <button
              key={src + index}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Снимка ${index + 1}`}
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
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
