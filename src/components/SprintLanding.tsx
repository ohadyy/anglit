import Image from "next/image";
import type { CourseOffer, nextCohortInfo } from "@/lib/cohorts";
import { HeroDecor } from "@/components/HeroDecor";
import { COURSE_REGULAR_PRICE, CourseOfferCta, CourseOfferPrice } from "@/components/CourseOfferCard";
import { LeadForm } from "@/components/LeadForm";
import { ResultsCards } from "@/components/ResultsCards";
import { TestimonialBubble } from "@/components/TestimonialBubble";
import { StepsList } from "@/components/StepsList";
import { copy } from "@/content/copy";
import { sprintCopy } from "@/content/sprintCopy";

// The one action on this page. It goes to checkout, which asks for sign-in first if needed.
function Cta({ className = "" }: { className?: string }) {
  return <CourseOfferCta className={className}>{sprintCopy.cta}</CourseOfferCta>;
}

// The VSL, shown between the promise and the offer. Unlisted on Vimeo, so the h= hash is required;
// dnt=1: no Vimeo tracking cookies for visitors
const VSL = "https://player.vimeo.com/video/1236863571?h=cde649bc61&dnt=1&title=0&byline=0&portrait=0&badge=0";

// Small line under each buy button: the date of the real upcoming cohort, so it is never an invented deadline
function Urgency({ cohort }: { cohort: NextCohort }) {
  if (!cohort) return null;
  return (
    <p className="mt-3 text-sm font-semibold opacity-80">
      המחזור הקרוב מתחיל ב-<bdi>{cohort.label}</bdi> | קבוצה של עד <bdi>{cohort.capacity}</bdi> משתתפים
    </p>
  );
}

type NextCohort = Awaited<ReturnType<typeof nextCohortInfo>>;

