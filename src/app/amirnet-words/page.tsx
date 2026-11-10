import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { vocabCategories } from "@/content/vocabulary";
import { PUBLIC_WORD_COUNT, wordsCopy as t } from "@/content/seoPages";
import { approvedWords } from "@/lib/vocab";
import { site } from "@/lib/site";
import { CARD } from "@/lib/ui";

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.description,
  alternates: { canonical: "/amirnet-words" },
};


export default function AmirnetWordsPage() {
  const all = approvedWords();
  // ponytail: a fixed slice of the bank is public; the owner can raise PUBLIC_WORD_COUNT in seoPages.ts
  const words = all.slice(0, PUBLIC_WORD_COUNT);

  const termsJsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: t.title,
    url: `${site.url}/amirnet-words`,
    inLanguage: ["en", "he"],
    hasDefinedTerm: words.map((w) => ({ "@type": "DefinedTerm", name: w.word, description: w.translation })),
  };

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-4 sm:px-6">
      <BreadcrumbJsonLd trail={[{ name: t.title, path: "/amirnet-words" }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(termsJsonLd) }} />

      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
        <mark className="pink">{t.title}</mark>
      </h1>
      <p className="mt-3 max-w-xl leading-relaxed opacity-80">{t.intro}</p>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">{t.howTitle}</h2>
        <ul className="mt-4 grid gap-3">
          {t.how.map((line) => (
            <li key={line} className="flex gap-2.5 leading-relaxed">
              <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-fg" />
              <span className="opacity-90">{line}</span>
            </li>
          ))}
        </ul>
      </section>

      {vocabCategories.map((cat) => {
        const inCat = words.filter((w) => w.category === cat.id);
        if (!inCat.length) return null;
        return (
          <section key={cat.id} className="mt-12">
            <h2 className="text-2xl font-bold">{cat.label}</h2>
            <dl className={`${CARD} mt-4 divide-y divide-line !py-1`}>
              {inCat.map((w) => (
                <div key={w.id} className="py-3">
                  <dt className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <span dir="ltr" className="text-lg font-semibold">
                      {w.word}
                    </span>
                    <span className="opacity-90">{w.translation}</span>
                  </dt>
                  <dd dir="ltr" className="mt-1 text-left text-sm opacity-70">
                    {w.example}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        );
      })}

      <div data-invert="" className="mt-12 rounded-3xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold">{t.trainerTitle}</h2>
        <p className="mt-2 opacity-80">{t.trainerText(all.length)}</p>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <Link href="/vocabulary" className="inline-flex rounded-full bg-fg px-6 py-3.5 font-semibold text-bg">
            {t.trainerCta}
          </Link>
          <Link href="/practice/words" className="inline-flex min-h-11 items-center text-sm underline underline-offset-4 opacity-80">
            {t.gameCta}
          </Link>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-bold">{t.moreTitle}</h2>
        <ul className="mt-3 grid gap-2">
          <li>
            <Link href="/learn/connectors" className="inline-flex min-h-11 items-center underline underline-offset-4">
              מילות קישור באמירנט: שיעור קצר ותרגול
            </Link>
          </li>
          <li>
            <Link href="/learn/affixes" className="inline-flex min-h-11 items-center underline underline-offset-4">
              תחיליות וסופיות: לנחש מילה שלא מכירים
            </Link>
          </li>
          <li>
            <Link href="/blog/tips-hashlamat-mishpatim" className="inline-flex min-h-11 items-center underline underline-offset-4">
              איך לפתור שאלות השלמת משפטים
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
