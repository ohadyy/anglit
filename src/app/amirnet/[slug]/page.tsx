import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { getInstitution, institutions } from "@/content/institutions";

const CARD = "rounded-3xl border border-line bg-white p-5 shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] sm:p-6";

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
    title: `איזה ציון אמירנט צריך ${inst.inName}`,
    description: `${inst.answer} הטבלה המלאה של הרמות, מהמקור הרשמי של המוסד.`,
    alternates: { canonical: `/amirnet/${inst.slug}` },
  };
}

export default async function InstitutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const inst = await findInstitution(params);
  if (!inst) notFound();
  const others = institutions.filter((i) => i.slug !== inst.slug);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-4 sm:px-6">
      <BreadcrumbJsonLd
        trail={[
          { name: "מה צריך לדעת על אמירנט", path: "/amirnet" },
          { name: inst.name, path: `/amirnet/${inst.slug}` },
        ]}
      />
      <Link href="/amirnet" className="inline-flex min-h-11 items-center text-sm underline underline-offset-4 opacity-70">
        מה צריך לדעת על אמירנט
      </Link>

      <h1 className="font-display mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
        <mark className="pink">איזה ציון אמירנט צריך {inst.inName}</mark>
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
                <bdi dir="ltr">{b.range}</bdi>
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
          <Link href="/exam-dates" className="underline underline-offset-4">מתי יש מבחן פנוי</Link>. בין מבחן למבחן צריך לעבור 35 יום, ולכן
          כדאי לתכנן מראש.
        </p>
      </section>

      <div data-invert="" className="mt-12 rounded-3xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold">רוצים להגיע למבחן מוכנים?</h2>
        <p className="mt-2 opacity-80">שבוע אחד בקבוצה קטנה עם מורה אמיתי, ותרגול יומי עם הסבר לכל שאלה.</p>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <Link href="/pricing" className="inline-flex rounded-full bg-fg px-6 py-3.5 font-semibold text-bg">
            לכל המסלולים והמחירים
          </Link>
          <Link href="/practice" className="inline-flex min-h-11 items-center text-sm underline underline-offset-4 opacity-80">
            לתרגול חינם
          </Link>
        </div>
      </div>

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
