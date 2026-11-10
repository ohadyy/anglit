import { Stem } from "./Stem";
import Link from "next/link";
import type { ReactNode } from "react";
import { homeQuestionTypes } from "@/content/copy";

function Bar({ w = "100%" }: { w?: string }) {
  return <i className="block h-2 rounded-full bg-line" style={{ width: w }} />;
}

function Opt({ children, on }: { children: ReactNode; on?: boolean }) {
  return <div className={`rounded-lg border px-3 py-1.5 text-sm ${on ? "border-mint bg-mint/25 font-semibold" : "border-line bg-white"}`}>{children}</div>;
}

const PREVIEWS: Record<string, ReactNode> = {
  sentence: (
    <>
      <p className="text-sm font-semibold"><Stem text="She ____ to school." revealed={false} /></p>
      <div className="mt-2 grid gap-1.5">
        <Opt on>goes</Opt>
        <Opt>go</Opt>
      </div>
    </>
  ),
  restatement: (
    <>
      <p className="text-sm font-semibold">It is too cold to swim.</p>
      <div className="mt-2 grid gap-1.5">
        <Opt on>It is so cold that we can&apos;t swim.</Opt>
        <Opt>It is cold enough to swim.</Opt>
      </div>
    </>
  ),
  reading: (
    <>
      <div className="space-y-1.5">
        <Bar />
        <Bar w="92%" />
        <Bar w="70%" />
      </div>
      <div className="mt-3">
        <Opt on>The main idea is…</Opt>
      </div>
    </>
  ),
};

export function QuestionTypeCards() {
  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-3">
      {homeQuestionTypes.items.map((it) => (
        <Link
          key={it.type}
          href={`/practice?type=${it.type}`}
          className="lift touch-manipulation overflow-hidden rounded-3xl border border-line bg-white text-start"
        >
          <div dir="ltr" className="h-36 overflow-hidden border-b border-line bg-raise p-4 text-ink">
            {PREVIEWS[it.type]}
          </div>
          <div className="p-5">
            <h3 className="text-xl font-bold">{it.title}</h3>
            <p className="mt-1 leading-relaxed opacity-80">{it.text}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
