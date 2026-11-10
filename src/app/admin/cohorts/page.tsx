import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { cohorts, enrollments, user } from "@/db/schema";
import { requireStaffSession } from "@/lib/access";
import { toLocalInput } from "@/lib/jerusalemTime";
import { COHORT_SESSIONS } from "@/content/cohortSchedule";
import { CohortManager } from "./CohortManager";
import { AdminShell, adminMetadata } from "../AdminShell";

export const metadata = adminMetadata("מחזורים");

// Same gate as /admin: staff phones only, anyone else gets a plain 404.
export default async function CohortsPage() {
  await requireStaffSession("/admin/cohorts");

  const [cohortRows, enrolled, users] = await Promise.all([
    db.select().from(cohorts).orderBy(cohorts.startDate),
    db
      .select({ userId: enrollments.userId, cohortId: enrollments.cohortId, name: user.name, phone: user.phone })
      .from(enrollments)
      .innerJoin(user, eq(enrollments.userId, user.id)),
    db.select({ id: user.id, name: user.name, phone: user.phone }).from(user).orderBy(desc(user.createdAt)),
  ]);

  const enrolledIds = new Set(enrolled.map((e) => e.userId));

  return (
    <AdminShell
      title="מחזורים"
      intro={<>שינוי כאן עובד באתר מיד. תלמידים רואים רק מחזורים בסטטוס &quot;פתוח להרשמה&quot;. מחזור שיש בו תלמידים לא נמחק, אלא נסגר.</>}
      width="max-w-3xl"
    >
      <CohortManager
        defaultSessions={COHORT_SESSIONS}
        cohorts={cohortRows.map((c) => ({
          id: c.id,
          start: toLocalInput(c.startDate),
          exam: toLocalInput(c.examDate),
          capacity: c.capacity,
          sessions: c.sessions ?? "",
          status: c.status,
          students: enrolled.filter((e) => e.cohortId === c.id).map((e) => ({ id: e.userId, name: e.name, phone: e.phone })),
        }))}
        // ponytail: every unassigned user goes to the client; add server-side search if the list passes a few thousand
        unassigned={users.filter((u) => !enrolledIds.has(u.id)).map((u) => ({ id: u.id, name: u.name, phone: u.phone }))}
      />
    </AdminShell>
  );
}
