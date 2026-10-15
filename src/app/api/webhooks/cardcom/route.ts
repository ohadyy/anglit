import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { sendTemplate } from "@/lib/whatsapp";
import { notify } from "@/lib/ntfy";
import { getProduct } from "@/content/pricingCopy";
import { getLpResult } from "@/lib/cardcom";
import { db } from "@/db";
import { enrollments, orders, user } from "@/db/schema";

// Cardcom pings this URL after a payment attempt, but the exact ping payload
// isn't reliably documented — so instead of trusting it, we only use it as a
// signal to re-check the authoritative result ourselves via GetLpResult.
// That call needs the LowProfileId, which Cardcom includes in the ping one
// way or another (JSON body, form body, or query string) — we check all three.
async function extractLowProfileId(request: Request): Promise<string | null> {
  const url = new URL(request.url);
  const fromQuery = url.searchParams.get("LowProfileId") ?? url.searchParams.get("lowprofileid");
  if (fromQuery) return fromQuery;

  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = await request.json().catch(() => null);
    return body?.LowProfileId ?? body?.lowprofileid ?? null;
  }
  if (contentType.includes("application/x-www-form-urlencoded")) {
    const form = await request.formData();
    return (form.get("LowProfileId") ?? form.get("lowprofileid"))?.toString() ?? null;
  }
  return null;
}

// Only the first confirmed payment sends the thank-you, since Cardcom may ping more than once.
async function sendPurchaseThanks(userId: string, productId: string | null) {
  try {
    const [account] = await db.select({ name: user.name, phone: user.phone }).from(user).where(eq(user.id, userId));
    const product = getProduct(productId);
    if (!account || !product) return;
    await sendTemplate(account.phone, process.env.WHATSAPP_TEMPLATE_PURCHASE ?? "purchase_thanks", [account.name, product.name]);
  } catch (err) {
    console.error("[cardcom webhook] purchase WhatsApp failed:", err);
  }
}

// The /diploactjoin overflow path (see src/app/api/diploact/join/route.ts) ties the order to
// a specific cohort up front, before payment clears, so the seat can be reserved the moment
// it does — without waiting for the student to pick it themselves in the account page.
async function enrollInOrderCohort(userId: string, cohortId: string | null) {
  if (!cohortId) return;
  try {
    const [existing] = await db.select({ id: enrollments.id }).from(enrollments).where(eq(enrollments.userId, userId)).limit(1);
    if (existing) return;
    await db.insert(enrollments).values({ userId, cohortId, status: "active" });
  } catch (err) {
    console.error("[cardcom webhook] auto-enroll failed:", err);
  }
}

// Push notification for every paid order, so the phone number is one tap away for a manual
// WhatsApp message — this stands in for an automated thank-you until the WhatsApp Cloud API
// template above is actually usable (Meta verification) and until there's a real CRM.
async function notifyPurchase(userId: string, productId: string | null, amountAgorot: number) {
  const [account] = await db
    .select({ name: user.name, phone: user.phone, examDate: user.examDate, priorScore: user.priorScore })
    .from(user)
    .where(eq(user.id, userId));
  const product = getProduct(productId);
  await notify(
    "New purchase - Anglit",
    [
      `מוצר: ${product?.name ?? productId ?? "לא ידוע"}`,
      `סכום: ${(amountAgorot / 100).toFixed(0)} ₪`,
      `שם: ${account?.name ?? "לא ידוע"}`,
      `טלפון: ${account?.phone ?? "לא ידוע"}`,
      ...(account?.examDate ? [`תאריך מבחן: ${account.examDate}`] : []),
      ...(account?.priorScore != null ? [`ציון קודם: ${account.priorScore}`] : []),
    ],
    "moneybag",
  );
}

export async function POST(request: Request) {
  const lowProfileId = await extractLowProfileId(request);
  if (!lowProfileId) {
    console.error("[cardcom webhook] no LowProfileId in request");
    return NextResponse.json({ received: true });
  }

  const result = await getLpResult(lowProfileId);
  const orderId = result.ReturnValue;
  if (!orderId) {
    console.error("[cardcom webhook] GetLpResult had no ReturnValue", result);
    return NextResponse.json({ received: true });
  }

  // Load the order we created ourselves, and only trust Cardcom's answer when it matches it
  const [order] = await db
    .select({
      status: orders.status,
      userId: orders.userId,
      product: orders.product,
      cohortId: orders.cohortId,
      amountAgorot: orders.amountAgorot,
      providerTransactionId: orders.providerTransactionId,
    })
    .from(orders)
    .where(eq(orders.id, orderId));
  if (!order) {
    console.error("[cardcom webhook] unknown order", orderId);
    return NextResponse.json({ received: true });
  }

  const sameTransaction = order.providerTransactionId === lowProfileId;
  const sameAmount = result.Amount === undefined || Number(result.Amount) === order.amountAgorot / 100;
  const paidOk = result.ResponseCode === 0 && !!result.TranzactionId && sameTransaction && sameAmount;

  if (paidOk) {
    if (order.status !== "paid") {
      await db.update(orders).set({ status: "paid", paidAt: new Date() }).where(eq(orders.id, orderId));
      await sendPurchaseThanks(order.userId, order.product);
      await notifyPurchase(order.userId, order.product, order.amountAgorot);
      if (order.product === "course") await enrollInOrderCohort(order.userId, order.cohortId);
    }
  } else if (order.status === "pending") {
    // Only a pending order can become failed; a paid one is never downgraded by a later ping
    if (!sameTransaction || result.ResponseCode !== 0) {
      await db.update(orders).set({ status: "failed" }).where(eq(orders.id, orderId));
    }
  } else if (!sameTransaction || !sameAmount) {
    console.error("[cardcom webhook] mismatch for order", orderId, { sameTransaction, sameAmount });
  }

  return NextResponse.json({ received: true });
}
