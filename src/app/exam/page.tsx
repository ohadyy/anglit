import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { hasPaidAccess } from "@/lib/access";
import { db } from "@/db";
import { examAttempts } from "@/db/schema";
import { examTests } from "@/content/examTests";
import { EXAM_CORE_QUESTIONS, EXAM_PILOT_QUESTIONS_RANGE } from "@/lib/examStructure";
import { LockIcon } from "@/components/LockIcon";

export const metadata: Metadata = {
  title: "מבחני תרגול",
  robots: { index: false },
};

export default async function ExamListPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in?next=/exam");

  const paid = await hasPaidAccess(session.user.id);

  // The best score so far for each test. A retake can only raise it.
  const attempts = await db
    .select({ testNumber: examAttempts.testNumber, estimatedScore: examAttempts.estimatedScore })
    .from(examAttempts)
    .where(eq(examAttempts.userId, session.user.id));
  const bestByTest = new Map<string, number>();
  for (const a of attempts) {
    if (!a.testNumber) continue;
    bestByTest.set(a.testNumber, Math.max(bestByTest.get(a.testNumber) ?? 0, a.estimatedScore));
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl"><mark className="pink">מבחני תרגול</mark></h1>
      <p className="mt-2 leading-relaxed opacity-80">
        כל מבחן מופיע עם מספר קבוע. אותו מספר תמיד נותן את אותו מבחן. {EXAM_CORE_QUESTIONS} שאלות ליבה
        ועוד {EXAM_PILOT_QUESTIONS_RANGE} שאלות ניסיון. במבחן האמיתי מופיעים תמיד פרקי ניסיון, והמבחן נמשך כ-50 דקות.
      </p>
      {!paid && (
        <p className="mt-2 text-sm leading-relaxed opacity-70">
          מבחן אחד פתוח לכולם בחינם. שאר המבחנים נפתחים עם התשלום על הסמינר.
        </p>
      )}

      <ol className="mt-8 flex flex-col gap-3">
        {examTests.map((test, i) => {
          const best = bestByTest.get(test.number);
          const locked = !paid && !test.free;
          return (
            <li
              key={test.number}
              className="flex items-center justify-between gap-3 rounded-3xl border border-line bg-white p-5 shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)]"
            >
              <div className="min-w-0">
                <p className="text-sm opacity-70">מבחן {i + 1}</p>
                <div className="mt-1 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <p className="text-lg font-bold tabular-nums tracking-tight">{test.number}</p>
                  {best !== undefined && (
                    <p className="text-3xl font-bold tabular-nums text-fg">
                      {best}
                      <span className="ms-1 text-sm font-semibold opacity-70">מתוך 150</span>
                    </p>
                  )}
                  {!paid && test.free && <p className="text-sm font-semibold text-ok">חינם</p>}
                </div>
              </div>
              <Link
                href={locked ? "/pricing" : `/exam/${test.number}`}
                className="flex shrink-0 items-center gap-2 rounded-full bg-fg px-5 py-2.5 text-sm font-semibold text-bg"
              >
                {locked ? <LockIcon className="size-4" /> : best !== undefined ? "שפר" : "להתחיל"}
              </Link>
            </li>
          );
        })}
      </ol>

      <Link href="/account" className="mt-10 self-start text-sm underline opacity-70">
        חזרה לאזור האישי
      </Link>
    </div>
  );
}
