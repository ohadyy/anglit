import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import { cohorts, enrollments } from "@/db/schema";

// The sessions every cohort follows. Shown to the student in the confirmation message.
export { COHORT_SESSIONS } from "@/content/cohortSchedule";

const dateFormat = new Intl.DateTimeFormat("he-IL", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jerusalem",
});

export function formatCohortDate(date: Date) {
  return dateFormat.format(date);
}

/** Open cohorts with the number of free seats, and the cohort this student already joined */
export async function cohortOptionsFor(userId: string) {
  const open = await db.select().from(cohorts).where(eq(cohorts.status, "upcoming")).orderBy(cohorts.startDate);

  const taken = await db
    .select({ cohortId: enrollments.cohortId, n: count() })
    .from(enrollments)
    .groupBy(enrollments.cohortId);
  const takenById = new Map(taken.map((row) => [row.cohortId, Number(row.n)]));

  const [mine] = await db
    .select({ cohortId: enrollments.cohortId })
    .from(enrollments)
    .where(eq(enrollments.userId, userId))
    .limit(1);

  const joined = mine ? await db.select().from(cohorts).where(eq(cohorts.id, mine.cohortId)).limit(1) : [];

  return {
    options: open.map((c) => ({
      id: c.id,
      label: formatCohortDate(c.startDate),
      seatsLeft: Math.max(0, c.capacity - (takenById.get(c.id) ?? 0)),
    })),
    joinedLabel: joined[0] ? formatCohortDate(joined[0].startDate) : null,
  };
}

/** The first open cohort that still has a free seat, and whether it's the very next cohort
 * overall (true) or a later one reached because earlier ones are already full (false).
 * Null if every open cohort is full. Used by /diploactjoin to reserve a seat right away
 * instead of leaving that for the account-page cohort picker. */
export async function cohortWithRoom(): Promise<{ id: string; label: string; isPrimary: boolean } | null> {
  const open = await db.select().from(cohorts).where(eq(cohorts.status, "upcoming")).orderBy(cohorts.startDate);
  for (let i = 0; i < open.length; i++) {
    const c = open[i];
    const [taken] = await db.select({ n: count() }).from(enrollments).where(eq(enrollments.cohortId, c.id));
    if (Number(taken?.n ?? 0) < c.capacity) {
      return { id: c.id, label: formatCohortDate(c.startDate), isPrimary: i === 0 };
    }
  }
  return null;
}

// Course prices. 347 is the regular price. 49 applies only to the next cohort that has
// not started yet, while it still has seats, and it ends when that cohort starts.
export const COURSE_PRICE_ILS = 347;
export const UPCOMING_COHORT_PRICE_ILS = 49;

export type CourseOffer = {
  cohortId: string;
  label: string;
  seatsLeft: number;
  priceIls: number;
};

// Disabled 2026-10-15: the open cohort is already committed (paid orders exist for it,
// even though not everyone has finished picking their seat in `enrollments` yet), so the
// site always shows the regular price now, regardless of what the enrollments count says.
// To re-enable for a future cohort, restore the DB-driven check this used to do.
export async function upcomingCourseOffer(): Promise<CourseOffer | null> {
  return null;
}
