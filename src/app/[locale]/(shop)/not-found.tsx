import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { NotFoundContent } from "@/components/shared/NotFoundContent";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("notFound");
  return { title: `${t("title")} - Nexa` };
}

export default function NotFound() {
  return (
    <div className="bg-white py-24">
      <Container>
        <NotFoundContent />
      </Container>
    </div>
  );
}
