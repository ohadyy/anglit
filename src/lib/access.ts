import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { and, eq, ne } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { orders, user } from "@/db/schema";
import type { ProductId } from "@/lib/enums";
import { normalizePhone } from "@/lib/phoneAuth";

// STAFF_PHONES (comma-separated) lets the owner's test accounts see everything.
// Both sides are compared normalized, so "050-123 4567" and "0501234567" are the same number.
let staffSet: Set<string> | null = null;
function staffPhones(): Set<string> {
  staffSet ??= new Set((process.env.STAFF_PHONES ?? "").split(",").map((p) => normalizePhone(p.trim())).filter(Boolean));
  return staffSet;
}

/** True for a staff phone number, without a DB round-trip — for lists that already loaded the user. */
export function isStaffPhone(phone: string | null | undefined): boolean {
  return !!phone && staffPhones().has(normalizePhone(phone));
}

// Paid access is derived straight from orders, not from cohort enrollment —
// the site's own content (exam, scoring) should unlock the moment Cardcom's
// webhook marks an order "paid", independent of which Zoom cohort someone
// later gets slotted into.
export async function hasPaidAccess(userId: string): Promise<boolean> {
  const [account] = await db.select({ phone: user.phone }).from(user).where(eq(user.id, userId)).limit(1);
  if (account && isStaffPhone(account.phone)) return true;

  const [paidOrder] = await db
    .select({ id: orders.id })
    .from(orders)
    .where(and(eq(orders.userId, userId), eq(orders.status, "paid")))
    .limit(1);
  return !!paidOrder;
}

/** The products this user paid for (real orders only, staff phones add nothing) */
export async function paidProducts(userId: string): Promise<ProductId[]> {
  const rows = await db
    .select({ product: orders.product })
    .from(orders)
    .where(and(eq(orders.userId, userId), eq(orders.status, "paid")));
  return [...new Set(rows.map((r) => r.product).filter((p): p is ProductId => !!p))];
}

/** The gate for the staff pages: sign in first, and anyone who is not staff gets a plain 404 (no hint the page exists) */
export async function requireStaffSession(next: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(`/sign-in?next=${next}`);
  if (!isStaffPhone(session.user.phone)) notFound();
  return session;
}

/** Server actions take whatever the browser sends, so every staff action starts here */
export async function requireStaff() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !isStaffPhone(session.user.phone)) throw new Error("forbidden");
  return session;
}

// Manual access = a zero-agorot "paid" course order with provider "manual". Everything that
// checks hasPaidAccess or paidProducts picks it up, and no cohort enrollment is created.
export const MANUAL_PROVIDER = "manual";

export async function grantManualAccess(userId: string) {
  await db.insert(orders).values({ userId, amountAgorot: 0, product: "course", provider: MANUAL_PROVIDER, status: "paid", paidAt: new Date() });
}

export async function revokeManualAccess(userId: string) {
  await db.delete(orders).where(and(eq(orders.userId, userId), eq(orders.provider, MANUAL_PROVIDER)));
}

/** True when the user has a paid order through a real card payment (not manual access) */
export async function hasCardPayment(userId: string): Promise<boolean> {
  const [cardOrder] = await db
    .select({ id: orders.id })
    .from(orders)
    .where(and(eq(orders.userId, userId), ne(orders.provider, MANUAL_PROVIDER), eq(orders.status, "paid")))
    .limit(1);
  return !!cardOrder;
}
