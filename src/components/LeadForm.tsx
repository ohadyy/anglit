"use client";

import Link from "next/link";
import { useState } from "react";

export function LeadForm({ source }: { source: "pricing" | "sign-up" }) {
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
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-3xl border border-line bg-white shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] p-6 text-center">
        <p className="font-semibold">קיבלנו! נחזור אליכם בקרוב.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-line bg-white shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] p-6">
      <p className="font-semibold">חסר לכם מידע? רוצים לברר עוד?</p>
      <p className="mt-1 text-sm opacity-70">השאירו פרטים ונחזור אליכם.</p>
      <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-3">
        <input
          type="text"
          placeholder="שם"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="rounded-2xl border border-line bg-bg px-4 py-3"
        />
        <input
          type="tel"
          placeholder="מספר טלפון"
          dir="ltr"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="rounded-2xl border border-line bg-bg px-4 py-3 text-right"
        />
        <textarea
          placeholder="מה תרצו לדעת? (לא חובה)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={2}
          className="rounded-2xl border border-line bg-bg px-4 py-3"
        />
        <label className="flex items-start gap-2.5 text-sm leading-relaxed">
          <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 size-4 shrink-0" />
          <span>
            אני מסכים/ה שייצרו איתי קשר בנוגע לסמינר, ושהפרטים יישמרו לפי{" "}
            <Link href="/legal/privacy" className="inline-flex min-h-11 items-center underline">
              מדיניות הפרטיות
            </Link>
          </span>
        </label>
        {status === "error" && (
          <p className="text-sm text-warn">משהו השתבש, נסו שוב או כתבו לנו באינסטגרם.</p>
        )}
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full bg-fg px-6 py-3 font-semibold text-bg disabled:opacity-50"
        >
          {status === "sending" ? "שולח..." : "השאירו פרטים"}
        </button>
      </form>
    </div>
  );
}
