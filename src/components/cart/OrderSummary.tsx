import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/products";

const FREE_SHIPPING_THRESHOLD = 100;
const SHIPPING_FEE = 9.99;

export function OrderSummary({ subtotal }: { subtotal: number }) {
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-navy-100 p-6">
      <h2 className="text-base font-semibold text-navy-950">
        Обобщение на поръчката
      </h2>

      <div className="flex flex-col gap-2.5 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-navy-500">Междинна сума</span>
          <span className="font-medium text-navy-950">
            {formatPrice(subtotal)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-navy-500">Доставка</span>
          <span className="font-medium text-navy-950">
            {shipping === 0 ? "Безплатна" : formatPrice(shipping)}
          </span>
        </div>
        {shipping > 0 && (
          <p className="text-xs text-navy-400">
            Безплатна доставка над {formatPrice(FREE_SHIPPING_THRESHOLD)}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-navy-100 pt-4">
        <span className="text-sm font-semibold text-navy-950">Общо</span>
        <span className="text-xl font-bold text-navy-950">
          {formatPrice(total)}
        </span>
      </div>

      <Link
        href="/checkout"
        className="flex items-center justify-center gap-2 rounded-full bg-navy-900 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
      >
        Продължи към поръчката
        <ArrowRight className="size-4" />
      </Link>

      <Link
        href="/products"
        className="text-center text-sm font-medium text-navy-600 hover:text-navy-950"
      >
        Продължи пазаруването
      </Link>
    </div>
  );
}
