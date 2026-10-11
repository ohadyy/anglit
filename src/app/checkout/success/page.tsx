import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Wordmark } from "@/components/Logo";
import { checkoutSuccessStepsByProduct } from "@/content/copy";
import { upcomingCourseOffer } from "@/lib/cohorts";

export const metadata: Metadata = {
  title: "התשלום התקבל",
};

// Cardcom redirects the browser here right after payment. The webhook
// (src/app/api/webhooks/cardcom/route.ts) is the actual source of truth that
// marks the order paid. This page explains what happens next.
export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product } = await searchParams;
  // Access-only buyers see the open cohort offer once, as an invitation, at the real price
  const offer = product === "access" ? await upcomingCourseOffer() : null;
  const steps = product === "access" || product === "private" ? checkoutSuccessStepsByProduct[product] : checkoutSuccessStepsByProduct.course;
  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col px-4 py-12 sm:px-6">
      <header>
        <Wordmark className="h-8 w-auto" />
        {/* The dog sits beside the heading. Its head faces the text (the image is already mirrored). */}
        <div className="mt-6 flex flex-col-reverse items-center gap-6 sm:flex-row">
          <h1 className="font-display min-w-0 flex-1 text-center text-4xl font-bold leading-tight sm:text-start sm:text-5xl">
            התשלום התקבל, <mark className="pink">ברוכים הבאים!</mark>
          </h1>
          <Image
            src="/brand/mascot-lounging-dog.png"
            alt=""
            width={1168}
            height={880}
            className="h-auto w-40 shrink-0 sm:w-52"
          />
        </div>
        <p className="mt-5 text-lg leading-relaxed opacity-80">שמחים שהצטרפתם. הנה מה שקורה עכשיו, צעד אחרי צעד.</p>
      </header>

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
