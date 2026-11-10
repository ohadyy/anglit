"use server";

import { revalidatePath } from "next/cache";
import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import { cohorts, enrollments, orders } from "@/db/schema";
import { fromLocalInput } from "@/lib/jerusalemTime";
import { COHORT_STATUSES, type CohortStatus } from "@/lib/enums";
import { MAX_COHORT_CAPACITY, MAX_SESSIONS_LENGTH } from "@/content/cohortSchedule";
import { setCohort } from "../actions";
import { requireStaff } from "@/lib/access";
import { BAD_REQUEST, type ActionResult } from "../_shared";

export type CohortInput = {
  start: string; // datetime-local, Israel time
  exam: string;
  capacity: number;
  sessions: string;
  status: CohortStatus;
};

// Returns an error message (string) or the values to write
function parse(input: CohortInput) {
  const start = fromLocalInput(input.start);
  const exam = fromLocalInput(input.exam);
  if (!start || !exam) return "צריך לבחור תאריך ושעה להתחלה ולמבחן.";
  if (exam <= start) return "המבחן צריך להיות אחרי תחילת המחזור.";
  if (!Number.isInteger(input.capacity) || input.capacity < 1 || input.capacity > MAX_COHORT_CAPACITY) return `מספר המקומות צריך להיות בין 1 ל-${MAX_COHORT_CAPACITY}.`;
  if (!COHORT_STATUSES.includes(input.status)) return BAD_REQUEST.error;
  // One line: the text also goes into a WhatsApp template parameter, which can't hold line breaks
  const sessions = String(input.sessions ?? "").replace(/\s+/g, " ").trim();
  if (sessions.length > MAX_SESSIONS_LENGTH) return `תיאור המפגשים ארוך מדי. עד ${MAX_SESSIONS_LENGTH} תווים.`;
  return { startDate: start, examDate: exam, capacity: input.capacity, status: input.status, sessions: sessions || null };
}

export async function createCohort(input: CohortInput): Promise<ActionResult> {
  await requireStaff();
  const parsed = parse(input);
  if (typeof parsed === "string") return { ok: false, error: parsed };

  await db.insert(cohorts).values(parsed);
  revalidatePath("/admin/cohorts");
  return { ok: true };
}

export async function updateCohort(id: string, input: CohortInput): Promise<ActionResult> {
  await requireStaff();
  const parsed = parse(input);
  if (typeof parsed === "string") return { ok: false, error: parsed };

  const updated = await db.update(cohorts).set(parsed).where(eq(cohorts.id, id)).returning({ id: cohorts.id });
  if (updated.length === 0) return { ok: false, error: "המחזור לא נמצא." };
  revalidatePath("/admin/cohorts");
  return { ok: true };
}

// A cohort with students or orders is never deleted: their history points at it. Closing it hides it instead.
export async function deleteCohort(id: string): Promise<ActionResult> {
  await requireStaff();
  const [[e], [o]] = await Promise.all([
    db.select({ n: count() }).from(enrollments).where(eq(enrollments.cohortId, id)),
    db.select({ n: count() }).from(orders).where(eq(orders.cohortId, id)),
  ]);
  if (Number(e?.n ?? 0) > 0 || Number(o?.n ?? 0) > 0) {
    return { ok: false, error: "יש במחזור הזה תלמידים או תשלומים, ולכן לא מוחקים אותו. אפשר לשנות את הסטטוס ל\"נסגר\" והוא ייעלם מהרשימות." };
  }
  await db.delete(cohorts).where(eq(cohorts.id, id));
  revalidatePath("/admin/cohorts");
  return { ok: true };
}

// Same rules as the per-student sheet in /admin (seat cap ignored, no WhatsApp), but refreshes this page too
export async function assignStudent(userId: string, cohortId: string | null): Promise<ActionResult> {
  const res = await setCohort(userId, cohortId);
  revalidatePath("/admin/cohorts");
  return res;
}
