"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { clearOnboarding, readOnboarding, type Onboarding } from "@/lib/onboarding";
import { trackMeta } from "@/components/MetaPixel";
import { signUp } from "@/lib/auth-client";
import { phoneToSyntheticEmail } from "@/lib/phoneAuth";
import { AuthShell, authInput as input } from "@/components/AuthShell";
import { GoogleButton } from "@/components/GoogleButton";
import { authCopy } from "@/content/copy";
import { safeNext } from "@/lib/safeNext";

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
  // The questions before sign-up (/onboarding) are answered first, so a WhatsApp follow-up can
  // use the real exam date and scores. Without answers the visitor goes there before the form.
  const [answers, setAnswers] = useState<Onboarding | null>(null);
  useEffect(() => {
    const saved = readOnboarding();
    if (!saved) router.replace(`/onboarding?next=${encodeURIComponent(next)}`);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read the browser's saved answers once
    else setAnswers(saved);
  }, [router, next]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!answers) return;
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
      examDate: answers.examDate || undefined,
      priorScore: answers.priorScore ?? undefined,
      targetScore: answers.targetScore ?? undefined,
      gender: answers.gender ?? undefined,
    });
    setLoading(false);
    if (error) {
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
    clearOnboarding();
    router.push(next);
  }

  // Until the saved answers are read (or the visitor is sent to the questions) there is nothing to show
  if (!answers) return null;

  return (
    <AuthShell>
      <div
        className="account-enter rounded-3xl border border-line bg-white p-7 shadow-[0_24px_48px_-20px_rgb(14_8_82/0.35)] sm:p-9"
        style={{ "--delay": "0ms" } as React.CSSProperties}
      >
        <h1 className="font-display text-center text-3xl font-bold">
          <mark className="pink">{authCopy.signUpTitle}</mark>
        </h1>
        <p className="mt-4 text-center text-sm leading-relaxed opacity-70">{authCopy.signUpSub}</p>

        <GoogleButton next={next} />

        <form onSubmit={onSubmit} className="mt-3 flex flex-col gap-3">
          <input type="text" name="name" autoComplete="name" placeholder="שם מלא" value={name} onChange={(e) => setName(e.target.value)} required className={input} />
          <input
            type="tel"
            name="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="מספר טלפון"
            dir="ltr"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className={`${input} text-right`}
          />
          <label className="flex flex-col gap-1.5">
            <span className="text-sm opacity-70">תאריך לידה</span>
            <input type="date" name="bday" autoComplete="bday" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required className={input} />
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
              {/* Inline text links, not boxes: a box splits the sentence across lines */}
              קראתי ואני מסכים/ה ל<Link href="/legal/terms" className="underline">תקנון</Link> ול
              <Link href="/legal/privacy" className="underline">מדיניות הפרטיות</Link>
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
          {error && <p role="alert" className="text-sm text-warn">{error}</p>}
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
