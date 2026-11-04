"use client";

import Link from "next/link";
import { THOUGHTS } from "@/content/calm";
import { ELIMINATE } from "@/content/eliminate";
import { SCENARIOS } from "@/content/blackout";
import { SESSIONS } from "@/content/calmSessions";
import { LtrWords } from "@/components/LtrWords";
import { FeedbackBar } from "@/components/FeedbackBar";
import { Wordmark } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useStored } from "@/lib/useStored";

type Verdict = "ok" | "fix";
type Item = { id: string; label: string; body: React.ReactNode };

const INITIAL = {
  name: "",
  marks: {} as Record<string, Verdict>,
  notes: {} as Record<string, string>,
  general: "",
};

const SECTIONS: { title: string; items: Item[] }[] = [
  {
    title: "מחשבות מעכבות (לפח)",
    items: THOUGHTS.filter((t) => t.heavy).map((t) => ({ id: t.id, label: t.text, body: <p className="text-lg font-medium">{t.text}</p> })),
  },
  {
    title: "מחשבות מקדמות (שומרים)",
    items: THOUGHTS.filter((t) => !t.heavy).map((t) => ({ id: t.id, label: t.text, body: <p className="text-lg font-medium">{t.text}</p> })),
  },
  {
    title: "שאלות פסילה",
    items: ELIMINATE.map((q) => ({
      id: q.id,
      label: q.stem,
      body: (
        <>
          <p dir="ltr" className="text-left text-lg font-medium leading-snug">{q.stem}</p>
          <p className="mt-3 text-sm font-semibold opacity-70">נשארות בלי פסילה (הראשונה היא התשובה הנכונה):</p>
          <p dir="ltr" className="mt-1 flex flex-wrap gap-2 text-left">
            {q.keep.map((o) => (
              <span key={o} className="rounded-xl bg-fg/5 px-3 py-2">{o}</span>
            ))}
          </p>
          <p className="mt-3 text-sm font-semibold opacity-70">שני אלו המשחק מבקש לפסול:</p>
          <p dir="ltr" className="mt-1 flex flex-wrap gap-2 text-left">
            {q.out.map((o) => (
              <span key={o} className="rounded-xl bg-coral/30 px-3 py-2 line-through">{o}</span>
            ))}
          </p>
          <p className="mt-3 text-sm opacity-70"><LtrWords text={q.why} /></p>
          <p className="mt-2 text-sm opacity-70"><LtrWords text={q.pick} /></p>
        </>
      ),
    })),
  },
  {
    title: "מה עושים כשנתקעים (תרחישים)",
    items: SCENARIOS.map((s) => ({
      id: s.id,
      label: s.setup,
      body: (
        <>
          <p className="text-lg font-medium leading-relaxed">{s.setup}</p>
          <ul className="mt-3 flex flex-col gap-3">
            {s.options.map((o) => (
              <li key={o.text} className={`rounded-xl p-3 ${o.good ? "bg-mint/30" : "bg-fg/5"}`}>
                <p className="font-semibold">{o.text}</p>
                <p className="mt-1 text-sm opacity-80">{o.good ? "מתאים. " : "לא הצעד הראשון. "}{o.reply}</p>
              </li>
            ))}
          </ul>
        </>
      ),
    })),
  },
  {
    title: "סקריפטים לסשנים הקוליים",
    items: SESSIONS.map((s) => ({
      id: s.id,
      label: s.title,
      body: (
        <>
          <p className="text-lg font-semibold">{s.title} · כ-{s.minutes} דקות</p>
          <p className="mt-1 text-sm opacity-70">{s.when}</p>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">{s.script}</p>
        </>
      ),
    })),
  },
];
const ALL = SECTIONS.flatMap((s) => s.items);

