"use client";

import { useTranslations } from "next-intl";
import { motion, type Variants } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

export function Hero() {
  const t = useTranslations("home.hero");

  return (
    <section className="relative overflow-hidden bg-navy-950">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#1f2e4d,transparent_60%)]"
      />
      <Container>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative flex min-h-[70vh] flex-col items-start justify-center gap-6 py-24 sm:min-h-[60vh]"
        >
          <motion.span
            variants={item}
            className="rounded-full border border-navy-600 px-3 py-1 text-xs font-medium uppercase tracking-widest text-navy-200"
          >
            {t("badge")}
          </motion.span>
          <motion.h1
            variants={item}
            className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            {t("titleLine1")}
            <br />
            {t("titleLine2")}
          </motion.h1>
          <motion.p
            variants={item}
            className="max-w-lg text-base text-navy-200 sm:text-lg"
          >
            {t("subtitle")}
          </motion.p>
          <motion.div
            variants={item}
            className="flex flex-col gap-3 pt-2 sm:flex-row"
          >
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-navy-950 transition-all hover:scale-[1.03] hover:bg-navy-100 active:scale-95"
            >
              {t("shopNow")}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/deals"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-navy-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.03] hover:bg-navy-800 active:scale-95"
            >
              {t("viewDeals")}
            </Link>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
