import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { orders, user } from "@/db/schema";

function staffPhones(): string[] {
  return (process.env.STAFF_PHONES ?? "").split(",").map((p) => p.trim()).filter(Boolean);
}

/** True for a staff phone number, without a DB round-trip — for lists that already loaded the user. */
export function isStaffPhone(phone: string): boolean {
  return staffPhones().includes(phone);
}

// Paid access is derived straight from orders, not from cohort enrollment —
// the site's own content (exam, scoring) should unlock the moment Cardcom's
// webhook marks an order "paid", independent of which Zoom cohort someone
// later gets slotted into.
// STAFF_PHONES (comma-separated) lets the owner's test accounts see everything.
export async function hasPaidAccess(userId: string): Promise<boolean> {
  const [account] = await db.select({ phone: user.phone }).from(user).where(eq(user.id, userId)).limit(1);
  if (account && staffPhones().includes(account.phone)) return true;

  const [paidOrder] = await db
    .select({ id: orders.id })
    .from(orders)
    .where(and(eq(orders.userId, userId), eq(orders.status, "paid")))
    .limit(1);
  return !!paidOrder;
}

/** True when the user has a paid "7 ימים לאמירנט" order (the course product) */
export async function hasCourse(userId: string): Promise<boolean> {
  const [paidCourse] = await db
    .select({ id: orders.id })
    .from(orders)
    .where(and(eq(orders.userId, userId), eq(orders.status, "paid"), eq(orders.product, "course")))
    .limit(1);
  return !!paidCourse;
}

/** True for the owner's staff accounts (STAFF_PHONES). Used to gate internal pages. */
export async function isStaff(userId: string): Promise<boolean> {
  const [account] = await db.select({ phone: user.phone }).from(user).where(eq(user.id, userId)).limit(1);
  return !!account && staffPhones().includes(account.phone);
}
