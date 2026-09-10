import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("privacyPage");
  return { title: `${t("title")} — Nexa` };
}

type Section = { heading: string; body: string };

export default async function PrivacyPage() {
  const [t, tBreadcrumb] = await Promise.all([
    getTranslations("privacyPage"),
    getTranslations("breadcrumb"),
  ]);
  const sections = t.raw("sections") as Section[];

  return (
    <div className="bg-white py-10">
      <Container>
        <nav className="mb-4 text-xs text-navy-500">
          <Link href="/" className="hover:text-navy-950">
            {tBreadcrumb("home")}
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-navy-800">{t("title")}</span>
        </nav>

        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-navy-950">
            {t("title")}
          </h1>
          <p className="mt-2 text-xs text-navy-400">{t("lastUpdated")}</p>
          <p className="mt-6 text-sm leading-relaxed text-navy-700">
            {t("intro")}
          </p>

          <div className="mt-10 flex flex-col gap-8">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-lg font-semibold text-navy-950">
                  {section.heading}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-navy-600">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
