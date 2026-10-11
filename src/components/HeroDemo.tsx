"use client";

import Link from "next/link";
import { useState } from "react";
import type { Question } from "@/content/questions";
import { QuestionView, TypeLabel } from "./QuestionView";
import { site } from "@/lib/site";

// A live question in the hero, inverted against the page theme. The page passes the question in,
// so this client component does not carry the whole question bank.
export function HeroDemo({ q: demo }: { q: Question }) {
  const [selected, setSelected] = useState<number | null>(null);
  const revealed = selected !== null;

  return (
    <div
      data-invert=""
      className="rounded-[2rem] p-5 shadow-[0_30px_60px_-24px_rgb(14_8_82/0.5)] sm:p-7"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <TypeLabel q={demo} />
        <span className="text-sm opacity-70">{revealed ? "ככה עובדים" : "נסו לענות"}</span>
      </div>
      <QuestionView q={demo} selected={selected} revealed={revealed} onSelect={setSelected} />
      {revealed && (
        <Link
          href="/practice"
          className="rise mt-5 flex items-center justify-between rounded-2xl bg-fg px-5 py-4 font-semibold text-bg"
        >
          <span>עוד {site.freeLimit} שאלות כאלה, חינם</span>
          <span aria-hidden>←</span>
        </Link>
      )}
    </div>
  );
}
