"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { isStaff } from "@/lib/access";

// Manual access = a zero-agorot "paid" course order with provider "manual". Everything that
// checks hasPaidAccess/hasCourse picks it up, and no cohort enrollment is created.
export async function setManualAccess(userId: string, grant: boolean) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !(await isStaff(session.user.id))) throw new Error("forbidden");

  if (grant) {
    await db.insert(orders).values({ userId, amountAgorot: 0, product: "course", provider: "manual", status: "paid", paidAt: new Date() });
  } else {
    await db.delete(orders).where(and(eq(orders.userId, userId), eq(orders.provider, "manual")));
  }
  revalidatePath("/admin");
}
