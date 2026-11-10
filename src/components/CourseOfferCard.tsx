import Link from "next/link";
import { loyaltyLabel } from "@/content/pricingCopy";
import { courseProduct, coursePrice, discountPercent } from "@/lib/pricing";

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

// `loyal`: an existing customer, who sees (and is charged) the loyalty price
export function CourseOfferPrice({ align = "center", big = false, loyal = false }: { align?: "center" | "start"; big?: boolean; loyal?: boolean }) {
  const text = align === "center" ? "text-center" : "text-start";
  const { listIls, priceIls } = coursePrice(loyal);
  const crossedOut = loyal ? listIls : courseProduct.listPriceIls;
  return (
    <div className={text}>
      <p className="flex items-center justify-center gap-4 text-lg">
        <s className="text-warn tabular-nums"><span className="sr-only">מחיר מקורי </span>{crossedOut} ₪</s>
        <span className="opacity-70">{loyal ? loyaltyLabel : `${discountPercent(courseProduct)}% הנחה`}</span>
      </p>
      <p className={`font-bold tracking-tight tabular-nums text-ok ${big ? "mt-4 text-6xl" : "text-4xl"}`}>{priceIls} ₪</p>
      {!loyal && !big && <p className="mt-1 text-sm opacity-70">לכל הסמינר, תשלום חד פעמי</p>}
    </div>
  );
}
