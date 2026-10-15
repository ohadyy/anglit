"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signUp } from "@/lib/auth-client";
import { phoneToSyntheticEmail } from "@/lib/phoneAuth";
import { AuthShell } from "@/components/AuthShell";
import { diploactCopy } from "@/content/diploactCopy";

const input =
  "w-full rounded-2xl border border-line bg-white px-4 py-3.5 text-base outline-none transition-colors focus:border-fg focus:ring-2 focus:ring-fg/15";

type JoinResult =
  | { path: "free"; orderId: string }
  | { path: "half"; cohortLabel: string; amountIls: number; payUrl: string }
  | { path: "none" };

export function DiploactJoinForm({ seatsLeft }: { seatsLeft: number | null }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [tookExam, setTookExam] = useState<"yes" | "no" | null>(null);
  const [priorScore, setPriorScore] = useState("");
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fullOffer, setFullOffer] = useState<{ cohortLabel: string; amountIls: number; payUrl: string } | null>(null);
  const [payConsent, setPayConsent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signUpError } = await signUp.email({
      name,
      email: phoneToSyntheticEmail(phone),
      password: birthDate,
      phone,
      birthDate,
      termsAccepted: terms,
      marketingConsent: false,
      priorScore: tookExam === "yes" && priorScore ? Number(priorScore) : undefined,
    });
    if (signUpError) {
      setLoading(false);
      const code = signUpError.code ?? "";
      setError(
        code === "USER_ALREADY_EXISTS" || code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
          ? "כבר יש חשבון עם המספר הזה. נסו להתחבר."
          : code.startsWith("INVALID_EMAIL") || code.startsWith("PASSWORD")
            ? "בדקו את מספר הטלפון ואת תאריך הלידה."
            : "משהו השתבש, נסו שוב.",
      );
      return;
    }

    // Account created — the server decides whether the nearest cohort still has a free
    // seat (and reserves it right away), or offers half price for the next one instead
    const res = await fetch("/api/diploact/join", { method: "POST" });
    const data = (await res.json().catch(() => null)) as JoinResult | { error: string } | null;
    if (!res.ok || !data || "error" in data) {
      setLoading(false);
      setError("נרשמתם, אבל שיבוץ המחזור לא הושלם. כתבו לנו בוואטסאפ ונסדר את זה ידנית.");
      return;
    }

    if (data.path === "free") {
      router.push("/checkout/success?product=course");
      return;
    }
    if (data.path === "half") {
      setLoading(false);
      setFullOffer(data);
      return;
    }
    // "none" — every open cohort is already full, including the overflow one
    setLoading(false);
    setError("נרשמתם, אבל כרגע כל המחזורים הפתוחים מלאים. נחזור אליכם בוואטסאפ לקבוע מחזור.");
  }

  return (
    <AuthShell leftPose="/brand/mascot/dog-celebrate.png">
      <div className="account-enter rounded-3xl border border-line bg-white shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] p-7 shadow-[0_24px_48px_-20px_rgb(14_8_82/0.35)] sm:p-9">
        <p className="text-center text-sm font-semibold tracking-[0.08em] opacity-70">{diploactCopy.eyebrow}</p>
        <h1 className="font-display mt-2 text-center text-3xl font-bold">
          <mark className="pink">{diploactCopy.title}</mark>
        </h1>
        <p className="mt-4 text-center text-sm leading-relaxed opacity-70">{diploactCopy.sub}</p>

        {seatsLeft !== null && (
          <p className="mx-auto mt-4 w-fit rounded-full border border-warn/40 bg-warn/10 px-4 py-2 text-center text-sm font-semibold text-warn">
            {seatsLeft > 0 ? `נשארו רק ${seatsLeft} מקומות במחזור הקרוב` : "המחזור הקרוב מלא — נרשמים עכשיו למחזור הבא ב-50% הנחה"}
          </p>
        )}

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
            <input
              type="date"
              dir="ltr"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
              className={`${input} text-right`}
            />
          </label>

          <div>
            <span className="text-sm opacity-70">ניגשתם בעבר למבחן אמירנט?</span>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              {(["yes", "no"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setTookExam(v)}
                  className={`min-h-11 rounded-2xl border px-4 py-2.5 font-semibold transition-colors ${
                    tookExam === v ? "border-fg bg-fg text-bg" : "border-line bg-white hover:bg-fg/5"
                  }`}
                >
                  {v === "yes" ? "כן" : "לא"}
                </button>
              ))}
            </div>
          </div>

          {tookExam === "yes" && (
            <label className="flex flex-col gap-1.5">
              <span className="text-sm opacity-70">איזה ציון קיבלתם?</span>
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
          )}

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

          {error && <p className="text-sm text-warn">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-3 rounded-full bg-fg px-6 py-3.5 font-semibold text-bg disabled:opacity-50"
          >
            {loading ? "נרשם..." : "הרשמה חינם למחזור"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm opacity-70">
          כבר נרשמתם?{" "}
          <Link href="/sign-in?next=/account" className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4">
            התחברות
          </Link>
        </p>
      </div>

      {fullOffer && (
        <div role="dialog" aria-modal="true" aria-labelledby="full-offer-title" className="fixed inset-0 z-50 grid place-items-center bg-fg/40 p-4">
          <div className="fade-in w-full max-w-sm rounded-3xl border border-line bg-white p-7 shadow-2xl">
            <h2 id="full-offer-title" className="font-display text-xl font-bold">
              המחזור הקרוב כבר התמלא
            </h2>
            <p className="mt-2 text-sm leading-relaxed opacity-70">
              החשבון שלכם נוצר בהצלחה. המחזור הקרוב ביותר אזל, אבל יש מקום פנוי במחזור הבא,{" "}
              <bdi dir="ltr">{fullOffer.cohortLabel}</bdi>, ב-50% הנחה: {fullOffer.amountIls} ₪ במקום 347 ₪. המקום נשמר לכם ברגע שהתשלום מתקבל.
            </p>
            <label className="mt-5 flex items-start gap-2.5 text-sm leading-relaxed">
              <input
                type="checkbox"
                required
                checked={payConsent}
                onChange={(e) => setPayConsent(e.target.checked)}
                className="mt-1 size-4 shrink-0 accent-fg"
              />
              <span>
                קראתי ואני מסכים/ה ל<Link href="/legal/terms" className="inline-flex min-h-11 items-center underline">תקנון</Link> ול
                <Link href="/legal/refunds" className="inline-flex min-h-11 items-center underline">מדיניות הביטול והחזרים</Link>
              </span>
            </label>
            <button
              type="button"
              disabled={!payConsent}
              onClick={() => (window.location.href = fullOffer.payUrl)}
              className="mt-5 w-full rounded-full bg-fg px-6 py-3.5 font-semibold text-bg disabled:opacity-50"
            >
              לתשלום המוזל, {fullOffer.amountIls} ₪
            </button>
            <Link href="/account" className="mt-4 block text-center text-sm underline opacity-70">
              לא עכשיו, לאזור האישי
            </Link>
          </div>
        </div>
      )}
    </AuthShell>
  );
}
