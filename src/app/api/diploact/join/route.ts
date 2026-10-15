import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { createLowProfile } from "@/lib/cardcom";
import { cohortWithRoom, COURSE_PRICE_ILS } from "@/lib/cohorts";
import { db } from "@/db";
import { enrollments, orders } from "@/db/schema";

// Free registration for Diploact leads (see /diploactjoin). The earliest open cohort gets
// a free seat (same mechanism as the DIPLOACT checkout coupon). Once that cohort is full,
// later signups are offered half price for the next cohort instead — a real Cardcom charge,
// with the seat reserved by the webhook once that payment actually clears (see
// src/app/api/webhooks/cardcom/route.ts), not here.
const HALF_PRICE_PERCENT = 0.5;

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const target = await cohortWithRoom();
  if (!target) {
    return NextResponse.json({ path: "none" satisfies Path });
  }

  if (target.isPrimary) {
    const [order] = await db
      .insert(orders)
      .values({
        userId: session.user.id,
        amountAgorot: 0,
        product: "course",
        cohortId: target.id,
        provider: "coupon",
        status: "paid",
        paidAt: new Date(),
        termsAcceptedAt: new Date(),
      })
      .returning();
    await db.insert(enrollments).values({ userId: session.user.id, cohortId: target.id, status: "active" }).catch(() => {});
    return NextResponse.json({ path: "free" satisfies Path, orderId: order.id });
  }

  // Overflow: the nearest cohort is full, so this signup pays half price for the next one
  const amountIls = Math.round(COURSE_PRICE_ILS * HALF_PRICE_PERCENT);
  const origin = new URL(request.url).origin;
  const [order] = await db
    .insert(orders)
    .values({
      userId: session.user.id,
      amountAgorot: Math.round(amountIls * 100),
      product: "course",
      cohortId: target.id,
      termsAcceptedAt: new Date(),
    })
    .returning();

  try {
    const result = await createLowProfile({
      returnValue: order.id,
      amountIls,
      successRedirectUrl: `${origin}/checkout/success?product=course`,
      failedRedirectUrl: `${origin}/checkout/failed`,
      webHookUrl: `${origin}/api/webhooks/cardcom`,
    });
    await db.update(orders).set({ providerTransactionId: result.LowProfileId }).where(eq(orders.id, order.id));
    return NextResponse.json({ path: "half" satisfies Path, cohortLabel: target.label, amountIls, payUrl: result.Url });
  } catch (err) {
    await db.update(orders).set({ status: "failed" }).where(eq(orders.id, order.id));
    console.error("[diploact/join] Cardcom error:", err);
    return NextResponse.json({ error: "payment setup failed" }, { status: 500 });
  }
}

type Path = "free" | "half" | "none";
