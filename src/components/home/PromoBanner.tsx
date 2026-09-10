import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function PromoBanner() {
  return (
    <section className="bg-white py-16">
      <Container>
        <div className="relative overflow-hidden rounded-2xl bg-navy-900 px-8 py-14 text-center sm:px-16">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#2b3f68,transparent_55%)]"
          />
          <div className="relative flex flex-col items-center gap-4">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-navy-100">
              Ограничено предложение
            </span>
            <h2 className="max-w-xl text-2xl font-bold text-white sm:text-3xl">
              До -40% на избрани продукти тази седмица
            </h2>
            <p className="max-w-md text-sm text-navy-200">
              Разгледай текущите намаления, преди да са изчерпани наличностите.
            </p>
            <Link
              href="/deals"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-navy-950 transition-colors hover:bg-navy-100"
            >
              Виж промоциите
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
