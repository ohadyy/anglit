import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import {
  cohorts,
  enrollments,
  examAttempts,
  orders,
  session as authSession,
  user,
  vocabProgress,
} from "@/db/schema";
import { isStaff, isStaffPhone } from "@/lib/access";
import { questionType } from "@/lib/examScore";
import { TYPE_LABELS } from "@/content/questionLabels";
import { Wordmark } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AdminTable, type Row } from "./AdminTable";

export const metadata: Metadata = {
  title: "פאנל ניהול",
  robots: { index: false, follow: false },
};

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// Gated the same way /studio is: only phones listed in STAFF_PHONES may open it,
// and anyone else gets a plain 404 rather than a redirect that reveals the page exists.
export default async function AdminPage() {
  const authed = await auth.api.getSession({ headers: await headers() });
  if (!authed) redirect("/sign-in?next=/admin");
  if (!(await isStaff(authed.user.id))) notFound();

  const [users, paidOrders, enrollmentRows, attemptRows, vocabRows, sessionRows] = await Promise.all([
    db.select({ id: user.id, name: user.name, phone: user.phone, createdAt: user.createdAt }).from(user).orderBy(desc(user.createdAt)),
    db.select({ userId: orders.userId, product: orders.product, provider: orders.provider }).from(orders).where(eq(orders.status, "paid")),
    db
      .select({ userId: enrollments.userId, status: enrollments.status, cohortStart: cohorts.startDate })
      .from(enrollments)
      .innerJoin(cohorts, eq(enrollments.cohortId, cohorts.id))
      .orderBy(cohorts.startDate),
    db
      .select({
        userId: examAttempts.userId,
        kind: examAttempts.kind,
        score: examAttempts.estimatedScore,
        completedAt: examAttempts.completedAt,
        answers: examAttempts.answers,
      })
      .from(examAttempts),
    db.select({ userId: vocabProgress.userId }).from(vocabProgress),
    db.select({ userId: authSession.userId, updatedAt: authSession.updatedAt }).from(authSession),
  ]);

  const paidMap = new Map<string, Set<string>>();
  for (const o of paidOrders) {
    if (!paidMap.has(o.userId)) paidMap.set(o.userId, new Set());
    if (o.product) paidMap.get(o.userId)!.add(o.product);
  }

  const manualIds = new Set(paidOrders.filter((o) => o.provider === "manual").map((o) => o.userId));

  const enrollmentMap =new Map<string, { status: string; cohortStart: Date }>();
  for (const e of enrollmentRows) enrollmentMap.set(e.userId, { status: e.status, cohortStart: e.cohortStart });

  type AttemptAcc = { count: number; best: number; lastOpen?: number; lastClose?: number; lastOpenAt?: Date; lastCloseAt?: Date };
  const attemptMap = new Map<string, AttemptAcc>();
  for (const a of attemptRows) {
    const s = attemptMap.get(a.userId) ?? { count: 0, best: 0 };
    s.count++;
    s.best = Math.max(s.best, a.score);
    if (a.kind === "open" && (!s.lastOpenAt || a.completedAt > s.lastOpenAt)) {
      s.lastOpen = a.score;
      s.lastOpenAt = a.completedAt;
    }
    if (a.kind === "close" && (!s.lastCloseAt || a.completedAt > s.lastCloseAt)) {
      s.lastClose = a.score;
      s.lastCloseAt = a.completedAt;
    }
    attemptMap.set(a.userId, s);
  }

  const vocabMap = new Map<string, number>();
  for (const v of vocabRows) vocabMap.set(v.userId, (vocabMap.get(v.userId) ?? 0) + 1);

  // Rough tally only: which question types showed up across a student's exam attempts, and how
  // many times — not exact practice, and nothing from the free /practice page, which isn't
  // saved to the server at all (only the timed exams and the vocabulary trainer are).
  const practiceMap = new Map<string, Record<string, number>>();
  for (const a of attemptRows) {
    const tally = practiceMap.get(a.userId) ?? {};
    for (const qId of Object.keys(a.answers ?? {})) {
      const type = questionType(qId);
      if (!type) continue;
      tally[type] = (tally[type] ?? 0) + 1;
    }
    practiceMap.set(a.userId, tally);
  }

  const lastSeenMap = new Map<string, Date>();
  for (const s of sessionRows) {
    const cur = lastSeenMap.get(s.userId);
    if (!cur || s.updatedAt > cur) lastSeenMap.set(s.userId, s.updatedAt);
  }

  const now = new Date();
  const rows: Row[] = users.map((u) => {
    const products = paidMap.get(u.id);
    const acc = attemptMap.get(u.id);
    const attempts: Row["attempts"] = acc && { count: acc.count, best: acc.best, lastOpen: acc.lastOpen, lastClose: acc.lastClose };
    const improved = acc?.lastOpen !== undefined && acc?.lastClose !== undefined ? acc.lastClose > acc.lastOpen : null;

    const tally = practiceMap.get(u.id) ?? {};
    const practice = Object.entries(tally)
      .map(([type, count]) => ({ label: TYPE_LABELS[type as keyof typeof TYPE_LABELS].he, count }))
      .sort((a, b) => b.count - a.count);
    const vocabCount = vocabMap.get(u.id) ?? 0;
    if (vocabCount > 0) practice.push({ label: "אוצר מילים", count: vocabCount });

    return {
      ...u,
      staff: isStaffPhone(u.phone),
      paid: !!products,
      manual: manualIds.has(u.id),
      products: products ? [...products] : [],
      enrollment: enrollmentMap.get(u.id),
      attempts,
      improved,
      vocabCount,
      practice,
      lastSeen: lastSeenMap.get(u.id),
    };
  });

  const stats = {
    total: rows.length,
    paid: rows.filter((r) => r.paid).length,
    newThisWeek: rows.filter((r) => now.getTime() - r.createdAt.getTime() < WEEK_MS).length,
    improved: rows.filter((r) => r.improved === true).length,
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full min-w-0 max-w-6xl flex-col px-4 py-10 sm:px-6">
      <header className="flex items-center justify-between gap-3">
        <Link href="/" aria-label="לעמוד הבית">
          <Wordmark className="h-6 w-auto" />
        </Link>
        <ThemeToggle />
      </header>

      <h1 className="font-display mt-8 text-3xl font-bold sm:text-4xl">פאנל ניהול</h1>
      <p className="mt-2 leading-relaxed opacity-70">כל מי שנרשם לאתר, ההתקדמות והציונים שלהם. אפשר לתת או לבטל גישה מלאה בלי תשלום, ישר מהשורה.</p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatPill label="נרשמו" value={stats.total} tone="dark" />
        <StatPill label="משלמים" value={stats.paid} tone="ok" />
        <StatPill label="הצטרפו השבוע" value={stats.newThisWeek} tone="outline" />
        <StatPill label="השתפרו" value={stats.improved} tone="accent" />
      </div>

      {rows.length === 0 ? (
        <p className="mt-10 rounded-3xl border border-dashed border-line p-6 text-center opacity-70">עוד אין משתמשים רשומים.</p>
      ) : (
        <AdminTable rows={rows} now={now.getTime()} />
      )}
      <div className="pb-10" />
    </div>
  );
}

function StatPill({ label, value, tone }: { label: string; value: number; tone: "dark" | "ok" | "outline" | "accent" }) {
  const toneClass =
    tone === "dark"
      ? "bg-fg text-bg"
      : tone === "ok"
        ? "bg-ok text-bg"
        : tone === "accent"
          ? "bg-marker text-ink-deep"
          : "border border-line bg-white";
  return (
    <div>
      <p className="px-1 text-sm opacity-70">{label}</p>
      <div className={`mt-2 flex h-16 items-center justify-center rounded-full text-2xl font-bold tabular-nums ${toneClass}`}>{value}</div>
    </div>
  );
}
