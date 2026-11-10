import type { Metadata } from "next";
import Link from "next/link";
import { calmCopy } from "@/content/calm";
import { CalmIcon, AngelaFigure } from "./CalmArt";

export const metadata: Metadata = {
  title: "אנג'לה | מיינדסט למבחן",
  description: "אימונים קצרים להתמודדות עם לחץ ובלאקאאוט בזמן המבחן.",
};

const CARDS = [
  { icon: "thoughts", href: "/calm/thoughts", title: calmCopy.thoughtsTitle, text: calmCopy.thoughtsText },
  { icon: "eliminate", href: "/calm/eliminate", title: calmCopy.eliminateTitle, text: calmCopy.eliminateText },
  { icon: "blackout", href: "/calm/blackout", title: calmCopy.blackoutTitle, text: calmCopy.blackoutText },
  { icon: "sessions", href: "/calm/sessions", title: calmCopy.sessionsTitle, text: calmCopy.sessionsText },
] as const;

export default function CalmPage() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 pb-20 pt-24">
      <AngelaFigure />

      <p className="font-hand mt-10 text-center text-3xl opacity-70">{calmCopy.greeting}</p>
      <h1 className="font-display mt-3 text-center text-3xl font-bold leading-snug">{calmCopy.ask}</h1>

      <nav className="mt-14 flex flex-col gap-3" aria-label="אימונים">
        {CARDS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="flex items-start gap-4 rounded-[2rem] bg-fg/[0.06] p-6 hover:bg-fg/10"
          >
            <CalmIcon name={c.icon} />
            <div>
              <p className="font-display text-xl font-bold">{c.title}</p>
              <p className="mt-2 text-sm leading-relaxed opacity-70">{c.text}</p>
            </div>
          </Link>
        ))}
      </nav>

      <p className="mt-10 text-center text-xs leading-relaxed opacity-50">{calmCopy.disclaimer}</p>
    </div>
  );
}
