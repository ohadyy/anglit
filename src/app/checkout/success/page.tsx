import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { checkoutSuccessStepsByProduct } from "@/content/copy";
import { upcomingCourseOffer } from "@/lib/cohorts";
import { MetaEvent } from "@/components/MetaPixel";
import ReceiptPrinter from "@/components/ReceiptPrinter";
import { getProduct } from "@/content/pricingCopy";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "התשלום התקבל",
  robots: { index: false },
};

// Cardcom redirects the browser here right after payment. The webhook
// (src/app/api/webhooks/cardcom/route.ts) is the actual source of truth that
// marks the order paid. This page explains what happens next.
export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; order?: string }>;
}) {
  const { order: orderId } = await searchParams;
  // Only the buyer of an order sees this page. Anyone else (no order in the link, someone else's order,
  // signed out) gets the normal 404, so the address cannot be opened by just typing it.
  const session = orderId ? await auth.api.getSession({ headers: await headers() }) : null;
  const [order] = orderId && session ? await db.select({ userId: orders.userId, status: orders.status, amountAgorot: orders.amountAgorot, product: orders.product, paidAt: orders.paidAt, createdAt: orders.createdAt }).from(orders).where(eq(orders.id, orderId)) : [];
  // "pending" is allowed because the browser can arrive a moment before the payment webhook marks the order paid
  if (!order || order.userId !== session?.user.id || (order.status !== "paid" && order.status !== "pending")) notFound();
  const product = order.product;
  // The browser Purchase fires only once the order is confirmed paid. If the confirmation is slower than this
  // page, the server-side event from the webhook still covers it.
  const paid = order;
  const fireBrowserPurchase = paid.status === "paid";
  // Access-only buyers see the open cohort offer once, as an invitation, at the real price
  const offer = product === "access" ? await upcomingCourseOffer() : null;
  const steps = product === "access" || product === "private" ? checkoutSuccessStepsByProduct[product] : checkoutSuccessStepsByProduct.course;
  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col px-4 py-12 sm:px-6">
      {fireBrowserPurchase && <MetaEvent name="Purchase" eventId={orderId!} params={{ value: paid.amountAgorot / 100, currency: "ILS" }} />}
      <header>
        <Image src="/celebration.svg" alt="" width={2774} height={1860} priority className="mx-auto h-auto w-full max-w-[16rem] sm:max-w-xs" />
        <h1 className="font-display mt-4 text-center text-5xl font-bold leading-tight sm:text-6xl">
          התשלום התקבל, <mark className="pink">ברוכים הבאים!</mark>
        </h1>
        <p className="mt-5 text-lg leading-relaxed opacity-80">שמחים שהצטרפתם. הנה מה שקורה עכשיו, צעד אחרי צעד.</p>
      </header>

      <div className="mt-10 flex justify-center">
        <ReceiptPrinter
          order={orderId!.slice(-6).toUpperCase()}
          date={(paid.paidAt ?? paid.createdAt).toLocaleDateString("he-IL", { day: "numeric", month: "long", year: "numeric" })}
          items={[{ name: getProduct(product)?.name ?? "", quantity: 1, price: paid.amountAgorot / 100 }]}
        />
      </div>

      <ol className="mt-10 flex flex-col gap-3">
        {steps.map((step, i) => (
          <li key={step.title} className="flex gap-4 rounded-3xl border border-line bg-white shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] p-5">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-fg text-sm font-bold text-bg tabular-nums">
              {i + 1}
            </span>
            <div>
              <p className="font-semibold">{step.title}</p>
              <p className="mt-1 text-sm leading-relaxed opacity-80">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>

      {offer && (
        <div className="mt-8 rounded-3xl border border-line bg-white p-5 shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)]">
          <p className="font-semibold">רוצים להצטרף גם לסמינר?</p>
          <p className="mt-1 text-sm leading-relaxed opacity-80">
            המחזור הקרוב מתחיל ב-{offer.label}, והמחיר למחזור הזה הוא {offer.priceIls} ₪. המחיר נסגר כשהמחזור מתחיל.
          </p>
          <Link href="/checkout?product=course" className="mt-4 flex min-h-11 items-center justify-center rounded-full bg-fg px-6 py-3 font-semibold text-bg">
            לפרטים ולהצטרפות
          </Link>
        </div>
      )}

      <div className="mt-8 grid gap-3">
        <Link href="/account" className="flex items-center justify-center rounded-full bg-fg px-6 py-4 font-semibold text-bg">
          לאזור האישי
        </Link>
        <Link
          href="/exam"
          className="flex items-center justify-center rounded-full border border-fg/25 px-6 py-4 font-semibold hover:bg-fg/5"
        >
          למבחן הפתיחה
        </Link>
      </div>

      <p className="mt-5 text-center text-sm opacity-70">
        אם מבחן הפתיחה עדיין נעול, רעננו את הדף בעוד דקה. אישור התשלום מגיע לאתר קצת אחרי שהתשלום הושלם.
      </p>
    </div>
  );
}
