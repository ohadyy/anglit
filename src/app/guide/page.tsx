import type { Metadata } from "next";
import Link from "next/link";
import { guideCopy as g } from "@/content/guideCopy";

export const metadata: Metadata = {
  title: g.seoTitle,
  description: g.seoDescription,
  alternates: { canonical: "/guide" },
};

const CARD = "rounded-3xl border border-line bg-white p-5 shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] sm:p-6";
const BTN = "inline-flex min-h-12 items-center justify-center rounded-full bg-fg px-6 py-3.5 font-semibold text-bg transition-opacity hover:opacity-85";

export default function GuidePage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-8 sm:px-6">
      <div className="flex items-stretch gap-2">
        <h1 className="font-display min-w-0 flex-1 self-center text-[1.85rem] leading-[1.25] font-bold tracking-tight sm:text-4xl">
          <mark className="pink">{g.title}</mark>
        </h1>
        {/* Wrapper stretches to the title height; the cropped SVG fills it top to bottom */}
        <div className="relative w-36 shrink-0 sm:w-64">
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG, nothing for next/image to optimize */}
          <img src="/guide/guide-illustration.svg" alt="" className="absolute inset-0 h-full w-full object-contain" />
        </div>
      </div>
      <p className="mt-8 max-w-xl text-lg leading-relaxed opacity-80">{g.sub}</p>

      <div className="mt-12">
        <a
          href="/guide/anglit-amirnet-guide.pdf"
          download={g.downloadFile}
          className="flex min-h-20 w-full items-center justify-center gap-3 rounded-full bg-fg px-8 py-5 text-xl font-bold text-bg shadow-[0_18px_40px_-12px_rgb(25_16_127/0.55)] ring-4 ring-[#ee478c] transition-transform hover:scale-[1.02] active:scale-[0.98] sm:min-h-24 sm:text-2xl"
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-7 shrink-0" aria-hidden="true">
            <path d="M12 3v12m0 0l-5-5m5 5l5-5M4 20h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {g.download}
        </a>
        <p className="mt-3 text-center text-sm opacity-60">{g.meta}</p>
      </div>


      <section className="mt-20">
        <h2 className="text-2xl font-bold">{g.insideTitle}</h2>
        <ul className="mt-4 grid gap-3">
          {g.inside.map((line) => (
            <li key={line} className="flex gap-2.5 leading-relaxed">
              <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-fg" />
              <span className="opacity-90">{line}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">{g.nextTitle}</h2>
        <p className="mt-2 opacity-80">{g.nextText}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className={`${CARD} flex flex-col`}>
            <h3 className="font-bold">{g.practiceTitle}</h3>
            <p className="mt-2 flex-1 leading-relaxed opacity-80">{g.practiceText}</p>
            <Link href="/checkout?product=access" className={`${BTN} mt-5 bg-transparent text-fg ring-2 ring-fg`}>{g.practiceCta}</Link>
          </div>
          <div data-invert="" className="flex flex-col rounded-3xl p-5 sm:p-6">
            <h3 className="font-bold">{g.seminarTitle}</h3>
            <p className="mt-2 flex-1 leading-relaxed opacity-80">{g.seminarText}</p>
            <Link href="/ads" className={`${BTN} mt-5`}>{g.seminarCta}</Link>
          </div>
        </div>
      </section>

      <p className="mt-12 text-sm leading-relaxed opacity-60">{g.disclaimer}</p>
    </main>
  );
}
