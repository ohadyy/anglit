import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { ExamDatesCalendar } from "@/components/ExamDatesCalendar";
import { examDatesAsOf, examDatesCopy } from "@/content/examDates";

export const metadata: Metadata = {
  title: "מועדי מבחן",
  description: "מועדי מבחן אמירנט הפנויים לפי מרכז בחינה.",
};

export default function ExamDatesPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-4 sm:px-6">
      <BreadcrumbJsonLd trail={[{ name: "מועדי מבחן", path: "/exam-dates" }]} />
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{examDatesCopy.title}</h1>
        <p className="mt-3 max-w-xl leading-relaxed opacity-80">{examDatesCopy.intro}</p>

        <div className="mt-8">
          <ExamDatesCalendar />
        </div>

        <p className="mt-8 text-sm leading-relaxed opacity-70">{examDatesCopy.disclaimer}</p>
        <p className="mt-2 text-sm opacity-70">
          {examDatesCopy.asOfLabel} {examDatesAsOf}
        </p>
      </main>

    </div>
  );
}