export function SprintLanding({ offer, cohort = null }: { offer: CourseOffer | null; cohort?: NextCohort }) {
  return (
    <div className="flex min-h-dvh flex-col pb-[calc(7rem+env(safe-area-inset-bottom))] lg:pb-0">
      {/* Warms up the connection to the VSL player before the visitor scrolls to it */}
      <link rel="preconnect" href="https://player.vimeo.com" />
      {/* Header + hero share one continuous gradient, so the logo doesn't sit on a flat block above it */}
      <div className="hero-mesh relative flex flex-col">
        <HeroDecor mark="7" />

        <div className="rise relative z-10 mx-auto flex max-w-3xl flex-col items-center px-4 pb-14 pt-32 text-center sm:px-6 sm:pt-36">
          <p className="text-sm font-semibold tracking-[0.08em] opacity-70">{sprintCopy.eyebrow}</p>
          <h1 className="font-display mt-4 text-[2.5rem] font-bold leading-[1.08] tracking-[-0.03em] text-balance sm:text-6xl">
            מוכנים למבחן <mark className="pink">תוך שבוע</mark>.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed opacity-80">{sprintCopy.sub}</p>

          <div className="mt-8 aspect-video w-full overflow-hidden rounded-3xl border border-line bg-ink-deep shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)]">
            <iframe
              src={VSL}
              title={sprintCopy.videoTitle}
              loading="lazy"
              className="h-full w-full"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>

          <TestimonialBubble />

          <div className="mt-8 w-full max-w-sm rounded-3xl border border-line bg-white p-6 shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)]">
            <CourseOfferPrice offer={offer} />
            <Cta className="mt-6 w-full" />
            <Urgency cohort={cohort} />
          </div>
        </div>
      </div>

      <main className="flex-1">
        <ResultsCards />

        {/* Pain: the problem the reader already has */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
            <h2 className="text-center text-2xl font-bold text-balance sm:text-3xl">{sprintCopy.painTitle}</h2>
            <ul className="mt-8 flex flex-col gap-3">
              {sprintCopy.pain.map((p) => (
                <li key={p} className="rounded-3xl border border-line bg-white p-5 text-lg leading-relaxed shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)]">
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Who teaches: right after the pain, so the reader meets the teacher while still recognising the problem */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6">
            <div className="mx-auto w-44 overflow-hidden rounded-3xl sm:w-52">
              <Image src="/about/ohad.jpg" alt="אהד, המורה לסמינר אמירנט של Anglit" width={1086} height={1448} className="h-auto w-full object-cover" />
            </div>
            <p className="mt-3 text-sm font-semibold opacity-80">{sprintCopy.whoCaption}</p>
            <h2 className="mt-6 text-2xl font-bold text-balance sm:text-3xl">{sprintCopy.whoTitle}</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed opacity-80">{sprintCopy.whoText}</p>
          </div>
        </section>

        {/* How the week is built */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
            <h2 className="text-center text-2xl font-bold text-balance sm:text-3xl">{sprintCopy.howTitle}</h2>
            <div className="mt-8">
              <StepsList steps={sprintCopy.how} />
            </div>
          </div>
        </section>

        <section className="border-t border-line">
          <div className="mx-auto max-w-md px-4 py-10 sm:px-6">
            <LeadForm source="ads" title={sprintCopy.leadTitle} sub={sprintCopy.leadSub} sentText={sprintCopy.leadSent} />
          </div>
        </section>

        {/* What is included, with the offer next to it */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
            <h2 className="text-center text-2xl font-bold text-balance sm:text-3xl">{sprintCopy.includedTitle}</h2>
            <ul className="mt-8 flex flex-col gap-3">
              {sprintCopy.included.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-lg leading-relaxed">
                  <svg viewBox="0 0 20 20" fill="none" className="mt-1 size-5 shrink-0 text-ok" aria-hidden="true">
                    <path d="M4 10.5l3.5 3.5L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="opacity-90">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 rounded-3xl border border-line bg-white p-6 text-center shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)]">
              <CourseOfferPrice offer={offer} />
              <Cta className="mt-6 w-full sm:w-auto sm:px-10" />
              <Urgency cohort={cohort} />
            </div>
          </div>
        </section>

        {/* Who it fits, stated plainly on both sides */}
        <section className="border-t border-line">
          <div className="mx-auto grid max-w-3xl gap-3 px-4 py-14 sm:grid-cols-2 sm:px-6">
            <div className="rounded-3xl border border-line bg-white p-6 shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)]">
              <p className="font-bold">{sprintCopy.fitTitle}</p>
              <p className="mt-3 leading-relaxed opacity-80">{sprintCopy.fitYes}</p>
            </div>
            <div className="rounded-3xl border border-line p-6">
              <p className="font-bold opacity-70">{sprintCopy.fitNoTitle}</p>
              <p className="mt-3 leading-relaxed opacity-70">{sprintCopy.fitNo}</p>
            </div>
          </div>
        </section>

        {/* Guarantee: the reason to act now, stated once in full */}
        <section data-invert="">
          <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6">
            <p className="text-sm font-semibold opacity-70">{copy.guaranteeEyebrow}</p>
            <h2 className="mx-auto mt-3 max-w-xl text-3xl font-bold leading-tight text-balance sm:text-4xl">
              {copy.guaranteeTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-md opacity-70">{copy.guaranteeTerms}</p>
          </div>
        </section>

        {/* Objections: the doubts a buyer has before paying, each answered with facts we can stand behind */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
            <h2 className="text-center text-2xl font-bold text-balance sm:text-3xl">{sprintCopy.objectionsTitle}</h2>
            <div className="mt-8 grid gap-3">
              {sprintCopy.objections.map((o) => (
                <div key={o.q} className="rounded-3xl border border-line bg-white p-6 shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)]">
                  <p className="font-bold">{o.q}</p>
                  <p className="mt-2 leading-relaxed opacity-80">{o.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Refund panel: the reader sees the way out before paying */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
            <h2 className="font-bold">{sprintCopy.refundTitle}</h2>
            <p className="mt-2 leading-relaxed opacity-80">{sprintCopy.refundText}</p>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
            <h2 className="text-center text-2xl font-bold text-balance sm:text-3xl">{sprintCopy.faqTitle}</h2>
            <div className="mt-8 divide-y divide-line border-y border-line">
              {sprintCopy.faq.map((item) => (
                <details key={item.q} className="group py-5">
                  <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-2 font-semibold">
                    {item.q}
                    <span aria-hidden="true" className="shrink-0 text-xl opacity-70 group-open:hidden">+</span>
                    <span aria-hidden="true" className="hidden shrink-0 text-xl opacity-70 group-open:inline">−</span>
                  </summary>
                  <p className="mt-3 leading-relaxed opacity-80">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Undecided visitors: after the buy path, so the top of the page stays about buying */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-md px-4 py-14 sm:px-6">
            <LeadForm source="ads" title={sprintCopy.leadTitle} sub={sprintCopy.leadSub} sentText={sprintCopy.leadSent} />
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
            <h2 className="text-2xl font-bold text-balance sm:text-3xl">{sprintCopy.title}</h2>
            <Cta className="mt-6 w-full sm:w-auto sm:px-10" />
          </div>
        </section>
      </main>

      {/* Sticky mobile bar: the price and the action stay in view while scrolling */}
      <div className="fixed inset-x-0 bottom-0 z-20 flex items-center gap-3 border-t border-line bg-bg/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <div className="min-w-0 flex-1">
          <p className="text-sm opacity-70">{offer ? `מחיר למחזור ${offer.label}` : "מחיר הסמינר"}</p>
          <p className="text-xl font-bold tabular-nums">{offer ? offer.priceIls : COURSE_REGULAR_PRICE} ₪</p>
        </div>
        <Cta className="shrink-0 px-6 py-3.5" />
      </div>
    </div>
  );
}
