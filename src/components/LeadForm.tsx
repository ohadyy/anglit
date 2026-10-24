"use client";

import Link from "next/link";
import { useState } from "react";
import { trackMeta } from "@/components/MetaPixel";

export function LeadForm({
  source,
  title = "חסר לכם מידע? רוצים לברר עוד?",
  sub = "השאירו פרטים ונחזור אליכם.",
  sentText = "קיבלנו! נחזור אליכם בקרוב.",
}: {
  source: "pricing" | "sign-up" | "ads";
  title?: string;
  sub?: string;
  sentText?: string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [consent, setConsent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact: phone, message, source, consent }),
      });
      if (res.ok) trackMeta("Lead", (await res.json()).id);
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="rounded-3xl border border-line bg-white shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] p-6 text-center">
        <p className="font-semibold">{sentText}</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-line bg-white shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] p-6">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm opacity-70">{sub}</p>
      <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-3">
        <input
          type="text"
          name="name"
          autoComplete="name"
          aria-label="שם"
          placeholder="שם…"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="rounded-2xl border border-line bg-bg px-4 py-3"
        />
        <input
          type="tel"
          name="phone"
          autoComplete="tel"
          inputMode="tel"
          spellCheck={false}
          aria-label="מספר טלפון"
          placeholder="מספר טלפון…"
          dir="ltr"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="rounded-2xl border border-line bg-bg px-4 py-3 text-right"
        />
        <textarea
          name="message"
          autoComplete="off"
          aria-label="מה תרצו לדעת? (לא חובה)"
          placeholder="מה תרצו לדעת? (לא חובה)…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={2}
          className="rounded-2xl border border-line bg-bg px-4 py-3"
        />
        <label className="flex items-start gap-2.5 text-sm leading-relaxed">
          <input type="checkbox" name="consent" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 size-5 shrink-0" />
          <span>
            אני מסכים/ה שייצרו איתי קשר בנוגע לסמינר, ושהפרטים יישמרו לפי{" "}
            <Link href="/legal/privacy" className="inline-flex min-h-11 items-center underline">
              מדיניות הפרטיות
            </Link>
          </span>
        </label>
        {status === "error" && (
          <p role="alert" className="text-sm text-warn">משהו השתבש, נסו שוב או כתבו לנו באינסטגרם.</p>
        )}
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full bg-fg px-6 py-3 font-semibold text-bg transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          {status === "sending" ? "שולח…" : "השאירו פרטים"}
        </button>
      </form>
    </div>
  );
}
