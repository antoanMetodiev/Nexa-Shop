"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { AlertTriangle } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function ErrorContent({ onRetry }: { onRetry: () => void }) {
  const t = useTranslations("errorPage");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto flex max-w-lg flex-col items-center gap-6 text-center"
    >
      <motion.span
        initial={{ rotate: -20, scale: 0.8 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
        className="flex size-16 items-center justify-center rounded-full bg-navy-50 text-navy-700"
      >
        <AlertTriangle className="size-8" />
      </motion.span>

      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-navy-400">
          {t("badge")}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-sm text-navy-500">{t("subtitle")}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full bg-navy-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.03] hover:bg-navy-800 active:scale-95"
        >
          {t("retry")}
        </button>
        <Link
          href="/"
          className="rounded-full border border-navy-200 px-6 py-3 text-sm font-semibold text-navy-800 transition-all hover:scale-[1.03] hover:bg-navy-50 active:scale-95"
        >
          {t("home")}
        </Link>
      </div>
    </motion.div>
  );
}
