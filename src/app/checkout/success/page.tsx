import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { checkoutSuccessStepsByProduct } from "@/content/copy";
import { MetaEvent } from "@/components/MetaPixel";
import ReceiptPrinter from "@/components/ReceiptPrinter";
import { getProduct } from "@/content/pricingCopy";
import { auth } from "@/lib/auth";
import { formatHebrewDate } from "@/lib/formatDate";
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
  searchParams: Promise<{ order?: string }>;
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
  const fireBrowserPurchase = order.status === "paid";
  const steps = product === "access" || product === "private" ? checkoutSuccessStepsByProduct[product] : checkoutSuccessStepsByProduct.course;
  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col px-4 py-12 sm:px-6">
      {fireBrowserPurchase && <MetaEvent name="Purchase" eventId={orderId!} params={{ value: order.amountAgorot / 100, currency: "ILS" }} />}
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
          date={formatHebrewDate(order.paidAt ?? order.createdAt)}
          items={[{ name: getProduct(product)?.name ?? "", quantity: 1, price: order.amountAgorot / 100 }]}
        />
      </div>

      <ol className="mt-10 flex flex-col gap-3">
        {steps.map((step, i) => (
          <li key={step.title} className="flex gap-4 rounded-3xl border border-line bg-white shadow-card p-5">
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
