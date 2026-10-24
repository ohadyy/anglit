import Link from "next/link";
import { copy } from "@/content/copy";
import { FREE_ACTIVITIES, type FreeActivityId } from "@/content/freePractice";

// Shown to visitors without paid access when a free practice ends: other free practices first,
// then the course pitch. Never says the free practice is "over", because the other ones are still open.
export function FreeNextCard({ current }: { current: FreeActivityId }) {
  const others = FREE_ACTIVITIES.filter((a) => a.id !== current);
  return (
    <section className="mt-10 w-full text-start">
      <h2 className="font-display text-2xl font-bold">{copy.freeNextTitle}</h2>
      <p className="mt-1 text-sm opacity-70">{copy.freeNextSub}</p>
      <div className="mt-4 grid gap-3">
        {others.map((a) => (
          <Link
            key={a.id}
            href={a.href}
            className="group flex items-center justify-between gap-4 rounded-2xl border border-line bg-white p-4 shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] hover:border-fg/30"
          >
            <span>
              <span className="block font-semibold">{a.title}</span>
              <span className="mt-0.5 block text-sm opacity-70">{a.text}</span>
            </span>
            <span aria-hidden className="opacity-70 group-hover:opacity-100">←</span>
          </Link>
        ))}
      </div>

      <div data-invert="" className="mt-6 rounded-3xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold leading-snug">{copy.freePitchTitle}</h2>
        <p className="mt-2 leading-relaxed opacity-80">{copy.freePitchText}</p>
        <p className="mt-3 text-sm leading-relaxed opacity-80">
          {copy.guaranteeTitle} {copy.guaranteeTerms}
        </p>
        <Link href="/pricing" className="mt-5 flex w-full items-center justify-center rounded-full bg-fg px-6 py-3.5 font-semibold text-bg sm:inline-flex sm:w-auto">
          {copy.freePitchCta}
        </Link>
      </div>
    </section>
  );
}
