import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link, redirect } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { AccountSettingsForm } from "@/components/account/AccountSettingsForm";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("account");
  return { title: `${t("title")} - Nexa` };
}

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: "/sign-in", locale: locale as Locale });
  }

  const [t, tBreadcrumb] = await Promise.all([
    getTranslations("account"),
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

        <AccountSettingsForm user={user!} />
      </Container>
    </div>
  );
}
