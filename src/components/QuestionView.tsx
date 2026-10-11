"use client";

import Image from "next/image";
import type { Question, QuestionType, WordFormationQuestion } from "@/content/questions";
import { TYPE_LABELS } from "@/content/questionLabels";
import { usePassage } from "@/components/PassageContext";
import { highlight, Stem } from "./Stem";

type Size = "app" | "stage";

// "stage" is the recording frame: sizes are in container-width units (cqw)
// so the layout scales with the phone screen it is filmed on.
const S = {
  app: {
    label: "text-sm",
    stem: "text-xl sm:text-2xl leading-snug",
    list: "gap-2.5",
    option: "text-base sm:text-lg py-3.5 px-4 gap-3 rounded-2xl min-h-14",
    badge: "size-7 text-sm",
    icon: "size-5",
    explain: "text-base leading-relaxed",
    card: "p-5 rounded-3xl",
    passage: "text-[15px] leading-relaxed",
    passageTitle: "text-sm",
    gap: "gap-5",
  },
  stage: {
    label: "text-[3.4cqw]",
    stem: "text-[6.3cqw] leading-[1.22]",
    list: "gap-[2.2cqw]",
    option: "text-[4.7cqw] py-[3.3cqw] px-[4cqw] gap-[3cqw] rounded-[4cqw]",
    badge: "size-[7cqw] text-[3.6cqw]",
    icon: "size-[5.4cqw]",
    explain: "text-[4cqw] leading-[1.45]",
    card: "p-[4.4cqw] rounded-[4cqw]",
    passage: "text-[3.8cqw] leading-[1.45]",
    passageTitle: "text-[4cqw]",
    gap: "gap-[4.6cqw]",
  },
} as const;

