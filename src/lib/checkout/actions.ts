"use server";

import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { SHIPPING_FEE } from "@/lib/constants";
import type { CartItem } from "@/lib/cart-context";

/**
 * Creates a hosted Stripe Checkout Session for the current cart and returns
 * its URL for the client to redirect to (window.location.href — it's a
 * Stripe-hosted domain, not a Next.js route). The order itself is only
 * written to the DB once Stripe confirms payment, via the webhook
 * (src/app/api/webhooks/stripe/route.ts) — never eagerly here.
 */
export async function createCheckoutSession(
  items: CartItem[],
  freeShippingThreshold: number,
  locale: string,
  origin: string,
): Promise<{ url: string } | { error: string }> {
  if (items.length === 0) {
    return { error: "Cart is empty" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = subtotal >= freeShippingThreshold ? 0 : SHIPPING_FEE;

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
    (item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "eur",
        unit_amount: Math.round(item.price * 100),
        product_data: {
          name: item.title,
          images: [item.thumbnail],
          metadata: { product_id: String(item.id) },
        },
      },
    }),
  );

  if (shipping > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: "eur",
        unit_amount: Math.round(shipping * 100),
        product_data: { name: "Доставка" },
      },
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    customer_email: user?.email,
    shipping_address_collection: { allowed_countries: ["BG"] },
    success_url: `${origin}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/${locale}/cart`,
    metadata: {
      user_id: user?.id ?? "",
    },
  });

  if (!session.url) {
    return { error: "Failed to create checkout session" };
  }
  return { url: session.url };
}
