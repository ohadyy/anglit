import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { examAttempts } from "@/db/schema";
import { scoreLevel } from "@/lib/examScore";
import { hasCourse, hasPaidAccess } from "@/lib/access";
import { cohortOptionsFor } from "@/lib/cohorts";
import { LockIcon } from "@/components/LockIcon";
import { copy } from "@/content/copy";
import { UserAvatar } from "./UserAvatar";
import { SignOutButton } from "./SignOutButton";
import { CohortPicker } from "./CohortPicker";
import { StartChecklist } from "./StartChecklist";

export default async function AccountPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in?next=/account");

  const [attempts, paid, course] = await Promise.all([
    db
      .select()
      .from(examAttempts)
      .where(eq(examAttempts.userId, session.user.id))
      .orderBy(desc(examAttempts.completedAt)),
    hasPaidAccess(session.user.id),
    hasCourse(session.user.id),
  ]);

  const openTest = attempts.find((a) => a.kind === "open");
  const closeTest = attempts.find((a) => a.kind === "close");
  const cohort = course ? await cohortOptionsFor(session.user.id) : null;

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col px-4 py-12 sm:px-6">
      <header className="account-enter" style={delayStyle(0)}>
        <div className="flex items-center gap-4">
          <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
            שלום, <span>{session.user.name}</span>
          </h1>
          {/* Seeded by user id: same user always gets the same avatar, and no personal data leaves the page */}
          <UserAvatar seed={session.user.id} />
        </div>
        <p className="mt-3 text-lg opacity-70">איזה תרגול נעשה היום?</p>
      </header>

      {!paid && (
        <div className="account-enter mt-8 rounded-3xl border border-line bg-white shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] p-5" style={delayStyle(60)}>
          <p className="font-semibold">{copy.accountUnpaidBannerTitle}</p>
          <p className="mt-1 text-sm opacity-70">{copy.accountUnpaidBannerText}</p>
          <Link
            href="/pricing"
            className="mt-4 flex w-full items-center justify-center rounded-full bg-fg px-5 py-3 font-semibold text-bg"
          >
            {copy.accountUnpaidBannerCta}
          </Link>
        </div>
      )}

      <nav className="mt-10 grid gap-4 sm:grid-cols-2" aria-label="אזורי הלימוד">
        <Tile
          delay={120}
          href={paid ? "/exam" : "/pricing"}
          title="מבחנים"
          text={paid ? "10 מבחני תרגול, וכל אחד עם מספר קבוע" : copy.accountLockedLabel}
          badge={paid && attempts.length > 0 ? `${attempts.length} ניסיונות` : undefined}
          locked={!paid}
        />
        <Tile
          delay={180}
          href="/practice"
          title="תרגול חופשי"
          text={paid ? "כל סוגי השאלות פתוחים, עם הסבר לכל תשובה" : "5 שאלות חינם לדוגמה, בלי הרשמה"}
          badge={paid ? undefined : "חינם"}
          locked={false}
        />
        <Tile
          delay={240}
          href={paid ? "/vocabulary" : "/pricing"}
          title="אוצר מילים"
          text={paid ? "המילים שחוזרות במבחן, לפי רמת השליטה שלכם" : copy.accountLockedLabel}
          locked={!paid}
        />
        <Tile
          delay={300}
          href={course ? "#cohort" : "/pricing"}
          title="המחזור שלי"
          text={
            !course
              ? "לתלמידי \"7 ימים לאמירנט\" בלבד"
              : cohort?.joinedLabel
                ? `נרשמתם למחזור שמתחיל ב-${cohort.joinedLabel}`
                : "בחרו מחזור, ותקבלו אישור בוואטסאפ"
          }
          locked={!course}
        />
      </nav>

      <StartChecklist
        steps={[
          { label: "שלמו את המסלול", done: paid, href: "/pricing" },
          // Only course students pick a cohort; practice-only members skip this step
          ...(course ? [{ label: "בחרו מחזור", done: !!cohort?.joinedLabel, href: "#cohort" }] : []),
          ...(paid ? [{ label: "עשו את מבחן הפתיחה", done: !!openTest, href: "/exam" }] : []),
        ]}
      />

      {cohort && (
        <section id="cohort" className="account-enter mt-10 scroll-mt-8" style={delayStyle(360)}>
          <CohortPicker options={cohort.options} joinedLabel={cohort.joinedLabel} />
        </section>
      )}

      {(openTest || closeTest) && (
        <section className="account-enter mt-10" style={delayStyle(420)}>
          <h2 className="font-display text-xl font-bold">התוצאות שלכם</h2>
          <div className="mt-4 flex flex-col gap-3">
            {openTest && <ResultCard title="מבחן פתיחה" attempt={openTest} />}
            {closeTest && <ResultCard title="מבחן סיום" attempt={closeTest} />}
          </div>
        </section>
      )}

      {/* Empty state: a paid member with no results yet gets a clear next step, not a blank space */}
      {paid && !openTest && !closeTest && (
        <section className="account-enter mt-10" style={delayStyle(420)}>
          <h2 className="font-display text-xl font-bold">התוצאות שלכם</h2>
          <div className="mt-4 rounded-3xl border border-dashed border-line p-6 text-center">
            <Image src="/studying-with-clock.svg" alt="" width={2775} height={1860} className="mx-auto mb-4 h-auto w-48 sm:w-56" />
            <p className="font-semibold">עוד אין תוצאות מבחן</p>
            <p className="mt-1 text-sm leading-relaxed opacity-70">כשתסיימו מבחן, התוצאה והרמה שלכם יופיעו כאן.</p>
            <Link href="/exam" className="mt-5 inline-flex rounded-full border border-fg/25 px-5 py-2.5 text-sm font-semibold hover:bg-fg/5">
              למבחנים
            </Link>
          </div>
        </section>
      )}

      <SignOutButton className="mt-12 self-start rounded-full border border-fg/25 px-6 py-3 font-semibold hover:bg-fg/5" />
    </div>
  );
}

