"use client";

import { useState, useTransition } from "react";
import { BottomSheet } from "@/components/BottomSheet";
import { Badge } from "./Badge";
import { addNote, deleteLead, deleteNote, setFollowUp, setStatus, type ActionResult } from "./actions";
import { StatusSelect } from "./StatusSelect";
import { NOTE_LABEL, PRODUCT_LABEL, SOURCE_LABEL, waLink, type Contact, type NoteType } from "./labels";

const field =
  "w-full rounded-2xl border border-line bg-white px-4 py-3 text-base outline-none focus:border-fg focus:ring-2 focus:ring-fg/15";
const dateTimeFmt = new Intl.DateTimeFormat("he-IL", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jerusalem" });

const addDays = (day: string, days: number) => new Date(new Date(`${day}T12:00:00Z`).getTime() + days * 86_400_000).toISOString().slice(0, 10);

const REMINDERS = [
  { label: "מחר", days: 1 },
  { label: "בעוד 3 ימים", days: 3 },
  { label: "בעוד שבוע", days: 7 },
];

const NOTE_PLACEHOLDER: Record<NoteType, string> = {
  call: "על מה דיברתם? (אפשר להשאיר ריק)",
  whatsapp: "מה כתבתם? (אפשר להשאיר ריק)",
  note: "הערה",
};

export function ContactSheet({ contact: c, today, onClose }: { contact: Contact; today: string; onClose: () => void }) {
  const [pending, start] = useTransition();
  const [type, setType] = useState<NoteType>("call");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);

  const run = (task: () => Promise<ActionResult>, after?: () => void) =>
    start(async () => {
      setError(null);
      const res = await task();
      if (res.ok) after?.();
      else setError(res.error);
    });

  const remove = () => {
    if (!confirm(`למחוק את ${c.name} מרשימת הלידים? ההערות והתזכורת יימחקו, ואי אפשר לשחזר.`)) return;
    run(() => deleteLead(c.refId), onClose);
  };

  return (
    <BottomSheet open onClose={onClose} title={c.name}>
      <div className="flex flex-col gap-6">
        <section className="flex flex-col gap-2 text-sm">
          <p className="opacity-70">
            <bdi dir="ltr">{c.phone ?? c.email ?? "—"}</bdi> · {SOURCE_LABEL[c.source] ?? c.source}
          </p>
          {c.message && <p className="rounded-2xl bg-sunk p-3 leading-relaxed">{c.message}</p>}
          <div className="flex flex-wrap gap-1.5">
            {c.products.map((p) => (
              <Badge key={p} tone="ok">
                {PRODUCT_LABEL[p] ?? p}
              </Badge>
            ))}
            {c.manual && <Badge tone="neutral">גישה ידנית</Badge>}
            {c.registered && c.kind === "lead" && <Badge tone="neutral">נרשם גם לאתר</Badge>}
          </div>
          {c.phone && (
            <div className="mt-1 flex gap-2">
              <a href={`tel:${c.phone}`} className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-fg text-sm font-bold text-bg">
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
        </section>

        <section className="flex flex-col gap-3">
          <h3 className="text-sm font-bold">סטטוס</h3>
          {c.paid ? (
            <p className="text-sm font-semibold text-ok">שילם/ה, אז הסטטוס נקבע לפי התשלום.</p>
          ) : (
            <StatusSelect value={c.status} disabled={pending} onChange={(s) => run(() => setStatus(c.kind, c.refId, s), onClose)} />
          )}
        </section>

        <section className="flex flex-col gap-3">
          <h3 className="text-sm font-bold">תזכורת לחזור אליו</h3>
          <input
            type="date"
            value={c.followUp ?? ""}
            min={today}
            disabled={pending}
            onChange={(e) => run(() => setFollowUp(c.kind, c.refId, e.target.value || null), onClose)}
            className={field}
          />
          <div className="flex flex-wrap gap-2">
            {REMINDERS.map((r) => (
              <button
                key={r.days}
                type="button"
                disabled={pending}
                onClick={() => run(() => setFollowUp(c.kind, c.refId, addDays(today, r.days)), onClose)}
                className="min-h-11 rounded-full border border-line bg-white px-4 text-sm font-semibold disabled:opacity-50"
              >
                {r.label}
              </button>
            ))}
            {c.followUp && (
              <button
                type="button"
                disabled={pending}
                onClick={() => run(() => setFollowUp(c.kind, c.refId, null), onClose)}
                className="min-h-11 rounded-full px-4 text-sm font-semibold underline underline-offset-4 disabled:opacity-50"
              >
                ניקוי
              </button>
            )}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h3 className="text-sm font-bold">רישום שיחה או הערה</h3>
          <div className="flex gap-2">
            {(Object.keys(NOTE_LABEL) as NoteType[]).map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={type === t}
                onClick={() => setType(t)}
                className={`min-h-11 flex-1 rounded-full border text-sm font-semibold ${type === t ? "border-fg bg-fg text-bg" : "border-line bg-white"}`}
              >
                {NOTE_LABEL[t]}
              </button>
            ))}
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={1000}
            rows={3}
            placeholder={NOTE_PLACEHOLDER[type]}
            className={`${field} resize-none`}
          />
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => addNote(c.kind, c.refId, type, body), onClose)}
            className="min-h-11 rounded-full bg-fg px-5 text-sm font-bold text-bg disabled:opacity-50"
          >
            {pending ? "רגע..." : "שמירה"}
          </button>
        </section>

        {c.notes.length > 0 && (
          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-bold">היסטוריה</h3>
            <ul className="flex flex-col gap-3">
              {c.notes.map((n) => (
                <li key={n.id} className="flex items-start gap-3 rounded-2xl border border-line bg-white p-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold opacity-70">
                      {NOTE_LABEL[n.type]} · {dateTimeFmt.format(n.createdAt)}
                    </p>
                    {n.body && <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed">{n.body}</p>}
                  </div>
                  <button
                    type="button"
                    disabled={pending}
                    aria-label="מחיקת הרישום"
                    onClick={() => confirm("למחוק את הרישום?") && run(() => deleteNote(n.id))}
                    className="grid size-11 shrink-0 place-items-center rounded-full text-lg opacity-60 disabled:opacity-30"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {c.kind === "lead" && (
          <section className="flex flex-col gap-3 border-t border-line pt-5">
            <button
              type="button"
              disabled={pending}
              onClick={remove}
              className="min-h-11 rounded-full border border-warn/50 px-5 text-sm font-bold text-warn disabled:opacity-40"
            >
              מחיקה מרשימת הלידים
            </button>
          </section>
        )}

        {error && (
          <p role="status" className="text-sm font-semibold text-warn">
            {error}
          </p>
        )}
      </div>
    </BottomSheet>
  );
}
