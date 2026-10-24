import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import Link from "next/link";
import { guideAsOf, guideCopy as g, NITE_ACCOMMODATIONS_URL, NITE_AMIRNET_URL } from "@/content/examGuide";
import { NITE_REGISTRATION_URL } from "@/content/examDates";
import { TYPE_LABELS } from "@/content/questionLabels";
import { CORE_SECTIONS, PILOT_CHAPTER, PILOT_CHAPTER_TYPES } from "@/lib/examStructure";
import { SCORE_LEVELS } from "@/lib/scoreLevels";
import { institutions } from "@/content/institutions";
import { ScrollIndex } from "@/components/ScrollIndex";

export const metadata: Metadata = {
  title: "מה צריך לדעת על אמירנט",
  description: "מבנה מבחן אמירנט, מה אומר הציון, הרשמה ומחיר, התאמות, ומה קורה ביום המבחן.",
};

const CARD = "rounded-3xl border border-line bg-white p-5 shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] sm:p-6";

export default function AmirnetGuidePage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-4 sm:px-6">
      <BreadcrumbJsonLd trail={[{ name: "מה צריך לדעת על אמירנט", path: "/amirnet" }]} />
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
        <mark className="pink">{g.title}</mark>
      </h1>
      <p className="mt-3 max-w-xl leading-relaxed opacity-80">{g.intro}</p>

      <ScrollIndex
        items={[
          { id: "structure", label: g.structureTitle },
          { id: "score", label: g.scoreTitle },
          { id: "register", label: g.registerTitle },
          { id: "accommodations", label: g.accommodationsTitle },
          { id: "day", label: g.dayTitle },
        ]}
      />

      <section className="mt-12">
        <h2 className="text-2xl font-bold">{g.aboutTitle}</h2>
        <p className="mt-3 leading-relaxed opacity-80">{g.about}</p>
      </section>

      <section id="structure" className="mt-12 scroll-mt-24">
        <h2 className="text-2xl font-bold">{g.structureTitle}</h2>
        <p className="mt-3 leading-relaxed opacity-80">{g.structure}</p>
        <ol className={`${CARD} mt-5 divide-y divide-line !py-1`}>
          {CORE_SECTIONS.map((s, i) => (
            <li key={i} className="flex items-center justify-between gap-3 py-3">
              <span>
                <span className="text-sm opacity-60">פרק {i + 1}</span>{" "}
                <span className="font-semibold">{TYPE_LABELS[s.type].he}</span>
              </span>
              <span className="shrink-0 text-sm tabular-nums opacity-80">
                {s.count} שאלות · {s.minutes} דק׳
              </span>
            </li>
          ))}
          <li className="flex items-center justify-between gap-3 py-3">
            <span>
              <span className="text-sm opacity-60">פרקים 7–8</span> <span className="font-semibold">פרקי ניסיון</span>
            </span>
            <span className="shrink-0 text-sm tabular-nums opacity-80">
<bdi dir="ltr">
                {Math.min(...PILOT_CHAPTER_TYPES.map((t) => PILOT_CHAPTER[t].count))}–
                {Math.max(...PILOT_CHAPTER_TYPES.map((t) => PILOT_CHAPTER[t].count))}
              </bdi>{" "}
              שאלות כל אחד
            </span>
          </li>
        </ol>
        <p className="mt-4 leading-relaxed opacity-80">{g.pilotNote}</p>
      </section>

      <section id="score" className="mt-12 scroll-mt-24">
        <h2 className="text-2xl font-bold">{g.scoreTitle}</h2>
        <p className="mt-3 leading-relaxed opacity-80">{g.score}</p>
        <ul className={`${CARD} mt-5 divide-y divide-line !py-1`}>
          {SCORE_LEVELS.map((l, i) => (
            <li key={l.min} className="flex items-center justify-between gap-3 py-3">
              <span className="font-semibold">{l.label}</span>
              <span className="shrink-0 text-sm tabular-nums opacity-80">
                <bdi dir="ltr">{l.min}–{SCORE_LEVELS[i + 1] ? SCORE_LEVELS[i + 1].min - 1 : 150}</bdi>
                {" · "}
                {l.courses > 0 ? `${l.courses} קורסים` : "בלי קורסי רמה"}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm leading-relaxed opacity-70">{g.scoreDisclaimer}</p>
        <h3 className="mt-8 text-lg font-bold">הציון הנדרש לפי מוסד</h3>
        <ul className="mt-3 flex flex-wrap gap-2">
          {institutions.map((i) => (
            <li key={i.slug}>
              <Link href={`/amirnet/${i.slug}`} className="inline-flex min-h-11 items-center rounded-full border border-fg/25 px-4 text-sm hover:bg-fg/5">
                {i.name}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/score" className="mt-4 inline-flex min-h-11 items-center rounded-full border border-fg/25 px-6 font-semibold hover:bg-fg/5">
          {g.scoreCta}
        </Link>
      </section>

      <section id="register" className="mt-12 scroll-mt-24">
        <h2 className="text-2xl font-bold">{g.registerTitle}</h2>
        <ul className="mt-4 grid gap-3">
          {g.register.map((line) => (
            <li key={line} className="flex gap-2.5 leading-relaxed">
              <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-fg" />
              <span className="opacity-90">{line}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/exam-dates" className="inline-flex min-h-11 items-center rounded-full border border-fg/25 px-6 font-semibold hover:bg-fg/5">
            {g.registerCta}
          </Link>
          <a
            href={NITE_REGISTRATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center text-sm underline underline-offset-4 opacity-70"
          >
            {g.registerOfficial}
          </a>
        </div>
      </section>

      <section id="accommodations" className="mt-12 scroll-mt-24">
        <h2 className="text-2xl font-bold">{g.accommodationsTitle}</h2>
        <p className="mt-3 leading-relaxed opacity-80">{g.accommodations}</p>
        <a
          href={NITE_ACCOMMODATIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex min-h-11 items-center text-sm underline underline-offset-4 opacity-70"
        >
          {g.accommodationsCta}
        </a>
      </section>

      <section id="day" className="mt-12 scroll-mt-24">
        <h2 className="text-2xl font-bold">{g.dayTitle}</h2>
        <ul className="mt-4 grid gap-3">
          {g.day.map((line) => (
            <li key={line} className="flex gap-2.5 leading-relaxed">
              <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-fg" />
              <span className="opacity-90">{line}</span>
            </li>
          ))}
        </ul>
      </section>

      <div data-invert="" className="mt-14 rounded-3xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold">{g.ctaTitle}</h2>
        <p className="mt-2 opacity-80">{g.ctaText}</p>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <Link href="/pricing" className="inline-flex rounded-full bg-fg px-6 py-3.5 font-semibold text-bg">
            {g.cta}
          </Link>
          <Link href="/start" className="inline-flex min-h-11 items-center text-sm underline underline-offset-4 opacity-80">
            {g.ctaSecondary}
          </Link>
        </div>
      </div>

      <p className="mt-8 text-sm leading-relaxed opacity-60">
        {g.disclaimer} {guideAsOf}.{" "}
        <a href={NITE_AMIRNET_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
          לאתר מאל״ו
        </a>
      </p>
    </main>
  );
}