function Tile({
  href,
  title,
  text,
  badge,
  locked,
  delay,
}: {
  href: string;
  title: string;
  text: string;
  badge?: string;
  locked: boolean;
  delay: number;
}) {
  return (
    <Link
      href={href}
      data-transition-ignore
      style={delayStyle(delay)}
      className="account-enter account-tile group flex min-h-44 flex-col justify-between rounded-3xl border border-line bg-white shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] p-6 hover:border-fg/30"
    >
      <div>
        <span aria-hidden className="block size-2.5 rounded-full bg-marker" />
        <p className="font-display mt-6 text-2xl font-bold">{title}</p>
        <p className="mt-2 text-sm leading-relaxed opacity-70">{text}</p>
      </div>
      <div className="mt-6 flex items-center justify-between text-sm font-semibold opacity-70 group-hover:opacity-100">
        <span>{badge ?? ""}</span>
        <span aria-hidden>{locked ? <LockIcon className="size-5" /> : "←"}</span>
      </div>
    </Link>
  );
}

// Each entrance step is delayed a little more than the one before it (stagger)
function delayStyle(ms: number): CSSProperties {
  return { "--delay": `${ms}ms` } as CSSProperties;
}

function ResultCard({ title, attempt }: { title: string; attempt: typeof examAttempts.$inferSelect }) {
  const level = scoreLevel(attempt.estimatedScore);
  return (
    <div className="rounded-3xl border border-line bg-white shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] p-5">
      <div className="flex items-center justify-between">
        <p className="font-semibold">{title}</p>
        <p className="text-2xl font-bold tabular-nums">{attempt.estimatedScore}</p>
      </div>
      <p className="mt-1 text-sm opacity-70">
        {level.label} · {attempt.rawCorrect}/{attempt.totalQuestions} נכונות
      </p>
    </div>
  );
}
