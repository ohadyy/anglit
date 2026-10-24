"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { signIn } from "@/lib/auth-client";
import { phoneToSyntheticEmail } from "@/lib/phoneAuth";
import { AuthShell } from "@/components/AuthShell";
import { authCopy } from "@/content/copy";
import { safeNext } from "@/lib/safeNext";

const input =
  "w-full rounded-2xl border border-line bg-white px-4 py-3.5 text-base outline-none transition-colors focus:border-fg focus:ring-2 focus:ring-fg/15";

function SignInForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signIn.email({
      email: phoneToSyntheticEmail(phone),
      password: birthDate,
    });
    setLoading(false);
    if (error) {
      setError("מספר טלפון או תאריך לידה שגויים.");
      return;
    }
    router.push(next);
  }

  return (
    <AuthShell>
      {error && <Image src="/login-fail.svg" alt="" width={2825} height={1910} className="mx-auto mb-4 h-auto w-56 sm:w-64" />}
      <div
        className="account-enter rounded-3xl border border-line bg-white shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] p-7 shadow-[0_24px_48px_-20px_rgb(14_8_82/0.35)] sm:p-9"
        style={{ "--delay": "0ms" } as React.CSSProperties}
      >
        <h1 className="font-display text-center text-3xl font-bold">
          <mark className="pink">{authCopy.signInTitle}</mark>
        </h1>
        <p className="mt-4 text-center text-sm leading-relaxed opacity-70">{authCopy.signInSub}</p>

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
          {error && <p className="text-sm text-warn">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-3 rounded-full bg-fg px-6 py-3.5 font-semibold text-bg disabled:opacity-50"
          >
            {loading ? "מתחבר..." : "התחברות"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm opacity-70">
          עדיין אין לכם חשבון?{" "}
          <Link href={`/sign-up?next=${encodeURIComponent(next)}`} className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4">
            הרשמה
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
