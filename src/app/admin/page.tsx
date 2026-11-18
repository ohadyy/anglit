import Link from "next/link";
import { desc, eq, ne } from "drizzle-orm";
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
import { isStaffPhone, MANUAL_PROVIDER, requireStaffSession } from "@/lib/access";
import { questionType } from "@/lib/examScore";
import { countUncontactedLeads } from "@/lib/uncontactedLeads";
import { daysUntil } from "@/lib/urgency";
import { formatCohortDate } from "@/lib/jerusalemTime";
import { TYPE_LABELS } from "@/content/questionLabels";
import { AdminTable, type Row } from "./AdminTable";
import { AdminShell, adminMetadata } from "./AdminShell";

export const metadata = adminMetadata("פאנל ניהול");

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// Gated the same way /studio is: only phones listed in STAFF_PHONES may open it,
// and anyone else gets a plain 404 rather than a redirect that reveals the page exists.
export default async function AdminPage() {
  const authed = await requireStaffSession("/admin");

  const [users, paidOrders, enrollmentRows, attemptRows, vocabRows, sessionRows, cohortRows, waitingLeads] = await Promise.all([
    db
      .select({
        id: user.id,
        name: user.name,
        phone: user.phone,
        createdAt: user.createdAt,
        examDate: user.examDate,
        priorScore: user.priorScore,
        targetScore: user.targetScore,
      })
      .from(user)
      .orderBy(desc(user.createdAt)),
    db.select({ userId: orders.userId, product: orders.product, provider: orders.provider }).from(orders).where(eq(orders.status, "paid")),
    db
      .select({ userId: enrollments.userId, status: enrollments.status, cohortStart: cohorts.startDate, cohortId: enrollments.cohortId })
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
    db.select().from(cohorts).where(ne(cohorts.status, "closed")).orderBy(cohorts.startDate),
    countUncontactedLeads(),
  ]);

  const paidMap = new Map<string, Set<string>>();
  for (const o of paidOrders) {
    if (!paidMap.has(o.userId)) paidMap.set(o.userId, new Set());
    if (o.product) paidMap.get(o.userId)!.add(o.product);
  }

  const manualIds = new Set(paidOrders.filter((o) => o.provider === MANUAL_PROVIDER).map((o) => o.userId));

  const enrollmentMap = new Map<string, { status: string; cohortStart: Date; cohortId: string }>();
  for (const e of enrollmentRows) enrollmentMap.set(e.userId, { status: e.status, cohortStart: e.cohortStart, cohortId: e.cohortId });

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

  // Each student's first exam, and the best score they got in any exam after it
  const firstAttempt = new Map<string, { score: number; at: Date }>();
  for (const a of attemptRows) {
    const cur = firstAttempt.get(a.userId);
    if (!cur || a.completedAt < cur.at) firstAttempt.set(a.userId, { score: a.score, at: a.completedAt });
  }
  const bestAfterFirst = new Map<string, number>();
  for (const a of attemptRows) {
    if (a.completedAt.getTime() === firstAttempt.get(a.userId)!.at.getTime()) continue;
    bestAfterFirst.set(a.userId, Math.max(bestAfterFirst.get(a.userId) ?? -1, a.score));
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

  // Every exam a student took, oldest first, for the history dropdown in the table
  const historyMap = new Map<string, { score: number; kind: "open" | "close"; at: Date }[]>();
  for (const a of [...attemptRows].sort((x, y) => x.completedAt.getTime() - y.completedAt.getTime())) {
    const list = historyMap.get(a.userId) ?? [];
    list.push({ score: a.score, kind: a.kind, at: a.completedAt });
    historyMap.set(a.userId, list);
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
    // Improved = any later exam is at least one point above the very first one (null until a second exam exists)
    const improved = firstAttempt.has(u.id) && (acc?.count ?? 0) > 1 ? (bestAfterFirst.get(u.id) ?? -1) >= firstAttempt.get(u.id)!.score + 1 : null;

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
      history: historyMap.get(u.id) ?? [],
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
    <AdminShell
      title="פאנל ניהול"
      intro={<>כל מי שנרשם לאתר, ההתקדמות והציונים שלהם. אפשר לתת או לבטל גישה מלאה בלי תשלום, ישר מהשורה. הכפתור &quot;ניהול&quot; פותח עריכת פרטים, שיבוץ למחזור ומחיקת חשבון.</>}
      width="max-w-screen-2xl"
      back={false}
    >

      <Link href="/admin/crm" className="mt-5 inline-flex min-h-11 w-fit items-center rounded-full bg-fg px-5 text-sm font-bold text-bg">
        לידים ושיחות
        {waitingLeads > 0 && <span className="ms-2 rounded-full bg-coral px-2.5 py-0.5 text-xs tabular-nums text-white">{waitingLeads} מחכים</span>}
      </Link>

      <div className="mt-3 flex flex-wrap gap-3">
        <Link href="/admin/cohorts" className="inline-flex min-h-11 w-fit items-center rounded-full border border-line bg-white px-5 text-sm font-bold">
          מחזורים
        </Link>
        <Link href="/admin/coupons" className="inline-flex min-h-11 w-fit items-center rounded-full border border-line bg-white px-5 text-sm font-bold">
          קופונים
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatPill label="נרשמו" value={stats.total} tone="dark" />
        <StatPill label="משלמים" value={stats.paid} tone="ok" />
        <StatPill label="הצטרפו השבוע" value={stats.newThisWeek} tone="outline" />
        <StatPill label="השתפרו" value={stats.improved} tone="accent" />
      </div>

      <ImprovementBySegment rows={rows} />
      <CohortSheets
        rows={rows}
        now={now.getTime()}
        cohorts={cohortRows.map((c) => ({ id: c.id, start: c.startDate }))}
        members={enrollmentRows.map((e) => ({ userId: e.userId, cohortId: e.cohortId }))}
      />

      {rows.length === 0 ? (
        <p className="mt-10 rounded-3xl border border-dashed border-line p-6 text-center opacity-70">עוד אין משתמשים רשומים.</p>
      ) : (
        <AdminTable
          rows={rows}
          now={now.getTime()}
          selfId={authed.user.id}
          cohorts={cohortRows.map((c) => ({
            id: c.id,
            start: c.startDate,
            taken: enrollmentRows.filter((e) => e.cohortId === c.id).length,
            capacity: c.capacity,
          }))}
        />
      )}
    </AdminShell>
  );
}

const DAY_MS = 86_400_000;

// Who improves more? Only students with at least two exams count, so the numbers are small at first: read them as a hint, not a result.
function ImprovementBySegment({ rows }: { rows: Row[] }) {
  const measured = rows.filter((r) => r.improved !== null);
  if (measured.length === 0) return null;
  const closeExam = (r: Row) => !!r.examDate && Date.parse(r.examDate) - r.createdAt.getTime() <= 30 * DAY_MS;
  const segments: [string, (r: Row) => boolean][] = [
    ["מבחן בתוך 30 יום", closeExam],
    ["מבחן רחוק או בלי תאריך", (r) => !closeExam(r)],
    ["יעד 120 ומעלה", (r) => (r.targetScore ?? 0) >= 120],
    ["יעד נמוך מ-120", (r) => r.targetScore !== null && r.targetScore < 120],
    ["ניגשו בעבר", (r) => r.priorScore !== null],
    ["לא ניגשו בעבר", (r) => r.priorScore === null],
  ];
  return (
    <section className="mt-8">
      <h2 className="font-display text-lg font-bold">מי משתפר יותר</h2>
      <p className="mt-1 text-xs opacity-60">רק מי שעשה לפחות שני מבחנים. כל עוד המספרים קטנים, זה כיוון ולא מסקנה.</p>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {segments.map(([label, test]) => {
          const group = measured.filter(test);
          const better = group.filter((r) => r.improved).length;
          return (
            <div key={label} className="rounded-2xl border border-line bg-white p-3 shadow-card">
              <p className="text-xs opacity-70">{label}</p>
              <p className="mt-1 text-xl font-bold tabular-nums">{group.length ? `${Math.round((better / group.length) * 100)}%` : "—"}</p>
              <p className="text-xs opacity-60">{better} מתוך {group.length}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// One cheat sheet per open cohort: who is in it, what they answered, how close their exam is. For choosing groups and for opening the first session.
function CohortSheets({
  rows,
  now,
  cohorts,
  members,
}: {
  rows: Row[];
  now: number;
  cohorts: { id: string; start: Date }[];
  members: { userId: string; cohortId: string }[];
}) {
  const byId = new Map(rows.map((r) => [r.id, r]));
  const sheets = cohorts
    .map((c) => ({ c, people: members.filter((m) => m.cohortId === c.id).map((m) => byId.get(m.userId)).filter((r): r is Row => !!r) }))
    .filter((s) => s.people.length > 0);
  if (sheets.length === 0) return null;
  return (
    <section className="mt-8">
      <h2 className="font-display text-lg font-bold">המחזורים הפתוחים</h2>
      <div className="mt-3 flex flex-col gap-3">
        {sheets.map(({ c, people }) => {
          const targets = people.map((p) => p.targetScore).filter((n): n is number => n !== null);
          const avgTarget = targets.length ? Math.round(targets.reduce((a, b) => a + b, 0) / targets.length) : null;
          return (
            <details key={c.id} className="rounded-2xl border border-line bg-white p-4 shadow-card">
              <summary className="flex min-h-11 cursor-pointer flex-wrap items-center gap-x-3 font-semibold">
                <span>מחזור {formatCohortDate(c.start)}</span>
                <span className="text-sm font-normal opacity-70">{people.length} תלמידים{avgTarget !== null && ` · יעד ממוצע ${avgTarget}`}</span>
              </summary>
              <ul className="mt-3 divide-y divide-line text-sm">
                {people.map((p) => {
                  const left = daysUntil(p.examDate, now);
                  return (
                    <li key={p.id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2">
                      <span className="font-semibold">{p.name}</span>
                      <span className="text-xs opacity-80">
                        {p.priorScore === null ? "לא ניגש/ה בעבר" : `ציון קודם ${p.priorScore}`} · יעד {p.targetScore ?? "—"} ·{" "}
                        {left === null ? "בלי תאריך מבחן" : left < 0 ? "המבחן עבר" : `מבחן בעוד ${left} ימים`}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </details>
          );
        })}
      </div>
    </section>
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
