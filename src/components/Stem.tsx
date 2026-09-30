import { Fragment, type ReactNode } from "react";

const BLANK = /_{3,}/;

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Wraps keyword matches in <mark class="kw">. */
export function highlight(text: string, keywords: string[] | undefined, on: boolean): ReactNode {
  if (!on || !keywords?.length) return text;
  const re = new RegExp(`(${keywords.map(escapeRegExp).join("|")})`, "gi");
  return text.split(re).map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="kw">
        {part}
      </mark>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

/**
 * Renders a question stem. A run of underscores becomes a blank that fills
 * with the correct word once the answer is revealed.
 */
export function Stem({
  text,
  keywords,
  revealed,
  fill,
}: {
  text: string;
  keywords?: string[];
  revealed: boolean;
  fill?: string;
}) {
  const [before, after] = text.split(BLANK);
  if (after === undefined) return <>{highlight(text, keywords, revealed)}</>;

  return (
    <>
      {highlight(before, keywords, revealed)}
      <span
        className={`inline-block min-w-[4.5em] border-b-[0.12em] px-1 text-center transition-colors ${
          revealed ? "border-ok text-ok" : "border-current/50"
        }`}
      >
        {revealed ? fill : " "}
      </span>
      {highlight(after, keywords, revealed)}
    </>
  );
}
