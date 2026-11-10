import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { Stem } from "@/components/Stem";
import { LtrWords } from "@/components/LtrWords";
import { passages, type Question } from "@/content/questions";
import { NITE_PRACTICE_TEST_URL, sampleTestCopy as t } from "@/content/seoPages";
import { buildFreeSet } from "@/lib/practice";
import { CARD } from "@/lib/ui";

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.description,
  alternates: { canonical: "/sample-test" },
};

const LETTERS = ["A", "B", "C", "D"];

// Server-rendered on purpose: the answer sits in a <details>, so it works without JS and search engines read it
function SampleQuestion({ q, n }: { q: Question; n: number }) {
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

export default function SampleTestPage() {
  // The same 5 questions the free practice shows: already public, no paid content leaks
  const free = buildFreeSet();
  const byType = (type: Question["type"]) => free.filter((q) => q.type === type);
  const reading = byType("reading");
  const passage = passages.find((p) => reading[0] && "passageId" in reading[0] && p.id === reading[0].passageId);
  let n = 0;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-4 sm:px-6">
      <BreadcrumbJsonLd
        trail={[
          { name: "מה צריך לדעת על אמירנט", path: "/amirnet" },
          { name: t.title, path: "/sample-test" },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
        <mark className="pink">{t.title}</mark>
      </h1>
      <p className="mt-3 max-w-xl leading-relaxed opacity-80">{t.intro}</p>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">{t.structureTitle}</h2>
        <ol className={`${CARD} mt-4 divide-y divide-line !py-1`}>
          {t.structure.map((line) => (
            <li key={line} className="py-3">
              {line}
            </li>
          ))}
        </ol>
        <p className="mt-3 text-sm leading-relaxed opacity-70">
          {t.structureNote}{" "}
          <Link href="/amirnet" className="underline underline-offset-4">
            כל הפרטים על המבחן
          </Link>
        </p>
      </section>

      {(["sentence", "restatement"] as const).map((type) => (
        <section key={type} className="mt-12">
          <h2 className="text-2xl font-bold">{t.sections[type].title}</h2>
          <p className="mt-2 opacity-80">{t.sections[type].hint}</p>
          <ul className="mt-5 grid gap-5">
            {byType(type).map((q) => (
              <SampleQuestion key={q.id} q={q} n={++n} />
            ))}
          </ul>
        </section>
      ))}

      {passage && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold">{t.sections.reading.title}</h2>
          <p className="mt-2 opacity-80">{t.sections.reading.hint}</p>
          <article dir="ltr" className={`${CARD} mt-5 text-left leading-relaxed`}>
            <h3 className="text-lg font-bold">{passage.title}</h3>
            {passage.paragraphs.map((p, i) => (
              <p key={i} className="mt-3">
                <span className="me-2 text-sm opacity-60">({i + 1})</span>
                {p}
              </p>
            ))}
          </article>
          <ul className="mt-5 grid gap-5">
            {reading.map((q) => (
              <SampleQuestion key={q.id} q={q} n={++n} />
            ))}
          </ul>
        </section>
      )}

      <div data-invert="" className="mt-12 rounded-3xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold">{t.ctaTitle}</h2>
        <p className="mt-2 opacity-80">{t.ctaText}</p>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <Link href="/exam" className="inline-flex rounded-full bg-fg px-6 py-3.5 font-semibold text-bg">
            {t.cta}
          </Link>
          <Link href="/start" className="inline-flex min-h-11 items-center text-sm underline underline-offset-4 opacity-80">
            {t.ctaSecondary}
          </Link>
        </div>
      </div>

      <section className="mt-14">
        <h2 className="text-2xl font-bold">{t.faqTitle}</h2>
        <div className="mt-4 divide-y divide-line border-y border-line">
          {t.faq.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {f.q}
                <span aria-hidden="true" className="shrink-0 text-xl opacity-70 group-open:hidden">+</span>
                <span aria-hidden="true" className="hidden shrink-0 text-xl opacity-70 group-open:inline">−</span>
              </summary>
              <p className="mt-2 leading-relaxed opacity-80">{f.a}</p>
            </details>
          ))}
        </div>
        <a
          href={NITE_PRACTICE_TEST_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex min-h-11 items-center text-sm underline underline-offset-4 opacity-80"
        >
          למבחן התרגול הרשמי באתר מאל״ו
        </a>
      </section>
    </main>
  );
}
