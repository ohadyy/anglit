"use client";

import { useState, useTransition } from "react";
import { formatCohortDateTime, fromLocalInput, plusDays } from "@/lib/jerusalemTime";
import type { CohortStatus } from "@/lib/enums";
import { MAX_SESSIONS_LENGTH } from "@/content/cohortSchedule";
import { assignStudent, createCohort, deleteCohort, updateCohort, type CohortInput } from "./actions";
import type { ActionResult } from "../_shared";

type Person = { id: string; name: string; phone: string | null };
type Cohort = CohortInput & { id: string; students: Person[] };

const field =
  "w-full rounded-2xl border border-line bg-white px-4 py-3 text-base outline-none focus:border-fg focus:ring-2 focus:ring-fg/15";
const label = "flex flex-col gap-1.5 text-sm font-semibold";

const STATUS_LABELS: Record<CohortStatus, string> = { upcoming: "פתוח להרשמה", active: "התחיל, סגור להרשמה", closed: "נסגר" };

const prettyDate = (local: string) => {
  const d = fromLocalInput(local);
  return d ? formatCohortDateTime(d) : local;
};

function Message({ msg }: { msg: { text: string; ok: boolean } | null }) {
  return msg ? (
    <p role="status" className={`text-sm font-semibold ${msg.ok ? "text-ok" : "text-warn"}`}>
      {msg.text}
    </p>
  ) : null;
}

