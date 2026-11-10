import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import { cohorts, enrollments } from "@/db/schema";
import { COHORT_SESSIONS } from "@/content/cohortSchedule";
import { formatCohortDate, formatCohortDay } from "@/lib/jerusalemTime";

/** Cohorts open for registration (status "upcoming"), earliest first */
function openCohorts() {
  return db.select().from(cohorts).where(eq(cohorts.status, "upcoming")).orderBy(cohorts.startDate);
}

/** Open cohorts with the number of free seats, and the cohort this student already joined */
export async function cohortOptionsFor(userId: string) {
  const open = await openCohorts();

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
      sessions: c.sessions ?? COHORT_SESSIONS,
    })),
    joinedLabel: joined[0] ? formatCohortDate(joined[0].startDate) : null,
  };
}

/** The earliest upcoming cohort that is still open for registration, as a date label ("25 באוקטובר") plus its size */
export async function nextCohortInfo(): Promise<{ label: string; capacity: number } | null> {
  const open = await openCohorts();
  // Registration for a cohort is closed the day before it starts
  const next = open.find((c) => c.startDate.getTime() > Date.now() + 24 * 60 * 60 * 1000);
  if (!next) return null;
  return { label: formatCohortDay(next.startDate), capacity: next.capacity };
}
