import type { Metadata } from "next";
import Link from "next/link";
import { connectorsLesson as c } from "@/content/connectorsLesson";
import { questions } from "@/content/questions";
import { TryIt } from "@/components/TryIt";

export const metadata: Metadata = {
  title: c.seoTitle,
  description: c.seoDescription,
  alternates: { canonical: "/learn/connectors" },
};

const CARD = "rounded-3xl border border-line bg-white p-5 shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] sm:p-6";

// One sentence question (the although/despite trap) and one restatement
const SAMPLE_IDS = ["cn-08", "cn-21"];

export default function ConnectorsLessonPage() {
  const sample = SAMPLE_IDS.map((id) => questions.find((q) => q.id === id)!);
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-8 sm:px-6">
      <h1 className="font-display text-[1.85rem] leading-[1.25] font-bold tracking-tight sm:text-4xl">
        <mark className="pink">{c.title}</mark>
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed opacity-80">{c.intro}</p>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">{c.groupsTitle}</h2>
        <ul className="mt-4 grid gap-3">
          {c.groups.map((g) => (
            <li key={g.role} className={CARD}>
              <h3 className="font-bold">{g.role}</h3>
              <p dir="ltr" className="mt-2 text-left leading-relaxed">{g.words}</p>
              <p className="mt-2 text-sm leading-relaxed opacity-75">{g.meaning}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">{c.trapsTitle}</h2>
        <ol className="mt-4 grid gap-3">
          {c.traps.map((t, i) => (
            <li key={t} className="flex gap-3 leading-relaxed">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-fg text-sm font-bold text-bg">{i + 1}</span>
              <span>{t}</span>
            </li>
          ))}
        </ol>
      </section>

      <section data-invert="" className="mt-12 rounded-3xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold">{c.trickTitle}</h2>
        <ol className="mt-4 grid gap-3">
          {c.trick.map((t, i) => (
            <li key={t} className="flex gap-3 leading-relaxed">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-marker text-sm font-bold text-ink-deep">{i + 1}</span>
              <span>{t}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">{c.tryTitle}</h2>
        <p className="mt-2 opacity-80">{c.tryText}</p>
        <div className="mt-5">
          <TryIt questions={sample} />
        </div>
      </section>

      <section className={`${CARD} mt-12`}>
        <h2 className="text-xl font-bold">{c.ctaTitle}</h2>
        <p className="mt-2 leading-relaxed opacity-80">{c.ctaText}</p>
        <Link
          href="/practice?type=connectors"
          className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-fg px-6 py-3.5 font-semibold text-bg transition-opacity hover:opacity-85"
        >
          {c.ctaButton}
        </Link>
        <p className="mt-3 text-sm opacity-60">{c.ctaNote}</p>
      </section>
    </main>
  );
}