export function QuestionView({
  q,
  selected,
  revealed,
  onSelect,
  size = "app",
  showExplanation = true,
  showPassage = true,
}: {
  q: Question;
  selected: number | null;
  revealed: boolean;
  onSelect?: (i: number) => void;
  size?: Size;
  showExplanation?: boolean;
  showPassage?: boolean;
}) {
  const s = S[size];
  const isSentence = q.type === "sentence";

  return (
    <div className={`flex flex-col ${s.gap}`}>
      {q.type === "reading" && showPassage && (
        <PassageBlock q={q} size={size} revealed={revealed} />
      )}
      {(q.type === "listening" || q.type === "audiocomplete") && <AudioBlock passageId={q.passageId} size={size} />}

      <div dir="ltr" className={`text-left font-medium text-balance ${s.stem}`}>
        <Stem
          text={q.stem}
          keywords={q.type === "reading" ? undefined : q.keywords}
          revealed={revealed}
          fill={isSentence ? q.options[q.answer] : undefined}
        />
      </div>

      <ol dir="ltr" className={`flex flex-col ${s.list}`}>
        {q.options.map((opt, i) => {
          const isAnswer = i === q.answer;
          const isPicked = i === selected;
          // bg-white is literal white even inside an inverted (dark) card, so its text needs a
          // fixed dark color here — it cannot inherit text-fg, which flips to light on that card
          let state = "border-line bg-white text-ink active:scale-[0.99] hover:border-fg/30";
          if (!revealed && isPicked) state = "border-fg bg-white text-ink ring-1 ring-fg";
          if (revealed && isAnswer) state = "border-mint bg-mint text-ink-deep";
          if (revealed && isPicked && !isAnswer) state = "border-coral bg-coral text-ink-deep";
          if (revealed && !isAnswer && !isPicked) state = "border-line bg-transparent opacity-70";

          return (
            <li key={i}>
              <button
                type="button"
                disabled={revealed || !onSelect}
                onClick={() => onSelect?.(i)}
                aria-pressed={isPicked}
                className={`flex w-full touch-manipulation items-center border text-left transition-[background-color,border-color,opacity,transform] duration-200 disabled:cursor-default ${s.option} ${state}`}
              >
                <span
                  className={`grid shrink-0 place-items-center rounded-full font-semibold tabular-nums ${s.badge} ${
                    revealed && (isAnswer || isPicked) ? "bg-ink-deep/15" : "bg-fg/10"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="flex-1">{opt}</span>
                {revealed && isAnswer && <Tick className={s.icon} />}
                {revealed && isPicked && !isAnswer && <Cross className={s.icon} />}
              </button>
            </li>
          );
        })}
      </ol>

      {revealed && showExplanation && (
        <div className={`rise bg-white text-ink ${s.card}`}>
          <p className={s.explain}>{q.explanation}</p>
          {q.trick && (
            <p className={`mt-3 font-semibold ${s.explain}`}>
              <span className="me-1.5 rounded-md bg-marker px-1.5 py-0.5 text-ink-deep">הטריק</span>
              {q.trick}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Tick({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-label="תשובה נכונה" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  );
}

function Cross({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-label="תשובה שגויה" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function AudioBlock({ passageId, size }: { passageId: string; size: Size }) {
  const p = usePassage(passageId);
  const s = S[size];
  return (
    <div className={`bg-sunk ${s.card}`}>
      <p className={`mb-3 font-semibold ${s.passageTitle}`}>{p.title}</p>
      {p.image && <Image src={p.image} alt="" width={1024} height={768} className="mx-auto mb-4 h-auto w-full max-w-sm" />}
      <audio controls preload="metadata" src={p.audio} className="w-full" />
    </div>
  );
}

function PassageBlock({
  q,
  size,
  revealed,
}: {
  q: Extract<Question, { type: "reading" }>;
  size: Size;
  revealed: boolean;
}) {
  const p = usePassage(q.passageId);
  const s = S[size];
  // On the recording stage, show only the referenced paragraph so it fits
  const shown =
    size === "stage" && q.paragraph
      ? [{ n: q.paragraph, text: p.paragraphs[q.paragraph - 1] }]
      : p.paragraphs.map((text, i) => ({ n: i + 1, text }));

  return (
    <div
      dir="ltr"
      className={`bg-sunk text-left ${s.card} ${size === "app" ? "max-h-[40vh] overflow-y-auto" : ""}`}
    >
      <p className={`mb-3 font-semibold ${s.passageTitle}`}>{p.title}</p>
      <div className={`flex flex-col gap-3 ${s.passage}`}>
        {shown.map(({ n, text }) => (
          <p
            key={n}
            className={`flex gap-3 ${q.paragraph && q.paragraph !== n ? "opacity-45" : "opacity-90"}`}
          >
            <span className="shrink-0 font-semibold tabular-nums opacity-70">{n}</span>
            <span>{highlight(text, q.keywords, revealed)}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

/** Typed answer for word formation: the base word, the sentence with a blank, and one input */
export function WordFormationView({
  q,
  value,
  onChange,
}: {
  q: WordFormationQuestion;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm leading-relaxed opacity-80">
        כתבו מילה אחת שמשלימה את המשפט. מילת הבסיס מופיעה למעלה. שימו לב לאיות ולדקדוק.
      </p>
      <div className="rounded-3xl bg-sunk p-5">
        <p className="text-sm opacity-70">מילת הבסיס</p>
        <p dir="ltr" className="mt-1 text-left text-xl font-bold">{q.baseWord}</p>
        <p dir="ltr" className="mt-4 text-left text-xl font-medium leading-snug text-balance sm:text-2xl">{q.stem}</p>
      </div>
      <input
        dir="ltr"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
        aria-label="המילה שיצרתם"
        className="w-full rounded-2xl border border-line bg-white px-4 py-3.5 text-lg text-ink outline-none transition-colors focus:border-fg focus:ring-2 focus:ring-fg/15"
      />
    </div>
  );
}

export function TypeLabel({ q, size = "app" }: { q: { type: QuestionType }; size?: Size }) {
  const t = TYPE_LABELS[q.type];
  return (
    <span className={`inline-flex items-baseline gap-2 font-medium opacity-70 ${S[size].label}`}>
      <span>{t.he}</span>
      {/* The recording header is too narrow for both names */}
      {size === "app" && (
        <span dir="ltr" className="opacity-70">
          {t.en}
        </span>
      )}
    </span>
  );
}
