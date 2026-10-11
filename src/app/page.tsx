import Image from "next/image";
import Link from "next/link";
import { HeroDecor } from "@/components/HeroDecor";
import { HeroDemo } from "@/components/HeroDemo";
import { copy, homeFaqGroups, homeFeatures } from "@/content/copy";
import { examDatesCopy } from "@/content/examDates";
import { questions, TYPE_LABELS } from "@/content/questions";
import { TYPES } from "@/lib/practice";

const EXAMPLES: Record<(typeof TYPES)[number], string> = {
  sentence: "The drought had a ____ effect on the region's economy…",
  restatement: "Had the bridge been inspected regularly, the accident…",
  reading: "According to paragraph 1, why do cities stay hot at night?",
};

export default function Home() {
  // The hero shows this one question; the server sends it, not the whole bank
  const heroQuestion = questions.find((q) => q.id === "sc-05")!;
  return (
    <div className="flex min-h-dvh flex-col">
      {/* Header + hero share one continuous gradient, so the nav bar doesn't sit on a flat block above it */}
      <div className="hero-mesh relative flex min-h-dvh flex-col">
        <HeroDecor mark="a" font="gevora" />

        <div className="relative z-10 mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center px-4 pb-16 pt-24 text-center sm:px-6">
          <h1
            className="rise text-[2.75rem] font-bold leading-[1.05] tracking-[-0.03em] text-balance sm:text-7xl"
          >
            <mark className="pink">שבוע אחד</mark>, ואתם מוכנים לאמירנט.
          </h1>
          <p className="rise font-hand mt-4 text-2xl opacity-70" style={{ animationDelay: "120ms" }}>
            {copy.heroEyebrow}
          </p>
          <p className="rise mx-auto mt-4 max-w-xl text-lg leading-relaxed opacity-80" style={{ animationDelay: "220ms" }}>
            {copy.heroSub}
          </p>
          <div className="rise mt-8 grid gap-3 sm:flex sm:flex-wrap sm:items-end sm:justify-center" style={{ animationDelay: "320ms" }}>
            <div className="group mascot-land flex w-fit flex-col items-end justify-self-center">
              <div className="mascot-tilt relative z-10 -mb-2 ml-3">
                <Image
                  src="/brand/mascot-hero.webp"
                  alt=""
                  width={50}
                  height={50}
                  className="mascot-bob h-auto w-[40px] sm:w-[50px]"
                />
              </div>
              <Link
                href="/sign-up"
                className="rounded-full bg-fg px-7 py-4 text-center font-semibold text-bg sm:py-3.5"
              >
                {copy.heroCta2}
              </Link>
            </div>
            <Link
              href="/start"
              className="rounded-full border border-fg/25 px-7 py-4 text-center font-semibold hover:bg-fg/5 sm:py-3.5"
            >
              {copy.heroCta1}
            </Link>
          </div>
          <p className="rise mt-5 text-sm opacity-70" style={{ animationDelay: "420ms" }}>
            {copy.heroNote}
          </p>
        </div>
      </div>

      <main className="flex-1">
        {/* Question types + try a question, side by side */}
        <section className="border-t border-line">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
            <div>
              <h2 className="reveal text-3xl font-bold sm:text-4xl">{copy.typesTitle}</h2>
              <div className="mt-8 grid gap-3">
                {TYPES.map((t) => (
                  <Link
                    key={t}
                    href={`/practice?type=${t}`}
                    className="group flex flex-col rounded-3xl border border-line bg-white shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] p-6 transition-colors hover:border-fg/30"
                  >
                    <span className="text-xl font-bold">{TYPE_LABELS[t].he}</span>
                    <span dir="ltr" className="text-left text-sm opacity-70">
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

            <HeroDemo q={heroQuestion} />
          </div>
        </section>

        {/* What's included */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
            <h2 className="reveal text-3xl font-bold sm:text-4xl">{copy.whatsIncludedTitle}</h2>
            <ul className="reveal-fade mt-8 flex flex-col gap-3">
              {homeFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-lg leading-relaxed">
                  <svg viewBox="0 0 20 20" fill="none" className="mt-1 size-5 shrink-0 text-ok">
                    <path
                      d="M4 10.5l3.5 3.5L16 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="opacity-90">{f}</span>
                </li>
              ))}
            </ul>
            <Link href="/pricing" className="mt-8 inline-flex rounded-full border border-fg/25 px-7 py-3.5 font-semibold hover:bg-fg/5">
              {copy.whatsIncludedCta}
            </Link>
          </div>
        </section>

        {/* Exam structure */}
        <section className="border-t border-line">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:px-6 sm:py-20 md:grid-cols-[1fr_1fr] md:items-center">
            <div>
              <h2 className="reveal text-3xl font-bold sm:text-4xl">{copy.examStructureTitle}</h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed opacity-80">{copy.examStructureText}</p>
              <Link
                href="/pricing"
                className="mt-6 inline-flex rounded-full bg-fg px-7 py-3.5 font-semibold text-bg"
              >
                {copy.examStructureCta}
              </Link>
              <Link href="/exam-dates" className="mt-4 flex min-h-11 items-center text-sm underline underline-offset-4 opacity-70">
                {examDatesCopy.homeLink}
              </Link>
            </div>
            <ol className="grid grid-cols-4 gap-2 text-center">
              {["4 דק׳", "4 דק׳", "15 דק׳", "6 דק׳", "6 דק׳", "4 דק׳", "7 דק׳", "4 דק׳"].map((t, i) => (
                <li key={i} className="rounded-2xl border border-line bg-white p-3">
                  <span className="block text-sm opacity-70">פרק {i + 1}</span>
                  <span className="mt-1 block font-bold tabular-nums">{t}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* About */}
        <section className="border-t border-line">
          <div className="mx-auto grid max-w-6xl gap-4 px-4 py-16 sm:px-6 sm:py-20 md:grid-cols-[1fr_2fr]">
            <h2 className="reveal text-3xl font-bold sm:text-4xl">{copy.aboutTitle}</h2>
            <p className="max-w-2xl text-lg leading-relaxed opacity-80">{copy.aboutText}</p>
          </div>
        </section>

        {/* Guarantee */}
        <section data-invert="">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <p className="text-sm font-semibold opacity-70">{copy.guaranteeEyebrow}</p>
            <h2 className="reveal mt-3 max-w-3xl text-[2rem] font-bold leading-tight text-balance sm:text-5xl">
              {copy.guaranteeTitle}
            </h2>
            <p className="mt-5 max-w-xl opacity-70">{copy.guaranteeTerms}</p>
            <Link
              href="/sign-up"
              className="mt-8 inline-flex rounded-full bg-fg px-7 py-4 font-semibold text-bg sm:py-3.5"
            >
              {copy.guaranteeCta}
            </Link>
          </div>
        </section>
        {/* FAQ */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
            <h2 className="reveal-fade text-center text-3xl font-bold sm:text-4xl">{copy.homeFaqTitle}</h2>
            <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-12">
              {homeFaqGroups.map((group) => (
                <div key={group.title}>
                  <h3 className="text-sm font-semibold opacity-70">{group.title}</h3>
                  <div className="mt-3 divide-y divide-line border-y border-line">
                    {group.items.map((item) => (
                      <details key={item.q} className="group py-5">
                        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-2 font-semibold">
                          {item.q}
                          <span className="shrink-0 text-xl opacity-70 group-open:hidden">+</span>
                          <span className="hidden shrink-0 text-xl opacity-70 group-open:inline">−</span>
                        </summary>
                        <p className="mt-3 leading-relaxed opacity-80">{item.a}</p>
                      </details>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
