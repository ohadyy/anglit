import type { Metadata } from "next";
import Link from "next/link";
import { affixesLesson as a } from "@/content/affixesLesson";
import { affixQuestions } from "@/content/affixesBank";
import { TryIt } from "@/components/TryIt";

export const metadata: Metadata = {
  title: a.seoTitle,
  description: a.seoDescription,
  alternates: { canonical: "/learn/affixes" },
};

const CARD = "rounded-3xl border border-line bg-white p-5 shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] sm:p-6";

// One word-form question and one guess-the-meaning question
const SAMPLE_IDS = ["af-04", "af-11"];

type Row = { role: string; affixes: string; examples: string };

function AffixCards({ rows }: { rows: Row[] }) {
  return (
    <ul className="mt-4 grid gap-3">
      {rows.map((r) => (
        <li key={r.role} className={CARD}>
          <h3 className="font-bold">{r.role}</h3>
          <p dir="ltr" className="mt-2 text-left font-semibold leading-relaxed">{r.affixes}</p>
          <p dir="ltr" className="mt-1 text-left text-sm leading-relaxed opacity-75">{r.examples}</p>
        </li>
      ))}
    </ul>
  );
}

export default function AffixesLessonPage() {
  const sample = SAMPLE_IDS.map((id) => affixQuestions.find((q) => q.id === id)!);
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-8 sm:px-6">
      <h1 className="font-display text-[1.85rem] leading-[1.25] font-bold tracking-tight sm:text-4xl">
        <mark className="pink">{a.title}</mark>
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed opacity-80">{a.intro}</p>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">{a.prefixesTitle}</h2>
        <AffixCards rows={a.prefixes} />
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">{a.suffixesTitle}</h2>
        <AffixCards rows={a.suffixes} />
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">{a.trapsTitle}</h2>
        <ol className="mt-4 grid gap-3">
          {a.traps.map((t, i) => (
            <li key={t} className="flex gap-3 leading-relaxed">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-fg text-sm font-bold text-bg">{i + 1}</span>
              <span>{t}</span>
            </li>
          ))}
        </ol>
      </section>

      <section data-invert="" className="mt-12 rounded-3xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold">{a.trickTitle}</h2>
        <ol className="mt-4 grid gap-3">
          {a.trick.map((t, i) => (
            <li key={t} className="flex gap-3 leading-relaxed">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-marker text-sm font-bold text-ink-deep">{i + 1}</span>
              <span>{t}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">{a.tryTitle}</h2>
        <p className="mt-2 opacity-80">{a.tryText}</p>
        <div className="mt-5">
          <TryIt questions={sample} />
        </div>
      </section>

      <section className={`${CARD} mt-12`}>
        <h2 className="text-xl font-bold">{a.ctaTitle}</h2>
        <p className="mt-2 leading-relaxed opacity-80">{a.ctaText}</p>
        <Link
          href="/practice?type=affixes"
          className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-fg px-6 py-3.5 font-semibold text-bg transition-opacity hover:opacity-85"
        >
          {a.ctaButton}
        </Link>
        <p className="mt-3 text-sm opacity-60">{a.ctaNote}</p>
      </section>
    </main>
  );
}
