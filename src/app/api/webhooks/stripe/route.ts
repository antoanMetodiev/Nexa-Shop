import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin-client";

const SHIPPING_LINE_DESCRIPTION = "Доставка";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    await recordOrder(event.data.object);
  }

  return NextResponse.json({ received: true });
}

async function recordOrder(session: Stripe.Checkout.Session) {
  const { data: lineItems } = await stripe.checkout.sessions.listLineItems(
    session.id,
    { expand: ["data.price.product"] },
  );

  const shippingCost =
    lineItems.find(
      (item) => item.description === SHIPPING_LINE_DESCRIPTION,
    )?.amount_total ?? 0;
  const amountTotal = session.amount_total ?? 0;
  const subtotal = amountTotal - shippingCost;

  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .insert({
      user_id: session.metadata?.user_id || null,
      email: session.customer_details?.email ?? "",
      status: "paid",
      subtotal: subtotal / 100,
      shipping: shippingCost / 100,
      total: amountTotal / 100,
      currency: session.currency ?? "eur",
      shipping_address: session.customer_details?.address
        ? {
            ...session.customer_details.address,
            name: session.customer_details.name,
          }
        : null,
      stripe_payment_intent_id:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : null,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("Failed to insert order:", orderError?.message);
    return;
  }

  const orderItems = lineItems
    .filter((item) => item.description !== SHIPPING_LINE_DESCRIPTION)
    .map((item) => {
      const product =
        typeof item.price?.product === "object" ? item.price.product : null;
      const productId =
        product && "metadata" in product
          ? Number(product.metadata.product_id)
          : NaN;
      const thumbnail =
        product && "images" in product ? (product.images?.[0] ?? null) : null;

      return {
        order_id: order.id,
        product_id: Number.isFinite(productId) ? productId : null,
        title: item.description ?? "",
        thumbnail,
        unit_price: (item.price?.unit_amount ?? 0) / 100,
        quantity: item.quantity ?? 1,
      };
    });

  if (orderItems.length > 0) {
    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems);
    if (itemsError) {
      console.error("Failed to insert order_items:", itemsError.message);
    }
  }
}
