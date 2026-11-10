"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { coupons } from "@/db/schema";
import { requireStaff } from "@/lib/access";
import { BAD_REQUEST, type ActionResult } from "../_shared";

// kind "percent": value is the percent taken off. kind "price": value is the final price in ILS.
export async function createCoupon(rawCode: string, kind: "percent" | "price", value: number): Promise<ActionResult> {
  await requireStaff();
  const code = typeof rawCode === "string" ? rawCode.trim().toUpperCase() : "";
  if (!/^[A-Z0-9]{2,20}$/.test(code)) return { ok: false, error: "הקוד יכול להכיל רק אותיות באנגלית ומספרים, 2 עד 20 תווים." };
  if (kind !== "percent" && kind !== "price") return BAD_REQUEST;
  if (!Number.isInteger(value)) return { ok: false, error: "צריך להזין מספר שלם." };
  // 100% off would send Cardcom a zero charge, which it rejects
  if (kind === "percent" && (value < 1 || value > 99)) return { ok: false, error: "אחוז ההנחה צריך להיות בין 1 ל-99." };
  if (kind === "price" && (value < 1 || value > 10000)) return { ok: false, error: "המחיר צריך להיות בין 1 ל-10,000 ₪." };

  const created = await db
    .insert(coupons)
    .values({ code, percent: kind === "percent" ? value : null, priceIls: kind === "price" ? value : null })
    .onConflictDoNothing()
    .returning({ code: coupons.code });
  if (created.length === 0) return { ok: false, error: "כבר יש קופון עם הקוד הזה. אפשר למחוק אותו וליצור מחדש, או לבחור קוד אחר." };

  revalidatePath("/admin/coupons");
  return { ok: true };
}

export async function deleteCoupon(code: string): Promise<ActionResult> {
  await requireStaff();
  if (typeof code !== "string" || !code) return BAD_REQUEST;

  await db.delete(coupons).where(eq(coupons.code, code));
  revalidatePath("/admin/coupons");
  return { ok: true };
}
