import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import Link from "next/link";
import { privateTutorCopy as t } from "@/content/privateTutor";
import { getProduct } from "@/content/pricingCopy";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: t.seoTitle,
  description: t.seoDescription,
  alternates: { canonical: "/private-tutor" },
};

const CARD = "rounded-3xl border border-line bg-white p-5 shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] sm:p-6";

export default function PrivateTutorPage() {
  const course = getProduct("course");
  const privateLessons = getProduct("private");

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "7 ימים לאמירנט",
    provider: { "@type": "EducationalOrganization", name: "Anglit", url: site.url },
    description: t.intro,
    offers: { "@type": "Offer", priceCurrency: "ILS", price: course?.price },
  };

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-4 sm:px-6">
      <BreadcrumbJsonLd trail={[{ name: "מורה פרטי לאמירנט", path: "/private-tutor" }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <p className="font-hand text-2xl opacity-70">{t.eyebrow}</p>
      <h1 className="font-display mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
        <mark className="pink">{t.title}</mark>
      </h1>
      <p className="mt-3 max-w-xl leading-relaxed opacity-80">{t.intro}</p>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">{t.whyPrivateTitle}</h2>
        <ul className="mt-4 grid gap-3">
          {t.whyPrivate.map((line) => (
            <li key={line} className="flex gap-2.5 leading-relaxed">
              <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-fg" />
              <span className="opacity-90">{line}</span>
            </li>
          ))}
        </ul>
      </section>

      <div data-invert="" className="mt-12 rounded-3xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold">{t.courseTitle}</h2>
        <p className="mt-2 opacity-80">{t.courseText}</p>
        <p className="mt-4 text-4xl font-bold tracking-tight">
          {course?.price} <span className="text-base font-normal opacity-70">₪ {course?.priceUnit}</span>
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <Link href="/checkout?product=course" className="inline-flex rounded-full bg-fg px-6 py-3.5 font-semibold text-bg">
            {t.courseCta}
          </Link>
          <Link href="/practice" className="inline-flex min-h-11 items-center text-sm underline underline-offset-4 opacity-80">
            לתרגול חינם
          </Link>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">{t.oneOnOneTitle}</h2>
        <p className="mt-3 leading-relaxed opacity-80">{t.oneOnOne}</p>
        {privateLessons && (
          <Link href="/pricing" className="mt-4 inline-flex min-h-11 items-center rounded-full border border-fg/25 px-6 font-semibold hover:bg-fg/5">
            {t.oneOnOneCta}
          </Link>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">שאלות נפוצות</h2>
        <div className="mt-5 grid gap-4">
          {t.faq.map((item) => (
            <div key={item.q} className={CARD}>
              <p className="font-semibold">{item.q}</p>
              <p className="mt-1.5 leading-relaxed opacity-80">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
