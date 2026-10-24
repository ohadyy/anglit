"use client";

import { useState } from "react";
import {
  examCenters,
  examDates,
  examDatesCopy,
  NITE_REGISTRATION_URL,
  type CenterId,
} from "@/content/examDates";

const WEEKDAYS = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];
const WEEKDAY_NAMES = ["יום ראשון", "יום שני", "יום שלישי", "יום רביעי", "יום חמישי", "יום שישי", "יום שבת"];
const MONTH_NAMES = [
  "ינואר",
  "פברואר",
  "מרץ",
  "אפריל",
  "מאי",
  "יוני",
  "יולי",
  "אוגוסט",
  "ספטמבר",
  "אוקטובר",
  "נובמבר",
  "דצמבר",
];

type Filter = CenterId | "all";

function dateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatDate(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  const weekday = new Date(y, m - 1, d).getDay();
  return `${WEEKDAY_NAMES[weekday]}, ${d}.${m}.${y}`;
}

export function ExamDatesCalendar() {
  const [filter, setFilter] = useState<Filter>("all");
  const [cursor, setCursor] = useState({ year: 2026, month: 9 });
  const [picked, setPicked] = useState<string | null>(null);

  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();
  const leading = new Date(cursor.year, cursor.month, 1).getDay();
  const cells: (number | null)[] = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function centersOn(key: string): CenterId[] {
    const all = examDates[key] ?? [];
    return filter === "all" ? all : all.filter((c) => c === filter);
  }

  function shiftMonth(delta: number) {
    setCursor((c) => {
      const d = new Date(c.year, c.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
    setPicked(null);
  }

  const pickedCenters = picked ? centersOn(picked) : [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-semibold opacity-70">{examDatesCopy.centerLabel}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(["all", ...Object.keys(examCenters)] as Filter[]).map((id) => {
            const active = filter === id;
            const label = id === "all" ? examDatesCopy.allCenters : examCenters[id].name;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setFilter(id);
                  setPicked(null);
                }}
                className={`inline-flex min-h-11 items-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  active ? "border-fg bg-fg text-bg" : "border-fg/25 hover:bg-fg/5"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border border-line bg-white p-5 shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] sm:p-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            aria-label={examDatesCopy.prevMonth}
            className="grid size-11 place-items-center text-2xl opacity-70 hover:opacity-100"
          >
            ‹
          </button>
          <p className="font-bold">
            {MONTH_NAMES[cursor.month]} {cursor.year}
          </p>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            aria-label={examDatesCopy.nextMonth}
            className="grid size-11 place-items-center text-2xl opacity-70 hover:opacity-100"
          >
            ›
          </button>
        </div>

        <div className="mt-5 grid grid-cols-7 gap-y-2 text-center text-sm opacity-70">
          {WEEKDAYS.map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-7 gap-y-2">
          {cells.map((day, i) => {
            if (day === null) return <span key={`pad-${i}`} />;
            const key = dateKey(cursor.year, cursor.month, day);
            const available = centersOn(key).length > 0;
            const isPicked = picked === key;
            return (
              <div key={key} className="flex justify-center">
                <button
                  type="button"
                  disabled={!available}
                  onClick={() => setPicked(key)}
                  aria-pressed={isPicked}
                  className={`flex size-11 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                    available
                      ? "bg-ok text-bg hover:opacity-90"
                      : "text-fg/30"
                  } ${isPicked ? "ring-2 ring-fg ring-offset-2 ring-offset-raise" : ""}`}
                >
                  {day}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div key={picked ?? "none"} className="rise border border-line bg-white p-5 sm:p-6">
        {!picked && <p className="opacity-70">{examDatesCopy.pickDate}</p>}

        {picked && pickedCenters.length === 0 && <p className="opacity-70">{examDatesCopy.noDates}</p>}

        {picked && pickedCenters.length > 0 && (
          <div className="flex flex-col gap-4">
            <p className="font-bold">{formatDate(picked)}</p>
            {pickedCenters.map((c) => (
              <div key={c} className="border-t border-line pt-4 first:border-t-0 first:pt-0">
                <p className="font-semibold">{examCenters[c].name}</p>
                <p className="mt-1 text-sm opacity-80">{examCenters[c].address}</p>
              </div>
            ))}
            <a
              href={NITE_REGISTRATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex w-full items-center justify-center bg-fg px-6 py-3 font-semibold text-bg"
            >
              {examDatesCopy.registerCta}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
