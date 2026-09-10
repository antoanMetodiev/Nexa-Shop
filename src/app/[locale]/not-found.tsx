import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Compass } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("notFound");
  return { title: `${t("title")} — Nexa` };
}

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="bg-white py-24">
      <Container>
        <div className="mx-auto flex max-w-lg flex-col items-center gap-6 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-navy-50 text-navy-700">
            <Compass className="size-8" />
          </span>

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
            <Link
              href="/"
              className="rounded-full bg-navy-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
            >
              {t("home")}
            </Link>
            <Link
              href="/products"
              className="rounded-full border border-navy-200 px-6 py-3 text-sm font-semibold text-navy-800 transition-colors hover:bg-navy-50"
            >
              {t("browseProducts")}
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
