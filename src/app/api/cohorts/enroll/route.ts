import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { and, count, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { cohorts, enrollments } from "@/db/schema";
import { hasCourse } from "@/lib/access";
import { COHORT_SESSIONS, formatCohortDate } from "@/lib/cohorts";
import { sendTemplate } from "@/lib/whatsapp";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!(await hasCourse(session.user.id))) {
    return NextResponse.json({ error: "course required" }, { status: 403 });
  }

  const body = (await request.json()) as { cohortId?: unknown };
  if (typeof body.cohortId !== "string") {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }

  const [cohort] = await db
    .select()
    .from(cohorts)
    .where(and(eq(cohorts.id, body.cohortId), eq(cohorts.status, "upcoming")))
    .limit(1);
  if (!cohort) {
    return NextResponse.json({ error: "cohort not open" }, { status: 404 });
  }

  // One cohort per student
  const [existing] = await db
    .select({ id: enrollments.id })
    .from(enrollments)
    .where(eq(enrollments.userId, session.user.id))
    .limit(1);
  if (existing) {
    return NextResponse.json({ error: "already enrolled" }, { status: 409 });
  }

  const [{ n }] = await db
    .select({ n: count() })
    .from(enrollments)
    .where(eq(enrollments.cohortId, cohort.id));
  if (Number(n) >= cohort.capacity) {
    return NextResponse.json({ error: "cohort full" }, { status: 409 });
  }

  await db.insert(enrollments).values({ userId: session.user.id, cohortId: cohort.id, status: "active" });

  // The confirmation is a nice-to-have: a failed send must not undo the enrollment
  try {
    await sendTemplate(
      session.user.phone,
      process.env.WHATSAPP_TEMPLATE_COHORT ?? "cohort_confirmation",
      [session.user.name, formatCohortDate(cohort.startDate), COHORT_SESSIONS],
    );
  } catch (err) {
    console.error("[cohorts] confirmation WhatsApp failed:", err);
  }

  return NextResponse.json({ ok: true });
}
