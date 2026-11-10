"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { FeedbackBar } from "@/components/FeedbackBar";
import { InternalHeader } from "@/components/InternalHeader";
import { QuestionView } from "@/components/QuestionView";
import { copy } from "@/content/copy";
import { questions } from "@/content/questions";
import { STORAGE_KEYS } from "@/lib/storageKeys";
import { useStored } from "@/lib/useStored";

type Verdict = "ok" | "fix";

const INITIAL = {
  marks: {} as Record<string, Verdict>,
  notes: {} as Record<string, string>,
  general: "",
};

const sample = questions.find((q) => q.type === "sentence")!;

// ---- small pieces used by the demos ----

/** A phone-sized window. `scrollToExplanation` mimics where the page ends up after the new auto-scroll. */
function Frame({ children, scrollToExplanation = false, tall = false }: { children: ReactNode; scrollToExplanation?: boolean; tall?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    const target = el?.querySelector<HTMLElement>(".rise");
    if (el && target && scrollToExplanation) el.scrollTop = target.offsetTop - el.clientHeight * 0.5;
  }, [scrollToExplanation]);
  return (
    <div
      ref={ref}
      className={`relative mx-auto w-full max-w-[340px] overflow-hidden rounded-3xl border-2 border-line bg-bg p-4 ${tall ? "h-[560px]" : ""}`}
    >
      {children}
    </div>
  );
}

function OldOption({ n, text, picked }: { n: number; text: string; picked?: boolean }) {
  // The previous look of a picked answer: only a dark outline on the same white
  const state = picked ? "border-fg bg-white text-ink ring-1 ring-fg" : "border-line bg-white text-ink";
  return (
    <div dir="ltr" className={`flex min-h-14 items-center gap-3 rounded-2xl border px-4 py-3.5 text-left ${state}`}>
      <span className="grid size-7 place-items-center rounded-full bg-fg/10 text-sm font-semibold">{n}</span>
      <span className="flex-1">{text}</span>
    </div>
  );
}

function BottomBar({ hint }: { hint?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-bg p-3">
      {hint && <p className="mb-2 text-center text-sm font-semibold text-warn">{hint}</p>}
      <div className="flex items-center gap-3">
        <span className="grid h-12 place-items-center rounded-full border border-line bg-white px-5 font-semibold text-ink">→ הקודמת</span>
        <span className="grid h-12 flex-1 place-items-center rounded-full bg-ink font-semibold text-white">חזרה לשאלה 1</span>
      </div>
    </div>
  );
}

function Measured({ label, className, children }: { label: string; className: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className={`inline-flex items-center underline underline-offset-4 outline outline-1 outline-dashed outline-coral ${className}`}>{children}</span>
      <span className="text-xs font-semibold tabular-nums opacity-70">{label}</span>
    </div>
  );
}

// ---- the list of changes ----

type Item = { id: string; title: string; where: string; what: string; before: ReactNode; after: ReactNode };

