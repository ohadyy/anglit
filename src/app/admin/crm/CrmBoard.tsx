"use client";

import { useMemo, useState, useTransition } from "react";
import { Badge, Dot, StageBadge } from "./Badge";
import { ContactSheet } from "./ContactSheet";
import { StatusSelect } from "./StatusSelect";
import { setStatusMany } from "./actions";
import { NOTE_LABEL, PRODUCT_LABEL, SOURCE_LABEL, STAGE_LABEL, STATUS_LABEL, waLink, type Contact, type CrmStatus, type Stage } from "./labels";

const dateFmt = new Intl.DateTimeFormat("he-IL", { day: "2-digit", month: "2-digit", year: "2-digit", timeZone: "Asia/Jerusalem" });
const dayFmt = new Intl.DateTimeFormat("he-IL", { day: "numeric", month: "long", timeZone: "Asia/Jerusalem" });

type Filter = "all" | Stage;

// "דיברנו, שילם" has no chip of its own: it counts under "שילם" together with real payments
const FILTERS: Filter[] = ["all", "new", "no_answer", "talked_interested", "talked_lost", "paid"];

const stageOf = (c: Contact): Stage => (c.paid ? "paid" : c.status);
const inFilter = (c: Contact, filter: Filter) =>
  filter === "all" || (filter === "paid" ? c.paid || c.status === "talked_paid" : !c.paid && c.status === filter);
const isDue = (c: Contact, today: string) => !!c.followUp && c.followUp <= today;

