"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { scoreLevel } from "@/lib/scoreLevels";
import { setManualAccess } from "./actions";
import { Badge } from "./crm/Badge";
import { PRODUCT_LABEL } from "@/lib/enums";
import { formatCohortDate } from "@/lib/jerusalemTime";
import { formatShortDate, formatShortDateTime } from "@/lib/formatDate";
import { ManageSheet } from "./ManageSheet";
import { urgencyOf } from "@/lib/urgency";

const ACTIVE_WITHIN_MS = 3 * 24 * 60 * 60 * 1000;

const ENROLLMENT_LABEL: Record<string, string> = {
  pending_payment: "ממתין לתשלום",
  active: "פעיל במחזור",
  completed: "סיים מחזור",
  free_retry: "מחזור חינם",
};

export type Row = {
  id: string;
  name: string;
  phone: string | null;
  createdAt: Date;
  /** The answers from /onboarding (null = not answered) */
  examDate: string | null;
  priorScore: number | null;
  targetScore: number | null;
  staff: boolean;
  paid: boolean;
  manual: boolean;
  products: string[];
  enrollment?: { status: string; cohortStart: Date; cohortId: string };
  attempts?: { count: number; best: number; lastOpen?: number; lastClose?: number };
  improved: boolean | null;
  /** Every exam, oldest first */
  history: { score: number; kind: "open" | "close"; at: Date }[];
  vocabCount: number;
  practice: { label: string; count: number }[];
  lastSeen?: Date;
};

export type CohortOption = { id: string; start: Date; taken: number; capacity: number };

type SortKey = "name" | "createdAt" | "best" | "lastSeen" | "urgency";

const urgencyInput = (r: Row) => ({ ...r, best: r.attempts?.best });
// Higher = write sooner: the level first, then the closer the exam, the higher
const urgencyRank = (r: Row, now: number) => {
  const u = urgencyOf(urgencyInput(r), now);
  return u.level * 100_000 + (u.daysLeft !== null && u.daysLeft >= 0 ? 1000 - u.daysLeft : 0);
};

