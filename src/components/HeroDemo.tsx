"use client";

import Link from "next/link";
import { useState } from "react";
import { questions } from "@/content/questions";
import { QuestionView, TypeLabel } from "./QuestionView";
import { site } from "@/lib/site";

const demo = questions.find((q) => q.id === "sc-05")!;

// A live question in the hero, inverted against the page theme
export function HeroDemo() {
  const [selected, setSelected] = useState<number | null>(null);
  const revealed = selected !== null;

  return (
    <div
      data-invert=""
      className="rounded-[2rem] p-5 shadow-[0_30px_60px_-24px_rgb(14_8_82/0.5)] sm:p-7"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <TypeLabel q={demo} />
        <span className="text-xs opacity-50">{revealed ? "ככה עובדים" : "נסו לענות"}</span>
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
