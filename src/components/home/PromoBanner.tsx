import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/motion/FadeIn";

export function PromoBanner() {
  const t = useTranslations("home.promo");

  return (
    <section className="bg-white py-16">
      <Container>
        <FadeIn className="relative overflow-hidden rounded-2xl bg-navy-900 px-8 py-14 text-center sm:px-16">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#2b3f68,transparent_55%)]"
          />
          <div className="relative flex flex-col items-center gap-4">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-navy-100">
              {t("badge")}
            </span>
            <h2 className="max-w-xl text-2xl font-bold text-white sm:text-3xl">
              {t("heading")}
            </h2>
            <p className="max-w-md text-sm text-navy-200">{t("subheading")}</p>
            <Link
              href="/deals"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-navy-950 transition-all hover:scale-[1.03] hover:bg-navy-100 active:scale-95"
            >
              {t("cta")}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
