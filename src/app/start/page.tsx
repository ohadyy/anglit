import type { Metadata } from "next";
import Link from "next/link";
import { copy } from "@/content/copy";
import { FREE_ACTIVITIES as CARDS } from "@/content/freePractice";

export const metadata: Metadata = {
  title: "תרגול חינם",
  description: "ארבעה תרגולים חינמיים לאמירנט: שאלות, מבחן תרגול שלם, ושני משחקי מילים.",
};


export default function StartPage() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col px-4 py-12 sm:px-6">
      <header>
        <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
          <mark className="pink">{copy.onboardingTitle}</mark>
        </h1>
        <p className="mt-3 text-lg leading-relaxed opacity-80">{copy.onboardingSub}</p>
      </header>

      <nav className="mt-10 grid gap-4 sm:grid-cols-2" aria-label="תרגולים חינמיים">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group flex min-h-44 flex-col justify-between rounded-3xl border border-line bg-white p-6 shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] hover:border-fg/30"
          >
            <div>
              <span aria-hidden className="block size-2.5 rounded-full bg-marker" />
              <p className="font-display mt-6 text-2xl font-bold">{card.title}</p>
              <p className="mt-2 text-sm leading-relaxed opacity-70">{card.text}</p>
            </div>
            <div className="mt-6 flex items-center justify-between text-sm font-semibold opacity-70 group-hover:opacity-100">
              <span>חינם</span>
              <span aria-hidden>←</span>
            </div>
          </Link>
        ))}
      </nav>

      <section className="mt-12 rounded-3xl border border-line bg-white p-6 shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)]">
        <h2 className="text-xl font-bold">{copy.onboardingPersuadeTitle}</h2>
        <p className="mt-3 leading-relaxed opacity-80">{copy.onboardingPersuadeText}</p>
        <Link
          href="/sign-up"
          className="mt-6 flex w-full items-center justify-center rounded-full bg-fg px-6 py-4 font-semibold text-bg sm:w-auto sm:px-10"
        >
          {copy.heroCta2}
        </Link>
      </section>
    </div>
  );
}
