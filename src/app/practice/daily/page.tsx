import type { Metadata } from "next";
import { buildDailyPool } from "@/lib/practice";
import { DailyQuestion } from "./DailyQuestion";

export const metadata: Metadata = {
  title: "שאלת היום באמירנט",
  description: "שאלת אמירנט אחת ביום, בחינם ועם הסבר מלא. עונים כל יום, שומרים על הרצף, וסופרים לאחור עד המבחן.",
  alternates: { canonical: "/practice/daily" },
};

// The browser picks today's question from this list by its own date.
export default function DailyPage() {
  return <DailyQuestion pool={buildDailyPool()} />;
}
