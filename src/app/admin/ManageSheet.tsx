"use client";

import { useState, useTransition } from "react";
import { BottomSheet } from "@/components/BottomSheet";
import { deleteUser, setCohort, updateDetails, type ActionResult } from "./actions";
import type { CohortOption, Row } from "./AdminTable";

// Same reason as in AdminTable: @/lib/cohorts pulls the db client into the client bundle.
const dateFmt = new Intl.DateTimeFormat("he-IL", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jerusalem" });

const field =
  "w-full rounded-2xl border border-line bg-white px-4 py-3 text-base outline-none focus:border-fg focus:ring-2 focus:ring-fg/15";

export function ManageSheet({
  row,
  cohorts,
  isSelf,
  open,
  onClose,
}: {
  row: Row;
  cohorts: CohortOption[];
  isSelf: boolean;
  open: boolean;
  onClose: () => void;
}) {
  const [pending, start] = useTransition();
  const [name, setName] = useState(row.name);
  const [phone, setPhone] = useState(row.phone ?? "");
  const [cohortId, setCohortId] = useState(row.enrollment?.cohortId ?? "");
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  const run = (task: () => Promise<ActionResult>, done: string, after?: () => void) =>
    start(async () => {
      setMessage(null);
      const res = await task();
      if (res.ok) after?.();
      setMessage({ text: res.ok ? done : res.error, ok: res.ok });
    });

  const remove = () => {
    if (!confirm(`למחוק את ${row.name} לצמיתות? כל המבחנים, התרגולים והשיבוץ שלהם יימחקו, ואי אפשר לשחזר.`)) return;
    run(() => deleteUser(row.id), "החשבון נמחק.", onClose);
  };

  return (
    <BottomSheet open={open} onClose={onClose} title={`ניהול: ${row.name}`}>
      <div className="flex flex-col gap-6">
        <section className="flex flex-col gap-3">
          <h3 className="text-sm font-bold">פרטים</h3>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="שם" className={field} />
          <input
            type="tel"
            dir="ltr"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="מספר טלפון"
            className={`${field} text-right`}
          />
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => updateDetails(row.id, name, phone), "הפרטים נשמרו.")}
            className="min-h-11 rounded-full bg-fg px-5 text-sm font-bold text-bg disabled:opacity-50"
          >
            שמירת פרטים
          </button>
        </section>

        <section className="flex flex-col gap-3">
          <h3 className="text-sm font-bold">שיבוץ למחזור</h3>
          <select value={cohortId} onChange={(e) => setCohortId(e.target.value)} className={field}>
            <option value="">לא משובץ</option>
            {cohorts.map((c) => (
              <option key={c.id} value={c.id}>
                {dateFmt.format(c.start)} ({c.taken}/{c.capacity})
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={pending || cohortId === (row.enrollment?.cohortId ?? "")}
            onClick={() => run(() => setCohort(row.id, cohortId || null), cohortId ? "המשתמש שובץ למחזור." : "המשתמש הוסר מהמחזור.")}
            className="min-h-11 rounded-full border border-line px-5 text-sm font-bold disabled:opacity-40"
          >
            שמירת שיבוץ
          </button>
          <p className="text-xs opacity-60">השיבוץ הידני לא מוגבל במספר המקומות, ולא נשלחת הודעת וואטסאפ.</p>
        </section>

        <section className="flex flex-col gap-3 border-t border-line pt-5">
          <h3 className="text-sm font-bold text-warn">מחיקת חשבון</h3>
          <button
            type="button"
            disabled={pending || isSelf || row.staff}
            onClick={remove}
            className="min-h-11 rounded-full border border-warn/50 px-5 text-sm font-bold text-warn disabled:opacity-40"
          >
            מחיקת החשבון לצמיתות
          </button>
          {(isSelf || row.staff) && <p className="text-xs opacity-60">חשבון צוות או החשבון שלך, לא ניתן למחוק מכאן.</p>}
        </section>

        {message && (
          <p role="status" className={`text-sm font-semibold ${message.ok ? "text-ok" : "text-warn"}`}>
            {message.text}
          </p>
        )}
      </div>
    </BottomSheet>
  );
}
