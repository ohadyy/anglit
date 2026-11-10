import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { hasPaidAccess } from "@/lib/access";
import { db } from "@/db";
import { examAttempts } from "@/db/schema";
import { examTests, findExamTest } from "@/content/examTests";
import { TactileLink } from "@/components/TactileButton";
import Image from "next/image";
import { copy } from "@/content/copy";
import { formatHebrewDate } from "@/lib/formatDate";
import { SCORE_MAX } from "@/content/facts";

export const metadata: Metadata = {
  title: copy.examTitle,
  robots: { index: false },
};

export default async function ExamListPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const paid = session ? await hasPaidAccess(session.user.id) : false;

  const attempts = session
    ? (
        await db
          .select({ id: examAttempts.id, testNumber: examAttempts.testNumber, estimatedScore: examAttempts.estimatedScore, completedAt: examAttempts.completedAt })
          .from(examAttempts)
          .where(eq(examAttempts.userId, session.user.id))
          .orderBy(desc(examAttempts.completedAt))
      ).filter((a) => a.testNumber && findExamTest(a.testNumber))
    : [];

  // One button, one choice: the student never picks a number. A paying student is sent to any of the
  // adaptive tests at random (/exam/start); a test taken before is a different test the second time anyway.
  // Without paid access the one free test is the only test; after it, the way forward is the seminar.
  const free = examTests.find((t) => t.free);
  const freeTaken = !!free && attempts.some((a) => a.testNumber === free.number);
  const startHref = paid ? "/exam/start" : free && !freeTaken ? `/exam/${free.number}` : null;

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl"><mark className="pink">{copy.examTitle}</mark></h1>
      <p className="mt-2 leading-relaxed opacity-80">{copy.examSub}</p>

      <div className="mt-8 flex flex-col items-center gap-4 rounded-[2rem] border border-line bg-white p-6 shadow-[0_30px_60px_-24px_rgb(14_8_82/0.25)]">
        <Image src="/winning.svg" alt="" width={2825} height={1910} priority className="h-auto w-56" />
        {startHref ? (
          <>
            <TactileLink href={startHref} prefetch={false} size="lg" fullWidth>
              <span className="text-xl">{copy.examStartCta}</span>
            </TactileLink>
            {!paid ? (
              <p className="text-sm font-semibold text-ok">המבחן הראשון חינם</p>
            ) : (
              attempts.length > 0 && <p className="text-sm opacity-70">{copy.examNextLabel.replace("{n}", String(attempts.length + 1))}</p>
            )}
          </>
        ) : (
          <>
            <TactileLink href="/pricing" size="lg" fullWidth>
              להמשך התרגול
            </TactileLink>
            <p className="text-center text-sm leading-relaxed opacity-70">שאר המבחנים נפתחים עם התשלום על הסמינר.</p>
          </>
        )}
      </div>

      {attempts.length > 0 && (
        <section className="mt-12">
          <h2 className="text-sm font-semibold opacity-70">{copy.examHistoryTitle}</h2>
          <ul className="mt-3 divide-y divide-line rounded-2xl border border-line bg-white">
            {/* Numbered by order taken (newest first), so the list reads as a series of different exams */}
            {attempts.map((a, i) => (
              <li key={a.id} className="px-4 py-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span>
                    <span className="font-semibold">מבחן {attempts.length - i}</span>
                    <span className="opacity-70"> · {formatHebrewDate(a.completedAt)}</span>
                  </span>
                  <span className="font-semibold tabular-nums">
                    {a.estimatedScore}
                    <span className="ms-1 text-xs font-normal opacity-60">מתוך {SCORE_MAX}</span>
                  </span>
                </div>
                {paid && (
                  <Link href={`/exam/review/${a.id}`} className="flex min-h-11 items-center font-semibold underline underline-offset-4">
                    ראה טעויות
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* A visitor without an account has no personal area to go back to */}
      <Link href={session ? "/account" : "/"} className="mt-10 flex min-h-11 items-center self-start text-sm underline opacity-70">
        {session ? "חזרה לאזור האישי" : "חזרה לדף הבית"}
      </Link>
    </div>
  );
}