export function CalmReviewClient() {
  const [st, setSt, reset] = useStored("anglit-calm-review", INITIAL);
  const ok = ALL.filter((i) => st.marks[i.id] === "ok").length;
  const fix = ALL.filter((i) => st.marks[i.id] === "fix").length;

  // Tapping the active verdict again clears it
  const mark = (id: string, v: Verdict) =>
    setSt((s) => {
      const marks = { ...s.marks };
      if (marks[id] === v) delete marks[id];
      else marks[id] = v;
      return { ...s, marks };
    });

  const summary = () => {
    const L = [`בדיקת אזור אנג'לה · Anglit${st.name ? ` · ${st.name}` : ""}`, ""];
    L.push(`תקינות: ${ok} · לתיקון: ${fix} · לא נבדקו: ${ALL.length - ok - fix}`);
    const toFix = ALL.filter((i) => st.marks[i.id] === "fix");
    if (toFix.length) {
      L.push("", "לתיקון:");
      for (const i of toFix) {
        L.push(`• ${i.id}: ${i.label.slice(0, 60)}${i.label.length > 60 ? "…" : ""}`);
        L.push(`  ${st.notes[i.id]?.trim() || "(בלי הערה)"}`);
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
        <h1 className="font-display text-3xl font-bold">בדיקת אזור אנג&apos;לה</h1>
        <p className="mt-2 leading-relaxed opacity-75">
          מסמנים <b>תקין</b> או <b>לתיקון</b> לכל מחשבה, שאלה, תרחיש וסקריפט. אם צריך תיקון, נפתח שדה להערה. הכל נשמר בטלפון.
          בסוף לוחצים &quot;שליחה בוואטסאפ&quot;. בשאלות הפסילה, בודקים שני דברים: שאכן אי אפשר שהתשובות החצויות יהיו נכונות, ושההסבר ברור.
        </p>

        <label className="mt-5 flex items-center gap-3">
          <span className="text-sm opacity-70">השם שלך:</span>
          <input
            value={st.name}
            onChange={(e) => setSt((s) => ({ ...s, name: e.target.value }))}
            placeholder="לא חובה"
            className="flex-1 rounded-xl border border-line bg-white px-3 py-2.5"
          />
        </label>

        {SECTIONS.map((sec) => (
          <section key={sec.title} className="mt-10">
            <h2 className="text-xl font-bold">{sec.title}</h2>
            <ol className="mt-3 flex flex-col gap-4">
              {sec.items.map((i) => {
                const v = st.marks[i.id];
                return (
                  <li
                    key={i.id}
                    className={`rounded-3xl border-2 bg-white p-4 sm:p-5 ${v === "ok" ? "border-mint" : v === "fix" ? "border-coral" : "border-line"}`}
                  >
                    <code dir="ltr" className="text-sm font-semibold opacity-70">{i.id}</code>
                    <div className="mt-2">{i.body}</div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {(
                        [
                          ["ok", "תקין"],
                          ["fix", "לתיקון"],
                        ] as [Verdict, string][]
                      ).map(([k, label]) => (
                        <button
                          key={k}
                          type="button"
                          onClick={() => mark(i.id, k)}
                          className={`min-h-12 rounded-full border-2 font-semibold ${
                            v === k ? (k === "ok" ? "border-mint bg-mint text-ink-deep" : "border-coral bg-coral text-ink-deep") : "border-line"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    {v === "fix" && (
                      <textarea
                        value={st.notes[i.id] ?? ""}
                        onChange={(e) => setSt((s) => ({ ...s, notes: { ...s.notes, [i.id]: e.target.value } }))}
                        placeholder="מה לתקן?"
                        className="mt-3 min-h-20 w-full rounded-2xl border border-line p-3"
                      />
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        ))}

        <section className="mt-12">
          <h2 className="text-xl font-bold">הערות כלליות</h2>
          <textarea
            value={st.general}
            onChange={(e) => setSt((s) => ({ ...s, general: e.target.value }))}
            placeholder="מחשבות שחסרות, נוסחים שלא מתאימים, טון..."
            className="mt-3 min-h-32 w-full rounded-2xl border border-line bg-white p-4"
          />
        </section>
      </main>

      <FeedbackBar status={`נבדקו ${ok + fix} מתוך ${ALL.length} · ${fix} לתיקון`} summary={summary} onReset={reset} />
    </div>
  );
}
