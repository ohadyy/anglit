"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { trackMeta } from "@/components/MetaPixel";
import { signUp } from "@/lib/auth-client";
import { phoneToSyntheticEmail } from "@/lib/phoneAuth";
import { AuthShell } from "@/components/AuthShell";
import { authCopy } from "@/content/copy";
import { safeNext } from "@/lib/safeNext";

const input =
  "w-full rounded-2xl border border-line bg-white px-4 py-3.5 text-base outline-none transition-colors focus:border-fg focus:ring-2 focus:ring-fg/15";

function SignUpForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [terms, setTerms] = useState(false);
  const [marketing, setMarketing] = useState(false);
  // The account fields above are valid and ready; this gate asks two more
  // questions before the account is actually created, so a WhatsApp follow-up
  // can reference a real exam date or score instead of being generic.
  const [gateOpen, setGateOpen] = useState(false);
  const [examDate, setExamDate] = useState("");
  const [priorScore, setPriorScore] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGateOpen(true);
  }

  async function createAccount() {
    setError(null);
    setLoading(true);
    const { error } = await signUp.email({
      name,
      email: phoneToSyntheticEmail(phone),
      password: birthDate,
      phone,
      birthDate,
      termsAccepted: terms,
      marketingConsent: marketing,
      examDate: examDate || undefined,
      priorScore: priorScore ? Number(priorScore) : undefined,
    });
    setLoading(false);
    if (error) {
      setGateOpen(false);
      // Map known codes to Hebrew; never show the library's English message
      const code = error.code ?? "";
      setError(
        code === "USER_ALREADY_EXISTS" || code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
          ? "כבר יש חשבון עם המספר הזה. נסו להתחבר."
          : code.startsWith("INVALID_EMAIL") || code.startsWith("PASSWORD")
            ? "בדקו את מספר הטלפון ואת תאריך הלידה."
            : "משהו השתבש, נסו שוב.",
      );
      return;
    }
    // Name and phone are real now, so this is a genuine lead (not an empty click)
    trackMeta("Lead", crypto.randomUUID());
    router.push(next);
  }

  return (
    <AuthShell>
      <div
        className="account-enter rounded-3xl border border-line bg-white shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] p-7 shadow-[0_24px_48px_-20px_rgb(14_8_82/0.35)] sm:p-9"
        style={{ "--delay": "0ms" } as React.CSSProperties}
      >
        <h1 className="font-display text-center text-3xl font-bold">
          <mark className="pink">{authCopy.signUpTitle}</mark>
        </h1>
        <p className="mt-4 text-center text-sm leading-relaxed opacity-70">{authCopy.signUpSub}</p>

        <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-3">
          <input type="text" placeholder="שם מלא" value={name} onChange={(e) => setName(e.target.value)} required className={input} />
          <input
            type="tel"
            placeholder="מספר טלפון"
            dir="ltr"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className={`${input} text-right`}
          />
          <label className="flex flex-col gap-1.5">
            <span className="text-sm opacity-70">תאריך לידה</span>
            <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required className={input} />
          </label>
          <label className="mt-1 flex items-start gap-2.5 text-sm leading-relaxed">
            <input
              type="checkbox"
              required
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              className="mt-1 size-4 shrink-0 accent-fg"
            />
            <span>
              קראתי ואני מסכים/ה ל<Link href="/legal/terms" className="inline-flex min-h-11 items-center underline">תקנון</Link> ול
              <Link href="/legal/privacy" className="inline-flex min-h-11 items-center underline">מדיניות הפרטיות</Link>
            </span>
          </label>
          <label className="flex items-start gap-2.5 text-sm leading-relaxed opacity-80">
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              className="mt-1 size-4 shrink-0 accent-fg"
            />
            <span>אני רוצה לקבל הודעות על מחזורים ומבצעים (אופציונלי)</span>
          </label>
          {error && <p className="text-sm text-warn">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-3 rounded-full bg-fg px-6 py-3.5 font-semibold text-bg disabled:opacity-50"
          >
            {loading ? "נרשם..." : "הרשמה"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm opacity-70">
          כבר נרשמתם?{" "}
          <Link href={`/sign-in?next=${encodeURIComponent(next)}`} className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4">
            התחברות
          </Link>
        </p>
      </div>

      {gateOpen && (
        // Intentionally has no backdrop click, no X and no Escape handler — the only way
        // through is "המשך", so the two questions below always get asked once.
        <div role="dialog" aria-modal="true" aria-labelledby="gate-title" className="fixed inset-0 z-50 grid place-items-center bg-fg/40 p-4">
          <div className="fade-in w-full max-w-sm rounded-3xl border border-line bg-white p-7 shadow-2xl">
            <h2 id="gate-title" className="font-display text-xl font-bold">עוד שתי שאלות, ואתם בפנים</h2>
            <p className="mt-2 text-sm leading-relaxed opacity-70">
              כדי שנדע איך ללוות אתכם נכון. אין תשובה נכונה, וגם אפשר לדלג.
            </p>
            <label className="mt-5 flex flex-col gap-1.5">
              <span className="text-sm opacity-70">יש לכם תאריך למבחן? (אופציונלי)</span>
              <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} className={input} />
            </label>
            <label className="mt-3 flex flex-col gap-1.5">
              <span className="text-sm opacity-70">ניגשתם בעבר? איזה ציון קיבלתם? (אופציונלי, דלגו אם לא)</span>
              <input
                type="number"
                inputMode="numeric"
                min={50}
                max={150}
                placeholder="למשל 95"
                dir="ltr"
                value={priorScore}
                onChange={(e) => setPriorScore(e.target.value)}
                className={`${input} text-right`}
              />
            </label>
            <button
              type="button"
              disabled={loading}
              onClick={createAccount}
              className="mt-5 w-full rounded-full bg-fg px-6 py-3.5 font-semibold text-bg disabled:opacity-50"
            >
              {loading ? "נרשם..." : "המשך"}
            </button>
          </div>
        </div>
      )}
    </AuthShell>
  );
}

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  );
}
