"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useStored } from "@/lib/useStored";

type Step = { text: string; links: { href: string; label: string }[] };

// What to do today, by how many days are left until the exam
function planFor(daysLeft: number): Step {
  if (daysLeft <= 0) return { text: "בהצלחה במבחן! לישון טוב, לאכול משהו, ולהגיע קצת לפני הזמן.", links: [] };
  if (daysLeft <= 7)
    return {
      text: "שבוע אחרון: מבחן תרגול מלא אחד כדי להתרגל לזמנים, ואז חזרה על מה שטעיתם בו. לא לומדים חומר חדש בערב שלפני.",
      links: [
        { href: "/exam", label: "מבחן תרגול" },
        { href: "/practice/daily", label: "שאלת היום" },
      ],
    };
  if (daysLeft <= 30)
    return {
      text: "כל יום: שאלת היום ועוד כמה מילים חדשות. פעם בשבוע מבחן תרגול מלא, כדי לראות איפה אתם עומדים.",
      links: [
        { href: "/practice/daily", label: "שאלת היום" },
        { href: "/vocabulary", label: "מילים" },
      ],
    };
  return {
    text: "יש זמן. מתחילים ממבחן תרגול אחד כדי לדעת מאיפה יוצאים, ואז רבע שעה של מילים ביום.",
    links: [
      { href: "/exam", label: "מבחן תרגול" },
      { href: "/vocabulary", label: "מילים" },
    ],
  };
}

export function ExamCountdown({ className = "" }: { className?: string }) {
  const [stored, setStored] = useStored("anglit-exam-date", { date: "" });
  // Today's date is only known in the browser, so the countdown waits for mount
  const [today, setToday] = useState("");
  // eslint-disable-next-line react-hooks/set-state-in-effect -- read the device date once
  useEffect(() => setToday(new Date().toLocaleDateString("en-CA")), []);

  const daysLeft = stored.date && today ? Math.round((Date.parse(stored.date) - Date.parse(today)) / 86_400_000) : null;
  const step = daysLeft === null ? null : planFor(daysLeft);

  return (
    <section className={`rounded-3xl border border-line bg-white p-5 shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] sm:p-6 ${className}`}>
      <h2 className="text-xl font-bold">מתי המבחן שלכם?</h2>
      <label className="mt-3 block text-sm opacity-70" htmlFor="exam-date">
        בוחרים תאריך, ומקבלים כמה ימים נשארו ומה כדאי לעשות היום
      </label>
      <input
        id="exam-date"
        type="date"
        min={today || undefined}
        value={stored.date}
        onChange={(e) => setStored({ date: e.target.value })}
        className="mt-2 min-h-11 w-full rounded-2xl border border-line bg-white px-4 text-base"
      />

      {step && daysLeft !== null && (
        <div className="mt-5">
          {daysLeft > 0 && (
            <p className="text-3xl font-bold tabular-nums">
              {daysLeft === 1 ? "מחר!" : `עוד ${daysLeft} ימים`}
            </p>
          )}
          <p className="mt-2 leading-relaxed opacity-80">{step.text}</p>
          {step.links.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {step.links.map((l) => (
                <Link key={l.href} href={l.href} className="inline-flex min-h-11 items-center rounded-full bg-fg px-5 text-sm font-semibold text-bg">
                  {l.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {!stored.date && (
        <Link href="/exam-dates" className="mt-4 inline-flex min-h-11 items-center text-sm underline opacity-70">
          עוד לא נרשמתם? מועדים פנויים
        </Link>
      )}
    </section>
  );
}
