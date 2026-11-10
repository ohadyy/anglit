import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createLowProfile } from "@/lib/cardcom";
import { db } from "@/db";
import { paidProducts } from "@/lib/access";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { contactLines, notify } from "@/lib/ntfy";
import { getProduct } from "@/content/pricingCopy";
import { priceFor } from "@/lib/pricing";
import { couponAgorot } from "@/lib/coupons";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.redirect(new URL("/sign-in?next=/pricing", request.url));
  }

  // Google sign-ins have no phone until /complete-profile; checkout and the follow-up calls need it
  if (!session.user.phone) {
    return NextResponse.redirect(new URL("/complete-profile?next=/pricing", request.url), { status: 303 });
  }

  const form = await request.formData();
  const product = getProduct(form.get("product")?.toString());
  if (!product) {
    return NextResponse.redirect(new URL("/pricing", request.url), { status: 303 });
  }
  if (form.get("terms") !== "on") {
    return NextResponse.redirect(new URL(`/checkout?product=${product.id}`, request.url), { status: 303 });
  }

  // Existing customers (paid for anything but the course) get the loyalty price on the course
  const owned = product.id === "course" ? await paidProducts(session.user.id) : [];
  const { listIls, priceIls: baseIls } = priceFor(product, owned);

  const couponCode = form.get("coupon")?.toString().trim();
  // Coupons apply to the seminar only, and never stack with the loyalty price: the buyer gets the lower of the two
  const couponAmount = couponCode ? (product.id === "course" ? await couponAgorot(couponCode, listIls) : null) : baseIls * 100;
  if (couponAmount === null) {
    return NextResponse.redirect(new URL(`/checkout?product=${product.id}&coupon=bad`, request.url), { status: 303 });
  }
  // Agorot are whole numbers; the webhook compares against this same stored amount
  const amountAgorot = Math.round(Math.min(couponAmount, baseIls * 100));
  const amountIls = amountAgorot / 100;
  const origin = new URL(request.url).origin;

  const [order] = await db
    .insert(orders)
    .values({
      userId: session.user.id,
      amountAgorot,
      product: product.id,
      termsAcceptedAt: new Date(),
    })
    .returning();

  // The buyer is about to enter a card: if they drop there, this is the number to call
  await notify("Checkout started - Anglit", [...contactLines(session.user.name, session.user.phone), `סכום: ${amountIls} ₪`], "shopping_cart");

  try {
    const result = await createLowProfile({
      returnValue: order.id,
      amountIls,
      successRedirectUrl: `${origin}/checkout/success?order=${order.id}`,
      failedRedirectUrl: `${origin}/checkout/failed?order=${order.id}`,
      webHookUrl: `${origin}/api/webhooks/cardcom`,
    });

    await db
      .update(orders)
      .set({ providerTransactionId: result.LowProfileId })
      .where(eq(orders.id, order.id));

    return NextResponse.redirect(result.Url, { status: 303 });
  } catch (err) {
    await db.update(orders).set({ status: "failed" }).where(eq(orders.id, order.id));
    console.error("[checkout/create] Cardcom error:", err);
    return NextResponse.redirect(new URL(`/checkout/failed?order=${order.id}`, request.url));
  }
}
