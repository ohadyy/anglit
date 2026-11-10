"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { trackMeta } from "@/components/MetaPixel";
import { AuthShell, authInput as input } from "@/components/AuthShell";
import { signIn } from "@/lib/auth-client";

export function CompleteProfileForm({ next, name }: { next: string; name: string }) {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [terms, setTerms] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/account/complete-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, birthDate, terms, marketing }),
    });
    if (!res.ok) {
      setLoading(false);
      setError(
        res.status === 403
          ? "תאריך הלידה לא תואם לחשבון שנרשם עם המספר הזה. בדקו ונסו שוב."
          : res.status === 409
            ? "המספר הזה כבר מחובר לחשבון Google אחר. אפשר להתחבר בטלפון ותאריך לידה."
            : res.status === 429
              ? "יותר מדי ניסיונות. נסו שוב בעוד כמה דקות."
              : res.status === 400
                ? "בדקו את מספר הטלפון ואת תאריך הלידה."
                : "משהו השתבש, נסו שוב.",
      );
      return;
    }
    // The Google login was moved onto the existing account and this empty one was deleted,
    // so sign in with Google again: it now lands on the old account.
    if ((await res.json()).linked) {
      await signIn.social({ provider: "google", callbackURL: next });
      return;
    }
    setLoading(false);
    // Phone is real now, so this is a genuine lead
    trackMeta("Lead", crypto.randomUUID());
    router.push(next);
  }

  return (
    <AuthShell>
      <div className="account-enter rounded-3xl border border-line bg-white p-7 shadow-[0_24px_48px_-20px_rgb(14_8_82/0.35)] sm:p-9">
        <h1 className="font-display text-center text-3xl font-bold">
          <mark className="pink">כמעט שם, {name.split(" ")[0]}</mark>
        </h1>
        <p className="mt-4 text-center text-sm leading-relaxed opacity-70">
          עוד שני פרטים, כדי שנוכל ליצור קשר בוואטסאפ ולשמור על החשבון. אם כבר נרשמתם בעבר עם טלפון, הזינו את אותו מספר ואת אותו תאריך לידה, ונחבר אתכם לחשבון הקיים עם כל התרגולים.
        </p>
        <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-3">
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
            {loading ? "שומר..." : "המשך"}
          </button>
        </form>
      </div>
    </AuthShell>
  );
}
