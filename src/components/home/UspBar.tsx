import { useTranslations } from "next-intl";
import { Headset, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";

const ITEMS = [
  { icon: Truck, titleKey: "shippingTitle", descKey: "shippingDesc" },
  { icon: RotateCcw, titleKey: "returnsTitle", descKey: "returnsDesc" },
  { icon: ShieldCheck, titleKey: "paymentTitle", descKey: "paymentDesc" },
  { icon: Headset, titleKey: "supportTitle", descKey: "supportDesc" },
] as const;

export function UspBar() {
  const t = useTranslations("home.usp");

  return (
    <section className="border-b border-navy-100 bg-white">
      <Container>
        <StaggerGrid className="grid grid-cols-2 gap-6 py-10 sm:grid-cols-4">
          {ITEMS.map(({ icon: Icon, titleKey, descKey }) => (
            <StaggerItem key={titleKey} className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-800">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-navy-950">
                  {t(titleKey)}
                </p>
                <p className="text-xs text-navy-500">{t(descKey)}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </Container>
    </section>
  );
}
