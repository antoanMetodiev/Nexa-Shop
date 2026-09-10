"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { SlidersHorizontal, X } from "lucide-react";

export function MobileFilterDrawer({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("products.mobileFilters");
  const tFilters = useTranslations("products.filters");

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full border border-navy-200 px-4 py-2 text-sm font-medium text-navy-800 lg:hidden"
      >
        <SlidersHorizontal className="size-4" />
        {t("button")}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-navy-950/50"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-full max-w-xs flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-navy-100 px-4 py-4">
              <span className="text-sm font-semibold text-navy-950">
                {tFilters("heading")}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("close")}
                className="rounded-full p-1.5 text-navy-500 hover:bg-navy-50"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>
            <div className="border-t border-navy-100 p-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full rounded-full bg-navy-900 py-2.5 text-sm font-semibold text-white"
              >
                {t("apply")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
