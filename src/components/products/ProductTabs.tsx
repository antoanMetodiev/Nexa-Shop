"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Star } from "lucide-react";
import type { ProductReview } from "@/lib/supabase/types";

type Tab = "description" | "shipping" | "reviews";

export function ProductTabs({
  description,
  warrantyInformation,
  shippingInformation,
  returnPolicy,
  reviews,
}: {
  description: string | null;
  warrantyInformation: string | null;
  shippingInformation: string | null;
  returnPolicy: string | null;
  reviews: ProductReview[];
}) {
  const [tab, setTab] = useState<Tab>("description");
  const t = useTranslations("productDetail");
  const locale = useLocale();

  function formatDate(iso: string): string {
    try {
      return new Intl.DateTimeFormat(locale === "bg" ? "bg-BG" : "en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "description", label: t("tabs.description") },
    { key: "shipping", label: t("tabs.shipping") },
    { key: "reviews", label: t("tabs.reviews", { count: reviews.length }) },
  ];

  return (
    <div>
      <div className="flex gap-6 border-b border-navy-100">
        {tabs.map((tabItem) => (
          <button
            key={tabItem.key}
            type="button"
            onClick={() => setTab(tabItem.key)}
            className={`-mb-px border-b-2 py-3 text-sm font-medium transition-colors ${
              tab === tabItem.key
                ? "border-navy-900 text-navy-950"
                : "border-transparent text-navy-500 hover:text-navy-800"
            }`}
          >
            {tabItem.label}
          </button>
        ))}
      </div>

      <div className="py-6">
        {tab === "description" && (
          <p className="max-w-3xl text-sm leading-relaxed text-navy-700">
            {description || t("noDescription")}
          </p>
        )}

        {tab === "shipping" && (
          <dl className="grid max-w-2xl grid-cols-1 gap-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="font-semibold text-navy-950">
                {t("shippingLabel")}
              </dt>
              <dd className="mt-1 text-navy-600">
                {shippingInformation || t("noInfo")}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-navy-950">
                {t("returnLabel")}
              </dt>
              <dd className="mt-1 text-navy-600">
                {returnPolicy || t("noInfo")}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-navy-950">
                {t("warrantyLabel")}
              </dt>
              <dd className="mt-1 text-navy-600">
                {warrantyInformation || t("noInfo")}
              </dd>
            </div>
          </dl>
        )}

        {tab === "reviews" &&
          (reviews.length === 0 ? (
            <p className="text-sm text-navy-500">{t("noReviews")}</p>
          ) : (
            <ul className="flex max-w-2xl flex-col gap-5">
              {reviews.map((review, index) => (
                <li
                  key={`${review.reviewerEmail}-${index}`}
                  className="border-b border-navy-50 pb-5 last:border-none"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-navy-950">
                      {review.reviewerName}
                    </span>
                    <span className="text-xs text-navy-400">
                      {formatDate(review.date)}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`size-3.5 ${
                          i < review.rating
                            ? "fill-navy-700 text-navy-700"
                            : "fill-navy-100 text-navy-100"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-navy-600">
                    {review.comment}
                  </p>
                </li>
              ))}
            </ul>
          ))}
      </div>
    </div>
  );
}
