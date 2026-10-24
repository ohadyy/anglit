"use client";

import { useState } from "react";
import { HoldButton } from "@/components/HoldButton";
import { LiquidGauge } from "@/components/LiquidGauge";
import { CheckoutSummaryBar } from "@/components/CheckoutSummaryBar";
import { getProduct } from "@/content/pricingCopy";
import { Replay } from "./Replay";

export function LabClient() {
  const [score, setScore] = useState(112);
  const [submits, setSubmits] = useState(0);
  const course = getProduct("course")!;

  return (
    <>
      <section className="mt-10">
        <h2 className="text-xl font-bold">מד ציון (סוף מבחן)</h2>
        <div className="mt-4 flex flex-col items-center rounded-3xl border border-line bg-white p-6">
          <Replay label="למלא שוב מאפס">
            <LiquidGauge score={score} className="w-56" />
          </Replay>
          <label className="mt-4 flex w-full flex-col gap-2 text-sm">
            <span className="opacity-70">הציון שיתמלא: {score}. שנו ואז לחצו &quot;למלא שוב מאפס&quot;</span>
            <input type="range" min={50} max={150} value={score} onChange={(e) => setScore(Number(e.target.value))} className="w-full" />
          </label>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold">כפתור הגשה בלחיצה ארוכה</h2>
        <div className="mt-4 rounded-3xl border border-line bg-white p-6">
          <HoldButton onComplete={() => setSubmits((n) => n + 1)} fullWidth>
            החזיקו להגשת המבחן
          </HoldButton>
          <p className="mt-4 text-center text-sm opacity-70">הוגש {submits} פעמים</p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold">סיכום הזמנה (תשלום)</h2>
        <p className="mt-1 text-sm opacity-70">בטלפון הסרגל מוצג בתחתית המסך. כאן אפשר לפתוח אותו ולראות את המגירה.</p>
      </section>
      <CheckoutSummaryBar
        name={course.name}
        price={course.price}
        note="למחזור הקרוב בלבד"
        included={course.included}
        excluded={course.excluded}
      />
    </>
  );
}
