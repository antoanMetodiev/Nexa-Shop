import { Headset, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { Container } from "@/components/ui/Container";

const ITEMS = [
  {
    icon: Truck,
    title: "Безплатна доставка",
    description: "За поръчки над 100 лв.",
  },
  {
    icon: RotateCcw,
    title: "Лесно връщане",
    description: "До 30 дни без въпроси",
  },
  {
    icon: ShieldCheck,
    title: "Сигурно плащане",
    description: "Защитено чрез Stripe",
  },
  {
    icon: Headset,
    title: "Поддръжка 24/7",
    description: "Винаги на разположение",
  },
];

export function UspBar() {
  return (
    <section className="border-b border-navy-100 bg-white">
      <Container>
        <div className="grid grid-cols-2 gap-6 py-10 sm:grid-cols-4">
          {ITEMS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-800">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-navy-950">
                  {title}
                </p>
                <p className="text-xs text-navy-500">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
