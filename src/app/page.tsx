import Image from "next/image";
import Link from "next/link";
import { HeroDecor } from "@/components/HeroDecor";
import { HomeIntro } from "@/components/HomeIntro";
import { TactileLink } from "@/components/TactileButton";
import { CourseOfferCta, CourseOfferPrice } from "@/components/CourseOfferCard";
import { StepsList } from "@/components/StepsList";
import { copy, homeFaqGroups, homeFeatures, homeHowSteps } from "@/content/copy";
import { examDatesCopy } from "@/content/examDates";
import { calculatorCopy, guideCopy } from "@/content/examGuide";
import { ScoreCalculator } from "@/components/ScoreCalculator";
import { upcomingCourseOffer } from "@/lib/cohorts";
import { organizationJsonLd } from "@/lib/organizationJsonLd";

// Shows the live cohort offer (price, seats left), so this page cannot be cached at build time
export const dynamic = "force-dynamic";

export default async function Home() {
  const offer = await upcomingCourseOffer();
  const aboutParagraphs = copy.aboutText.split("\n\n");

  return (
    <HomeIntro>
    <div className="flex min-h-dvh flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
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
              <TactileLink href="/sign-up" size="lg">
                {copy.heroCta2}
              </TactileLink>
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
        {/* What you get: three rows, each one point with room to breathe */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
            <h2 className="reveal text-center text-3xl font-bold sm:text-4xl">{copy.featuresTitle}</h2>
            <div className="mt-16 flex flex-col gap-20 sm:gap-28">
              {homeFeatures.map((f, i) => {
                // The last row is a real screenshot (portrait); the first two are square brand illustrations
                const isScreenshot = i === homeFeatures.length - 1;
                return (
                  <div key={f.title} className="grid items-center gap-8 sm:grid-cols-2 sm:gap-12">
                    <div
                      className={`mx-auto w-56 overflow-hidden rounded-3xl border border-line bg-white shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] sm:w-full sm:max-w-sm ${i % 2 ? "sm:order-2" : ""}`}
                    >
                      <Image
                        src={f.image}
                        alt={f.alt ?? ""}
                        width={isScreenshot ? 375 : 1024}
                        height={isScreenshot ? 812 : 1024}
                        className="h-auto w-full object-cover"
                      />
                    </div>
                    <div className={i % 2 ? "sm:order-1" : ""}>
                      <h3 className="text-3xl font-bold text-balance sm:text-5xl">{f.title}</h3>
                      <p className="mt-4 max-w-md text-lg leading-relaxed opacity-80 sm:text-xl">{f.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Who teaches: right after "what you get", so the reader meets the teacher while the point is fresh */}
        <section className="border-t border-line">
          <div className="mx-auto grid max-w-5xl items-center gap-8 px-4 py-16 sm:px-6 sm:py-20 md:grid-cols-[0.8fr_1.2fr] md:gap-12">
            <div className="mx-auto w-44 overflow-hidden rounded-3xl sm:w-56 md:mx-0 md:w-full">
              <Image src="/about/ohad.jpg" alt="אהד, המורה לסמינר אמירנט של Anglit" width={1086} height={1448} className="h-auto w-full object-cover" />
            </div>
            <div>
              <h2 className="reveal text-3xl font-bold sm:text-4xl">{copy.aboutTitle}</h2>
              <div className="mt-4 flex max-w-xl flex-col gap-4 text-lg leading-relaxed opacity-80">
                {aboutParagraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How the week is built, with the exam's real timing folded in */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
            <h2 className="reveal text-3xl font-bold sm:text-4xl">{copy.howTitle}</h2>
            <div className="mt-8">
              <StepsList steps={homeHowSteps} />
            </div>
            <p className="mt-6 max-w-xl text-sm leading-relaxed opacity-70">{copy.howFacts}</p>
          </div>
        </section>

        {/* Price, right next to the guarantee that removes the risk of paying */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-md px-4 py-16 text-center sm:px-6 sm:py-20">
            <p className="font-hand text-2xl opacity-70">{copy.homePricingTitle}</p>
            <div className="mt-6 rounded-3xl border border-line bg-white p-6 shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)]">
              <CourseOfferPrice offer={offer} />
              <CourseOfferCta className="mt-6 w-full">{copy.heroCta2}</CourseOfferCta>
            </div>
            <Link href="/pricing" className="mt-4 inline-flex min-h-11 items-center text-sm underline underline-offset-4 opacity-70">
              {copy.homePricingCta}
            </Link>

            <div data-invert="" className="mt-10 rounded-3xl p-6 text-start sm:p-8">
              <p className="text-sm font-semibold opacity-70">{copy.guaranteeEyebrow}</p>
              <h3 className="mt-3 text-2xl font-bold leading-tight text-balance">{copy.guaranteeTitle}</h3>
              <p className="mt-3 opacity-70">{copy.guaranteeTerms}</p>
            </div>
          </div>
        </section>

        {/* Score calculator, with the other reference pages gathered in one quiet row instead of scattered */}
        <section className="border-t border-line">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 sm:py-20 md:grid-cols-2 md:items-center md:gap-12">
            <div>
              <p className="font-hand text-2xl opacity-70">{copy.savingsEyebrow}</p>
              <h2 className="reveal mt-1 text-3xl font-bold sm:text-4xl text-balance">{copy.savingsTitle}</h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed opacity-80">{copy.savingsText}</p>
              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                <Link href="/score" className="inline-flex min-h-8 items-center underline underline-offset-4 opacity-70">
                  {calculatorCopy.homeLink}
                </Link>
                <Link href="/amirnet" className="inline-flex min-h-8 items-center underline underline-offset-4 opacity-70">
                  {guideCopy.homeLink}
                </Link>
                <Link href="/exam-dates" className="inline-flex min-h-8 items-center underline underline-offset-4 opacity-70">
                  {examDatesCopy.homeLink}
                </Link>
              </div>
            </div>
            <ScoreCalculator />
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

        {/* Final CTA, so the page doesn't end cold after the FAQ */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
            <h2 className="text-2xl font-bold sm:text-3xl">{copy.closingTitle}</h2>
            <Link href="/sign-up" className="mt-6 inline-flex rounded-full bg-fg px-7 py-4 font-semibold text-bg sm:w-auto sm:px-10">
              {copy.guaranteeCta}
            </Link>
          </div>
        </section>
      </main>

    </div>
    </HomeIntro>
  );
}
