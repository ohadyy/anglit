"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BottomSheet } from "@/components/BottomSheet";
import { COHORT_SESSIONS } from "@/content/cohortSchedule";

type Option = { id: string; label: string; seatsLeft: number };

// Lets a paid course student pick one open cohort. The server does the
// seat check and sends the WhatsApp confirmation.
export function CohortPicker({ options, joinedLabel }: { options: Option[]; joinedLabel: string | null }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [picked, setPicked] = useState<Option | null>(null);

  async function join(cohortId: string) {
    setBusy(cohortId);
    setError(null);
    try {
      const res = await fetch("/api/cohorts/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cohortId }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error === "cohort full" ? "המחזור הזה מלא. בחרו מחזור אחר." : "לא הצלחנו לשמור את הבחירה. נסו שוב.");
        setPicked(null);
        return;
      }
      setPicked(null);
      router.refresh();
    } catch {
      setError("לא הצלחנו לשמור את הבחירה. נסו שוב.");
    } finally {
      setBusy(null);
    }
  }

  if (joinedLabel) {
    return (
      <div className="mt-6 rounded-3xl border border-line bg-white shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] p-5">
        <p className="font-semibold">המחזור שלכם</p>
        <p className="mt-1 text-sm opacity-70">נרשמתם למחזור שמתחיל ב-{joinedLabel}. אישור נשלח אליכם בוואטסאפ.</p>
      </div>
    );
  }

  if (options.length === 0) {
    return (
      <div className="mt-6 rounded-3xl border border-line bg-white shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] p-5">
        <p className="font-semibold">שיבוץ למחזורים</p>
        <p className="mt-1 text-sm opacity-70">השיבוץ ייפתח בקרוב. נעדכן אתכם ברגע שיהיו מועדים פנויים.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-3xl border border-line bg-white shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] p-5">
      <p className="font-semibold">בחרו מחזור</p>
      <p className="mt-1 text-sm opacity-70">המפגשים: {COHORT_SESSIONS}.</p>
      <ul className="mt-4 flex flex-col gap-2">
        {options.map((o) => (
          <li key={o.id}>
            <button
              type="button"
              onClick={() => setPicked(o)}
              disabled={o.seatsLeft === 0 || busy !== null}
              className="flex w-full items-center justify-between rounded-2xl border border-line px-4 py-3 text-start transition-colors hover:border-fg/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="font-semibold">מחזור שמתחיל ב-{o.label}</span>
              <span className="text-sm tabular-nums opacity-70">
                {o.seatsLeft === 0 ? "מלא" : `נשארו ${o.seatsLeft} מקומות`}
              </span>
            </button>
          </li>
        ))}
      </ul>
      {busy && <p className="mt-3 text-sm opacity-70">שומרים את הבחירה...</p>}
      {error && <p className="mt-3 text-sm text-coral">{error}</p>}

      {/* Details and the join button live in the sheet, so joining is a deliberate step */}
      <BottomSheet open={picked !== null} onClose={() => setPicked(null)} title="פרטי המחזור">
        {picked && (
          <div>
            <p className="text-lg font-semibold">מחזור שמתחיל ב-{picked.label}</p>
            <p className="mt-1 text-sm opacity-70">{picked.seatsLeft === 0 ? "המחזור מלא" : `נשארו ${picked.seatsLeft} מקומות`}</p>
            <p className="mt-4 leading-relaxed opacity-80">
              המפגשים: {COHORT_SESSIONS}. אישור והפרטים לכניסה לזום יגיעו אליכם בוואטסאפ.
            </p>
            <button
              type="button"
              onClick={() => join(picked.id)}
              disabled={busy !== null || picked.seatsLeft === 0}
              className="mt-6 w-full rounded-full bg-fg px-6 py-4 font-semibold text-bg disabled:opacity-40"
            >
              לשבץ אותי למחזור הזה
            </button>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
