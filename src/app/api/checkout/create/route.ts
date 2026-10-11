import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createLowProfile } from "@/lib/cardcom";
import { upcomingCourseOffer } from "@/lib/cohorts";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getProduct } from "@/content/pricingCopy";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.redirect(new URL("/sign-in?next=/pricing", request.url));
  }

  const form = await request.formData();
  const product = getProduct(form.get("product")?.toString());
  if (!product) {
    return NextResponse.redirect(new URL("/pricing", request.url), { status: 303 });
  }
  if (form.get("terms") !== "on") {
    return NextResponse.redirect(new URL(`/checkout?product=${product.id}`, request.url), { status: 303 });
  }

  // The course costs the cohort price while the next cohort is open; the order is tied to that cohort
  const offer = product.id === "course" ? await upcomingCourseOffer() : null;
  const amountIls = offer ? offer.priceIls : Number(product.price);
  const origin = new URL(request.url).origin;

  const [order] = await db
    .insert(orders)
    .values({
      userId: session.user.id,
      amountAgorot: Math.round(amountIls * 100),
      product: product.id,
      cohortId: offer?.cohortId ?? null,
      termsAcceptedAt: new Date(),
    })
    .returning();

  try {
    const result = await createLowProfile({
      returnValue: order.id,
      amountIls,
      successRedirectUrl: `${origin}/checkout/success?product=${product.id}`,
      failedRedirectUrl: `${origin}/checkout/failed`,
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
    return NextResponse.redirect(new URL("/checkout/failed", request.url));
  }
}
