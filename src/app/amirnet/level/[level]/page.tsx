import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { ArticleCta } from "@/components/ArticleCta";
import { institutions, rangeDir } from "@/content/institutions";
import { getLevelPage, levelPages, levelRange } from "@/content/levelPages";
import { NITE_FACTS } from "@/content/facts";
import { CARD } from "@/lib/ui";

export function generateStaticParams() {
  return levelPages.map((l) => ({ level: l.slug }));
}

const headline = (name: string) => `${name} באנגלית: איזה ציון זה, וכמה קורסים נשארו`;

export async function generateMetadata({ params }: PageProps<"/amirnet/level/[level]">): Promise<Metadata> {
  const page = getLevelPage((await params).level);
  if (!page) return { title: "רמת אנגלית" };
  return {
    title: headline(page.name),
    description: page.answer,
    alternates: { canonical: `/amirnet/level/${page.slug}` },
  };
}

export default async function LevelPage({ params }: PageProps<"/amirnet/level/[level]">) {
  const page = getLevelPage((await params).level);
  if (!page) notFound();
  const { min, max, courses } = levelRange(page);
  // Every institution that prints this level, with its own range and notes
  const rows = institutions.flatMap((i) => i.bands.filter(page.matches).map((b) => ({ inst: i, band: b })));

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { q: `באיזה ציון אמירנט משבצים ל${page.name}?`, a: page.answer },
      {
        q: `אפשר לדלג על ${page.name}?`,
        a: `כן, עם ציון חדש וגבוה יותר באמירנט. בין מבחן למבחן צריך לעבור לפחות ${NITE_FACTS.minDaysBetweenTests} יום, ובחלק מהמוסדות אפשר להיבחן שוב גם במהלך התואר ולשנות את הרמה.`,
      },
    ].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-4 sm:px-6">
      <BreadcrumbJsonLd
        trail={[
          { name: "מה צריך לדעת על אמירנט", path: "/amirnet" },
          { name: page.name, path: `/amirnet/level/${page.slug}` },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Link href="/amirnet" className="inline-flex min-h-11 items-center text-sm underline underline-offset-4 opacity-70">
        מה צריך לדעת על אמירנט
      </Link>

      <h1 className="font-display mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
        <mark className="pink">{headline(page.name)}</mark>
      </h1>
      <p className="mt-4 max-w-xl text-lg leading-relaxed">{page.answer}</p>

      <ul className={`${CARD} mt-8 grid gap-3 sm:grid-cols-3`}>
        <li>
          <p className="text-sm opacity-70">הטווח הנפוץ</p>
          <p className="text-2xl font-bold tabular-nums">
            <bdi dir="ltr">
              {min}–{max}
            </bdi>
          </p>
        </li>
        <li>
          <p className="text-sm opacity-70">קורסים עד הפטור</p>
          <p className="text-2xl font-bold tabular-nums">
            <bdi dir="ltr">{courses}</bdi>
          </p>
        </li>
        <li>
          <p className="text-sm opacity-70">נקודות עד הפטור</p>
          <p className="text-2xl font-bold tabular-nums">
            <bdi dir="ltr">
              {NITE_FACTS.exemptionScore - max}–{NITE_FACTS.exemptionScore - min}
            </bdi>
          </p>
        </li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed opacity-70">כל מוסד קובע בעצמו את הטווחים ואת מספר הקורסים, ולכן כדאי לבדוק מול המוסד שלכם.</p>

      {rows.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-bold">{page.name} בכל מוסד</h2>
          <ul className={`${CARD} mt-4 divide-y divide-line !py-1`}>
            {rows.map(({ inst, band }) => (
              <li key={inst.slug + band.level} className="flex items-start justify-between gap-3 py-3">
                <span>
                  <Link href={`/amirnet/${inst.slug}`} className="font-semibold underline underline-offset-4">
                    {inst.name}
                  </Link>
                  {band.note && <span className="block text-sm opacity-70">{band.note}</span>}
                </span>
                <span className="shrink-0 text-sm tabular-nums opacity-80">
                  <bdi dir={rangeDir(band.range)}>{band.range}</bdi>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-2xl font-bold">מה משתנה אם עולים רמה</h2>
        <p className="mt-3 leading-relaxed opacity-80">{page.next}</p>
        <p className="mt-3 leading-relaxed opacity-80">
          רוצים לראות מה כל ציון נותן? ב<Link href="/score" className="underline underline-offset-4">מחשבון הציון</Link> מזיזים את הסמן ורואים
          את הרמה ואת מספר הקורסים. כדי לדעת מאיפה אתם מתחילים, יש{" "}
          <Link href="/exam" className="underline underline-offset-4">סימולציה חינם</Link> באותו מבנה של המבחן.
        </p>
      </section>

      <ArticleCta title="רוצים לעלות רמה לפני התואר?" className="mt-12" />

      <section className="mt-12">
        <h2 className="text-lg font-bold">רמות אחרות</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {levelPages
            .filter((l) => l.slug !== page.slug)
            .map((l) => (
              <li key={l.slug}>
                <Link href={`/amirnet/level/${l.slug}`} className="inline-flex min-h-11 items-center rounded-full border border-fg/25 px-4 text-sm hover:bg-fg/5">
                  {l.name}
                </Link>
              </li>
            ))}
        </ul>
      </section>
    </main>
  );
}
