import { Stem } from "@/components/Stem";
import { LtrWords } from "@/components/LtrWords";
import type { Question } from "@/content/questions";
import { sampleTestCopy as t } from "@/content/seoPages";
import { CARD } from "@/lib/ui";

const LETTERS = ["A", "B", "C", "D"];

// Server-rendered on purpose: the answer sits in a <details>, so it works without JS and search engines read it
export function SampleQuestion({ q, n }: { q: Question; n: number }) {
  return (
    <li className={CARD}>
      <p className="text-sm font-semibold opacity-70">שאלה {n}</p>
      <p dir="ltr" className="mt-2 text-left text-lg leading-relaxed">
        <Stem text={q.stem} revealed={false} />
      </p>
      <ol dir="ltr" className="mt-4 grid gap-2 text-left">
        {q.options.map((o, i) => (
          <li key={i} className="flex gap-3 rounded-2xl border border-line px-4 py-3">
            <span className="font-semibold">{LETTERS[i]}.</span>
            <span>{o}</span>
          </li>
        ))}
      </ol>
      <details className="group mt-4">
        <summary className="inline-flex min-h-11 cursor-pointer list-none items-center rounded-full border border-fg/25 px-5 font-semibold hover:bg-fg/5">
          {t.reveal}
        </summary>
        <div className="mt-4 grid gap-2 leading-relaxed">
          <p>
            <span className="font-semibold">{t.correctLabel}</span>{" "}
            <bdi dir="ltr">
              {LETTERS[q.answer]}. {q.options[q.answer]}
            </bdi>
          </p>
          <p className="opacity-90">
            <LtrWords text={q.explanation} />
          </p>
          {q.trick && (
            <p className="font-hand text-xl opacity-80">
              <LtrWords text={q.trick} />
            </p>
          )}
        </div>
      </details>
    </li>
  );
}
