import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { HeroDecor } from "@/components/HeroDecor";
import { HomeIntro } from "@/components/HomeIntro";
import { TestimonialBubble } from "@/components/TestimonialBubble";
import { TypingHeadline } from "@/components/TypingHeadline";
import { TactileLink } from "@/components/TactileButton";
import { CourseOfferCta, CourseOfferPrice } from "@/components/CourseOfferCard";
import { StepsList } from "@/components/StepsList";
import { WeekStory } from "@/components/WeekStory";
import { TextReveal } from "@/components/TextReveal";
import { HeroCards } from "@/components/HeroCards";
import { QuestionTypeCards } from "@/components/QuestionTypeCards";
import { copy, homeFaqGroups, homeFeatures, homeHowSteps, homeQuestionTypes } from "@/content/copy";
import { examDatesCopy } from "@/content/examDates";
import { calculatorCopy, guideCopy } from "@/content/examGuide";
import { ScoreCalculator } from "@/components/ScoreCalculator";
import { upcomingCourseOffer } from "@/lib/cohorts";
import { getViewer, isLoyal } from "@/lib/viewer";
import { TierPreview } from "@/components/TierPreview";
import { organizationJsonLd } from "@/lib/organizationJsonLd";
import { products } from "@/content/pricingCopy";
import { site } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = { alternates: { canonical: "/" } };

// Course + FAQ + WebSite structured data, built from the same copy the page shows
const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebSite", name: "Anglit", url: site.url, inLanguage: "he" },
    {
      "@type": "Course",
      name: "7 ימים לאמירנט",
      description: copy.seoDescription,
      inLanguage: "he",
      provider: { "@type": "EducationalOrganization", name: "Anglit", url: site.url },
      hasCourseInstance: { "@type": "CourseInstance", courseMode: "online", courseWorkload: "P7D" },
      offers: { "@type": "Offer", priceCurrency: "ILS", price: products.find((p) => p.id === "course")?.price, category: "Paid" },
    },
    {
      "@type": "FAQPage",
      mainEntity: homeFaqGroups.flatMap((g) =>
        g.items.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } }))
      ),
    },
  ],
};

