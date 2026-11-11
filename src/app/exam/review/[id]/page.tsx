import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { canAskOhad, hasPaidAccess } from "@/lib/access";
import { db } from "@/db";
import { examAttempts } from "@/db/schema";
import { passagesFor, reviewItems } from "@/lib/examQuestions";
import { ExamReview } from "@/components/ExamReview";
import { formatHebrewDate } from "@/lib/formatDate";
import { SCORE_MAX } from "@/content/facts";
import { PassageProvider } from "@/components/PassageContext";
import { ReadAloud } from "@/components/ReadAloud";
import { LockedExam } from "../../LockedExam";

export const metadata: Metadata = {
  title: "סקירת מבחן",
  robots: { index: false },
};

export default async function ExamReviewPage({ params }: PageProps<"/exam/review/[id]">) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(`/sign-in?next=/exam/review/${encodeURIComponent(id)}`);
  if (!(await hasPaidAccess(session.user.id))) return <LockedExam />;

  // Only the student's own attempt: another student's id finds nothing
  const [attempt] = await db
    .select()
    .from(examAttempts)
    .where(and(eq(examAttempts.id, id), eq(examAttempts.userId, session.user.id)));
  if (!attempt) notFound();

  const items = reviewItems(attempt.answers ?? {});
  const passages = passagesFor(items.map((i) => i.q));

  return (
    <div className="mx-auto w-full max-w-md px-4 pb-24 pt-10 sm:px-6">
      <ReadAloud />
      <Link href="/exam" className="text-sm underline underline-offset-4 opacity-70">
        חזרה למבחנים
      </Link>
      <p className="mt-6 text-sm opacity-70">{formatHebrewDate(attempt.completedAt)}</p>
      <p className="mt-1 text-sm font-semibold tabular-nums">
        הציון המשוער: {attempt.estimatedScore} מתוך {SCORE_MAX}
      </p>
      {items.length === 0 ? (
        <p className="mt-8 leading-relaxed opacity-80">אין שאלות שמורות למבחן הזה.</p>
      ) : (
        <div className="mt-6">
          <PassageProvider passages={passages}>
            <ExamReview items={items} askOhad={await canAskOhad(session.user.id, session.user.phone)} />
          </PassageProvider>
        </div>
      )}
    </div>
  );
}
