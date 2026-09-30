"use client";

import Link from "next/link";
import { copy, type CopyKey } from "@/content/copy";
import { variantSections, type VariantRow } from "@/content/copyVariants";
import { FeedbackBar } from "@/components/FeedbackBar";
import { Wordmark } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useStored } from "@/lib/useStored";

type Pick = "cur" | "a" | "b" | "own";

const INITIAL = {
  name: "",
  picks: {} as Partial<Record<CopyKey, Pick>>,
  own: {} as Partial<Record<CopyKey, string>>,
  general: "",
};

const allRows = variantSections.flatMap((s) => s.rows.map((r) => ({ ...r, section: s.title })));

export function ContentClient() {
  const [st, setSt, reset] = useStored("anglit-content", INITIAL);

  const pickOf = (k: CopyKey): Pick => st.picks[k] ?? "cur";
  const setPick = (k: CopyKey, p: Pick) => setSt((s) => ({ ...s, picks: { ...s.picks, [k]: p } }));
  const setOwn = (k: CopyKey, text: string) =>
    setSt((s) => ({
      ...s,
      own: { ...s.own, [k]: text },
      picks: { ...s.picks, [k]: text.trim() ? "own" : "cur" },
    }));

  const changed = allRows.filter((r) => pickOf(r.key) !== "cur").length;

  // Only rows that changed, so the WhatsApp message stays short
  const summary = () => {
    const L = [`טקסטים לאתר · Anglit${st.name ? ` · ${st.name}` : ""}`, ""];
    for (const r of allRows) {
      const p = pickOf(r.key);
      if (p === "cur") continue;
      const text = p === "a" ? r.a : p === "b" ? r.b : st.own[r.key] ?? "";
      const which = p === "a" ? "הצעה א׳" : p === "b" ? "הצעה ב׳" : "נוסח משלי";
      L.push(`• ${r.section} / ${r.label} [${r.key}]: ${which}`, `  ${text}`);
    }
    if (!changed) L.push("כל הטקסטים נשארים כמו שהם.");
    else L.push("", "כל השאר: כמו שזה היום.");
    if (st.general.trim()) L.push("", "הערות כלליות:", st.general.trim());
    return L.join("\n");
  };

  return (
    <div className="flex min-h-dvh flex-col pb-40">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link href="/" aria-label="לעמוד הבית">
          <Wordmark className="h-6 w-auto" />
        </Link>
        <div className="flex items-center gap-2">
          <a href="/" target="_blank" rel="noopener" className="text-sm underline underline-offset-4">
            לפתוח את האתר ↗
          </a>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <h1 className="text-3xl font-bold">טקסטים לאתר</h1>
        <p className="mt-2 leading-relaxed opacity-75">
          לכל טקסט באתר יש את מה שכתוב היום ושתי הצעות. לוחצים על הנוסח שאהבת, ואם אף אחד לא מתאים,
          כותבים נוסח משלך. הבחירות נשמרות בטלפון. בסוף לוחצים &quot;שליחה בוואטסאפ&quot;.
        </p>
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm opacity-70">
          <li>הצעה א׳: קרובה למה שיש, מחדדת</li>
          <li>הצעה ב׳: כיוון אחר</li>
          <li>
            <span className="font-semibold text-warn">הערה צבעונית</span> = צריך את האישור שלך
          </li>
        </ul>

        <label className="mt-5 flex items-center gap-3">
          <span className="text-sm opacity-70">השם שלך:</span>
          <input
            value={st.name}
            onChange={(e) => setSt((s) => ({ ...s, name: e.target.value }))}
            placeholder="לא חובה"
            className="flex-1 rounded-xl border border-line bg-raise px-3 py-2.5"
          />
        </label>

        {variantSections.map((sec) => (
          <section key={sec.title} className="mt-10">
            <h2 className="border-b border-line pb-2 text-xl font-bold">{sec.title}</h2>
            <div className="mt-4 flex flex-col gap-4">
              {sec.rows.map((r) => (
                <Row
                  key={r.key}
                  row={r}
                  pick={pickOf(r.key)}
                  own={st.own[r.key] ?? ""}
                  onPick={(p) => setPick(r.key, p)}
                  onOwn={(t) => setOwn(r.key, t)}
                />
              ))}
            </div>
          </section>
        ))}

        <section className="mt-12">
          <h2 className="text-xl font-bold">הערות כלליות</h2>
          <textarea
            value={st.general}
            onChange={(e) => setSt((s) => ({ ...s, general: e.target.value }))}
            placeholder="טון, מילים שאתה לא אוהב, מה באמת קורה בכל יום בשבוע, דברים שחסרים..."
            className="mt-3 min-h-32 w-full rounded-2xl border border-line bg-raise p-4"
          />
        </section>
      </main>

      <FeedbackBar
        status={`${changed} שינויים מתוך ${allRows.length} טקסטים`}
        summary={summary}
        onReset={reset}
      />
    </div>
  );
}

function Row({
  row,
  pick,
  own,
  onPick,
  onOwn,
}: {
  row: VariantRow;
  pick: Pick;
  own: string;
  onPick: (p: Pick) => void;
  onOwn: (t: string) => void;
}) {
  const options: [Pick, string, string][] = [
    ["cur", "היום באתר", copy[row.key]],
    ["a", "הצעה א׳", row.a],
    ["b", "הצעה ב׳", row.b],
  ];

  return (
    <fieldset className="rounded-3xl border border-line bg-raise p-4 sm:p-5">
      <legend className="sr-only">{row.label}</legend>
      <p className="font-semibold">{row.label}</p>
      {row.note && (
        <p className={`mt-1 text-sm ${row.warn ? "font-medium text-warn" : "opacity-65"}`}>{row.note}</p>
      )}

      <div className="mt-3 flex flex-col gap-2">
        {options.map(([value, label, text]) => (
          <label
            key={value}
            className={`flex cursor-pointer gap-3 rounded-2xl border-2 p-3 transition-colors ${
              pick === value ? "border-fg bg-bg" : "border-transparent bg-fg/5"
            }`}
          >
            <input
              type="radio"
              name={row.key}
              checked={pick === value}
              onChange={() => onPick(value)}
              className="mt-1 size-4 shrink-0 accent-[var(--fg)]"
            />
            <span className="flex flex-col gap-0.5">
              <span className="text-xs opacity-60">{label}</span>
              <span className="leading-snug">{text}</span>
            </span>
          </label>
        ))}
        <input
          value={own}
          onChange={(e) => onOwn(e.target.value)}
          placeholder="או נוסח משלך..."
          className={`rounded-2xl border-2 bg-bg px-3 py-3 ${pick === "own" ? "border-fg" : "border-line"}`}
        />
      </div>
    </fieldset>
  );
}
