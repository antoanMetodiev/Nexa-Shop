import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { MapEmbed } from "@/components/shared/MapEmbed";
import { FadeIn } from "@/components/motion/FadeIn";
import { getStoreSettings } from "@/lib/settings";

export async function StoreLocation() {
  const [t, settings] = await Promise.all([
    getTranslations("home.location"),
    getStoreSettings(),
  ]);

  return (
    <section className="border-t border-navy-100 bg-white py-16">
      <Container>
        <FadeIn className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-navy-950">
            {t("heading")}
          </h2>
          <p className="mt-1 text-sm text-navy-500">{t("subtitle")}</p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <MapEmbed address={settings.address} aspectClassName="aspect-[16/9]" />
        </FadeIn>
      </Container>
    </section>
  );
}
