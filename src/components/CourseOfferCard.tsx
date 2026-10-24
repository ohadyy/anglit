import Link from "next/link";
import type { CourseOffer } from "@/lib/cohorts";
import { getProduct } from "@/content/pricingCopy";

// The regular price comes from the same product list as the pricing page
export const COURSE_REGULAR_PRICE = getProduct("course")?.price ?? "347";
const COURSE_LIST_PRICE = getProduct("course")?.listPrice ?? "500";

export function CourseOfferCta({ className = "", children }: { className?: string; children: string }) {
  return (
    <Link
      href="/checkout?product=course"
      className={`inline-flex touch-manipulation items-center justify-center rounded-full bg-fg px-7 py-4 text-center font-semibold text-bg transition-opacity hover:opacity-85 active:opacity-75 ${className}`}
    >
      {children}
    </Link>
  );
}

// The price block shows the live offer when there is one, and the regular price otherwise
export function CourseOfferPrice({ offer, align = "center" }: { offer: CourseOffer | null; align?: "center" | "start" }) {
  const text = align === "center" ? "text-center" : "text-start";
  if (!offer) {
    return (
      <div className={text}>
        <p className="flex items-center justify-center gap-4 text-lg">
          <s className="text-warn tabular-nums"><span className="sr-only">מחיר מקורי </span>{COURSE_LIST_PRICE} ₪</s>
          <span className="opacity-70">30% הנחה</span>
        </p>
        <p className="text-4xl font-bold tracking-tight tabular-nums text-ok">{COURSE_REGULAR_PRICE} ₪</p>
        <p className="mt-1 text-sm opacity-70">לכל הסמינר, תשלום חד פעמי</p>
      </div>
    );
  }
  return (
    <div className={text}>
      <p className="text-sm font-semibold opacity-70">מחיר למחזור {offer.label}</p>
      <p className="mt-1 text-5xl font-bold tracking-tight tabular-nums text-ok">{offer.priceIls} ₪</p>
      <p className="mt-2 text-sm opacity-80">
        מחיר הסמינר הרגיל: <span className="line-through">{COURSE_REGULAR_PRICE} ₪</span>. המחיר נסגר כשהמחזור מתחיל.
      </p>
      <p className="mt-1 text-sm tabular-nums opacity-80">נשארו {offer.seatsLeft} מקומות במחזור הזה.</p>
    </div>
  );
}
