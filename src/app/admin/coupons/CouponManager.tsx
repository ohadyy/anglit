"use client";

import { useState, useTransition } from "react";
import { createCoupon, deleteCoupon } from "./actions";

type Row = { code: string; percent: number | null; priceIls: number | null };

const field =
  "w-full rounded-2xl border border-line bg-white px-4 py-3 text-base outline-none focus:border-fg focus:ring-2 focus:ring-fg/15";

export function CouponManager({ rows }: { rows: Row[] }) {
  const [pending, start] = useTransition();
  const [code, setCode] = useState("");
  const [kind, setKind] = useState<"percent" | "price">("percent");
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const create = () =>
    start(async () => {
      setError(null);
      const res = await createCoupon(code, kind, Number(value));
      if (res.ok) {
        setCode("");
        setValue("");
      } else setError(res.error);
    });

  const remove = (c: string) => {
    if (!confirm(`למחוק את הקופון ${c}? הוא יפסיק לעבוד מיד.`)) return;
    start(async () => {
      setError(null);
      const res = await deleteCoupon(c);
      if (!res.ok) setError(res.error);
    });
  };

  return (
    <>
      <section className="mt-8 flex flex-col gap-3 rounded-3xl border border-line bg-white p-4">
        <h2 className="text-sm font-bold">קופון חדש</h2>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="קוד, למשל DANA"
          dir="ltr"
          autoCapitalize="characters"
          autoComplete="off"
          maxLength={20}
          className={`${field} uppercase`}
        />
        <div className="flex gap-2">
          {(
            [
              ["percent", "אחוז הנחה"],
              ["price", "מחיר סופי"],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              type="button"
              aria-pressed={kind === k}
              onClick={() => setKind(k)}
              className={`min-h-11 flex-1 rounded-full border text-sm font-semibold ${kind === k ? "border-fg bg-fg text-bg" : "border-line bg-white"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-3 text-sm">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value.replace(/\D/g, ""))}
            inputMode="numeric"
            dir="ltr"
            placeholder={kind === "percent" ? "20" : "250"}
            className={field}
          />
          <span className="shrink-0 font-semibold">{kind === "percent" ? "% הנחה" : "₪ בסך הכל"}</span>
        </label>
        <button
          type="button"
          disabled={pending || !code.trim() || !value}
          onClick={create}
          className="min-h-11 rounded-full bg-fg px-5 text-sm font-bold text-bg disabled:opacity-50"
        >
          {pending ? "רגע..." : "יצירת קופון"}
        </button>
        {error && (
          <p role="status" className="text-sm font-semibold text-warn">
            {error}
          </p>
        )}
      </section>

      {rows.length === 0 ? (
        <p className="mt-6 rounded-3xl border border-dashed border-line p-6 text-center opacity-70">עוד אין קופונים.</p>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {rows.map((c) => (
            <li key={c.code} className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4">
              <div className="min-w-0 flex-1">
                <p className="font-bold" dir="ltr">
                  {c.code}
                </p>
                <p className="text-sm opacity-70">{c.priceIls !== null ? `מחיר סופי ${c.priceIls} ₪` : `${c.percent}% הנחה`}</p>
              </div>
              <button
                type="button"
                disabled={pending}
                onClick={() => remove(c.code)}
                className="min-h-11 rounded-full border border-warn/50 px-5 text-sm font-bold text-warn disabled:opacity-40"
              >
                מחיקה
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