const ITEMS: Item[] = [
  {
    id: "select",
    title: "תשובה שנבחרה במבחן",
    where: "מבחן תרגול: כל שאלה",
    what: "במקום מסגרת כהה על רקע לבן, התשובה שנבחרה נצבעת מלא. בטלפון, תחת לחץ זמן, רואים מיד מה סימנתם.",
    before: (
      <Frame>
        <div className="flex flex-col gap-2.5">
          <OldOption n={1} text="spread" />
          <OldOption n={2} text="reported" picked />
          <OldOption n={3} text="extinguished" />
        </div>
      </Frame>
    ),
    after: (
      <Frame>
        <div className="flex flex-col gap-2.5" dir="ltr">
          <QuestionOptionPreview n={1} text="spread" picked={false} />
          <QuestionOptionPreview n={2} text="reported" picked />
          <QuestionOptionPreview n={3} text="extinguished" picked={false} />
        </div>
      </Frame>
    ),
  },
  {
    id: "reveal",
    title: "הסבר אחרי תשובה בתרגול",
    where: "תרגול חינם ותרגול חופשי",
    what: "אחרי שבוחרים תשובה, העמוד גולל מעצמו כך שרואים גם את התשובה שסימנתם וגם את תחילת ההסבר. קוראי מסך שומעים גם 'תשובה נכונה' או 'תשובה שגויה'. ההדגמה כאן היא תמונה של המצב, לא אנימציה. את האנימציה האמיתית אפשר לראות ב-/practice?type=free.",
    before: (
      <Frame tall>
        <QuestionView q={sample} selected={(sample.answer + 1) % 4} revealed />
      </Frame>
    ),
    after: (
      <Frame tall scrollToExplanation>
        <QuestionView q={sample} selected={(sample.answer + 1) % 4} revealed />
      </Frame>
    ),
  },
  {
    id: "hint",
    title: "שאלות שנשארו בלי תשובה",
    where: "מבחן תרגול: סוף פרק, בעיקר פרק יצירת מילה",
    what: "כשיש שאלות בלי תשובה, הכפתור שולח אתכם אליהן. עכשיו כתוב לכם כמה נשארו, כדי שלא תסתובבו בלי להבין למה אי אפשר להתקדם. ההתנהגות עצמה לא השתנתה.",
    before: (
      <Frame>
        <BottomBar />
      </Frame>
    ),
    after: (
      <Frame>
        <BottomBar hint="נשארו 3 שאלות בלי תשובה" />
      </Frame>
    ),
  },
  {
    id: "top",
    title: "פתיחת המבחן בראש העמוד",
    where: "מבחן תרגול: אחרי 'להתחיל' ובכל מעבר שאלה ופרק",
    what: "כפתור ההתחלה נמצא בתחתית עמוד ההסבר, ולכן השאלה הראשונה נפתחה כשהמסך על הפוטר. עכשיו העמוד חוזר לראשו בכל שאלה ופרק.",
    before: (
      <Frame tall>
        <div className="flex h-full flex-col justify-between">
          <div className="h-40 rounded-xl bg-sunk" aria-hidden />
          <div className="rounded-xl bg-ink p-4 text-white">
            <p className="text-xl font-bold">בואו נתחיל</p>
            <p className="mt-2 text-sm opacity-80">וואטסאפ · אינסטגרם · תקנון</p>
          </div>
          <p className="text-center text-xs opacity-60">מה שרואים אחרי &quot;להתחיל&quot;: הפוטר</p>
        </div>
      </Frame>
    ),
    after: (
      <Frame tall>
        <div className="flex h-full flex-col gap-3">
          <p className="text-sm opacity-70">פרק 1 מתוך 8 · שאלה 1 מתוך 4</p>
          <p className="text-xl font-medium" dir="ltr">Although the fire was quickly ______, the smoke damaged most of the books.</p>
          <p className="mt-auto text-center text-xs opacity-60">מה שרואים אחרי &quot;להתחיל&quot;: השאלה</p>
        </div>
      </Frame>
    ),
  },
  {
    id: "text",
    title: "תיקוני טקסט",
    where: "עמוד הבית, אזור אישי",
    what: "טעויות כתיב וניסוחים מגושמים. הטקסט החדש נמשך ישירות מהקובץ של האתר, כך שזה מה שיופיע.",
    before: null, // rendered by TextPairs
    after: null,
  },
  {
    id: "targets",
    title: "גודל אזורי מגע",
    where: "פוטר, רשימת המוסדות ב-/amirnet, כפתור הנגישות",
    what: "המסגרת המקווקוות היא האזור שמגיב לאצבע. ההמלצה היא לפחות 44 פיקסלים בגובה.",
    before: (
      <Frame>
        <div className="flex flex-col gap-3">
          <Measured label="32px · קישור משפטי" className="min-h-8 text-sm">מדיניות פרטיות</Measured>
          <Measured label="20px · מוסד ברשימה" className="text-base">האוניברסיטה העברית</Measured>
          <div className="flex items-center justify-between">
            <span className="grid size-10 place-items-center rounded-full bg-fg text-bg" aria-hidden>♿</span>
            <span className="text-xs font-semibold tabular-nums opacity-70">40px · כפתור נגישות</span>
          </div>
        </div>
      </Frame>
    ),
    after: (
      <Frame>
        <div className="flex flex-col gap-3">
          <Measured label="44px · קישור משפטי" className="min-h-11 text-sm">מדיניות פרטיות</Measured>
          <Measured label="44px · מוסד ברשימה" className="min-h-11 text-base">האוניברסיטה העברית</Measured>
          <div className="flex items-center justify-between">
            <span className="grid size-11 place-items-center rounded-full bg-fg text-bg" aria-hidden>♿</span>
            <span className="text-xs font-semibold tabular-nums opacity-70">44px · כפתור נגישות</span>
          </div>
        </div>
      </Frame>
    ),
  },
  {
    id: "terms",
    title: "שורת התקנון בהרשמה",
    where: "/sign-up",
    what: "הקישורים עטופים בתיבות גבוהות שפירקו את המשפט לכמה שורות. עכשיו זה קישור רגיל בתוך הטקסט.",
    before: (
      <Frame>
        <label className="flex items-start gap-2.5 text-sm leading-relaxed">
          <input type="checkbox" className="mt-1 size-4 shrink-0 accent-fg" readOnly />
          <span>
            קראתי ואני מסכים/ה ל<span className="inline-flex min-h-11 items-center underline">תקנון</span> ול
            <span className="inline-flex min-h-11 items-center underline">מדיניות הפרטיות</span>
          </span>
        </label>
      </Frame>
    ),
    after: (
      <Frame>
        <label className="flex items-start gap-2.5 text-sm leading-relaxed">
          <input type="checkbox" className="mt-1 size-4 shrink-0 accent-fg" readOnly />
          <span>
            קראתי ואני מסכים/ה ל<span className="underline">תקנון</span> ול<span className="underline">מדיניות הפרטיות</span>
          </span>
        </label>
      </Frame>
    ),
  },
  {
    id: "guest",
    title: "קישור חזרה באימון לאורח",
    where: "/exam",
    what: "אורח בלי חשבון לא רואה 'חזרה לאזור האישי'. הוא רואה 'חזרה לדף הבית'.",
    before: (
      <Frame>
        <p className="text-sm underline opacity-70">חזרה לאזור האישי</p>
        <p className="mt-2 text-xs opacity-60">מוביל אורח למסך התחברות</p>
      </Frame>
    ),
    after: (
      <Frame>
        <p className="text-sm underline opacity-70">חזרה לדף הבית</p>
        <p className="mt-2 text-xs opacity-60">מוביל אורח לעמוד הבית. למשתמש רשום לא השתנה דבר.</p>
      </Frame>
    ),
  },
  {
    id: "hidden",
    title: "שינויים שלא רואים בעין",
    where: "הרשמה, התחברות, חלונות",
    what: "מילוי אוטומטי של שם, טלפון ותאריך לידה. הודעות שגיאה מוכרזות לקוראי מסך. בחלון 'עוד שתי שאלות' ובחלונות תחתונים ה-Tab לא בורח החוצה והפוקוס חוזר לכפתור שפתח את החלון.",
    before: <p className="text-sm opacity-70">הדפדפן לא הציע למלא פרטים. ה-Tab בחלון יצא אל העמוד שמאחוריו.</p>,
    after: <p className="text-sm">הדפדפן מציע למלא שם וטלפון. ה-Tab נשאר בתוך החלון.</p>,
  },
];

