"use client";

import { useRef, useState } from "react";

/**
 * Sticky bottom bar for the feedback pages: sends the summary over WhatsApp,
 * copies it, or clears everything. The summary also appears in a text box
 * so it can be copied by hand if the clipboard is blocked.
 */
export function FeedbackBar({
  status,
  summary,
  onReset,
  to,
}: {
  status: string;
  summary: () => string;
  onReset: () => void;
  /** Israeli local number (05x-xxxxxxx) to address the WhatsApp message to. Omit to let the student pick a contact. */
  to?: string;
}) {
  const [text, setText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const boxRef = useRef<HTMLTextAreaElement>(null);

  const send = () => {
    const s = summary();
    setText(s);
    const digits = to?.replace(/\D/g, "");
    const target = digits ? (digits.startsWith("0") ? `972${digits.slice(1)}` : digits) : "";
    window.open(`https://wa.me/${target}?text=${encodeURIComponent(s)}`, "_blank", "noopener");
  };

  const copy = async () => {
    const s = summary();
    setText(s);
    try {
      await navigator.clipboard.writeText(s);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      requestAnimationFrame(() => boxRef.current?.select());
    }
  };

  const reset = () => {
    if (!confirm("למחוק את כל הסימונים וההערות?")) return;
    setText(null);
    onReset();
  };

  return (
    <>
      {text !== null && (
        <div className="mx-auto mt-10 w-full max-w-3xl px-4 sm:px-6 print:hidden">
          <p className="mb-2 text-sm opacity-70">זה מה שנשלח:</p>
          <textarea
            ref={boxRef}
            readOnly
            value={text}
            className="h-56 w-full rounded-2xl border border-line bg-white p-4 text-sm leading-relaxed"
          />
        </div>
      )}
      <div
        className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-bg/95 backdrop-blur print:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-2 px-4 py-3 sm:px-6">
          <p className="w-full text-center text-sm opacity-70 sm:w-auto sm:flex-1 sm:text-start">
            {status}
          </p>
          <button
            type="button"
            onClick={send}
            className="flex-1 rounded-full bg-[#25D366] px-5 py-3 font-semibold text-white sm:flex-none"
          >
            שליחה בוואטסאפ
          </button>
          <button
            type="button"
            onClick={copy}
            className="rounded-full border border-line px-4 py-3 font-semibold"
          >
            {copied ? "הועתק ✓" : "העתקה"}
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-full px-3 py-3 text-sm opacity-70 hover:opacity-100"
          >
            איפוס
          </button>
        </div>
      </div>
    </>
  );
}
