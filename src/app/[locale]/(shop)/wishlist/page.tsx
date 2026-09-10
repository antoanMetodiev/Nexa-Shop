import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { WishlistView } from "@/components/wishlist/WishlistView";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("wishlist");
  return { title: `${t("title")} - Nexa` };
}

export default async function WishlistPage() {
  const [t, tBreadcrumb] = await Promise.all([
    getTranslations("wishlist"),
    getTranslations("breadcrumb"),
  ]);

  return (
    <div className="bg-white py-10">
      <Container>
        <nav className="mb-4 text-xs text-navy-500">
          <Link href="/" className="hover:text-navy-950">
            {tBreadcrumb("home")}
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-navy-800">{t("breadcrumb")}</span>
        </nav>

        <h1 className="mb-8 text-3xl font-bold tracking-tight text-navy-950">
          {t("title")}
        </h1>

        <WishlistView />
      </Container>
    </div>
  );
}