// Shows the live cohort offer (price, seats left), so this page cannot be cached at build time
export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: { searchParams: Promise<{ as?: string }> }) {
  const { as } = await searchParams;
  const [offer, viewer] = await Promise.all([upcomingCourseOffer(), getViewer(as)]);
  // A seminar student has already bought everything this page sells: their home is the account.
  // Staff keep the home page (it is where they work on the site) unless they preview as a student.
  if (viewer.tier === "course" && (!viewer.staff || as === "course")) redirect("/account");
  const aboutParagraphs = copy.aboutText.split("\n\n");
  // The calls to action follow what the visitor already has: a guest signs up, a signed-in visitor goes
  // straight to paying (sign-up would only bounce them to /account).
  const { tier } = viewer;
  const primary = { href: tier === "guest" ? "/sign-up" : "/checkout?product=course", label: copy.heroCta2 };
  const secondary = tier === "guest" || tier === "free" ? { href: "/start", label: copy.heroCta1 } : { href: "/account", label: copy.memberAccountCta };
  const heroNote = tier === "access" || tier === "course" ? copy.memberAccessNote : copy.heroNote;

  return (
    <HomeIntro>
    <div className="flex min-h-dvh flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }} />
      {/* Header + hero share one continuous gradient, so the nav bar doesn't sit on a flat block above it */}
      <div className="hero-mesh relative flex min-h-dvh flex-col">
        <HeroDecor mark="a" font="gevora" />

        <div className="relative z-10 mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center px-4 pb-28 pt-32 text-center sm:px-6">
          {viewer.staff && (
            <div className="mb-8">
              <TierPreview viewer={viewer} path="/" />
            </div>
          )}
          <TypingHeadline
            className="rise text-[2.75rem] font-bold leading-[1.05] tracking-[-0.03em] text-balance sm:text-7xl"
            marked="שבוע אחד"
            rest=", ואתם מוכנים לאמירנט."
          />
          <p className="rise font-hand mt-6 text-2xl opacity-70" style={{ animationDelay: "120ms" }}>
            {copy.heroEyebrow}
          </p>
          <TestimonialBubble />
          <p className="rise mx-auto mt-6 max-w-xl text-lg leading-relaxed opacity-80" style={{ animationDelay: "220ms" }}>
            {copy.heroSub}
          </p>
          <div className="rise mx-auto mt-10 flex w-full max-w-sm flex-col items-center gap-3" style={{ animationDelay: "320ms" }}>
            <TactileLink href={primary.href} size="lg" fullWidth>
              {primary.label}
            </TactileLink>
            <Link href={secondary.href} className="inline-flex min-h-11 items-center gap-2 font-semibold underline underline-offset-4">
              {secondary.label} <span aria-hidden="true">←</span>
            </Link>
          </div>
          <p className="rise mt-4 text-sm opacity-70" style={{ animationDelay: "420ms" }}>
            {heroNote}
          </p>
          <div className="rise w-full" style={{ animationDelay: "520ms" }}>
            <HeroCards />
          </div>
        </div>
      </div>

      <main className="flex-1">
        {/* What you get: three rows, each one point with room to breathe */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <h2 className="reveal text-center text-4xl font-bold text-balance sm:text-6xl">
              מה <mark className="pink">מקבלים</mark> בסמינר
            </h2>
            <div className="mt-16 flex flex-col gap-20 sm:gap-28">
              {homeFeatures.map((f, i) =>
                f.image ? (
                  <div key={f.title} className="flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
                    {f.image.endsWith(".svg") ? (
                      // Transparent vector art: no card frame, it sits directly on the page
                      // eslint-disable-next-line @next/next/no-img-element -- static vector art; next/image needs dangerouslyAllowSVG for this
                      <img
                        src={f.image}
                        alt={f.alt ?? ""}
                        width={f.imageWidth}
                        height={f.imageHeight}
                        className={`mx-auto w-[28rem] max-w-full lg:w-[42rem] lg:shrink-0 ${i % 2 ? "lg:order-2" : ""}`}
                      />
                    ) : (
                      <div
                        className={`mx-auto w-[24.5rem] max-w-full overflow-hidden rounded-3xl border border-line bg-white shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] lg:w-[42rem] lg:shrink-0 ${i % 2 ? "lg:order-2" : ""}`}
                      >
                        <Image src={f.image} alt={f.alt ?? ""} width={f.imageWidth} height={f.imageHeight} className="h-auto w-full object-cover" />
                      </div>
                    )}
                    <div className={`text-center lg:text-start ${i % 2 ? "lg:order-1" : ""}`}>
                      <h3 className="text-4xl font-bold text-balance sm:text-6xl">{f.title}</h3>
                      <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed opacity-80 sm:text-xl lg:mx-0">{f.text}</p>
                    </div>
                  </div>
                ) : (
                  // No photo yet for this one; placeholder text block until a real photo replaces it
                  <div key={f.title} className="mx-auto max-w-xl text-center">
                    <h3 className="text-4xl font-bold text-balance sm:text-6xl">{f.title}</h3>
                    <p className="mt-4 text-lg leading-relaxed opacity-80 sm:text-xl">{f.text}</p>
                  </div>
                )
              )}
            </div>
            <div className="mt-16 flex justify-center sm:mt-20">
              <TactileLink href={primary.href} size="lg">
                {primary.label}
              </TactileLink>
            </div>
          </div>
        </section>


        {/* The three question types, each opening a free practice set */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20">
            <h2 className="reveal text-3xl font-bold text-balance sm:text-4xl">{homeQuestionTypes.title}</h2>
            <QuestionTypeCards />
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
                  <TextReveal key={p} text={p} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How the week is built, with the exam's real timing folded in */}
        <section className="px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-4xl rounded-[2rem] bg-raise px-5 py-12 sm:px-10 sm:py-16">
            <div className="mx-auto max-w-3xl">
              <h2 className="reveal text-3xl font-bold sm:text-4xl">{copy.howTitle}</h2>
              <div className="mt-8">
                <WeekStory />
              </div>
              <div className="mt-10">
                <StepsList steps={homeHowSteps} />
              </div>
              <p className="mt-6 max-w-xl text-sm leading-relaxed opacity-70">{copy.howFacts}</p>
            </div>
          </div>
        </section>

        {/* Price, right next to the guarantee that removes the risk of paying */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
            <p className="font-hand text-2xl opacity-70">{copy.homePricingTitle}</p>
            {/* Side by side on wider screens: the price on one side, the guarantee that removes the risk on the other */}
            <div className="mx-auto mt-6 grid max-w-md gap-4 md:max-w-none md:grid-cols-2 md:gap-6">
              <div className="flex flex-col justify-center rounded-3xl border border-line bg-white p-8 shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] sm:p-10">
                <CourseOfferPrice offer={offer} big loyal={isLoyal(viewer)} />
                <CourseOfferCta className="mt-10 w-full">{copy.heroCta2}</CourseOfferCta>
                <Link href="/pricing" className="mx-auto mt-5 inline-flex min-h-11 items-center text-sm underline underline-offset-4 opacity-70 transition-opacity hover:opacity-100">
                  {copy.homePricingCta}
                </Link>
              </div>

              <div data-invert="" className="flex flex-col justify-center rounded-[2rem] p-6 text-start sm:p-8">
                <p className="text-sm font-semibold opacity-70">{copy.guaranteeEyebrow}</p>
                <h2 className="mt-3 text-2xl font-bold leading-tight text-balance">{copy.guaranteeTitle}</h2>
                <p className="mt-3 opacity-70">{copy.guaranteeTerms}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Score calculator, with the other reference pages gathered in one quiet row instead of scattered */}
        <section className="px-4 py-8 sm:px-6">
          <div className="mx-auto grid max-w-6xl gap-8 rounded-[2rem] bg-raise px-5 py-12 sm:px-10 sm:py-16 md:grid-cols-2 md:items-center md:gap-12">
            <div>
              <p className="font-hand text-2xl opacity-70">{copy.savingsEyebrow}</p>
              <h2 className="reveal mt-1 text-3xl font-bold sm:text-4xl text-balance">{copy.savingsTitle}</h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed opacity-80">{copy.savingsText}</p>
              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                <Link href="/score" className="inline-flex min-h-8 items-center underline underline-offset-4 opacity-70 transition-opacity hover:opacity-100">
                  {calculatorCopy.homeLink}
                </Link>
                <Link href="/amirnet" className="inline-flex min-h-8 items-center underline underline-offset-4 opacity-70 transition-opacity hover:opacity-100">
                  {guideCopy.homeLink}
                </Link>
                <Link href="/exam-dates" className="inline-flex min-h-8 items-center underline underline-offset-4 opacity-70 transition-opacity hover:opacity-100">
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
                          <span aria-hidden="true" className="shrink-0 text-xl opacity-70 group-open:hidden">+</span>
                          <span aria-hidden="true" className="hidden shrink-0 text-xl opacity-70 group-open:inline">−</span>
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
            <Link href={primary.href} className="mt-6 inline-flex touch-manipulation rounded-full bg-fg px-7 py-4 font-semibold text-bg transition-opacity hover:opacity-85 active:opacity-75 sm:w-auto sm:px-10">
              {copy.guaranteeCta}
            </Link>
          </div>
        </section>
      </main>

    </div>
    </HomeIntro>
  );
}