function Fields({ v, set, defaultSessions }: { v: CohortInput; set: (v: CohortInput) => void; defaultSessions: string }) {
  return (
    <div className="flex flex-col gap-3">
      <label className={label}>
        תחילת המחזור (תאריך ושעה)
        <input
          type="datetime-local"
          dir="ltr"
          value={v.start}
          // Every cohort so far ends exactly a week after it starts, so the exam follows the start until it is edited by hand
          onChange={(e) => set({ ...v, start: e.target.value, exam: e.target.value ? plusDays(e.target.value, 7) : v.exam })}
          className={`${field} text-right`}
        />
      </label>
      <label className={label}>
        מבחן הסיום (תאריך ושעה)
        <input type="datetime-local" dir="ltr" value={v.exam} onChange={(e) => set({ ...v, exam: e.target.value })} className={`${field} text-right`} />
      </label>
      <label className={label}>
        ימים ושעות המפגשים
        <input
          value={v.sessions}
          onChange={(e) => set({ ...v, sessions: e.target.value })}
          placeholder={defaultSessions}
          maxLength={MAX_SESSIONS_LENGTH}
          className={field}
        />
        <span className="text-xs font-normal opacity-60">הטקסט הזה מוצג לתלמידים ונשלח להם בוואטסאפ. ריק = הנוסח הרגיל.</span>
      </label>
      <label className={label}>
        מספר מקומות
        <input
          inputMode="numeric"
          dir="ltr"
          value={v.capacity || ""}
          onChange={(e) => set({ ...v, capacity: Number(e.target.value.replace(/\D/g, "")) })}
          className={`${field} text-right`}
        />
      </label>
      <label className={label}>
        סטטוס
        <select value={v.status} onChange={(e) => set({ ...v, status: e.target.value as CohortInput["status"] })} className={field}>
          {Object.entries(STATUS_LABELS).map(([k, text]) => (
            <option key={k} value={k}>
              {text}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

function NewCohort({ defaultSessions }: { defaultSessions: string }) {
  const empty: CohortInput = { start: "", exam: "", capacity: 6, sessions: "", status: "upcoming" };
  const [v, setV] = useState(empty);
  const [pending, run] = useTransition();
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const create = () =>
    run(async () => {
      const res = await createCohort(v);
      if (res.ok) setV(empty);
      setMsg({ text: res.ok ? "המחזור נוסף." : res.error, ok: res.ok });
    });

  return (
    <section className="mt-8 flex flex-col gap-3 rounded-3xl border border-line bg-white p-4">
      <h2 className="text-sm font-bold">מחזור חדש</h2>
      <Fields v={v} set={setV} defaultSessions={defaultSessions} />
      <button
        type="button"
        disabled={pending || !v.start || !v.exam}
        onClick={create}
        className="min-h-11 rounded-full bg-fg px-5 text-sm font-bold text-bg disabled:opacity-50"
      >
        {pending ? "רגע..." : "הוספת מחזור"}
      </button>
      <Message msg={msg} />
    </section>
  );
}

function CohortCard({ cohort, unassigned, defaultSessions }: { cohort: Cohort; unassigned: Person[]; defaultSessions: string }) {
  const [v, setV] = useState<CohortInput>({ start: cohort.start, exam: cohort.exam, capacity: cohort.capacity, sessions: cohort.sessions, status: cohort.status });
  const [pending, run] = useTransition();
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [search, setSearch] = useState("");
  const [pick, setPick] = useState("");

  const act = (task: () => Promise<ActionResult>, done: string, after?: () => void) =>
    run(async () => {
      setMsg(null);
      const res = await task();
      if (res.ok) after?.();
      setMsg({ text: res.ok ? done : res.error, ok: res.ok });
    });

  const remove = () => {
    if (!confirm(`למחוק את המחזור של ${prettyDate(cohort.start)}? אי אפשר לשחזר.`)) return;
    act(() => deleteCohort(cohort.id), "המחזור נמחק.");
  };

  const q = search.trim().toLowerCase();
  const matches = unassigned.filter((u) => !q || u.name.toLowerCase().includes(q) || (u.phone ?? "").includes(q));
  const shown = matches.slice(0, 30);

  return (
    <li className="rounded-2xl border border-line bg-white">
      <details>
        <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-3 px-4 py-3">
          <span className="min-w-0">
            <span className="block font-bold">{prettyDate(cohort.start)}</span>
            <span className="block text-sm opacity-70">
              {cohort.students.length}/{cohort.capacity} משובצים · {STATUS_LABELS[cohort.status]}
            </span>
          </span>
          <span aria-hidden className="text-sm opacity-60">
            עריכה
          </span>
        </summary>

        <div className="flex flex-col gap-6 border-t border-line p-4">
          <section className="flex flex-col gap-3">
            <Fields v={v} set={setV} defaultSessions={defaultSessions} />
            <button
              type="button"
              disabled={pending}
              onClick={() => act(() => updateCohort(cohort.id, v), "המחזור נשמר.")}
              className="min-h-11 rounded-full bg-fg px-5 text-sm font-bold text-bg disabled:opacity-50"
            >
              שמירת שינויים
            </button>
          </section>

          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-bold">משובצים למחזור</h3>
            {cohort.students.length === 0 ? (
              <p className="text-sm opacity-70">אף אחד עוד לא משובץ.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {cohort.students.map((s) => (
                  <li key={s.id} className="flex items-center gap-3 rounded-xl border border-line px-3 py-2">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{s.name}</span>
                      <span className="block text-xs opacity-60" dir="ltr">
                        {s.phone}
                      </span>
                    </span>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => act(() => assignStudent(s.id, null), `${s.name} הוסר מהמחזור.`)}
                      className="min-h-11 rounded-full border border-line px-4 text-sm font-bold disabled:opacity-40"
                    >
                      הסרה
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <h3 className="mt-2 text-sm font-bold">שיבוץ תלמיד</h3>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="חיפוש לפי שם או טלפון" className={field} />
            <select value={pick} onChange={(e) => setPick(e.target.value)} className={field}>
              <option value="">{matches.length === 0 ? "אין תלמידים לא משובצים שמתאימים" : "בחירת תלמיד"}</option>
              {shown.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} {u.phone ? `(${u.phone})` : ""}
                </option>
              ))}
            </select>
            {matches.length > shown.length && <p className="text-xs opacity-60">מוצגים 30 הראשונים. אפשר לחפש כדי לצמצם.</p>}
            <button
              type="button"
              disabled={pending || !pick}
              onClick={() => act(() => assignStudent(pick, cohort.id), "התלמיד שובץ למחזור.", () => setPick(""))}
              className="min-h-11 rounded-full border border-line px-5 text-sm font-bold disabled:opacity-40"
            >
              שיבוץ למחזור
            </button>
            <p className="text-xs opacity-60">השיבוץ הידני לא מוגבל במספר המקומות, ולא נשלחת הודעת וואטסאפ. תלמיד משובץ במחזור אחד בלבד: שיבוץ כאן מעביר אותו.</p>
          </section>

          <section className="flex flex-col gap-3 border-t border-line pt-5">
            <button
              type="button"
              disabled={pending}
              onClick={remove}
              className="min-h-11 rounded-full border border-warn/50 px-5 text-sm font-bold text-warn disabled:opacity-40"
            >
              מחיקת המחזור
            </button>
            <p className="text-xs opacity-60">אפשר למחוק רק מחזור ריק. אם יש בו תלמידים, משנים את הסטטוס ל&quot;נסגר&quot;.</p>
          </section>

          <Message msg={msg} />
        </div>
      </details>
    </li>
  );
}

export function CohortManager({ cohorts, unassigned, defaultSessions }: { cohorts: Cohort[]; unassigned: Person[]; defaultSessions: string }) {
  const open = cohorts.filter((c) => c.status !== "closed");
  const closed = cohorts.filter((c) => c.status === "closed");

  return (
    <>
      <NewCohort defaultSessions={defaultSessions} />

      <h2 className="mt-8 text-sm font-bold">מחזורים פעילים ({open.length})</h2>
      {open.length === 0 ? (
        <p className="mt-3 rounded-3xl border border-dashed border-line p-6 text-center opacity-70">אין מחזורים פתוחים. אפשר להוסיף למעלה.</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-3">
          {open.map((c) => (
            <CohortCard key={c.id} cohort={c} unassigned={unassigned} defaultSessions={defaultSessions} />
          ))}
        </ul>
      )}

      {closed.length > 0 && (
        <details className="mt-8">
          <summary className="min-h-11 cursor-pointer py-3 text-sm font-bold">מחזורים סגורים ({closed.length})</summary>
          <ul className="mt-1 flex flex-col gap-3">
            {closed.map((c) => (
              <CohortCard key={c.id} cohort={c} unassigned={unassigned} defaultSessions={defaultSessions} />
            ))}
          </ul>
        </details>
      )}
    </>
  );
}
