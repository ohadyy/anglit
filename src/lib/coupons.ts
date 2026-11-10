import { eq } from "drizzle-orm";
import { db } from "@/db";
import { coupons } from "@/db/schema";

/** Final price in agorot for a code typed by the buyer (case and spaces ignored), or null if it is not a real code. */
export async function couponAgorot(code: string | undefined | null, baseIls: number): Promise<number | null> {
  const [coupon] = await db
    .select()
    .from(coupons)
    .where(eq(coupons.code, (code ?? "").trim().toUpperCase()));
  if (!coupon) return null;
  if (coupon.priceIls !== null) return Math.min(coupon.priceIls, baseIls) * 100;
  return Math.round(baseIls * (100 - (coupon.percent ?? 0)));
}
