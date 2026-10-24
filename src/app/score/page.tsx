import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import Link from "next/link";
import { ScoreCalculator } from "@/components/ScoreCalculator";
import { calculatorCopy as c } from "@/content/examGuide";

export const metadata: Metadata = {
  title: "מחשבון ציון אמירנט",
  description: "מכניסים ציון אמירנט ורואים באיזו רמה תשובצו וכמה קורסי אנגלית יישארו לפני הפטור.",
};

export default function ScorePage() {
  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 pb-16 pt-4 sm:px-6">
      <BreadcrumbJsonLd trail={[{ name: "מחשבון ציון", path: "/score" }]} />
      <p className="font-hand text-2xl opacity-70">{c.eyebrow}</p>
      <h1 className="font-display mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{c.title}</h1>
      <p className="mt-3 leading-relaxed opacity-80">{c.intro}</p>

      <div className="mt-8">
        <ScoreCalculator />
      </div>

      <div data-invert="" className="mt-10 rounded-3xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold">{c.ctaTitle}</h2>
        <p className="mt-2 opacity-80">{c.ctaText}</p>
        <Link href="/pricing" className="mt-5 inline-flex rounded-full bg-fg px-6 py-3.5 font-semibold text-bg">
          {c.cta}
        </Link>
      </div>
      <Link href="/exam" className="mt-6 flex min-h-11 items-center text-sm underline underline-offset-4 opacity-70">
        {c.ctaSecondary}
      </Link>
    </main>
  );
}
