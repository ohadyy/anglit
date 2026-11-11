import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { getInstitution, institutions, rangeDir } from "@/content/institutions";
import { NITE_FACTS } from "@/content/facts";
import { CARD } from "@/lib/ui";
import { ArticleCta } from "@/components/ArticleCta";


// Leads with the words people search for (Search Console: "פטור מאנגלית בטכניון")
const headline = (inName: string) => `פטור מאנגלית ${inName}: איזה ציון אמירנט צריך`;

export function generateStaticParams() {
  return institutions.map((i) => ({ slug: i.slug }));
}

async function findInstitution(params: Promise<{ slug: string }>) {
  const { slug } = await params;
  return getInstitution(slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const inst = await findInstitution(params);
  if (!inst) return { title: "מוסד לימודים" };
  return {
    title: headline(inst.inName),
    description: `${inst.answer} טבלת הרמות המלאה, מהמקור הרשמי של המוסד.`,
    alternates: { canonical: `/amirnet/${inst.slug}` },
  };
}

export default async function InstitutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const inst = await findInstitution(params);
  if (!inst) notFound();
  const others = institutions.filter((i) => i.slug !== inst.slug);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `איזה ציון אמירנט צריך לפטור מאנגלית ${inst.inName}?`,
        acceptedAnswer: { "@type": "Answer", text: inst.answer },
      },
    ],
  };

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-4 sm:px-6">
      <BreadcrumbJsonLd
        trail={[
          { name: "מה צריך לדעת על אמירנט", path: "/amirnet" },
          { name: inst.name, path: `/amirnet/${inst.slug}` },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Link href="/amirnet" className="inline-flex min-h-11 items-center text-sm underline underline-offset-4 opacity-70">
        מה צריך לדעת על אמירנט
      </Link>

      <h1 className="font-display mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
        <mark className="pink">{headline(inst.inName)}</mark>
      </h1>
      <p className="mt-4 max-w-xl text-lg leading-relaxed">{inst.answer}</p>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">הרמות לפי הציון</h2>
        <ul className={`${CARD} mt-4 divide-y divide-line !py-1`}>
          {inst.bands.map((b) => (
            <li key={b.range} className="flex items-start justify-between gap-3 py-3">
              <span>
                <span className="font-semibold">{b.level}</span>
                {b.note && <span className="block text-sm opacity-70">{b.note}</span>}
              </span>
              <span className="shrink-0 text-sm tabular-nums opacity-80">
                <bdi dir={rangeDir(b.range)}>{b.range}</bdi>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">מה עוד כדאי לדעת</h2>
        <ul className="mt-4 grid gap-3">
          {inst.facts.map((f) => (
            <li key={f} className="flex gap-2.5 leading-relaxed">
              <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-fg" />
              <span className="opacity-90">{f}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm leading-relaxed opacity-70">
          המידע נלקח מ
          <a href={inst.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
            {inst.sourceLabel}
          </a>
          , ונבדק ב-{inst.checkedAt}. כל מוסד משנה את הכללים מדי פעם, ולכן לפני שמחליטים כדאי לבדוק שוב בדף המוסד.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">ומה הציון שלכם?</h2>
        <p className="mt-3 leading-relaxed opacity-80">
          הזיזו את הסמן ב<Link href="/score" className="underline underline-offset-4">מחשבון הציון</Link> ותראו לאיזו רמה תשובצו, או בדקו{" "}
          <Link href="/exam-dates" className="underline underline-offset-4">מתי יש מבחן פנוי</Link>. בין מבחן למבחן צריך לעבור {NITE_FACTS.minDaysBetweenTests} יום, ולכן
          כדאי לתכנן מראש.
        </p>
      </section>

      <ArticleCta title="רוצים להגיע למבחן מוכנים?" className="mt-12" />

      <section className="mt-12">
        <h2 className="text-lg font-bold">מוסדות אחרים</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={`/amirnet/${o.slug}`} className="inline-flex min-h-11 items-center rounded-full border border-fg/25 px-4 text-sm hover:bg-fg/5">
                {o.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
