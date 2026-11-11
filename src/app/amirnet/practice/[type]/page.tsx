import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { SampleQuestion } from "@/components/SampleQuestion";
import { ArticleCta } from "@/components/ArticleCta";
import { TYPE_PAGE_QUESTIONS, typePracticePages } from "@/content/seoPages";
import { buildFreeSet, buildSingleStemPool } from "@/lib/practice";

const getPage = (slug: string) => typePracticePages.find((p) => p.slug === slug);

export function generateStaticParams() {
  return typePracticePages.map((p) => ({ type: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/amirnet/practice/[type]">): Promise<Metadata> {
  const page = getPage((await params).type);
  if (!page) return { title: "תרגול" };
  return { title: page.metaTitle, description: page.description, alternates: { canonical: `/amirnet/practice/${page.slug}` } };
}

export default async function TypePracticePage({ params }: PageProps<"/amirnet/practice/[type]">) {
  const page = getPage((await params).type);
  if (!page) notFound();
  // The single-stem pool already ships to every visitor of the question of the day, so nothing paid leaks.
  // The free-sample questions are skipped: they already live on /sample-test.
  const freeIds = new Set(buildFreeSet().map((q) => q.id));
  const shown = buildSingleStemPool()
    .filter((q) => q.type === page.type && !freeIds.has(q.id))
    .slice(0, TYPE_PAGE_QUESTIONS);
  const others = typePracticePages.filter((p) => p.slug !== page.slug);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-4 sm:px-6">
      <BreadcrumbJsonLd
        trail={[
          { name: "מה צריך לדעת על אמירנט", path: "/amirnet" },
          { name: `תרגול ${page.name}`, path: `/amirnet/practice/${page.slug}` },
        ]}
      />
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
        <mark className="pink">תרגול {page.name} לאמירנט</mark>
      </h1>
      <p className="mt-3 max-w-xl leading-relaxed opacity-80">{page.intro}</p>
      <p className="mt-3 text-sm leading-relaxed opacity-70">
        כל השאלות מקוריות ונכתבו אצלנו באותו פורמט של המבחן. רוצים קודם את השיטה?{" "}
        <Link href={`/blog/${page.tipsSlug}`} className="underline underline-offset-4">
          {page.tipsLabel}
        </Link>
      </p>

      <ul className="mt-8 grid gap-5">
        {shown.map((q, i) => (
          <SampleQuestion key={q.id} q={q} n={i + 1} />
        ))}
      </ul>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">להמשיך לתרגל</h2>
        <ul className="mt-3 grid gap-2">
          <li>
            <Link href="/exam" className="inline-flex min-h-11 items-center underline underline-offset-4">
              סימולציה חינם של מבחן שלם, בתזמון של אמירנט
            </Link>
          </li>
          <li>
            <Link href="/practice/daily" className="inline-flex min-h-11 items-center underline underline-offset-4">
              שאלת היום: שאלה אחת חדשה כל יום
            </Link>
          </li>
          <li>
            <Link href="/sample-test" className="inline-flex min-h-11 items-center underline underline-offset-4">
              מבחן אמירנט לדוגמה, מכל סוגי השאלות
            </Link>
          </li>
          {others.map((p) => (
            <li key={p.slug}>
              <Link href={`/amirnet/practice/${p.slug}`} className="inline-flex min-h-11 items-center underline underline-offset-4">
                תרגול {p.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <ArticleCta title="רוצים לתרגל עם מורה?" className="mt-12" />
    </main>
  );
}
