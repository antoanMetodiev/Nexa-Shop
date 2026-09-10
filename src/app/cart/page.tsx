import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Кошница — Nexa",
  description: "Прегледай и редактирай продуктите в твоята кошница.",
};

export default function CartPage() {
  return (
    <div className="bg-white py-10">
      <Container>
        <nav className="mb-4 text-xs text-navy-500">
          <Link href="/" className="hover:text-navy-950">
            Начало
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-navy-800">Кошница</span>
        </nav>

        <h1 className="mb-8 text-3xl font-bold tracking-tight text-navy-950">
          Кошница
        </h1>

        <CartView />
      </Container>
    </div>
  );
}
