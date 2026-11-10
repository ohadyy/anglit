import { desc } from "drizzle-orm";
import { db } from "@/db";
import { coupons } from "@/db/schema";
import { requireStaffSession } from "@/lib/access";
import { CouponManager } from "./CouponManager";
import { AdminShell, adminMetadata } from "../AdminShell";

export const metadata = adminMetadata("קופונים");

// Same gate as /admin: staff phones only, anyone else gets a plain 404.
export default async function CouponsPage() {
  await requireStaffSession("/admin/coupons");

  const rows = await db.select().from(coupons).orderBy(desc(coupons.createdAt));

  return (
    <AdminShell
      title="קופונים"
      intro="קופון חדש עובד באתר מיד, בלי העלאה. הלקוח מקליד אותו בעמוד התשלום של הסמינר. מחיקה מבטלת אותו באותו רגע."
      width="max-w-3xl"
    >
      <CouponManager rows={rows.map((c) => ({ code: c.code, percent: c.percent, priceIls: c.priceIls }))} />
    </AdminShell>
  );
}
