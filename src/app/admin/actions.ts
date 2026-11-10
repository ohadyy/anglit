"use server";

import { revalidatePath } from "next/cache";
import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { cohorts, crmNotes, crmState, enrollments, user } from "@/db/schema";
import { grantManualAccess, hasCardPayment, isStaffPhone, requireStaff, revokeManualAccess } from "@/lib/access";
import { isValidIlPhone, normalizePhone } from "@/lib/phoneAuth";
import type { ActionResult } from "./_shared";

export async function setManualAccess(userId: string, grant: boolean) {
  await requireStaff();

  if (grant) await grantManualAccess(userId);
  else await revokeManualAccess(userId);
  revalidatePath("/admin");
}

// Puts a student in a cohort (or takes them out with null). Unlike the student's own picker this
// ignores the seat cap: the owner decides. One cohort per student, same as /api/cohorts/enroll.
export async function setCohort(userId: string, cohortId: string | null): Promise<ActionResult> {
  await requireStaff();

  if (cohortId === null) {
    await db.delete(enrollments).where(eq(enrollments.userId, userId));
  } else {
    const [cohort] = await db.select({ id: cohorts.id }).from(cohorts).where(eq(cohorts.id, cohortId)).limit(1);
    if (!cohort) return { ok: false, error: "המחזור לא נמצא." };
    const [existing] = await db.select({ id: enrollments.id }).from(enrollments).where(eq(enrollments.userId, userId)).limit(1);
    if (existing) await db.update(enrollments).set({ cohortId, status: "active" }).where(eq(enrollments.id, existing.id));
    else await db.insert(enrollments).values({ userId, cohortId, status: "active" });
  }
  revalidatePath("/admin");
  return { ok: true };
}

// Fixes a typo in the name or phone. The phone is also the staff check, so it stays unique.
export async function updateDetails(userId: string, name: string, rawPhone: string): Promise<ActionResult> {
  await requireStaff();

  const cleanName = name.trim();
  const phone = normalizePhone(rawPhone);
  if (!cleanName) return { ok: false, error: "צריך להזין שם." };
  if (!isValidIlPhone(phone)) return { ok: false, error: "מספר הטלפון לא תקין." };

  const [taken] = await db.select({ id: user.id }).from(user).where(and(eq(user.phone, phone), ne(user.id, userId))).limit(1);
  if (taken) return { ok: false, error: "המספר הזה כבר שייך למשתמש אחר." };

  await db.update(user).set({ name: cleanName, phone }).where(eq(user.id, userId));
  revalidatePath("/admin");
  return { ok: true };
}

// Permanent: exam results, vocabulary, mistakes, enrollment and manual access go with the account.
// Accounts with a real card payment are refused so the payment record is never lost by accident.
export async function deleteUser(userId: string): Promise<ActionResult> {
  const session = await requireStaff();
  if (userId === session.user.id) return { ok: false, error: "אי אפשר למחוק את החשבון שאתם מחוברים אליו." };

  const [target] = await db.select({ phone: user.phone }).from(user).where(eq(user.id, userId)).limit(1);
  if (!target) return { ok: false, error: "המשתמש לא נמצא." };
  if (isStaffPhone(target.phone)) return { ok: false, error: "זה חשבון צוות. מסירים אותו קודם מרשימת הצוות." };

  if (await hasCardPayment(userId)) return { ok: false, error: "למשתמש הזה יש תשלום בכרטיס אשראי, ולכן לא מוחקים אותו מכאן. אפשר לבטל לו את הגישה במקום." };

  // The CRM tables have no foreign key to user, so their rows are removed here
  await db.delete(crmNotes).where(and(eq(crmNotes.kind, "user"), eq(crmNotes.refId, userId)));
  await db.delete(crmState).where(and(eq(crmState.kind, "user"), eq(crmState.refId, userId)));
  await db.delete(user).where(eq(user.id, userId));
  revalidatePath("/admin");
  return { ok: true };
}
