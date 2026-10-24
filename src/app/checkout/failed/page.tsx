import type { Metadata } from "next";
import Image from "next/image";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { orders } from "@/db/schema";

export const metadata: Metadata = {
  title: "התשלום נכשל",
  robots: { index: false },
};

// Only the person who started the payment sees this page; anyone else gets the normal 404.
export default async function CheckoutFailedPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order: orderId } = await searchParams;
  const session = orderId ? await auth.api.getSession({ headers: await headers() }) : null;
  const [order] = orderId && session ? await db.select({ userId: orders.userId, status: orders.status }).from(orders).where(eq(orders.id, orderId)) : [];
  // "pending" is allowed because the payment provider can send the browser back before the webhook marks the order failed
  if (!order || order.userId !== session?.user.id || order.status === "paid") notFound();
  return (
    <div className="mx-auto flex flex-1 max-w-sm flex-col items-center justify-center px-4 py-16 text-center">
      <Image src="/checkout-fail.svg" alt="" width={2825} height={1910} priority className="h-auto w-72 sm:w-80" />
      <h1 className="font-display mt-6 text-2xl font-bold">התשלום לא הושלם</h1>
      <p className="mt-3 leading-relaxed opacity-80">
        לא הצלחנו לחייב את הכרטיס. אפשר לנסות שוב, או לפנות אלינו אם זה ממשיך לקרות.
      </p>
      <Link href="/checkout" className="mt-8 rounded-full bg-fg px-6 py-3 font-semibold text-bg">
        לנסות שוב
      </Link>
    </div>
  );
}