// A picked option rendered with the same classes the real QuestionView now uses for it
function QuestionOptionPreview({ n, text, picked }: { n: number; text: string; picked: boolean }) {
  const state = picked ? "border-ink bg-ink text-white ring-1 ring-fg" : "border-line bg-white text-ink";
  const badge = picked ? "bg-white/20" : "bg-fg/10";
  return (
    <div dir="ltr" className={`flex min-h-14 items-center gap-3 rounded-2xl border px-4 py-3.5 text-left ${state}`}>
      <span className={`grid size-7 place-items-center rounded-full text-sm font-semibold ${badge}`}>{n}</span>
      <span className="flex-1">{text}</span>
    </div>
  );
}

export function LabClient() {
  const [st, setSt, reset] = useStored(STORAGE_KEYS.lab, INITIAL);

  const mark = (id: string, v: Verdict) =>
    setSt((s) => {
      const marks = { ...s.marks };
      if (marks[id] === v) delete marks[id];
      else marks[id] = v;
      return { ...s, marks };
    });
  const note = (id: string, v: string) => setSt((s) => ({ ...s, notes: { ...s.notes, [id]: v } }));

  const ok = ITEMS.filter((i) => st.marks[i.id] === "ok").length;
  const fix = ITEMS.filter((i) => st.marks[i.id] === "fix").length;

  const summary = () => {
    const L = ["מעבדה: לפני ואחרי · Anglit", "", `מאושר: ${ok} · לתיקון: ${fix} · לא נבדקו: ${ITEMS.length - ok - fix}`];
    const toFix = ITEMS.filter((i) => st.marks[i.id] === "fix");
    if (toFix.length) {
      L.push("", "לתיקון:");
      for (const i of toFix) L.push(`• ${i.title}`, `  ${st.notes[i.id]?.trim() || "(בלי הערה)"}`);
    }
    if (st.general.trim()) L.push("", "הערות כלליות:", st.general.trim());
    return L.join("\n");
  };

  return (
    <div className="flex min-h-dvh flex-col pb-40">
      <InternalHeader className="max-w-3xl" />
      <main className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <h1 className="font-display text-3xl font-bold">מעבדה: לפני ואחרי</h1>
        <p className="mt-2 leading-relaxed opacity-75">
          כל שינוי מהסריקה, עם איך שהיה (למעלה, באדום) ואיך שנראה עכשיו (למטה, בירוק). מסמנים <b>מאושר</b> או <b>לתיקון</b>, ובסוף שולחים סיכום. העמוד מוצג רק בסביבת פיתוח.
        </p>
        <p className="mt-2 text-sm opacity-70">
          אפשר לראות את השינויים בפועל ב־<Link href="/exam/69185" className="underline">מבחן החינם</Link>, ב־<Link href="/practice?type=free" className="underline">תרגול החינם</Link> וב־<Link href="/sign-up" className="underline">הרשמה</Link>.
        </p>

        <ol className="mt-8 flex flex-col gap-8">
          {ITEMS.map((item, idx) => {
            const v = st.marks[item.id];
            return (
              <li key={item.id} className="rounded-3xl border border-line bg-white p-5 text-ink">
                <p className="text-sm font-semibold opacity-60">{idx + 1} מתוך {ITEMS.length} · {item.where}</p>
                <h2 className="mt-1 text-xl font-bold">{item.title}</h2>
                <p className="mt-2 leading-relaxed">{item.what}</p>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <section aria-label="לפני" className="rounded-2xl bg-coral/15 p-3">
                    <p className="mb-2 text-sm font-bold">לפני</p>
                    {item.id === "text" ? <TextPairs which="before" /> : item.before}
                  </section>
                  <section aria-label="אחרי" className="rounded-2xl bg-mint/25 p-3">
                    <p className="mb-2 text-sm font-bold">אחרי</p>
                    {item.id === "text" ? <TextPairs which="after" /> : item.after}
                  </section>
                </div>

                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    aria-pressed={v === "ok"}
                    onClick={() => mark(item.id, "ok")}
                    className={`min-h-11 flex-1 rounded-full border px-4 font-semibold ${v === "ok" ? "border-mint bg-mint text-ink-deep" : "border-line"}`}
                  >
                    מאושר
                  </button>
                  <button
                    type="button"
                    aria-pressed={v === "fix"}
                    onClick={() => mark(item.id, "fix")}
                    className={`min-h-11 flex-1 rounded-full border px-4 font-semibold ${v === "fix" ? "border-coral bg-coral text-ink-deep" : "border-line"}`}
                  >
                    לתיקון
                  </button>
                </div>
                {v === "fix" && (
                  <textarea
                    value={st.notes[item.id] ?? ""}
                    onChange={(e) => note(item.id, e.target.value)}
                    placeholder="מה לשנות?"
                    className="mt-3 min-h-20 w-full rounded-2xl border border-line bg-white p-3"
                  />
                )}
              </li>
            );
          })}
        </ol>

        <section className="mt-10">
          <h2 className="text-xl font-bold">הערות כלליות</h2>
          <textarea
            value={st.general}
            onChange={(e) => setSt((s) => ({ ...s, general: e.target.value }))}
            className="mt-3 min-h-28 w-full rounded-2xl border border-line bg-white p-4"
          />
        </section>
      </main>

      <FeedbackBar status={`${ok} מאושרים · ${fix} לתיקון · ${ITEMS.length - ok - fix} פתוחים`} summary={summary} onReset={reset} />
    </div>
  );
}

// The text change: the "after" strings come straight from the site's copy file.
const TEXT_CHANGES = [
  {
    before: "עוד יום שישי שילך לכם על ללכת לאוניברסיטה ולשנן מילים",
    after: copy.savingsText.slice(copy.savingsText.indexOf("עוד יום שישי"), copy.savingsText.indexOf("עוד אלפי")).replace(/,\s*$/, ""),
  },
  { before: "אתם פסע מלפתוח את כל האתר - הגישה תפתח לאחר התשלום.", after: copy.accountUnpaidBannerTitle },
  { before: "אתם אולי שואלים את עצמיכם..", after: copy.homeFaqTitle },
  { before: "...ולומדים אחד מהשניה.", after: "...ולומדים אחד מהשני." },
  { before: "יחס אישי זה מאוד חשוב אצלינו", after: "יחס אישי זה מאוד חשוב אצלנו" },
];

function TextPairs({ which }: { which: "before" | "after" }) {
  return (
    <ul className="flex flex-col gap-2">
      {TEXT_CHANGES.map((t) => (
        <li key={t.before} className="rounded-xl bg-white/70 p-3 text-sm leading-relaxed text-ink">
          {t[which]}
        </li>
      ))}
    </ul>
  );
}
