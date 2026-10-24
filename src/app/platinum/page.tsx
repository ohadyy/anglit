import { headers } from "next/headers";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { hasPaidAccess } from "@/lib/access";
import { db } from "@/db";
import { examAttempts } from "@/db/schema";
import { platinumTests } from "@/content/examTests";
import { Ore } from "./Ore";
import { GoldWordmark } from "./GoldWordmark";
import { LockIcon } from "@/components/LockIcon";

export default async function PlatinumHubPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const paid = session ? await hasPaidAccess(session.user.id) : false;

  // Best score so far for each test, the same way the regular list shows it
  const attempts = session
    ? await db
        .select({ testNumber: examAttempts.testNumber, estimatedScore: examAttempts.estimatedScore })
        .from(examAttempts)
        .where(eq(examAttempts.userId, session.user.id))
    : [];
  const best = new Map<string, number>();
  for (const a of attempts) {
    if (a.testNumber?.startsWith("P")) best.set(a.testNumber, Math.max(best.get(a.testNumber) ?? 0, a.estimatedScore));
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-16 pt-14">
      <header className="text-center">
        <div className="plat-fade flex justify-center"><GoldWordmark className="h-9" /></div>
        <h1 className="plat-rise plat-serif plat-gold-text mt-3 text-6xl font-semibold leading-none tracking-tight sm:text-7xl" style={{ "--d": "250ms" } as React.CSSProperties}>
          Platinum
        </h1>
        <div className="plat-fade mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" style={{ "--d": "700ms" } as React.CSSProperties} />
        <p className="plat-fade mt-6 text-lg font-semibold leading-relaxed" style={{ "--d": "900ms" } as React.CSSProperties}>
          לא לבעלי לב חלש.
          <br />
          מבחנים קשים, לאנשים רציניים.
          <br />
          ציון טוב פה = ניגשים לאמירנט בלי דאגות.
          <br />
          חושבים שאתם מסוגלים?
        </p>
      </header>

      <ol className="mt-12 flex flex-col gap-4">
        {platinumTests.map((test, i) => {
          const locked = !paid && !test.free;
          const score = best.get(test.number);
          return (
            <li key={test.number} className="plat-rise" style={{ "--d": `${1100 + i * 180}ms` } as React.CSSProperties}>
              <Link
                href={locked ? "/pricing" : `/platinum/${test.number}`}
                className={`plat-tone-${test.tone} plat-card group flex items-center gap-5 rounded-sm p-5 transition-colors duration-700 hover:border-[var(--tone)]`}
              >
                <Ore tone={test.tone} className="size-14 shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="plat-cinzel plat-tone-text block text-2xl font-bold leading-tight tracking-wider">{test.name}</span>
                </span>
                <span className="shrink-0 text-end">
                  {score !== undefined && (
                    <span className="plat-serif plat-gold-text block text-3xl font-semibold tabular-nums">{score}</span>
                  )}
                  {locked ? (
                    <LockIcon className="ms-auto size-5 opacity-70" />
                  ) : test.free && !paid ? (
                    <span className="text-xs tracking-wide text-[var(--gold)]">פתוח לכולם</span>
                  ) : score === undefined ? (
                    <span className="text-sm text-[var(--gold)]">להיכנס</span>
                  ) : null}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      <p className="mt-10 text-center text-xs leading-relaxed opacity-50">
        מבחני תרגול של Anglit. הציון הוא הערכה בלבד ואינו ציון רשמי של מאל&quot;ו.
      </p>
      <Link href="/exam" className="mt-4 self-center text-sm underline underline-offset-4 opacity-60">
        חזרה למבחני התרגול
      </Link>
    </div>
  );
}

