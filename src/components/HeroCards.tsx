import { homeHeroCards as t } from "@/content/copy";

const SHADOW = "shadow-[0_18px_40px_-24px_rgb(14_8_82/0.35)]";

// Two floating test cards and a gain chip, all telling the same story (opening test -> closing test)
export function HeroCards() {
  return (
    <div className="mt-10">
      <div className="relative mx-auto h-56 max-w-sm" aria-hidden="true">
        <div className={`absolute start-[10%] top-0 w-[46%] -rotate-3 rounded-2xl border border-line bg-white p-4 text-center ${SHADOW}`}>
          <p className="text-sm font-semibold">{t.open}</p>
          <p className="mt-1 text-4xl font-bold">
            <bdi dir="ltr">95</bdi>
          </p>
        </div>
        <div className={`absolute end-[10%] top-10 w-[46%] rotate-3 rounded-2xl bg-mint p-4 text-center text-ink-deep ${SHADOW}`}>
          <p className="text-sm font-semibold">{t.close}</p>
          <p className="mt-1 text-4xl font-bold">
            <bdi dir="ltr">125</bdi>
          </p>
        </div>
        <div className={`absolute inset-x-0 bottom-0 mx-auto flex w-max items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold ${SHADOW}`}>
          <span className="grid h-6 w-6 place-items-center rounded-full bg-mint text-ink-deep">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="m5 12.5 4.5 4.5L19 7.5" />
            </svg>
          </span>
          <bdi dir="ltr">+30</bdi> {t.gain}
        </div>
      </div>
    </div>
  );
}
