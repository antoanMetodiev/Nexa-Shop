import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";

export function Hero() {
  const t = useTranslations("home.hero");

  return (
    <section className="relative overflow-hidden bg-navy-950">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#1f2e4d,transparent_60%)]"
      />
      <Container>
        <div className="relative flex min-h-[70vh] flex-col items-start justify-center gap-6 py-24 sm:min-h-[60vh]">
          <span className="rounded-full border border-navy-600 px-3 py-1 text-xs font-medium uppercase tracking-widest text-navy-200">
            {t("badge")}
          </span>
          <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t("titleLine1")}
            <br />
            {t("titleLine2")}
          </h1>
          <p className="max-w-lg text-base text-navy-200 sm:text-lg">
            {t("subtitle")}
          </p>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-navy-950 transition-colors hover:bg-navy-100"
            >
              {t("shopNow")}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/deals"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-navy-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
            >
              {t("viewDeals")}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