export function AdminTable({ rows, now, cohorts, selfId }: { rows: Row[]; now: number; cohorts: CohortOption[]; selfId: string }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "createdAt", dir: -1 });

  const filtered = useMemo(() => {
    const q = query.trim();
    const matches = q ? rows.filter((r) => r.name.includes(q) || r.phone?.includes(q)) : rows;
    const sorted = [...matches].sort((a, b) => {
      const dir = sort.dir;
      if (sort.key === "name") return a.name.localeCompare(b.name, "he") * dir;
      if (sort.key === "createdAt") return (a.createdAt.getTime() - b.createdAt.getTime()) * dir;
      if (sort.key === "best") return ((a.attempts?.best ?? -1) - (b.attempts?.best ?? -1)) * dir;
      if (sort.key === "urgency") return (urgencyRank(a, now) - urgencyRank(b, now)) * dir;
      return ((a.lastSeen?.getTime() ?? 0) - (b.lastSeen?.getTime() ?? 0)) * dir;
    });
    return sorted;
  }, [rows, query, sort, now]);

  const toggleSort = (key: SortKey) => setSort((s) => (s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: 1 }));

  return (
    <div className="mt-8 min-w-0 overflow-hidden rounded-3xl border border-line bg-white shadow-card">
      <div className="flex items-center gap-2.5 p-4 sm:p-5">
        <svg aria-hidden viewBox="0 0 20 20" className="size-5 shrink-0 opacity-50">
          <circle cx="9" cy="9" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M14 14L18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="חיפוש לפי שם או טלפון"
          className="w-full bg-transparent text-sm outline-none placeholder:opacity-50"
        />
      </div>

      {/* The table scrolls inside its own box, so the sideways scrollbar is always on screen instead of at the end of a long list */}
      <div className="max-h-[75dvh] overflow-y-auto overflow-x-hidden border-t border-line">
        <table className="w-full text-sm max-md:block">
          <thead className="max-md:hidden sticky top-0 z-10 bg-white shadow-[0_1px_0_var(--color-line)]">
            <tr className="text-xs opacity-60">
              <Th>שם</Th>
              <SortTh label="דחיפות" active={sort.key === "urgency"} dir={sort.dir} onClick={() => toggleSort("urgency")} />
              <Th>סטטוס</Th>
              <Th>מחזור</Th>
              <Th>מה ענו</Th>
              <SortTh label="הצטרפו" active={sort.key === "createdAt"} dir={sort.dir} onClick={() => toggleSort("createdAt")} />
              <SortTh label="מבחנים" active={sort.key === "best"} dir={sort.dir} onClick={() => toggleSort("best")} />
              <Th>סוגי תרגול</Th>
              <SortTh label="נראו לאחרונה" active={sort.key === "lastSeen"} dir={sort.dir} onClick={() => toggleSort("lastSeen")} />
            </tr>
          </thead>
          <tbody className="max-md:block">
            {filtered.map((r) => (
              <UserRow key={r.id} row={r} now={now} cohorts={cohorts} isSelf={r.id === selfId} />
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="p-8 text-center text-sm opacity-60">אין תוצאות לחיפוש.</p>}
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-3 py-3 text-right font-semibold first:ps-5 last:pe-5">{children}</th>;
}

function SortTh({ label, active, dir, onClick }: { label: string; active: boolean; dir: 1 | -1; onClick: () => void }) {
  return (
    <th className="px-3 py-3 text-right font-semibold last:pe-5">
      <button type="button" onClick={onClick} className="inline-flex items-center gap-1 hover:opacity-100 active:opacity-100">
        {label}
        <span aria-hidden className={active ? "opacity-100" : "opacity-40"}>
          {active && dir === -1 ? "↓" : "↑"}
        </span>
      </button>
    </th>
  );
}

function UserRow({ row, now, cohorts, isSelf }: { row: Row; now: number; cohorts: CohortOption[]; isSelf: boolean }) {
  const [pending, start] = useTransition();
  const [managing, setManaging] = useState(false);
  const toggle = () => {
    if (row.manual && !confirm(`לבטל את הגישה של ${row.name}?`)) return;
    start(() => setManualAccess(row.id, !row.manual));
  };
  const urgency = urgencyOf(urgencyInput(row), now);
  const active = row.lastSeen ? now - row.lastSeen.getTime() < ACTIVE_WITHIN_MS : false;
  return (
    <tr className="border-t border-line hover:bg-sunk/40 max-md:block max-md:px-4 max-md:py-3">
      <td className="ps-5 py-3 pe-4 max-md:block max-md:px-0 max-md:py-1.5">
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold text-mist" aria-hidden>
            {row.name.trim().charAt(0) || "?"}
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold">{row.name}</p>
            <p className="text-xs opacity-60">
              <bdi dir="ltr">{row.phone ?? "—"}</bdi>
            </p>
          </div>
        </div>
      </td>
      <td className="px-3 py-3 text-xs leading-relaxed max-md:block max-md:px-0 max-md:py-1.5">
        {urgency.level > 0 ? (
          <div className="max-w-44">
            <Badge tone={urgency.level === 2 ? "warn" : "neutral"}>{urgency.level === 2 ? "לכתוב היום" : "כדאי הודעה"}</Badge>
            <p className="mt-1 whitespace-normal opacity-80">{urgency.reason}</p>
          </div>
        ) : urgency.daysLeft !== null && urgency.daysLeft >= 0 ? (
          <span className="opacity-70">מבחן בעוד {urgency.daysLeft} ימים</span>
        ) : (
          <span className="opacity-40">—</span>
        )}
      </td>
      <td className="px-3 py-3 max-md:block max-md:px-0 max-md:py-1.5">
        <div className="flex flex-wrap items-center gap-1.5">
          {row.staff && <Badge tone="neutral">צוות</Badge>}
          {row.products.map((p) => (
            <Badge key={p} tone="ok">
              {PRODUCT_LABEL[p] ?? p}
            </Badge>
          ))}
          {!row.paid && !row.staff && <Badge tone="warn">לא שילם/ה</Badge>}
          {row.enrollment && <Badge tone="neutral">{ENROLLMENT_LABEL[row.enrollment.status] ?? row.enrollment.status}</Badge>}
          {row.manual && <Badge tone="neutral">ניתנה ידנית</Badge>}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {/* Staff already have everything; card-paid users are left alone. */}
          {!row.staff && (row.manual || !row.paid) && (
            <button
              type="button"
              onClick={toggle}
              disabled={pending}
              className={`min-h-11 rounded-full px-4 text-xs font-bold disabled:opacity-50 ${row.manual ? "border border-line" : "bg-fg text-bg"}`}
            >
              {pending ? "רגע..." : row.manual ? "בטל גישה" : "תן גישה מלאה"}
            </button>
          )}
          <button
            type="button"
            onClick={() => setManaging(true)}
            className="min-h-11 rounded-full border border-line px-4 text-xs font-bold"
          >
            ניהול
          </button>
        </div>
        {/* Mounted only while open so the form always starts from the saved values */}
        {managing && <ManageSheet row={row} cohorts={cohorts} isSelf={isSelf} open onClose={() => setManaging(false)} />}
      </td>
      <td className="px-3 py-3 opacity-80 max-md:block max-md:px-0 max-md:py-1.5">{row.enrollment ? formatCohortDate(row.enrollment.cohortStart) : "אין"}</td>
      <td className="px-3 py-3 text-xs leading-relaxed max-md:block max-md:px-0 max-md:py-1.5">
        {row.priorScore === null && row.targetScore === null && !row.examDate ? (
          <span className="opacity-50">לא ענו</span>
        ) : (
          <>
            <p>ציון קודם: <span className="font-semibold tabular-nums">{row.priorScore ?? "לא ניגש/ה"}</span></p>
            <p>יעד: <span className="font-semibold tabular-nums">{row.targetScore ?? "—"}</span></p>
            <p>מבחן: <span className="font-semibold tabular-nums">{row.examDate ? row.examDate.split("-").reverse().join("/") : "אין תאריך"}</span></p>
          </>
        )}
      </td>
      <td className="px-3 py-3 tabular-nums opacity-80 max-md:block max-md:px-0 max-md:py-1.5">{formatShortDate(row.createdAt)}</td>
      <td className="px-3 py-3 max-md:block max-md:px-0 max-md:py-1.5">
        {row.attempts ? (
          <div>
            <p className="font-semibold tabular-nums">
              {row.attempts.best} <span className="font-normal opacity-60">({scoreLevel(row.attempts.best).label})</span>
            </p>
            {row.history.length > 1 && <History history={row.history} />}
            {row.improved !== null && (
              <p className={`text-xs font-semibold ${row.improved ? "text-ok" : "text-warn"}`}>{row.improved ? "השתפרו ✓" : "לא השתפרו"}</p>
            )}
          </div>
        ) : (
          <span className="opacity-50">אין</span>
        )}
      </td>
      <td className="px-3 py-3 max-md:block max-md:px-0 max-md:py-1.5">
        {row.practice.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {row.practice.map((p) => (
              <Badge key={p.label} tone="neutral">
                {p.label} ~{p.count}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="opacity-50">אין עדיין</span>
        )}
      </td>
      <td className="px-3 py-3 pe-5 max-md:block max-md:px-0 max-md:py-1.5">
        {row.lastSeen ? (
          active ? (
            <Badge tone="ok">פעיל/ה</Badge>
          ) : (
            <span className="text-xs opacity-70">{formatShortDateTime(row.lastSeen)}</span>
          )
        ) : (
          <Badge tone="neutral">מעולם לא</Badge>
        )}
      </td>
    </tr>
  );
}

// A button that opens a small list of every exam the student took, with the change from the one before. Closed by default so the table stays short.
function History({ history }: { history: Row["history"] }) {
  const first = history[0].score;
  const last = history[history.length - 1].score;
  const best = Math.max(...history.map((h) => h.score));
  const ref = useRef<HTMLDetailsElement>(null);
  // A tap or click anywhere outside closes the list
  useEffect(() => {
    const close = (e: PointerEvent) => {
      if (ref.current?.open && !ref.current.contains(e.target as Node)) ref.current.open = false;
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  return (
    <details ref={ref} className="relative mt-1">
      <summary className="inline-flex min-h-8 cursor-pointer list-none items-center gap-1 rounded-full border border-line px-3 text-xs font-semibold [&::-webkit-details-marker]:hidden">
        היסטוריה ({history.length}) <span aria-hidden>▾</span>
      </summary>
      <div className="absolute start-0 top-full z-20 mt-1 w-64 rounded-2xl border border-line bg-white p-3 text-xs shadow-card">
        <ol className="flex flex-col gap-1.5">
          {history.map((h, i) => {
            const diff = i === 0 ? null : h.score - history[i - 1].score;
            return (
              <li key={i} className="flex items-center justify-between gap-2">
                <span className="opacity-70">
                  {formatShortDate(h.at)} · {h.kind === "open" ? "פתיחה" : "סימולציה"}
                </span>
                <span className="font-semibold tabular-nums">
                  {h.score}
                  {diff !== null && diff !== 0 && (
                    <bdi dir="ltr" className={`ms-1.5 ${diff > 0 ? "text-ok" : "text-warn"}`}>
                      {diff > 0 ? "+" : ""}
                      {diff}
                    </bdi>
                  )}
                </span>
              </li>
            );
          })}
        </ol>
        <p className="mt-2 border-t border-line pt-2 font-semibold">
          מההתחלה: <bdi dir="ltr" className={last - first >= 0 ? "text-ok" : "text-warn"}>{last - first > 0 ? "+" : ""}{last - first}</bdi>
          {best > last && <span className="font-normal opacity-70"> · הכי גבוה {best}</span>}
        </p>
      </div>
    </details>
  );
}
