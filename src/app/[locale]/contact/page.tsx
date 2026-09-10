import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { MapEmbed } from "@/components/shared/MapEmbed";
import {
  STORE_ADDRESS,
  STORE_EMAIL,
  STORE_MAPS_LINK,
  STORE_PHONE,
  STORE_PHONE_HREF,
} from "@/lib/constants";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contactPage");
  return { title: `${t("title")} — Nexa` };
}

export default async function ContactPage() {
  const [t, tBreadcrumb] = await Promise.all([
    getTranslations("contactPage"),
    getTranslations("breadcrumb"),
  ]);

  const infoRows = [
    {
      icon: MapPin,
      label: t("addressLabel"),
      value: STORE_ADDRESS,
      href: STORE_MAPS_LINK,
    },
    {
      icon: Mail,
      label: t("emailLabel"),
      value: STORE_EMAIL,
      href: `mailto:${STORE_EMAIL}`,
    },
    {
      icon: Phone,
      label: t("phoneLabel"),
      value: STORE_PHONE,
      href: `tel:${STORE_PHONE_HREF}`,
    },
    {
      icon: Clock,
      label: t("hoursLabel"),
      value: t("hoursValue"),
      href: null,
    },
  ];

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

        <FadeIn>
          <h1 className="text-3xl font-bold tracking-tight text-navy-950">
            {t("title")}
          </h1>
          <p className="mt-2 text-sm text-navy-500">{t("subtitle")}</p>
        </FadeIn>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <StaggerGrid className="flex flex-col gap-6">
            {infoRows.map((row) => {
              const Icon = row.icon;
              const content = (
                <div className="flex items-start gap-4 rounded-xl border border-navy-100 p-4 transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-800">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">
                      {row.label}
                    </p>
                    <p className="mt-0.5 text-sm text-navy-800">
                      {row.value}
                    </p>
                  </div>
                </div>
              );

              return (
                <StaggerItem key={row.label}>
                  {row.href ? (
                    <a
                      href={row.href}
                      target={
                        row.href.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        row.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="block transition-colors hover:border-navy-300"
                    >
                      {content}
                    </a>
                  ) : (
                    content
                  )}
                </StaggerItem>
              );
            })}
          </StaggerGrid>

          <FadeIn delay={0.15}>
            <MapEmbed />
          </FadeIn>
        </div>
      </Container>
    </div>
  );
}