export function CrmBoard({ contacts, today }: { contacts: Contact[]; today: string }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const counts = useMemo(
    () => Object.fromEntries(FILTERS.map((f) => [f, contacts.filter((c) => inFilter(c, f)).length])) as Record<Filter, number>,
    [contacts],
  );

  const visible = useMemo(() => {
    const q = query.trim();
    return contacts
      .filter((c) => inFilter(c, filter))
      .filter((c) => !q || c.name.includes(q) || c.phone?.includes(q) || c.email?.includes(q))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [contacts, filter, query]);

  // Only people still on screen count: a filter or search change never applies to someone hidden
  const chosen = visible.filter((c) => selected.has(c.key));
  const allChosen = visible.length > 0 && chosen.length === visible.length;

  const toggle = (key: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (!next.delete(key)) next.add(key);
      return next;
    });

  const exitSelecting = () => {
    setSelecting(false);
    setSelected(new Set());
    setError(null);
  };

  const apply = (status: CrmStatus) => {
    if (!confirm(`לסמן ${chosen.length} אנשים כ"${STATUS_LABEL[status]}"?`)) return;
    const targets = chosen.map((c) => ({ kind: c.kind, refId: c.refId }));
    start(async () => {
      setError(null);
      const res = await setStatusMany(targets, status);
      if (res.ok) exitSelecting();
      else setError(res.error);
    });
  };

  // Looked up on every render, so the open sheet shows the saved values after each action
  const open = contacts.find((c) => c.key === openKey);

  return (
    <>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="עוד לא פניתי" value={counts.new} tone="dark" />
        <Stat label="לא ענו" value={counts.no_answer} tone="warn" />
        <Stat label="רוצים, עוד לא שילמו" value={counts.talked_interested} tone="accent" />
        <Stat label="שילמו" value={counts.paid} tone="ok" />
      </div>

      <div className="mt-6 flex items-center gap-2.5 rounded-full border border-line bg-white px-4">
        <svg aria-hidden viewBox="0 0 20 20" className="size-5 shrink-0 opacity-50">
          <circle cx="9" cy="9" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M14 14L18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="חיפוש לפי שם, טלפון או אימייל"
          className="min-h-12 w-full bg-transparent text-base outline-none placeholder:opacity-50"
        />
      </div>

      <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 text-sm font-semibold ${
              filter === f ? "border-fg bg-fg text-bg" : "border-line bg-white"
            }`}
          >
            {f !== "all" && <Dot stage={f} />}
            {f === "all" ? "הכל" : STAGE_LABEL[f]} <span className="tabular-nums opacity-60">{counts[f]}</span>
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-sm opacity-60">{visible.length} מוצגים</p>
        <button
          type="button"
          onClick={() => (selecting ? exitSelecting() : setSelecting(true))}
          aria-pressed={selecting}
          className={`min-h-11 rounded-full border px-4 text-sm font-semibold ${selecting ? "border-fg bg-fg text-bg" : "border-line bg-white"}`}
        >
          {selecting ? "סיום בחירה" : "בחירה מרובה"}
        </button>
      </div>

      {selecting && (
        <div className="sticky top-[5.5rem] z-20 -mx-4 mt-3 flex flex-col gap-3 border-y border-line bg-bg/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold">נבחרו {chosen.length}</p>
            <button
              type="button"
              onClick={() => setSelected(allChosen ? new Set() : new Set(visible.map((c) => c.key)))}
              className="min-h-11 rounded-full border border-line bg-white px-4 text-sm font-semibold"
            >
              {allChosen ? "ניקוי בחירה" : `בחירת כל ה-${visible.length} המוצגים`}
            </button>
          </div>
          <StatusSelect value={null} placeholder="סימון הנבחרים כ..." disabled={pending || chosen.length === 0} onChange={apply} />
          {error && (
            <p role="status" className="text-sm font-semibold text-warn">
              {error}
            </p>
          )}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="mt-8 rounded-3xl border border-dashed border-line p-6 text-center opacity-70">
          {contacts.length === 0 ? "עוד אין לידים." : "אין תוצאות."}
        </p>
      ) : (
        <ul className="mt-5 flex flex-col gap-3">
          {visible.map((c) => (
            <ContactCard
              key={c.key}
              contact={c}
              today={today}
              selecting={selecting}
              checked={selected.has(c.key)}
              onPress={() => (selecting ? toggle(c.key) : setOpenKey(c.key))}
            />
          ))}
        </ul>
      )}

      {/* Mounted only while open so every sheet starts with an empty note form */}
      {open && <ContactSheet contact={open} today={today} onClose={() => setOpenKey(null)} />}
    </>
  );
}

function ContactCard({
  contact: c,
  today,
  selecting,
  checked,
  onPress,
}: {
  contact: Contact;
  today: string;
  selecting: boolean;
  checked: boolean;
  onPress: () => void;
}) {
  const stage = stageOf(c);
  const due = isDue(c, today);
  const last = c.notes[0];
  return (
    <li className={`rounded-3xl border bg-white p-4 shadow-[0_18px_40px_-28px_rgb(14_8_82/0.3)] ${checked ? "border-fg" : "border-line"}`}>
      <button type="button" onClick={onPress} aria-pressed={selecting ? checked : undefined} className="flex w-full items-start gap-3 text-right">
        {selecting && (
          <span
            aria-hidden
            className={`mt-1.5 grid size-6 shrink-0 place-items-center rounded-lg border-2 ${checked ? "border-fg bg-fg text-bg" : "border-line bg-white"}`}
          >
            {checked && (
              <svg viewBox="0 0 16 16" className="size-4">
                <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
        )}
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold text-mist" aria-hidden>
          {c.name.trim().charAt(0) || "?"}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-start justify-between gap-2">
            <span className="truncate font-semibold">{c.name}</span>
            <StageBadge stage={c.paid ? "paid" : c.status} />
          </span>
          <span className="mt-0.5 block text-xs opacity-60">
            <bdi dir="ltr">{c.phone ?? c.email ?? "—"}</bdi> · {SOURCE_LABEL[c.source] ?? c.source} · {dateFmt.format(c.createdAt)}
          </span>
          {(c.followUp || c.manual || c.products.length > 0) && (
            <span className="mt-2 flex flex-wrap gap-1.5">
              {c.products.map((p) => (
                <Badge key={p} tone="ok">
                  {PRODUCT_LABEL[p] ?? p}
                </Badge>
              ))}
              {c.manual && <Badge tone="neutral">גישה ידנית</Badge>}
              {c.followUp && stage !== "paid" && (
                <Badge tone={due ? "warn" : "neutral"}>תזכורת: {dayFmt.format(new Date(`${c.followUp}T12:00:00Z`))}</Badge>
              )}
            </span>
          )}
          {last && (
            <span className="mt-2 block truncate text-xs opacity-70">
              {NOTE_LABEL[last.type]}
              {last.body && `: ${last.body}`}
            </span>
          )}
        </span>
      </button>
      {c.phone && (
        <div className="mt-3 flex gap-2">
          <a href={`tel:${c.phone}`} className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-line text-sm font-bold">
            התקשר
          </a>
          <a
            href={waLink(c.phone)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-line text-sm font-bold"
          >
            וואטסאפ
          </a>
        </div>
      )}
    </li>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: "dark" | "ok" | "warn" | "accent" }) {
  const toneClass =
    tone === "dark" ? "bg-fg text-bg" : tone === "ok" ? "bg-ok text-bg" : tone === "warn" ? "bg-warn text-bg" : "bg-marker text-ink-deep";
  return (
    <div>
      <p className="px-1 text-sm opacity-70">{label}</p>
      <div className={`mt-2 flex h-16 items-center justify-center rounded-full text-2xl font-bold tabular-nums ${toneClass}`}>{value}</div>
    </div>
  );
}
