import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { MapEmbed } from "@/components/shared/MapEmbed";

export function StoreLocation() {
  const t = useTranslations("home.location");

  return (
    <section className="border-t border-navy-100 bg-white py-16">
      <Container>
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-navy-950">
            {t("heading")}
          </h2>
          <p className="mt-1 text-sm text-navy-500">{t("subtitle")}</p>
        </div>

        <MapEmbed aspectClassName="aspect-[16/9]" />
      </Container>
    </section>
  );
}
