"use client";

import Link from "next/link";
import { useState } from "react";
import { getPassage, questions, TYPE_LABELS, type Question } from "@/content/questions";
import { FeedbackBar } from "@/components/FeedbackBar";
import { Wordmark } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TYPES } from "@/lib/practice";
import { useStored } from "@/lib/useStored";

type Verdict = "ok" | "fix";
type Filter = "all" | "open" | "fix";

const INITIAL = {
  name: "",
  marks: {} as Record<string, Verdict>,
  notes: {} as Record<string, string>,
  general: "",
};

export function ReviewClient() {
  const [st, setSt, reset] = useStored("anglit-review", INITIAL);
  const [filter, setFilter] = useState<Filter>("all");

  const ok = questions.filter((q) => st.marks[q.id] === "ok").length;
  const fix = questions.filter((q) => st.marks[q.id] === "fix").length;
  const open = questions.length - ok - fix;

  // Tapping the active verdict again clears it
  const mark = (id: string, v: Verdict) =>
    setSt((s) => {
      const marks = { ...s.marks };
      if (marks[id] === v) delete marks[id];
      else marks[id] = v;
      return { ...s, marks };
    });
  const note = (id: string, text: string) => setSt((s) => ({ ...s, notes: { ...s.notes, [id]: text } }));

  const visible = (q: Question) =>
    filter === "all" || (filter === "open" ? !st.marks[q.id] : st.marks[q.id] === "fix");

  const summary = () => {
    const L = [`בדיקת מאגר השאלות · Anglit${st.name ? ` · ${st.name}` : ""}`, ""];
    L.push(`תקינות: ${ok} · לתיקון: ${fix} · לא נבדקו: ${open}`);
    const toFix = questions.filter((q) => st.marks[q.id] === "fix");
    if (toFix.length) {
      L.push("", "לתיקון:");
      for (const q of toFix) {
        L.push(`• ${q.id}: ${q.stem.slice(0, 60)}${q.stem.length > 60 ? "…" : ""}`);
        const n = st.notes[q.id]?.trim();
        L.push(`  ${n || "(בלי הערה)"}`);
      }
    }
    if (st.general.trim()) L.push("", "הערות כלליות:", st.general.trim());
    return L.join("\n");
  };

  return (
    <div className="flex min-h-dvh flex-col pb-40">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link href="/" aria-label="לעמוד הבית">
          <Wordmark className="h-6 w-auto" />
        </Link>
        <ThemeToggle />
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <h1 className="text-3xl font-bold">בדיקת מאגר השאלות</h1>
        <p className="mt-2 leading-relaxed opacity-75">
          עוברים על כל שאלה ומסמנים <b>תקין</b> או <b>לתיקון</b>. אם צריך תיקון, נפתח שדה להערה. הכל
          נשמר בטלפון, אז אפשר לעצור ולחזור. בסוף לוחצים &quot;שליחה בוואטסאפ&quot;.
        </p>

        <label className="mt-5 flex items-center gap-3">
          <span className="text-sm opacity-70">השם שלך:</span>
          <input
            value={st.name}
            onChange={(e) => setSt((s) => ({ ...s, name: e.target.value }))}
            placeholder="לא חובה"
            className="flex-1 rounded-xl border border-line bg-raise px-3 py-2.5"
          />
        </label>

        <div className="sticky top-0 z-[5] -mx-4 mt-6 bg-bg/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
          <div className="flex gap-2 overflow-x-auto">
            {(
              [
                ["all", `הכול (${questions.length})`],
                ["open", `לא נבדקו (${open})`],
                ["fix", `לתיקון (${fix})`],
              ] as [Filter, string][]
            ).map(([f, label]) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm ${
                  filter === f ? "border-fg bg-fg text-bg" : "border-line"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="mt-3 flex h-1.5 overflow-hidden rounded-full bg-fg/10" aria-hidden>
            <span className="bg-mint transition-[width]" style={{ width: `${(ok / questions.length) * 100}%` }} />
            <span className="bg-coral transition-[width]" style={{ width: `${(fix / questions.length) * 100}%` }} />
          </div>
        </div>

        {TYPES.map((t) => {
          const qs = questions.filter((q) => q.type === t && visible(q));
          if (!qs.length) return null;
          return (
            <section key={t} className="mt-8">
              <h2 className="text-xl font-bold">{TYPE_LABELS[t].he}</h2>
              <ol className="mt-3 flex flex-col gap-4">
                {qs.map((q) => (
                  <ReviewCard
                    key={q.id}
                    q={q}
                    verdict={st.marks[q.id]}
                    note={st.notes[q.id] ?? ""}
                    onMark={(v) => mark(q.id, v)}
                    onNote={(v) => note(q.id, v)}
                  />
                ))}
              </ol>
            </section>
          );
        })}

        {filter !== "all" && questions.every((q) => !visible(q)) && (
          <p className="mt-10 rounded-2xl bg-raise p-6 text-center opacity-70">
            {filter === "open" ? "עברת על כל השאלות." : "אין שאלות שסומנו לתיקון."}
          </p>
        )}

        <section className="mt-12">
          <h2 className="text-xl font-bold">הערות כלליות</h2>
          <textarea
            value={st.general}
            onChange={(e) => setSt((s) => ({ ...s, general: e.target.value }))}
            placeholder="רמת קושי, סוגי שאלות שחסרים, מילים שכדאי להוסיף..."
            className="mt-3 min-h-32 w-full rounded-2xl border border-line bg-raise p-4"
          />
        </section>
      </main>

      <FeedbackBar
        status={`נבדקו ${ok + fix} מתוך ${questions.length} · ${fix} לתיקון`}
        summary={summary}
        onReset={reset}
      />
    </div>
  );
}

function ReviewCard({
  q,
  verdict,
  note,
  onMark,
  onNote,
}: {
  q: Question;
  verdict?: Verdict;
  note: string;
  onMark: (v: Verdict) => void;
  onNote: (v: string) => void;
}) {
  const edge =
    verdict === "ok" ? "border-mint" : verdict === "fix" ? "border-coral" : "border-line";

  return (
    <li className={`rounded-3xl border-2 bg-raise p-4 sm:p-5 ${edge}`}>
      <div className="flex items-center justify-between text-xs">
        <code dir="ltr" className="font-semibold opacity-60">
          {q.id}
        </code>
        {q.type === "reading" && (
          <span className="opacity-60">
            {getPassage(q.passageId).title}
            {q.paragraph ? ` · פסקה ${q.paragraph}` : " · כל הקטע"}
          </span>
        )}
      </div>

      <p dir="ltr" className="mt-3 text-left text-lg font-medium leading-snug">
        {q.stem}
      </p>
      <ol dir="ltr" className="mt-3 flex flex-col gap-1.5 text-left">
        {q.options.map((o, i) => (
          <li
            key={i}
            className={`rounded-xl px-3 py-2 ${
              i === q.answer ? "bg-mint font-semibold text-ink-deep" : "bg-fg/5"
            }`}
          >
            {i + 1}. {o}
          </li>
        ))}
      </ol>
      <p className="mt-3 text-sm leading-relaxed opacity-80">{q.explanation}</p>
      {q.trick && (
        <p className="mt-2 text-sm font-semibold">
          <span className="me-1.5 rounded-md bg-marker px-1.5 py-0.5 text-ink-deep">הטריק</span>
          {q.trick}
        </p>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onMark("ok")}
          aria-pressed={verdict === "ok"}
          className={`rounded-full border-2 py-3 font-semibold ${
            verdict === "ok" ? "border-mint bg-mint text-ink-deep" : "border-line"
          }`}
        >
          ✓ תקין
        </button>
        <button
          type="button"
          onClick={() => onMark("fix")}
          aria-pressed={verdict === "fix"}
          className={`rounded-full border-2 py-3 font-semibold ${
            verdict === "fix" ? "border-coral bg-coral text-ink-deep" : "border-line"
          }`}
        >
          ✗ לתיקון
        </button>
      </div>

      {verdict === "fix" && (
        <textarea
          autoFocus={!note}
          value={note}
          onChange={(e) => onNote(e.target.value)}
          placeholder="מה לא בסדר? למשל: התשובה הנכונה היא 3, או: שאלה קלה מדי למבחן"
          className="rise mt-3 min-h-24 w-full rounded-2xl border border-coral/60 bg-bg p-3"
        />
      )}
    </li>
  );
}
