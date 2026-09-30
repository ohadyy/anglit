import Link from "next/link";
import { Wordmark } from "@/components/Logo";
import { HeroDemo } from "@/components/HeroDemo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { copy } from "@/content/copy";
import { questions, TYPE_LABELS } from "@/content/questions";
import { TYPES } from "@/lib/practice";
import { site } from "@/lib/site";

// Draft week plan — to be finalized by the teacher
const WEEK = [
  { day: "יום 1", title: "מבחן פתיחה ומפגש זום ראשון", note: "יודעים בדיוק מאיפה מתחילים" },
  { day: "יום 2", title: "השלמת משפטים", note: "מילות מפתח, ניגוד וסיבה ותוצאה" },
  { day: "יום 3", title: "תרגול עצמי באתר", note: "סט ממוקד לפי מה שיצא לכם במבחן הפתיחה" },
  { day: "יום 4", title: "ניסוח מחדש", note: "איך מזהים את המסיח שהופך את המשמעות" },
  { day: "יום 5", title: "הבנת הנקרא", note: "לענות בלי לקרוא כל מילה" },
  { day: "יום 6", title: "סימולציה מלאה", note: "בזמן אמת, בתנאי מבחן" },
  { day: "יום 7", title: "מבחן סיום ואסטרטגיה ליום המבחן", note: "רואים כמה עליתם" },
];

const EXAMPLES: Record<(typeof TYPES)[number], string> = {
  sentence: "The drought had a ____ effect on the region's economy…",
  restatement: "Had the bridge been inspected regularly, the accident…",
  reading: "According to paragraph 1, why do cities stay hot at night?",
};

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5">
        <Wordmark className="h-7 w-auto sm:h-8" />
        <nav className="flex items-center gap-2 text-sm font-medium">
          <a
            href={site.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full px-4 py-2 hover:bg-fg/5 sm:block"
          >
            <bdi dir="ltr">@{site.handle}</bdi>
          </a>
          <ThemeToggle />
          <Link href="/practice" className="rounded-full bg-fg px-5 py-2.5 text-bg">
            תרגול חינם
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-6 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-20 lg:pt-14">
          <div>
            <p className="text-sm font-semibold opacity-70">{copy.heroEyebrow}</p>
            <h1 className="mt-3 text-[2.5rem] font-bold leading-[1.08] tracking-tight text-balance sm:text-6xl">
              {copy.heroTitle}
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed opacity-80">{copy.heroSub}</p>
            <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap">
              <Link
                href="/practice"
                className="rounded-full bg-fg px-7 py-4 text-center font-semibold text-bg sm:py-3.5"
              >
                {copy.heroCta1}
              </Link>
              <a
                href={site.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-fg/25 px-7 py-4 text-center font-semibold hover:bg-fg/5 sm:py-3.5"
              >
                {copy.heroCta2}
              </a>
            </div>
            <p className="mt-5 text-sm opacity-60">{copy.heroNote}</p>
          </div>

          <HeroDemo />
        </section>

        {/* Week */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <h2 className="text-3xl font-bold sm:text-4xl">{copy.weekTitle}</h2>
            <p className="mt-3 max-w-xl opacity-75">{copy.weekSub}</p>
            <ol className="mt-8 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-7">
              {WEEK.map((d, i) => {
                const edge = i === 0 || i === WEEK.length - 1;
                return (
                  <li
                    key={d.day}
                    {...(edge ? { "data-invert": "" } : {})}
                    className={`flex flex-col gap-1.5 p-5 ${edge ? "" : "bg-raise"}`}
                  >
                    <span className="text-xs font-semibold opacity-60">{d.day}</span>
                    <span className="font-semibold leading-snug">{d.title}</span>
                    <span className="text-sm opacity-70">{d.note}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* Question types */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <h2 className="text-3xl font-bold sm:text-4xl">{copy.typesTitle}</h2>
            <div className="mt-8 grid gap-3 md:grid-cols-3 md:gap-4">
              {TYPES.map((t) => (
                <Link
                  key={t}
                  href={`/practice?type=${t}`}
                  className="group flex flex-col rounded-3xl border border-line bg-raise p-6 transition-colors hover:border-fg/30"
                >
                  <span className="text-xl font-bold">{TYPE_LABELS[t].he}</span>
                  <span dir="ltr" className="text-left text-sm opacity-50">
                    {TYPE_LABELS[t].en}
                  </span>
                  <p dir="ltr" className="mt-5 flex-1 text-left leading-relaxed opacity-80">
                    {EXAMPLES[t]}
                  </p>
                  <span className="mt-6 text-sm font-semibold opacity-70 group-hover:opacity-100">
                    {questions.filter((q) => q.type === t).length} שאלות לתרגול ←
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section className="border-t border-line">
          <div className="mx-auto grid max-w-6xl gap-4 px-4 py-16 sm:px-6 sm:py-20 md:grid-cols-[1fr_2fr]">
            <h2 className="text-3xl font-bold sm:text-4xl">{copy.aboutTitle}</h2>
            <p className="max-w-2xl text-lg leading-relaxed opacity-80">{copy.aboutText}</p>
          </div>
        </section>

        {/* Guarantee */}
        <section data-invert="">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <p className="text-sm font-semibold opacity-60">{copy.guaranteeEyebrow}</p>
            <h2 className="mt-3 max-w-3xl text-[2rem] font-bold leading-tight text-balance sm:text-5xl">
              {copy.guaranteeTitle}
            </h2>
            <p className="mt-5 max-w-xl opacity-70">{copy.guaranteeTerms}</p>
            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex rounded-full bg-fg px-7 py-4 font-semibold text-bg sm:py-3.5"
            >
              {copy.guaranteeCta}
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm opacity-60 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>© {new Date().getFullYear()} Anglit</span>
          <span>{copy.footerDisclaimer}</span>
        </div>
      </footer>
    </div>
  );
}
