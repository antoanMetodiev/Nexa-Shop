import type Stripe from "stripe";
import { getTranslations } from "next-intl/server";
import { CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { ClearCartOnMount } from "@/components/checkout/ClearCartOnMount";
import { formatPrice } from "@/lib/products";
import { stripe } from "@/lib/stripe";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const t = await getTranslations("checkout.success");

  let session: Stripe.Checkout.Session | null = null;
  if (session_id) {
    try {
      session = await stripe.checkout.sessions.retrieve(session_id);
    } catch (error) {
      console.error("Failed to retrieve checkout session:", error);
    }
  }

  return (
    <div className="bg-white py-16">
      <Container>
        <ClearCartOnMount />
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-green-50 text-green-600">
            <CheckCircle2 className="size-8" />
          </span>
          <h1 className="text-2xl font-bold text-navy-950">{t("heading")}</h1>
          <p className="text-sm text-navy-500">{t("body")}</p>
          {session?.amount_total != null && (
            <p className="text-lg font-semibold text-navy-950">
              {formatPrice(session.amount_total / 100)}
            </p>
          )}
          {session?.customer_details?.email && (
            <p className="text-xs text-navy-400">
              {session.customer_details.email}
            </p>
          )}
          <Link
            href="/products"
            className="mt-2 rounded-full bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
          >
            {t("continueShopping")}
          </Link>
        </div>
      </Container>
    </div>
  );
}
