import { useTranslations } from "next-intl";
import { PackageSearch } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function EmptyState() {
  const t = useTranslations("products.emptyState");

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-navy-200 py-24 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-navy-50 text-navy-400">
        <PackageSearch className="size-7" />
      </span>
      <div>
        <p className="font-medium text-navy-950">{t("title")}</p>
        <p className="mt-1 text-sm text-navy-500">{t("subtitle")}</p>
      </div>
      <Link
        href="/products"
        className="rounded-full bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
      >
        {t("cta")}
      </Link>
    </div>
  );
}
