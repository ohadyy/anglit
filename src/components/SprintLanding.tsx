import Image from "next/image";
import type { CourseOffer } from "@/lib/cohorts";
import { HeroDecor } from "@/components/HeroDecor";
import { COURSE_REGULAR_PRICE, CourseOfferCta, CourseOfferPrice } from "@/components/CourseOfferCard";
import { StepsList } from "@/components/StepsList";
import { copy } from "@/content/copy";
import { sprintCopy } from "@/content/sprintCopy";

// The one action on this page. It goes to checkout, which asks for sign-in first if needed.
function Cta({ className = "" }: { className?: string }) {
  return <CourseOfferCta className={className}>{sprintCopy.cta}</CourseOfferCta>;
}

export function SprintLanding({ offer }: { offer: CourseOffer | null }) {
  return (
    <div className="flex min-h-dvh flex-col pb-28 lg:pb-0">
      {/* Header + hero share one continuous gradient, so the logo doesn't sit on a flat block above it */}
      <div className="hero-mesh relative flex flex-col">
        <HeroDecor mark="7" />

        <div className="rise relative z-10 mx-auto flex max-w-3xl flex-col items-center px-4 pb-14 pt-32 text-center sm:px-6 sm:pt-36">
          <p className="text-sm font-semibold tracking-[0.08em] opacity-70">{sprintCopy.eyebrow}</p>
          <h1 className="font-display mt-4 text-[2.5rem] font-bold leading-[1.08] tracking-[-0.03em] text-balance sm:text-6xl">
            מוכנים למבחן <mark className="pink">תוך שבוע</mark>.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed opacity-80">{sprintCopy.sub}</p>

          <div className="mt-8 w-full max-w-sm rounded-3xl border border-line bg-white p-6 shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)]">
            <CourseOfferPrice offer={offer} />
            <Cta className="mt-6 w-full" />
          </div>
        </div>
      </div>

      <main className="flex-1">
        {/* Pain: the problem the reader already has */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
            <h2 className="text-center text-2xl font-bold sm:text-3xl">{sprintCopy.painTitle}</h2>
            <ul className="mt-8 flex flex-col gap-3">
              {sprintCopy.pain.map((p) => (
                <li key={p} className="rounded-3xl border border-line bg-white p-5 text-lg leading-relaxed shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)]">
                  {p}
                </li>
              ))}
            </ul>          </div>
        </section>

        {/* Who teaches: right after the pain, so the reader meets the teacher while still recognising the problem */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6">
            <div className="mx-auto w-44 overflow-hidden rounded-3xl sm:w-52">
              <Image src="/about/ohad.jpg" alt="אהד, המורה לסמינר אמירנט של Anglit" width={1086} height={1448} className="h-auto w-full object-cover" />
            </div>
            <h2 className="mt-6 text-2xl font-bold sm:text-3xl">{sprintCopy.whoTitle}</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed opacity-80">{sprintCopy.whoText}</p>
          </div>
        </section>

        {/* Cost of waiting: what not acting costs */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
            <h2 className="text-center text-2xl font-bold sm:text-3xl">{sprintCopy.costTitle}</h2>
            <ul className="mt-8 flex flex-col gap-3">
              {sprintCopy.costPoints.map((p) => (
                <li key={p} className="rounded-3xl bg-fg/5 p-5 text-lg leading-relaxed">
                  {p}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-center text-lg font-semibold">{sprintCopy.costUs}</p>
          </div>
        </section>

        {/* How the week is built */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
            <h2 className="text-center text-2xl font-bold sm:text-3xl">{sprintCopy.howTitle}</h2>
            <div className="mt-8">
              <StepsList steps={sprintCopy.how} />
            </div>
          </div>
        </section>

        {/* What is included, with the offer next to it */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
            <h2 className="text-center text-2xl font-bold sm:text-3xl">{sprintCopy.includedTitle}</h2>
            <ul className="mt-8 flex flex-col gap-3">
              {sprintCopy.included.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-lg leading-relaxed">
                  <svg viewBox="0 0 20 20" fill="none" className="mt-1 size-5 shrink-0 text-ok" aria-hidden>
                    <path d="M4 10.5l3.5 3.5L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="opacity-90">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 rounded-3xl border border-line bg-white p-6 text-center shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)]">
              <CourseOfferPrice offer={offer} />
              <Cta className="mt-6 w-full sm:w-auto sm:px-10" />
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
              <p className="font-bold opacity-70">פחות מתאים אם</p>
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
            <h2 className="text-center text-2xl font-bold sm:text-3xl">{sprintCopy.objectionsTitle}</h2>
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
            <h3 className="font-bold">{sprintCopy.refundTitle}</h3>
            <p className="mt-2 leading-relaxed opacity-80">{sprintCopy.refundText}</p>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
            <h2 className="text-center text-2xl font-bold sm:text-3xl">{sprintCopy.faqTitle}</h2>
            <div className="mt-8 divide-y divide-line border-y border-line">
              {sprintCopy.faq.map((item) => (
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
        </section>

        {/* Final CTA */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
            <h2 className="text-2xl font-bold sm:text-3xl">{sprintCopy.title}</h2>
            <Cta className="mt-6 w-full sm:w-auto sm:px-10" />
          </div>
        </section>
      </main>

      {/* Sticky mobile bar: the price and the action stay in view while scrolling */}
      <div className="fixed inset-x-0 bottom-0 z-20 flex items-center gap-3 border-t border-line bg-bg/95 p-3 backdrop-blur lg:hidden">
        <div className="min-w-0 flex-1">
          <p className="text-sm opacity-70">{offer ? `מחיר למחזור ${offer.label}` : "מחיר הסמינר"}</p>
          <p className="text-xl font-bold tabular-nums">{offer ? offer.priceIls : COURSE_REGULAR_PRICE} ₪</p>
        </div>
        <Cta className="shrink-0 px-6 py-3.5" />
      </div>
    </div>
  );
}
