"use client";

import { useMemo, useState, useTransition } from "react";
import { scoreLevel } from "@/lib/scoreLevels";
import { setManualAccess } from "./actions";

// Not imported from @/lib/cohorts: that module also pulls in the Neon db client at
// module scope, which breaks when bundled into this client component.
const cohortDateFmt = new Intl.DateTimeFormat("he-IL", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jerusalem" });
const formatCohortDate = (date: Date) => cohortDateFmt.format(date);

const dateFmt = new Intl.DateTimeFormat("he-IL", { day: "2-digit", month: "2-digit", year: "2-digit" });
const dateTimeFmt = new Intl.DateTimeFormat("he-IL", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
const ACTIVE_WITHIN_MS = 3 * 24 * 60 * 60 * 1000;

const PRODUCT_LABEL: Record<string, string> = { course: "קורס מלא", access: "גישה", private: "פרטי" };
const ENROLLMENT_LABEL: Record<string, string> = {
  pending_payment: "ממתין לתשלום",
  active: "פעיל במחזור",
  completed: "סיים מחזור",
  free_retry: "מחזור חינם",
};

export type Row = {
  id: string;
  name: string;
  phone: string;
  createdAt: Date;
  staff: boolean;
  paid: boolean;
  manual: boolean;
  products: string[];
  enrollment?: { status: string; cohortStart: Date };
  attempts?: { count: number; best: number; lastOpen?: number; lastClose?: number };
  improved: boolean | null;
  vocabCount: number;
  practice: { label: string; count: number }[];
  lastSeen?: Date;
};

type SortKey = "name" | "createdAt" | "best" | "lastSeen";

export function AdminTable({ rows, now }: { rows: Row[]; now: number }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "createdAt", dir: -1 });

  const filtered = useMemo(() => {
    const q = query.trim();
    const matches = q ? rows.filter((r) => r.name.includes(q) || r.phone.includes(q)) : rows;
    const sorted = [...matches].sort((a, b) => {
      const dir = sort.dir;
      if (sort.key === "name") return a.name.localeCompare(b.name, "he") * dir;
      if (sort.key === "createdAt") return (a.createdAt.getTime() - b.createdAt.getTime()) * dir;
      if (sort.key === "best") return ((a.attempts?.best ?? -1) - (b.attempts?.best ?? -1)) * dir;
      return ((a.lastSeen?.getTime() ?? 0) - (b.lastSeen?.getTime() ?? 0)) * dir;
    });
    return sorted;
  }, [rows, query, sort]);

  const toggleSort = (key: SortKey) => setSort((s) => (s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: 1 }));

  return (
    <div className="mt-8 min-w-0 overflow-hidden rounded-3xl border border-line bg-white shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)]">
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

      <div className="overflow-x-auto border-t border-line">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="text-xs opacity-60">
              <Th>שם</Th>
              <Th>סטטוס</Th>
              <Th>מחזור</Th>
              <SortTh label="הצטרפו" active={sort.key === "createdAt"} dir={sort.dir} onClick={() => toggleSort("createdAt")} />
              <SortTh label="מבחנים" active={sort.key === "best"} dir={sort.dir} onClick={() => toggleSort("best")} />
              <Th>סוגי תרגול</Th>
              <SortTh label="נראו לאחרונה" active={sort.key === "lastSeen"} dir={sort.dir} onClick={() => toggleSort("lastSeen")} />
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <UserRow key={r.id} row={r} now={now} />
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="p-8 text-center text-sm opacity-60">אין תוצאות לחיפוש.</p>}
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="whitespace-nowrap px-4 py-3 text-right font-semibold first:ps-5 last:pe-5">{children}</th>;
}

function SortTh({ label, active, dir, onClick }: { label: string; active: boolean; dir: 1 | -1; onClick: () => void }) {
  return (
    <th className="whitespace-nowrap px-4 py-3 text-right font-semibold last:pe-5">
      <button type="button" onClick={onClick} className="inline-flex items-center gap-1 hover:opacity-100 active:opacity-100">
        {label}
        <span aria-hidden className={active ? "opacity-100" : "opacity-40"}>
          {active && dir === -1 ? "↓" : "↑"}
        </span>
      </button>
    </th>
  );
}

function UserRow({ row, now }: { row: Row; now: number }) {
  const [pending, start] = useTransition();
  const toggle = () => {
    if (row.manual && !confirm(`לבטל את הגישה של ${row.name}?`)) return;
    start(() => setManualAccess(row.id, !row.manual));
  };
  const active = row.lastSeen ? now - row.lastSeen.getTime() < ACTIVE_WITHIN_MS : false;
  return (
    <tr className="border-t border-line hover:bg-sunk/40">
      <td className="ps-5 py-3 pe-4">
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold text-mist" aria-hidden>
            {row.name.trim().charAt(0) || "?"}
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold">{row.name}</p>
            <p className="text-xs opacity-60">
              <bdi dir="ltr">{row.phone}</bdi>
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
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
        {/* Staff already have everything; card-paid users are left alone. */}
        {!row.staff && (row.manual || !row.paid) && (
          <button
            type="button"
            onClick={toggle}
            disabled={pending}
            className={`mt-2 min-h-11 whitespace-nowrap rounded-full px-4 text-xs font-bold disabled:opacity-50 ${row.manual ? "border border-line" : "bg-fg text-bg"}`}
          >
            {pending ? "רגע..." : row.manual ? "בטל גישה" : "תן גישה מלאה"}
          </button>
        )}
      </td>
      <td className="whitespace-nowrap px-4 py-3 opacity-80">{row.enrollment ? formatCohortDate(row.enrollment.cohortStart) : "אין"}</td>
      <td className="whitespace-nowrap px-4 py-3 tabular-nums opacity-80">{dateFmt.format(row.createdAt)}</td>
      <td className="whitespace-nowrap px-4 py-3">
        {row.attempts ? (
          <div>
            <p className="font-semibold tabular-nums">
              {row.attempts.best} <span className="font-normal opacity-60">({scoreLevel(row.attempts.best).label})</span>
            </p>
            {row.improved !== null && (
              <p className={`text-xs font-semibold ${row.improved ? "text-ok" : "text-warn"}`}>{row.improved ? "השתפרו ✓" : "לא השתפרו"}</p>
            )}
          </div>
        ) : (
          <span className="opacity-50">אין</span>
        )}
      </td>
      <td className="px-4 py-3">
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
      <td className="whitespace-nowrap px-4 py-3 pe-5">
        {row.lastSeen ? (
          active ? (
            <Badge tone="ok">פעיל/ה</Badge>
          ) : (
            <span className="text-xs opacity-70">{dateTimeFmt.format(row.lastSeen)}</span>
          )
        ) : (
          <Badge tone="neutral">מעולם לא</Badge>
        )}
      </td>
    </tr>
  );
}

function Badge({ tone, children }: { tone: "ok" | "warn" | "neutral"; children: React.ReactNode }) {
  const toneClass =
    tone === "ok" ? "border-ok/30 bg-ok/10 text-ok" : tone === "warn" ? "border-warn/40 bg-warn/10 text-warn" : "border-line opacity-70";
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold ${toneClass}`}>
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
